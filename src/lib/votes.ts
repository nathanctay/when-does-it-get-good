import { prisma } from './prisma'
import { createHash } from 'crypto'

export function createFingerprint(ip: string, userAgent: string): string {
  const data = `${ip}-${userAgent}`
  return createHash('sha256').update(data).digest('hex')
}

export async function canUserVote(fingerprint: string, showId: number): Promise<boolean> {
  const existingVote = await prisma.votes.findFirst({
    where: {
      show_id: showId,
      fingerprint: fingerprint
    }
  })

  return !existingVote
}

export async function submitVote(showId: number, seasonNo: number, episodeNo: number, fingerprint: string) {
  const existingVote = await prisma.votes.findFirst({
    where: {
      show_id: showId,
      fingerprint: fingerprint
    }
  })

  if (existingVote) {
    return await prisma.votes.update({
      where: { id: existingVote.id },
      data: {
        season_no: seasonNo,
        episode_no: episodeNo,
        created_at: new Date()
      }
    })
  }

  return await prisma.votes.create({
    data: {
      show_id: showId,
      season_no: seasonNo,
      episode_no: episodeNo,
      tag: tag || null,
      fingerprint: uniqueFingerprint
    }
  })
}

export async function getVoteStats(showId: number) {
  const votes = await prisma.votes.findMany({
    where: { show_id: showId }
  })

  if (votes.length === 0) return null

  const episodeCounts: Record<string, number> = {}
  const tagCounts: Record<string, number> = {
    'worth-wait': 0,
    'dont-waste': 0
  }

  votes.forEach(v => {
    const key = `${v.season_no}-${v.episode_no}`
    episodeCounts[key] = (episodeCounts[key] || 0) + 1

    if (v.tag && tagCounts[v.tag] !== undefined) {
      tagCounts[v.tag]++
    }
  })

  const sortedEpisodes = Object.entries(episodeCounts).sort((a, b) => b[1] - a[1])
  const [verdictKey, count] = sortedEpisodes[0]
  const [season, episode] = verdictKey.split('-').map(Number)

  return {
    season,
    episode,
    totalVotes: votes.length,
    percentage: Math.round((count / votes.length) * 100),
    breakdown: episodeCounts,
    tags: tagCounts
  }
}
