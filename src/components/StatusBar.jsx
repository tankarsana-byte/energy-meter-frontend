// components/StatusBar.jsx — Shows connection status and last fetch
import React from 'react'

/**
 * Props:
 *  connected   – boolean, whether last API fetch succeeded
 *  fetchCount  – total number of successful fetches
 *  lastUpdated – time string of last update
 */
export default function StatusBar({ connected, fetchCount, lastUpdated }) {
  return (
    <div className="glass-light rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">

      {/* Left: Connection indicator */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 text-xs font-body ${connected ? 'text-electric-400' : 'text-red-400'}`}>
          {connected ? (
            <>
              <span className="status-dot" />
              <span>Connected to EnergyMeter API</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
              <span>Connection lost — retrying…</span>
            </>
          )}
        </div>
      </div>

      {/* Centre: Endpoint */}
      <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-600">
        <span className="text-electric-700">GET</span>
        <span>energy-meter-backend-four.onrender.com/data</span>
      </div>

      {/* Right: Stats */}
      <div className="flex items-center gap-4 text-xs font-body text-slate-500">
        <span>Polls: <span className="text-slate-300 font-mono">{fetchCount}</span></span>
        <span>Updated: <span className="text-slate-300 font-mono">{lastUpdated || '--'}</span></span>
        <span className="hidden sm:inline px-2 py-0.5 rounded-full font-display font-semibold text-electric-500"
              style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)' }}>
          2s refresh
        </span>
      </div>
    </div>
  )
}
