import { Link } from 'react-router-dom'
import { Clock, Tag, FileText, ExternalLink } from 'lucide-react'
import type { Article } from '../types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="block group rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 hover:bg-slate-900 transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[article.category]} text-white`}>
          {CATEGORY_LABELS[article.category]}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          {article.publication_date}
        </span>
      </div>
      <h2 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors mb-2">
        {article.title}
      </h2>
      <p className="text-sm text-slate-400 line-clamp-2 mb-3">
        {article.summary}
      </p>
      <div className="flex items-center gap-3 text-xs text-slate-600">
        {article.word_count > 0 && (
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {article.word_count.toLocaleString()} words
          </span>
        )}
        {article.source_links?.length > 0 && (
          <span className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            {article.source_links.length} sources
          </span>
        )}
      </div>
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {article.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
