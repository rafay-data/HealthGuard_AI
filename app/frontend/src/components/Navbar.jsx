// HealthGuard AI - Navbar Component

import { Link, useLocation } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

function Navbar() {
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/assessment', label: 'Health Assessment' },
    { path: '/about', label: 'About' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-ink/95 backdrop-blur
                     border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center flex-wrap gap-3">

          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-lg bg-accent/15
                             flex items-center justify-center
                             group-hover:bg-accent/25 transition-colors">
              <HeartPulse className="w-5 h-5 text-accent" strokeWidth={2.2} />
            </span>
            <span className="text-lg font-display font-semibold
                             text-paper tracking-tight">
              HealthGuard <span className="text-accent">AI</span>
            </span>
          </Link>

          <div className="flex gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-1
                  ${location.pathname === link.path
                    ? 'text-paper'
                    : 'text-paper/60 hover:text-paper/90'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5
                                   bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar