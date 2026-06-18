import { Link, useParams } from 'react-router-dom'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types'
import type { Category } from '../types'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export default function CategoryNav() {
  const { category: active } = useParams()

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        to="/"
        className={`text-sm px-3 py-1.5 rounded-full transition-colors border ${
          !active
            ? 'bg-indigo-600 border-indigo-500 text-white'
            : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
        }`}
      >
        All
      </Link>
      {ALL_CATEGORIES.map(cat => (
        <Link
          key={cat}
          to={`/category/${cat}`}
          className={`text-sm px-3 py-1.5 rounded-full transition-colors border ${
            active === cat
              ? `bg-gradient-to-r ${CATEGORY_COLORS[cat]} text-white border-transparent`
              : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </div>
  )
}
