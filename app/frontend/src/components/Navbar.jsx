// HealthGuard AI - Navbar Component

import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/assessment', label: 'Health Assessment' },
    { path: '/about', label: 'About' }
  ]

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold">HealthGuard AI</span>
          </Link>

          {/* Nav Links */}
          <div className="flex gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium hover:text-blue-200 transition-colors
                  ${location.pathname === link.path
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar