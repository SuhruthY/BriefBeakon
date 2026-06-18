import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag, BarChart3, Users, Eye, TrendingUp, ExternalLink, FileText, Clock } from 'lucide-react'
import { getArticleBySlug } from '../lib/data'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types'
import type { Article } from '../types'

function ReadingTime({ words }: { words: number }) {
  const min = Math.max(1, Math.ceil(words / 200))
  return (
    <span className="flex items-center gap-1 text-xs text-slate-600">
      <Clock className="w-3 h-3" /> {min} min read
    </span>
  )
}

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

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — BriefBeakon`
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', article.meta_description || article.summary)
    }
  }, [article])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="skeleton-pulse h-8 rounded-lg w-3/4 mb-4" />
        <div className="skeleton-pulse h-4 rounded-lg w-1/4 mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-pulse h-4 rounded-lg w-full" />
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

  const paragraphs = article.content.split('\n\n').filter(Boolean)

  return (
    <article className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to briefing
      </Link>

      <div className="glass rounded-xl p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[article.category]} text-white`}>
            {CATEGORY_LABELS[article.category]}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            {article.publication_date}
          </span>
          <span className="text-xs text-slate-600">by {article.author}</span>
          <ReadingTime words={article.word_count} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {article.word_count.toLocaleString()} words
          </span>
          {article.source_links?.length > 0 && (
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {article.source_links.length} sources
            </span>
          )}
        </div>

        <p className="text-lg text-slate-400 mt-4 leading-relaxed border-l-2 border-indigo-500/50 pl-4 italic">
          {article.summary}
        </p>
      </div>

      <div className="prose prose-invert max-w-none mb-12">
        {paragraphs.map((paragraph, i) => {
          const isHeading = paragraph.startsWith('## ')
          if (isHeading) {
            const text = paragraph.replace('## ', '')
            return (
              <h2 key={i} className="text-xl font-semibold text-white mt-10 mb-4 gradient-text">{text}</h2>
            )
          }
          return (
            <p key={i} className="text-slate-300 leading-relaxed mb-5 text-base sm:text-lg">{paragraph}</p>
          )
        })}
      </div>

      {article.key_takeaways.length > 0 && (
        <GlassSection icon={BarChart3} title="Key Takeaways">
          <ul className="space-y-2 text-slate-300">
            {article.key_takeaways.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-indigo-400 mt-1 shrink-0">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassSection>
      )}

      {article.public_sentiment && (
        <GlassSection icon={Users} title="Public Sentiment">
          <p className="text-slate-300 leading-relaxed">{article.public_sentiment}</p>
        </GlassSection>
      )}

      {article.impact_analysis && (
        <GlassSection icon={Eye} title="Impact Analysis">
          <p className="text-slate-300 leading-relaxed">{article.impact_analysis}</p>
        </GlassSection>
      )}

      {article.future_outlook && (
        <GlassSection icon={TrendingUp} title="Future Outlook">
          <p className="text-slate-300 leading-relaxed">{article.future_outlook}</p>
        </GlassSection>
      )}

      {article.source_links?.length > 0 && (
        <GlassSection icon={ExternalLink} title="Sources & References">
          <div className="space-y-2">
            {article.source_links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
              >
                <ExternalLink className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span>{link.title}</span>
                <span className="text-xs text-slate-600">({link.domain})</span>
              </a>
            ))}
          </div>
        </GlassSection>
      )}

      <div className="flex flex-wrap gap-2 mt-8">
        {article.tags.map(tag => (
          <span key={tag} className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/30">
            <Tag className="w-3 h-3 inline mr-1" /> {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

function GlassSection({ icon: Icon, title, children }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 glass rounded-xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  )
}
