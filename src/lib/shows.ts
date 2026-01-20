import { prisma } from './prisma'
import { getShowDetails } from './tmdb'

export async function getOrCreateShow(tmdbId: number) {
  // Check if show exists in DB
  let show = await prisma.shows.findUnique({
    where: { tmdb_id: tmdbId }
  })

  // If not, fetch from TMDB and create
  if (!show) {
    const tmdbShow = await getShowDetails(tmdbId)
    if (!tmdbShow) return null

    show = await prisma.shows.create({
      data: {
        tmdb_id: tmdbId,
        title: tmdbShow.name,
        poster_path: tmdbShow.poster_path,
        total_seasons: tmdbShow.number_of_seasons,
        last_updated: new Date()
      }
    })
  } else {
    // Optionally update metadata if it's old (e.g., > 24h)
    const lastUpdated = show.last_updated ? new Date(show.last_updated) : new Date(0)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    if (lastUpdated < twentyFourHoursAgo) {
      const tmdbShow = await getShowDetails(tmdbId)
      if (tmdbShow) {
        show = await prisma.shows.update({
          where: { id: show.id },
          data: {
            title: tmdbShow.name,
            poster_path: tmdbShow.poster_path,
            total_seasons: tmdbShow.number_of_seasons,
            last_updated: new Date()
          }
        })
      }
    }
  }

  return show
}

export async function getShowWithVotes(tmdbId: number) {
  return await prisma.shows.findUnique({
    where: { tmdb_id: tmdbId },
    include: {
      votes: true
    }
  })
}

export async function getTrendingShows(limit: number = 10) {
  // Trending = shows with most votes in the last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const trendingVotes = await prisma.votes.groupBy({
    by: ['show_id'],
    where: {
      created_at: {
        gte: sevenDaysAgo
      }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: limit
  })

  const showIds = trendingVotes.map(t => t.show_id).filter((id): id is number => id !== null)

  if (showIds.length === 0) {
    // If no trending, just return latest shows
    return await prisma.shows.findMany({
      orderBy: { last_updated: 'desc' },
      take: limit
    })
  }

  return await prisma.shows.findMany({
    where: {
      id: { in: showIds }
    }
  })
}

export function calculateVerdict(votes: any[]) {
  if (votes.length === 0) return null

  // Group by season and episode
  const counts: Record<string, number> = {}
  votes.forEach(v => {
    const key = `${v.season_no}-${v.episode_no}`
    counts[key] = (counts[key] || 0) + 1
  })

  // Find the episode with the most votes
  let maxVotes = 0
  let verdictKey = ''
  
  for (const [key, count] of Object.entries(counts)) {
    if (count > maxVotes) {
      maxVotes = count
      verdictKey = key
    }
  }

  const [season, episode] = verdictKey.split('-').map(Number)
  
  return {
    season,
    episode,
    totalVotes: votes.length,
    percentage: Math.round((maxVotes / votes.length) * 100)
  }
}
