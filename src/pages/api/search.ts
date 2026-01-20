import type { APIRoute } from 'astro'
import { searchShows } from '../../lib/tmdb'

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')
  if (!query) {
    return new Response(JSON.stringify([]), { status: 200 })
  }

  const results = await searchShows(query)
  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
