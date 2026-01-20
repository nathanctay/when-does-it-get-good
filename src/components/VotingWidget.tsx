import React, { useState, useEffect } from 'react'
import { Check, ChevronRight, Loader2, AlertCircle } from 'lucide-react'

interface VotingWidgetProps {
  tmdbId: number
  showId: number
  totalSeasons: number
}

export default function VotingWidget({ tmdbId, showId, totalSeasons }: VotingWidgetProps) {
  const [season, setSeason] = useState<number>(1)
  const [episode, setEpisode] = useState<number>(1)
  const [tag, setTag] = useState<string | null>(null)
  const [episodesCount, setEpisodesCount] = useState<number>(20)
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoadingEpisodes(true)
      try {
        const response = await fetch(`/api/shows/${tmdbId}?season=${season}`)
        const data = await response.json()
        if (data.episodes) {
          setEpisodesCount(data.episodes.length)
          if (episode > data.episodes.length) setEpisode(1)
        }
      } catch (error) {
        console.error('Failed to fetch episodes:', error)
      } finally {
        setIsLoadingEpisodes(false)
      }
    }
    fetchEpisodes()
  }, [season, tmdbId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId, season, episode, tag })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'VOTE RECORDED. DATABASE UPDATING...' })
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'SUBMISSION ERROR' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'NETWORK ERROR. PLEASE RETRY.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest">Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="block w-full bg-white border border-blue-900 text-slate-900 rounded-sm py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>Season {s}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest">Episode</label>
          <select
            value={episode}
            onChange={(e) => setEpisode(Number(e.target.value))}
            disabled={isLoadingEpisodes}
            className="block w-full bg-white border border-blue-900 text-slate-900 rounded-sm py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
          >
            {Array.from({ length: episodesCount }, (_, i) => i + 1).map((e) => (
              <option key={e} value={e}>Episode {e}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTag(tag === 'worth-wait' ? null : 'worth-wait')}
            className={`py-2 px-2 text-[10px] font-black uppercase border transition-all ${tag === 'worth-wait'
                ? 'bg-blue-600 border-white text-white'
                : 'bg-white border-blue-900 text-blue-900 hover:bg-blue-50'
              }`}
          >
            Worth the wait
          </button>
          <button
            type="button"
            onClick={() => setTag(tag === 'dont-waste' ? null : 'dont-waste')}
            className={`py-2 px-2 text-[10px] font-black uppercase border transition-all ${tag === 'dont-waste'
                ? 'bg-red-600 border-white text-white'
                : 'bg-white border-blue-900 text-blue-900 hover:bg-blue-50'
              }`}
          >
            Don't waste time
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoadingEpisodes}
        className="w-full bg-white hover:bg-blue-50 text-blue-900 font-black py-3 px-6 rounded-sm text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Cast Vote <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>

      {message && (
        <div className={`p-3 rounded-sm flex items-start gap-3 border ${message.type === 'success'
            ? 'bg-green-500 border-green-600 text-white'
            : 'bg-red-500 border-red-600 text-white'
          }`}>
          {message.type === 'success' ? <Check className="h-4 w-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
          <p className="text-[10px] font-black uppercase tracking-wider">{message.text}</p>
        </div>
      )}
    </form>
  )
}
