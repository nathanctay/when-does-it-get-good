import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface VoteStats {
  season: number
  episode: number
  totalVotes: number
  percentage: number
  breakdown: Record<string, number>
}

interface VoteChartProps {
  stats: VoteStats | null
}

export default function VoteChart({ stats }: VoteChartProps) {
  if (!stats) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 border border-slate-200">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">No Data Collected Yet</p>
      </div>
    )
  }

  // Transform breakdown into chart data
  const data = Object.entries(stats.breakdown)
    .map(([key, count]) => {
      const [s, e] = key.split('-').map(Number)
      return {
        name: `S${s}E${e}`,
        count,
        season: s,
        episode: e
      }
    })
    .sort((a, b) => {
      if (a.season !== b.season) return a.season - b.season
      return a.episode - b.episode
    })

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} 
          />
          <YAxis 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ 
              borderRadius: '2px', 
              border: '1px solid #cbd5e1', 
              boxShadow: '2px 2px 0 rgba(0,0,0,0.05)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.season === stats.season && entry.episode === stats.episode ? '#1d4ed8' : '#94a3b8'} 
                stroke="#1e3a8a"
                strokeWidth={entry.season === stats.season && entry.episode === stats.episode ? 1 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
