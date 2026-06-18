import { useState, useEffect } from 'react'
import { Film, ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { MovieIntelligence as MovieType } from '../types'

export default function MovieIntelligence() {
  const [movies, setMovies] = useState<MovieType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        if (supabase) {
          const { data } = await supabase
            .from('movie_intelligence')
            .select('*')
            .order('publication_date', { ascending: false })
          if (data) {
            setMovies(data as MovieType[])
            setLoading(false)
            return
          }
        }
      } catch {
        // Fall through
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Film className="w-5 h-5 text-pink-400" />
          <span className="text-sm text-slate-500">Audience Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Movie Intelligence
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          AI-powered audience reception analysis. Skip the reviews, get the verdict.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-3/4 mb-4" />
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-6" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20">
          <Film className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-400 mb-2">No movie intelligence yet</h2>
          <p className="text-slate-600">Movie analysis will appear once generated.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {movies.map(movie => (
            <div key={movie.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{movie.title}</h2>
                  {movie.year && <span className="text-sm text-slate-500">{movie.year}</span>}
                </div>
                <span className="text-xs text-slate-500">{movie.publication_date}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-slate-300">Critics: {movie.critic_score ?? 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UsersIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-slate-300">Audience: {movie.audience_score ?? 'N/A'}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overall Sentiment</h4>
                <p className="text-sm text-slate-300">{movie.overall_sentiment}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-900/50">
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold mb-1">
                    <ThumbsUp className="w-3 h-3" /> Liked
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
                    {movie.what_viewers_liked?.slice(0, 3).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-900/50">
                  <div className="flex items-center gap-1 text-rose-400 text-xs font-semibold mb-1">
                    <ThumbsDown className="w-3 h-3" /> Criticisms
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
                    {movie.common_criticisms?.slice(0, 3).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Verdict</h4>
                <p className="text-sm text-slate-300 italic">"{movie.ai_verdict}"</p>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <span className="text-indigo-400 font-medium">Recommendation:</span>
                <span className="text-slate-300">{movie.watch_recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function UsersIcon(props: React.ComponentProps<typeof Star>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
