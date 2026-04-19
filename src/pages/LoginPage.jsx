// pages/LoginPage.jsx — Stylish login screen
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  // Form state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  /**
   * Handle login form submission.
   * No real auth — accepts any non-empty username/password.
   */
  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Simple validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)

    // Simulate a short "loading" for UX polish
    setTimeout(() => {
      sessionStorage.setItem('em_logged_in', 'true')
      sessionStorage.setItem('em_user', username)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="noise min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(20,184,166,0.12) 0%, #020917 60%)' }}>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-10 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-10 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #0d9488, transparent)' }} />

      {/* Login Card */}
      <div className="glass card-glow rounded-2xl p-8 w-full max-w-md mx-4 animate-slide-up relative z-10">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-glow"
               style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(13,148,136,0.3))', border: '1px solid rgba(20,184,166,0.4)' }}>
            <svg className="w-8 h-8 text-electric-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-white text-glow">EnergyGuard</h1>
          <p className="text-slate-400 text-sm mt-1 font-body">Smart Meter · Theft Detection System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-xs font-display font-semibold text-electric-400 uppercase tracking-widest mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 rounded-xl font-body text-sm text-white placeholder-slate-500 transition-all duration-200"
                style={{ background: 'rgba(15,31,54,0.8)', border: '1px solid rgba(20,184,166,0.2)' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-display font-semibold text-electric-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-xl font-body text-sm text-white placeholder-slate-500 transition-all duration-200"
                style={{ background: 'rgba(15,31,54,0.8)', border: '1px solid rgba(20,184,166,0.2)' }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs font-body bg-red-900/20 rounded-lg px-3 py-2 border border-red-800/40">
              ⚠ {error}
            </p>
          )}

          {/* Hint */}
          <p className="text-slate-500 text-xs font-body text-center">
            Demo: any username &amp; password works
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-display font-semibold text-white text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing In…
              </span>
            ) : 'Sign In →'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6 font-body">
          Automated Energy Meter with Theft Detection
        </p>
      </div>
    </div>
  )
}
