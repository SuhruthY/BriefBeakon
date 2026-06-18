import { Link, useParams } from 'react-router-dom'
import { useSound } from '../hooks/useSound'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types'
import type { Category } from '../types'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export default function CategoryNav() {
  const { category: active } = useParams()
  const { playTick } = useSound()

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      <Link
        to="/"
        onClick={() => playTick()}
        className={`text-sm px-3 py-1.5 rounded-full transition-all duration-200 border ${
          !active
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            : 'border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-600'
        }`}
      >
        All
      </Link>
      {ALL_CATEGORIES.map(cat => (
        <Link
          key={cat}
          to={`/category/${cat}`}
          onClick={() => playTick()}
          className={`text-sm px-3 py-1.5 rounded-full transition-all duration-200 border category-pill ${
            active === cat
              ? `bg-gradient-to-r ${CATEGORY_COLORS[cat]} text-white border-transparent shadow-lg`
              : 'border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-600'
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </div>
  )
}
