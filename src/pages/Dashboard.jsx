// pages/Dashboard.jsx — VoltGuard style dashboard
import React, { useState, useEffect, useCallback } from 'react'
import Navbar        from '../components/Navbar.jsx'
import EnergyChart   from '../components/EnergyChart.jsx'
import TheftAlert    from '../components/TheftAlert.jsx'
import ComplaintForm from '../components/ComplaintForm.jsx'

const API_URL     = 'https://energy-meter-backend-four.onrender.com/data'
const MAX_HISTORY = 30

// Anomaly: only flag when data exists
const isAnomaly = (v, p) => {
  if (v == null || p == null) return false
  return v < 200 || v > 250 || p > 3000
}

const timeNow = () => new Date().toLocaleTimeString('en-IN', { hour12: false })

function seedHistory() {
  const now = Date.now()
  return Array.from({ length: MAX_HISTORY }, (_, i) => {
    const t = new Date(now - (MAX_HISTORY - i) * 2000)
    return {
      time:   t.toLocaleTimeString('en-IN', { hour12: false }),
      power:  Math.round(500 + Math.random() * 200),
      energy: Math.round(140 + Math.random() * 20),
    }
  })
}

// Format value: integers as-is, floats to 1dp
const fmt = (v) =>
  v == null ? '—' : Number.isInteger(v) ? v : parseFloat(v).toFixed(1)

