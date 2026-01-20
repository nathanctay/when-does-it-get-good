import type { APIRoute } from 'astro'
import { getOrCreateShow } from '../../../lib/shows'
import { getVoteStats } from '../../../lib/votes'
import { getSeasonDetails } from '../../../lib/tmdb'

export const GET: APIRoute = async ({ params, url }) => {
  const tmdbId = params.tmdb_id
  const season = url.searchParams.get('season')

  if (!tmdbId) {
    return new Response(JSON.stringify({ error: 'Missing TMDB ID' }), { status: 400 })
  }

  try {
    const show = await getOrCreateShow(Number(tmdbId))
    if (!show) {
      return new Response(JSON.stringify({ error: 'Show not found' }), { status: 404 })
    }

    if (season) {
      const seasonData = await getSeasonDetails(Number(tmdbId), Number(season))
      return new Response(JSON.stringify(seasonData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const stats = await getVoteStats(show.id)
    return new Response(JSON.stringify({ ...show, stats }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(`Error in show API for ${tmdbId}:`, error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
