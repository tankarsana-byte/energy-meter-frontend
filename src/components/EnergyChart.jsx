// components/EnergyChart.jsx — Tabbed chart: Live | 1 Day | 1 Month
import React, { useEffect, useRef, useState, useMemo } from 'react'
import {
  Chart,
  LineElement,
  BarElement,
  PointElement,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(
  LineElement, BarElement, PointElement,
  LineController, BarController,
  CategoryScale, LinearScale,
  Filler, Tooltip, Legend
)

// ── Simulate 24-hour data (hourly) ──────────────────────────
function generateDayData() {
  const hours = []
  for (let h = 0; h < 24; h++) {
    const label = `${String(h).padStart(2,'0')}:00`
    // Higher usage morning & evening, low at night
    const base  = h >= 6 && h <= 9   ? 700  :
                  h >= 17 && h <= 21  ? 900  :
                  h >= 22 || h < 5    ? 150  : 450
    hours.push({
      time:   label,
      power:  Math.round(base  + (Math.random() - 0.5) * 120),
      energy: parseFloat((base / 1000 + Math.random() * 0.05).toFixed(3)),
    })
  }
  return hours
}

// ── Simulate 30-day data (daily) ────────────────────────────
function generateMonthData() {
  const days = []
  const now  = new Date()
  for (let d = 29; d >= 0; d--) {
    const date = new Date(now)
    date.setDate(now.getDate() - d)
    const label = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    days.push({
      time:   label,
      power:  Math.round(400 + Math.random() * 600),
      energy: parseFloat((3 + Math.random() * 5).toFixed(2)),
    })
  }
  return days
}

// ── Shared chart options factory ────────────────────────────
function buildOptions(ctx, type) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'DM Sans', size: 12 },
          boxWidth: 12, boxHeight: 12,
          usePointStyle: true, pointStyle: 'circle', padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(6,15,30,0.95)',
        borderColor: 'rgba(20,184,166,0.3)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        titleFont: { family: 'Syne', weight: '600', size: 13 },
        bodyFont: { family: 'DM Sans', size: 12 },
        padding: 12, cornerRadius: 12,
        displayColors: true, boxWidth: 10, boxHeight: 10,
      },
    },
    scales: {
      x: {
        grid:  { color: 'rgba(20,184,166,0.05)', drawBorder: false },
        ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: type === 'month' ? 10 : 12 },
      },
      y: {
        grid:  { color: 'rgba(20,184,166,0.06)', drawBorder: false },
        ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
  }
}

// ── Single chart renderer ────────────────────────────────────
function ChartCanvas({ data, chartType }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return
    const ctx = canvasRef.current.getContext('2d')

    const gradPower = ctx.createLinearGradient(0, 0, 0, 280)
    gradPower.addColorStop(0, 'rgba(20,184,166,0.4)')
    gradPower.addColorStop(1, 'rgba(20,184,166,0.0)')

    const gradEnergy = ctx.createLinearGradient(0, 0, 0, 280)
    gradEnergy.addColorStop(0, 'rgba(96,165,250,0.3)')
    gradEnergy.addColorStop(1, 'rgba(96,165,250,0.0)')

    if (chartRef.current) { chartRef.current.destroy() }

    const isBar    = chartType === 'bar'
    const labels   = data.map(d => d.time)
    const powerVal = data.map(d => d.power)
    const energyVal= data.map(d => d.energy)

    chartRef.current = new Chart(ctx, {
      type: isBar ? 'bar' : 'line',
      data: {
        labels,
        datasets: [
          {
            label:           'Power (W)',
            data:            powerVal,
            borderColor:     '#14b8a6',
            borderWidth:     isBar ? 0 : 2,
            backgroundColor: isBar ? 'rgba(20,184,166,0.55)' : gradPower,
            fill:            !isBar,
            tension:         0.4,
            pointRadius:     isBar ? 0 : 3,
            pointHoverRadius:isBar ? 0 : 6,
            pointBackgroundColor: '#14b8a6',
            pointBorderColor:     '#020917',
            pointBorderWidth:     2,
            borderRadius:    isBar ? 4 : 0,
            yAxisID:         'y',
          },
          {
            label:           'Energy (kWh)',
            data:            energyVal,
            borderColor:     '#60a5fa',
            borderWidth:     isBar ? 0 : 2,
            backgroundColor: isBar ? 'rgba(96,165,250,0.45)' : gradEnergy,
            fill:            !isBar,
            tension:         0.4,
            pointRadius:     isBar ? 0 : 3,
            pointHoverRadius:isBar ? 0 : 6,
            pointBackgroundColor: '#60a5fa',
            pointBorderColor:     '#020917',
            pointBorderWidth:     2,
            borderRadius:    isBar ? 4 : 0,
            yAxisID:         'y1',
          },
        ],
      },
      options: {
        ...buildOptions(ctx, chartType),
        scales: {
          x: {
            grid:  { color: 'rgba(20,184,166,0.05)', drawBorder: false },
            ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 12 },
            stacked: false,
          },
          y: {
            position: 'left',
            grid:  { color: 'rgba(20,184,166,0.06)', drawBorder: false },
            ticks: { color: '#14b8a6', font: { family: 'JetBrains Mono', size: 10 } },
            title: { display: true, text: 'Power (W)', color: '#14b8a680', font: { size: 10 } },
          },
          y1: {
            position: 'right',
            grid:  { drawOnChartArea: false },
            ticks: { color: '#60a5fa', font: { family: 'JetBrains Mono', size: 10 } },
            title: { display: true, text: 'Energy (kWh)', color: '#60a5fa80', font: { size: 10 } },
          },
        },
      },
    })

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null } }
  }, [data, chartType])

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

