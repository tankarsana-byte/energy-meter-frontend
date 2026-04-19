// components/TheftAlert.jsx — Light theme anomaly banner
import React from 'react'

export default function TheftAlert({ isAlert, voltage, power }) {
  if (!isAlert) {
    return (
      <div className="rounded-xl px-5 py-3.5 flex items-center gap-3"
           style={{ background: '#f0fdf9', border: '1px solid #99f6e4' }}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#14b8a6" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
        </svg>
        <p className="text-sm font-body text-teal-700">
          <span className="font-semibold font-display">System Normal</span> — All readings within safe limits. No anomalies detected.
        </p>
        <span className="ml-auto text-xs font-mono text-teal-500 font-semibold">✓ SECURE</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl px-5 py-3.5 flex items-center gap-3 animate-pulse-slow"
         style={{ background: '#fef2f2', border: '1.5px solid #fca5a5' }}>
      <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
      </svg>
      <p className="text-sm font-body text-red-700">
        <span className="font-semibold font-display">⚠ Anomaly Detected</span> — Unusual reading: V:{voltage}V · P:{power}W. Possible tampering or overload.
      </p>
      <span className="ml-auto text-xs font-mono text-red-500 font-semibold animate-pulse">ALERT</span>
    </div>
  )
}
