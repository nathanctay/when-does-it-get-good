import 'dotenv/config'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

if (!TMDB_API_KEY) {
  console.warn('TMDB_API_KEY is not defined in environment variables')
}

// Support both Bearer token and standard API key
const isBearer = TMDB_API_KEY && TMDB_API_KEY.length > 50
const authHeader = isBearer ? { Authorization: `Bearer ${TMDB_API_KEY}` } : {}
const apiKeyParam = !isBearer ? `&api_key=${TMDB_API_KEY}` : ''

const headers = {
  accept: 'application/json',
  ...authHeader
}

export interface TMDBShow {
  id: number
  name: string
  poster_path: string | null
  overview: string
  first_air_date: string
  number_of_seasons: number
  genres: { id: number; name: string }[]
  status: string
  networks: { id: number; name: string; logo_path: string | null }[]
}

export interface TMDBSearchResult {
  id: number
  name: string
  poster_path: string | null
  first_air_date: string
}

export interface TMDBSeason {
  id: number
  season_number: number
  episodes: TMDBEpisode[]
}

export interface TMDBEpisode {
  id: number
  episode_number: number
  name: string
  overview: string
  air_date: string
}

export async function searchShows(query: string): Promise<TMDBSearchResult[]> {
  if (!query) return []
  
  const url = `${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1${apiKeyParam}`
  
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`)
    const data = await response.json()
    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      poster_path: r.poster_path,
      first_air_date: r.first_air_date
    }))
  } catch (error) {
    console.error('Error searching shows:', error)
    return []
  }
}

export async function getShowDetails(tmdbId: number): Promise<TMDBShow | null> {
  const url = `${TMDB_BASE_URL}/tv/${tmdbId}?language=en-US${apiKeyParam}`
  
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`TMDB API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching show details for ${tmdbId}:`, error)
    return null
  }
}

export async function getSeasonDetails(tmdbId: number, seasonNumber: number): Promise<TMDBSeason | null> {
  const url = `${TMDB_BASE_URL}/tv/${tmdbId}/season/${seasonNumber}?language=en-US${apiKeyParam}`
  
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`TMDB API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching season details for show ${tmdbId} season ${seasonNumber}:`, error)
    return null
  }
}

export function getTMDBImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Poster'
  return `https://image.tmdb.org/t/p/${size}${path}`
}