// ── Main Export ──────────────────────────────────────────────
export default function EnergyChart({ history }) {
  const [activeTab, setActiveTab] = useState('live')

  // Memoize simulated data so it doesn't re-generate on every render
  const dayData   = useMemo(() => generateDayData(),   [])
  const monthData = useMemo(() => generateMonthData(), [])

  const tabs = [
    { id: 'live',  label: '⚡ Live',    badge: '2s',   desc: 'Real-time readings from sensor' },
    { id: 'day',   label: '📅 1 Day',   badge: '24h',  desc: 'Hourly usage for today'         },
    { id: 'month', label: '📆 1 Month', badge: '30d',  desc: 'Daily usage for past 30 days'   },
  ]

  // Summary stats per tab
  const stats = {
    live: {
      avg:  history.length ? Math.round(history.reduce((s,h) => s + h.power, 0) / history.length) : 0,
      max:  history.length ? Math.max(...history.map(h => h.power)) : 0,
      unit: 'W',
    },
    day: {
      avg:  Math.round(dayData.reduce((s,d) => s + d.power, 0) / dayData.length),
      max:  Math.max(...dayData.map(d => d.power)),
      unit: 'W',
    },
    month: {
      avg:  parseFloat((monthData.reduce((s,d) => s + d.energy, 0) / monthData.length).toFixed(2)),
      max:  parseFloat(Math.max(...monthData.map(d => d.energy)).toFixed(2)),
      unit: 'kWh/day',
    },
  }

  const current = stats[activeTab]
  const activeDesc = tabs.find(t => t.id === activeTab)?.desc

  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-800">Energy & Power Usage</h2>
          <p className="text-xs text-slate-400 font-body mt-0.5">{activeDesc}</p>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs font-body px-3 py-1.5 rounded-lg"
               style={{ background: '#f0fdf9', border: '1px solid #99f6e4' }}>
            <span className="text-slate-500">Avg </span>
            <span className="text-teal-600 font-mono font-semibold">{current.avg} {current.unit}</span>
          </div>
          <div className="text-xs font-body px-3 py-1.5 rounded-lg"
               style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <span className="text-slate-500">Peak </span>
            <span className="text-blue-600 font-mono font-semibold">{current.max} {current.unit}</span>
          </div>
        </div>
      </div>

      {/* ── Tab Buttons ── */}
      <div className="flex gap-2 mb-5 p-1 rounded-xl w-fit"
           style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-4 py-2 rounded-lg text-xs font-display font-semibold transition-all duration-200 flex items-center gap-2"
            style={
              activeTab === tab.id
                ? { background: '#fff', color: '#0d9488', border: '1px solid #99f6e4', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                : { color: '#94a3b8', border: '1px solid transparent' }
            }
          >
            {tab.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                  style={{
                    background: activeTab === tab.id ? '#f0fdf9' : '#f1f5f9',
                    color:      activeTab === tab.id ? '#0d9488' : '#94a3b8',
                  }}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* ── Chart ── */}
      {activeTab === 'live' && (
        <ChartCanvas data={history} chartType="line" />
      )}
      {activeTab === 'day' && (
        <ChartCanvas data={dayData} chartType="bar" />
      )}
      {activeTab === 'month' && (
        <ChartCanvas data={monthData} chartType="bar" />
      )}

      {/* ── Footer note ── */}
      <p className="text-xs text-slate-400 font-body mt-4 text-center">
        {activeTab === 'live'  && '● Updating every 2 seconds from live sensor'}
        {activeTab === 'day'   && '○ Simulated hourly data — replace with real API when available'}
        {activeTab === 'month' && '○ Simulated daily data — replace with real API when available'}
      </p>
    </div>
  )
}
