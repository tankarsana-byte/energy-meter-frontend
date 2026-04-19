// components/MetricCard.jsx — Individual reading card
import React from 'react'

/**
 * Props:
 *  label      – display name  e.g. "Voltage"
 *  value      – numeric value e.g. 230
 *  unit       – unit string   e.g. "V"
 *  icon       – SVG path string
 *  color      – tailwind color accent  e.g. "electric" | "blue" | "purple" | "amber"
 *  description– short hint text
 *  index      – stagger index 1-4
 */
export default function MetricCard({ label, value, unit, icon, color = 'electric', description, index = 1 }) {

  // Colour maps for tailwind (must be explicit strings, not computed)
  const colorMap = {
    electric: {
      ring:  'rgba(20,184,166,0.15)',
      glow:  'rgba(20,184,166,0.25)',
      icon:  'rgba(20,184,166,0.12)',
      text:  '#14b8a6',
      badge: 'rgba(20,184,166,0.1)',
    },
    blue: {
      ring:  'rgba(59,130,246,0.15)',
      glow:  'rgba(59,130,246,0.2)',
      icon:  'rgba(59,130,246,0.12)',
      text:  '#60a5fa',
      badge: 'rgba(59,130,246,0.1)',
    },
    purple: {
      ring:  'rgba(168,85,247,0.15)',
      glow:  'rgba(168,85,247,0.2)',
      icon:  'rgba(168,85,247,0.12)',
      text:  '#c084fc',
      badge: 'rgba(168,85,247,0.1)',
    },
    amber: {
      ring:  'rgba(245,158,11,0.15)',
      glow:  'rgba(245,158,11,0.2)',
      icon:  'rgba(245,158,11,0.12)',
      text:  '#fbbf24',
      badge: 'rgba(245,158,11,0.1)',
    },
  }

  const c = colorMap[color] || colorMap.electric

  return (
    <div
      className={`glass rounded-2xl p-6 transition-all duration-300 cursor-default animate-slide-up stagger-${index}`}
      style={{
        border: `1px solid ${c.ring}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${c.glow}, 0 8px 32px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row: icon + label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-display font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background: c.icon, border: `1px solid ${c.ring}` }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={c.text} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-2">
        <span
          className="text-4xl font-display font-bold ticker transition-all duration-300"
          style={{ color: value !== null ? '#f1f5f9' : '#475569' }}
        >
          {value !== null && value !== undefined ? (Number.isInteger(value) ? value : parseFloat(value).toFixed(1)) : '—'}
        </span>
        <span className="text-sm font-body font-medium" style={{ color: c.text }}>
          {unit}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs font-body text-slate-500">{description}</p>
    </div>
  )
}