export default function Dashboard() {
  const [meterData,   setMeterData]   = useState(null)
  const [history,     setHistory]     = useState(seedHistory)
  const [connected,   setConnected]   = useState(true)
  const [fetchCount,  setFetchCount]  = useState(0)
  const [lastUpdated, setLastUpdated] = useState('')
  const [loadError,   setLoadError]   = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setMeterData(data)
      setConnected(true)
      setLoadError(false)
      const ts = timeNow()
      setLastUpdated(ts)
      setFetchCount(p => p + 1)
      setHistory(prev => {
        const next = [...prev, { time: ts, power: data.power, energy: data.energy }]
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
      })
    } catch {
      setConnected(false)
      setLoadError(true)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 2000)
    return () => clearInterval(id)
  }, [fetchData])

  const voltage = meterData?.voltage ?? null
  const current = meterData?.current ?? null
  const power   = meterData?.power   ?? null
  const energy  = meterData?.energy  ?? null
  const alert   = isAnomaly(voltage, power)
  const username = sessionStorage.getItem('em_user') || 'User'

  // Simulated "today" usage (fraction of total energy)
  const todayUnits = energy != null ? parseFloat((energy * 0.016).toFixed(2)) : null

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>

      {/* ── Navbar ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}
           className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-display font-bold text-slate-800 leading-none">EnergyGuard</p>
            <p className="text-xs text-slate-400 font-body">SMART GRID SYSTEMS</p>
          </div>
        </div>

        {/* Centre: connection badge */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-semibold"
             style={connected
               ? { background: '#f0fdf9', border: '1.5px solid #14b8a6', color: '#0d9488' }
               : { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626' }}>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-teal-500 animate-pulse' : 'bg-red-500'}`}/>
          {connected ? 'LIVE CONNECTED' : 'RECONNECTING…'}
        </div>

        {/* Right: user */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-display font-semibold text-slate-800">{username}</p>
            <p className="text-xs text-slate-400 font-body">CITIZEN | MTR101</p>
          </div>
          <button
            onClick={() => { sessionStorage.clear(); window.location.href = '/login' }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Error banner ── */}
        {loadError && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm"
               style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
            API se connect nahi ho pa raha. Last data show ho raha hai. Har 2 second mein retry…
          </div>
        )}

        {/* ── Theft Alert ── */}
        <TheftAlert isAlert={alert} voltage={voltage} power={power} />

        {/* ══════════════════════════════════════════
            SECTION 1 — LIVE HARDWARE FEED (dark card)
        ══════════════════════════════════════════ */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #0f1f36 0%, #0a1628 60%, #060f1e 100%)',
                      border: '1px solid rgba(20,184,166,0.2)',
                      boxShadow: '0 4px 32px rgba(0,0,0,0.25)' }}>

          {/* Big bolt watermark */}
          <div className="absolute right-6 top-4 opacity-10 pointer-events-none select-none">
            <svg className="w-28 h-28 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
            </svg>
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)' }}>
                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-white">Live Hardware Feed</h2>
                <p className="text-xs font-body font-semibold tracking-widest"
                   style={{ color: '#14b8a6' }}>CONNECTED TO EXTERNAL IoT HUB</p>
              </div>
            </div>
            {/* LIVE badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-bold"
                 style={{ background: connected ? 'rgba(20,184,166,0.15)' : 'rgba(239,68,68,0.15)',
                          border: `1px solid ${connected ? 'rgba(20,184,166,0.4)' : 'rgba(239,68,68,0.4)'}`,
                          color:  connected ? '#2dd4bf' : '#f87171' }}>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-teal-400 animate-pulse' : 'bg-red-400'}`}/>
              {connected ? 'LIVE' : 'OFFLINE'}
            </div>
          </div>

          {/* 4 readings inline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'VOLTAGE', value: fmt(voltage), unit: 'V',   color: '#14b8a6' },
              { label: 'CURRENT', value: fmt(current), unit: 'A',   color: '#60a5fa' },
              { label: 'POWER',   value: fmt(power),   unit: 'W',   color: '#c084fc' },
              { label: 'ENERGY',  value: fmt(energy),  unit: 'KWH', color: '#fbbf24' },
            ].map(r => (
              <div key={r.label}>
                <p className="text-xs font-display font-semibold tracking-widest mb-2"
                   style={{ color: '#475569' }}>{r.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-bold text-white leading-none ticker">
                    {r.value}
                  </span>
                  <span className="text-sm font-body font-semibold" style={{ color: r.color }}>
                    {r.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom status strip */}
          <div className="mt-5 pt-4 flex items-center justify-between flex-wrap gap-2"
               style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-4 text-xs font-body text-slate-500">
              <span>Polls: <span className="text-slate-400 font-mono">{fetchCount}</span></span>
              <span>Updated: <span className="text-slate-400 font-mono">{lastUpdated || '--:--:--'}</span></span>
            </div>
            <button onClick={fetchData}
                    className="flex items-center gap-1.5 text-xs font-display font-semibold transition-colors hover:text-teal-300"
                    style={{ color: '#14b8a6' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
              </svg>
              Refresh Now
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 2 — REAL-TIME METER READING (white cards)
        ══════════════════════════════════════════ */}
        <div>
          {/* Section title */}
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
            </svg>
            <h2 className="text-lg font-display font-bold text-slate-800">Real-Time Meter Reading</h2>
          </div>

          {/* 5 white cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                label: 'VOLTAGE',
                value: fmt(voltage),
                unit: 'V',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                  </svg>
                ),
                iconBg: '#fff7ed', iconBorder: '#fed7aa',
              },
              {
                label: 'CURRENT',
                value: fmt(current),
                unit: 'A',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                  </svg>
                ),
                iconBg: '#eff6ff', iconBorder: '#bfdbfe',
              },
              {
                label: 'POWER',
                value: fmt(power),
                unit: 'W',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#14b8a6" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                  </svg>
                ),
                iconBg: '#f0fdf9', iconBorder: '#99f6e4',
              },
              {
                label: 'UNITS TODAY',
                value: fmt(todayUnits),
                unit: 'KWH',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#8b5cf6" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
                iconBg: '#f5f3ff', iconBorder: '#ddd6fe',
              },
              {
                label: 'TOTAL UNITS',
                value: fmt(energy),
                unit: 'KWH',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                  </svg>
                ),
                iconBg: '#eef2ff', iconBorder: '#c7d2fe',
              },
            ].map(card => (
              <div key={card.label}
                   className="bg-white rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
                   style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                   onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
                   onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-display font-semibold tracking-widest text-slate-400">{card.label}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                       style={{ background: card.iconBg, border: `1px solid ${card.iconBorder}` }}>
                    {card.icon}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-display font-bold text-slate-800 ticker leading-none">
                    {card.value}
                  </span>
                  <span className="text-xs font-body font-semibold text-slate-400 ml-0.5">{card.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chart ── */}
        <EnergyChart history={history} />

        {/* ── Summary Table ── */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 className="text-base font-display font-bold text-slate-800 mb-4">Readings Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-xs font-display uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="pb-3 pr-6">Parameter</th>
                  <th className="pb-3 pr-6">Value</th>
                  <th className="pb-3 pr-6">Unit</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { param: 'Voltage',     val: voltage,    unit: 'V',   ok: voltage != null && voltage >= 200 && voltage <= 250, warn: 'Out of range' },
                  { param: 'Current',     val: current,    unit: 'A',   ok: current != null && current <= 15,                    warn: 'Overload'     },
                  { param: 'Power',       val: power,      unit: 'W',   ok: power   != null && power   <= 3000,                  warn: 'Overload'     },
                  { param: 'Units Today', val: todayUnits, unit: 'kWh', ok: true,                                                warn: ''             },
                  { param: 'Total Units', val: energy,     unit: 'kWh', ok: true,                                                warn: ''             },
                ].map(row => (
                  <tr key={row.param} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-6 font-display font-semibold text-slate-700">{row.param}</td>
                    <td className="py-3 pr-6 font-mono font-semibold text-slate-800">
                      {row.val != null ? fmt(row.val) : <span className="text-slate-400 font-body text-xs">Fetching…</span>}
                    </td>
                    <td className="py-3 pr-6 text-slate-400">{row.unit}</td>
                    <td className="py-3">
                      {row.val == null ? null : row.ok
                        ? <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">Normal</span>
                        : <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">{row.warn}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Complaint Form ── */}
        <ComplaintForm />

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-slate-400 font-body pb-4">
          EnergyGuard · Automated Energy Meter with Electricity Theft Detection ·{' '}
          <span className="text-teal-500">Mini Project 2025</span>
        </footer>

      </main>
    </div>
  )
}
