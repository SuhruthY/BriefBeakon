import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Particles() {
  useEffect(() => {
    const container = document.getElementById('particles')
    if (!container) return
    const count = 20
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div')
      dot.className = 'particle'
      dot.style.left = Math.random() * 100 + '%'
      dot.style.width = dot.style.height = (1 + Math.random() * 3) + 'px'
      dot.style.animationDuration = (15 + Math.random() * 25) + 's'
      dot.style.animationDelay = (Math.random() * 20) + 's'
      container.appendChild(dot)
    }
  }, [])

  return <div id="particles" className="particles" />
}

export default function Layout() {
  return (
    <div className="min-h-screen text-slate-100">
      <div className="animated-bg" />
      <div className="dot-grid" />
      <Particles />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800/50 py-8 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} BriefBeakon.
            <span className="hidden sm:inline"> A Beacon for What Matters Today.</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
