// components/Navbar.jsx — Top navigation bar
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ lastUpdated }) {
  const navigate  = useNavigate()
  const username  = sessionStorage.getItem('em_user') || 'User'

  const handleLogout = () => {
    sessionStorage.removeItem('em_logged_in')
    sessionStorage.removeItem('em_user')
    navigate('/login')
  }

  return (
    <nav className="glass border-b border-electric-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-glow"
                 style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.25), rgba(13,148,136,0.4))', border: '1px solid rgba(20,184,166,0.4)' }}>
              <svg className="w-4 h-4 text-electric-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">EnergyGuard</span>
          </div>

          {/* Centre status */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-body text-slate-400">
            <span className="status-dot" />
            <span>Live · Updated {lastUpdated || '--:--:--'}</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-body text-slate-300">
              <div className="w-7 h-7 rounded-full bg-electric-800/60 border border-electric-700/40 flex items-center justify-center text-electric-300 font-display font-bold text-xs">
                {username.charAt(0).toUpperCase()}
              </div>
              <span>{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-display font-semibold text-slate-400 hover:text-red-400 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-red-900/20 border border-transparent hover:border-red-800/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
