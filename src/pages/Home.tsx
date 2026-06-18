import { useState, useEffect } from 'react'
import { Sparkles, Newspaper } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import CategoryNav from '../components/CategoryNav'
import { getPublishedArticles } from '../lib/data'
import type { Article } from '../types'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getPublishedArticles()
      setArticles(data)
      setLoading(false)
    }
    load()
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Newspaper className="w-5 h-5 text-indigo-400" />
          <span className="text-sm text-slate-500">{today}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Your Daily Briefing
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          AI-curated stories that matter most today.
        </p>
      </div>

      <CategoryNav />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-24 mb-3" />
              <div className="h-5 bg-slate-800 rounded w-full mb-2" />
              <div className="h-5 bg-slate-800 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-800 rounded w-full mb-1" />
              <div className="h-4 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-400 mb-2">No articles yet</h2>
          <p className="text-slate-600">The first edition is being generated. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
