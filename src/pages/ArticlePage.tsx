import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag, BarChart3, Users, Eye, TrendingUp } from 'lucide-react'
import { getArticleBySlug } from '../lib/data'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types'
import type { Article } from '../types'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getArticleBySlug(slug || '')
      setArticle(data)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-3/4 mb-4" />
        <div className="h-4 bg-slate-800 rounded w-1/4 mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-800 rounded w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-slate-400 mb-2">Article not found</h1>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">Go home</Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to briefing
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[article.category]} text-white`}>
          {CATEGORY_LABELS[article.category]}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3 h-3" />
          {article.publication_date}
        </span>
        <span className="text-xs text-slate-600">by {article.author}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
        {article.title}
      </h1>

      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        {article.summary}
      </p>

      <div className="prose prose-invert max-w-none mb-12">
        {article.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{paragraph}</p>
        ))}
      </div>

      {article.key_takeaways.length > 0 && (
        <Section icon={BarChart3} title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {article.key_takeaways.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {article.public_sentiment && (
        <Section icon={Users} title="Public Sentiment">
          <p className="text-slate-300">{article.public_sentiment}</p>
        </Section>
      )}

      {article.impact_analysis && (
        <Section icon={Eye} title="Impact Analysis">
          <p className="text-slate-300">{article.impact_analysis}</p>
        </Section>
      )}

      {article.future_outlook && (
        <Section icon={TrendingUp} title="Future Outlook">
          <p className="text-slate-300">{article.future_outlook}</p>
        </Section>
      )}

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {article.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

function Section({ icon: Icon, title, children }: { icon: typeof BarChart3; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 p-5 rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  )
}
