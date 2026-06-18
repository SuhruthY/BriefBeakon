import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import { getArticlesByCategory } from '../lib/data'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types'
import type { Article, Category } from '../types'

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getArticlesByCategory(category || '')
      setArticles(data)
      setLoading(false)
    }
    load()
  }, [category])

  const cat = category as Category
  const label = CATEGORY_LABELS[cat] || category
  const color = CATEGORY_COLORS[cat] || 'from-slate-500 to-gray-600'

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-4 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> All categories
      </Link>
      <div className="mb-8">
        <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white mb-2`}>
          {label}
        </span>
        <h1 className="text-3xl font-bold text-white capitalize">{category}</h1>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="skeleton-pulse h-4 rounded w-24 mb-3" />
              <div className="skeleton-pulse h-5 rounded w-full mb-2" />
              <div className="skeleton-pulse h-5 rounded w-3/4 mb-3" />
              <div className="skeleton-pulse h-4 rounded w-full mb-1" />
              <div className="skeleton-pulse h-4 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-600">No articles in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <div key={article.slug} className={`reveal visible reveal-delay-${Math.min(i + 1, 6)}`}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
