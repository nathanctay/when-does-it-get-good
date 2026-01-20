import type { APIRoute } from 'astro'
import { createFingerprint, submitVote, getVoteStats } from '../../lib/votes'
import { getOrCreateShow } from '../../lib/shows'

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const data = await request.json()
    const { tmdbId, season, episode, tag } = data

    if (!tmdbId || !season || !episode) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || ''
    // Astro's clientAddress is reliable in many environments
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown'
    
    const fingerprint = createFingerprint(ip, userAgent)
    
    // Ensure show exists in our DB
    const show = await getOrCreateShow(Number(tmdbId))
    if (!show) {
      return new Response(JSON.stringify({ error: 'Show not found' }), { status: 404 })
    }

    await submitVote(show.id, Number(season), Number(episode), fingerprint, tag)
    
    const stats = await getVoteStats(show.id)
    
    return new Response(JSON.stringify({ success: true, stats }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in vote API:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
