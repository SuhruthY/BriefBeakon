import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Podcast, ArrowLeft, Sparkles } from 'lucide-react'
import { getPodcasts } from '../lib/data'
import PodcastPlayer from '../components/PodcastPlayer'
import type { PodcastEpisode } from '../types'

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PodcastEpisode | null>(null)

  useEffect(() => {
    async function load() {
      const data = await getPodcasts()
      setEpisodes(data)
      if (data.length > 0) setSelected(data[0])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-4 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to briefing
      </Link>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Podcast className="w-5 h-5 text-indigo-400" />
          <span className="text-sm text-slate-500">Daily Audio Briefing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          BriefBeakon Daily
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Your AI-curated daily news, narrated and delivered every morning.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton-pulse h-32 rounded-xl w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-pulse h-16 rounded-xl" />
            ))}
          </div>
        </div>
      ) : episodes.length === 0 ? (
        <div className="text-center py-20">
          <Podcast className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-400 mb-2">No episodes yet</h2>
          <p className="text-slate-600">The first daily briefing will appear here after the next generation run.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {selected && <PodcastPlayer episode={selected} />}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Previous Episodes</h3>
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setSelected(ep)}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all ${
                  selected?.id === ep.id
                    ? 'bg-indigo-600/10 border-indigo-500/30'
                    : 'glass border-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">{ep.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {ep.duration_display} &middot; {ep.story_count} stories &middot; {ep.word_count} words
                    </div>
                  </div>
                  <Podcast className={`w-4 h-4 shrink-0 ml-3 ${selected?.id === ep.id ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subscribe</h4>
            <p className="text-xs text-slate-600 mb-3">
              Copy the RSS feed URL into your favorite podcast app:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-slate-400 bg-slate-800/50 px-3 py-2 rounded-lg truncate">
                {window.location.origin}/BriefBeakon/podcast.xml
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/BriefBeakon/podcast.xml`)
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
