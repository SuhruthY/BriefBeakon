import { Link } from 'react-router-dom'
import { Sparkles, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center beacon-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">BriefBeakon</span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2">A Beacon for What Matters Today</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              Today
            </Link>
            <Link to="/movies" className="text-sm text-slate-400 hover:text-white transition-colors">
              Movies
            </Link>
            <Link to="/preferences" className="text-slate-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
