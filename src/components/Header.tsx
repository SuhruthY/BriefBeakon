import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Settings } from 'lucide-react'
import { useSound } from '../hooks/useSound'

export default function Header() {
  const location = useLocation()
  const { playTick, playChime } = useSound()

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={() => playChime()}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-shadow duration-300">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-sm group-hover:blur-md transition-all duration-300 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text tracking-tight">BriefBeakon</span>
              <span className="hidden sm:block text-[10px] text-slate-600 tracking-widest uppercase -mt-0.5">A Beacon for What Matters Today</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/" label="Today" current={location.pathname} onClick={playTick} />
            <NavLink to="/movies" label="Movies" current={location.pathname} onClick={playTick} />
            <NavLink to="/podcast" label="Podcast" current={location.pathname} onClick={playTick} />
            <Link
              to="/preferences"
              onClick={playTick}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label, current, onClick }: { to: string; label: string; current: string; onClick: () => void }) {
  const isActive = to === '/' ? current === '/' : current.startsWith(to)
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'text-white bg-indigo-600/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500 rounded-full" />
      )}
    </Link>
  )
}
