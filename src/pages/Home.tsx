import { useState, useEffect, useRef } from 'react'
import { Sparkles, Newspaper, TrendingUp, BookOpen, Layers, ArrowDown } from 'lucide-react'
import ArticleCard from '../components/ArticleCard'
import CategoryNav from '../components/CategoryNav'
import { getPublishedArticles } from '../lib/data'
import { useSound } from '../hooks/useSound'
import type { Article } from '../types'

function useCounter(target: number, duration: number) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return count
}

function StatCard({ icon: Icon, value, label, suffix }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; value: number; label: string; suffix?: string }) {
  const count = useCounter(value, 2000)
  return (
    <div className="reveal glass rounded-xl p-4 sm:p-5 text-center">
      <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
      <div className="stat-number text-2xl sm:text-3xl font-bold text-white">
        {count}{suffix || ''}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function HeroSection({ articleCount, loading }: { articleCount: number; loading: boolean }) {
  const { playWhoosh } = useSound()

  useEffect(() => { playWhoosh() }, [])

  const scrollToContent = () => {
    document.getElementById('today-briefing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative mb-12 sm:mb-16 pt-4 sm:pt-8">
      <div className="flex flex-col items-center text-center">
        {/* Beacon */}
        <div className="beacon-container mb-6">
          <div className="beacon-ring" />
          <div className="beacon-ring" />
          <div className="beacon-ring" />
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
            <div className="light-beam left" />
            <div className="light-beam right" />
            <div className="beacon-core flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 reveal visible">
          <span className="gradient-text">BriefBeakon</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-xl mb-2 reveal visible reveal-delay-1 leading-relaxed">
          A Beacon for What Matters Today.
        </p>
        <p className="text-sm text-slate-600 max-w-md reveal visible reveal-delay-2">
          AI-curated intelligence that cuts through the noise.
          <span className="hidden sm:inline"> Every story, analyzed. Every angle, covered.</span>
        </p>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg mt-8 reveal reveal-delay-3">
            <StatCard icon={Newspaper} value={articleCount} label="Articles Today" />
            <StatCard icon={Layers} value={6} label="Categories" />
            <StatCard icon={BookOpen} value={Math.max(1, Math.floor(articleCount / 3))} label="Avg. Words" suffix="K+" />
          </div>
        )}

        {/* Scroll hint */}
        <button
          onClick={scrollToContent}
          className="mt-8 text-slate-700 animate-bounce hover:text-indigo-400 transition-colors cursor-pointer"
          aria-label="Scroll to articles"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

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
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div>
      <HeroSection articleCount={articles.length} loading={loading} />

      <div id="today-briefing" className="mb-8 reveal">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-500 tracking-widest uppercase">{today}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
          Today's Briefing
        </h2>
      </div>

      <div className="reveal reveal-delay-1">
        <CategoryNav />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <h2 className="text-xl font-semibold text-slate-400 mb-2">No articles yet</h2>
          <p className="text-slate-600">The first edition is being generated. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <div key={article.slug} className={`reveal reveal-delay-${Math.min(i + 1, 6)}`}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
