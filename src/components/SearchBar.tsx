import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface SearchResult {
  id: number
  name: string
  poster_path: string | null
  first_air_date: string
}

interface SearchBarProps {
  variant?: 'hero' | 'header'
}

export default function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isHeader = variant === 'header'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data)
        setIsOpen(true)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full",
        isHeader ? "max-w-md" : "max-w-2xl mx-auto"
      )}
    >
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-slate-400" />
          )}
        </div>
        <input
          type="text"
          className={cn(
            "block w-full pl-9 pr-10 bg-white border border-slate-300 rounded-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all",
            isHeader ? "py-1.5 text-sm" : "py-3 text-base shadow-sm"
          )}
          placeholder={isHeader ? "Search shows..." : "Search for a TV show..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={cn(
          "absolute mt-1 w-full bg-white rounded-sm shadow-lg border border-slate-300 overflow-hidden z-[100]",
          isHeader ? "min-w-[300px] right-0" : ""
        )}>
          {results.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {results.map((show) => (
                <li key={show.id}>
                  <a
                    href={`/show/${show.id}-${show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-10 h-14 flex-shrink-0 bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                      <img
                        src={show.poster_path ? `https://image.tmdb.org/t/p/w92${show.poster_path}` : 'https://via.placeholder.com/92x138?text=N/A'}
                        alt={show.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-700">{show.name}</h4>
                      <p className="text-xs text-slate-500">
                        {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : !isLoading && (
            <div className="p-4 text-center">
              <p className="text-sm text-slate-500">No shows found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
