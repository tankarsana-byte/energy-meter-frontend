// components/ComplaintForm.jsx — Submit & view complaints
import React, { useState } from 'react'

// Complaint categories
const CATEGORIES = [
  'Electricity Theft / Tampering',
  'Meter Not Working',
  'Abnormal Bill / High Reading',
  'Power Fluctuation',
  'Damaged Meter Box',
  'Unauthorized Connection',
  'Other',
]

// Unique ID generator
const genId = () => 'CMP-' + Math.random().toString(36).substring(2, 7).toUpperCase()

export default function ComplaintForm() {
  // ── Form state ──────────────────────────────────────────────
  const [name,       setName]       = useState('')
  const [phone,      setPhone]      = useState('')
  const [address,    setAddress]    = useState('')
  const [category,   setCategory]   = useState('')
  const [description,setDescription]= useState('')
  const [submitted,  setSubmitted]  = useState(false)
  const [errors,     setErrors]     = useState({})

  // ── Complaints history (in-memory) ─────────────────────────
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-DEMO1',
      name: 'Rahul Sharma',
      category: 'Electricity Theft / Tampering',
      description: 'Neighbour seems to have bypassed the meter.',
      status: 'Under Review',
      date: '18 Apr 2025, 10:32 AM',
    },
  ])

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!name.trim())        e.name        = 'Name is required'
    if (!phone.trim())       e.phone       = 'Phone number is required'
    if (!/^\d{10}$/.test(phone.trim())) e.phone = 'Enter valid 10-digit number'
    if (!address.trim())     e.address     = 'Address is required'
    if (!category)           e.category    = 'Select a category'
    if (!description.trim()) e.description = 'Please describe the issue'
    return e
  }

  // ── Submit handler ──────────────────────────────────────────
  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    const newComplaint = {
      id:          genId(),
      name:        name.trim(),
      category,
      description: description.trim(),
      status:      'Submitted',
      date:        new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    }

    setComplaints(prev => [newComplaint, ...prev])
    setSubmitted(true)
    setErrors({})

    // Reset form after 3 seconds
    setTimeout(() => {
      setName(''); setPhone(''); setAddress('')
      setCategory(''); setDescription(''); setSubmitted(false)
    }, 3000)
  }

  // ── Status badge colour ─────────────────────────────────────
  const statusStyle = (s) => {
    if (s === 'Submitted')    return { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' }
    if (s === 'Under Review') return { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' }
    if (s === 'Resolved')     return { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' }
    return                           { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',border: 'rgba(148,163,184,0.2)' }
  }

  // ── Input class helper ──────────────────────────────────────
  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-slate-500 transition-all duration-200 ${
      errors[field] ? 'border-red-500/50' : 'border-electric-900/30'
    }`
  const inputStyle = (field) => ({
    background: 'rgba(15,31,54,0.8)',
    border: `1px solid ${errors[field] ? 'rgba(239,68,68,0.4)' : 'rgba(20,184,166,0.2)'}`,
  })

  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-display font-bold text-white">File a Complaint</h2>
          <p className="text-xs text-slate-400 font-body mt-0.5">Report theft, tampering, or any meter issue</p>
        </div>
      </div>

      {/* ── Success Banner ── */}
      {submitted && (
        <div className="mb-5 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in"
             style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.3)' }}>
          <svg className="w-4 h-4 text-electric-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-body text-electric-300">
            Complaint submitted successfully! Our team will review it shortly.
          </p>
        </div>
      )}

      {/* ── Form Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

        {/* Name */}
        <div>
          <label className="block text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            placeholder="e.g. Rahul Sharma"
            className={inputCls('name')}
            style={inputStyle('name')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }}
            placeholder="10-digit mobile number"
            className={inputCls('phone')}
            style={inputStyle('phone')}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
            Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={e => { setAddress(e.target.value); setErrors(p => ({ ...p, address: '' })) }}
            placeholder="House No, Street, Area"
            className={inputCls('address')}
            style={inputStyle('address')}
          />
          {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
            Complaint Category *
          </label>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })) }}
            className={inputCls('category')}
            style={{ ...inputStyle('category'), cursor: 'pointer' }}
          >
            <option value="" disabled>Select a category…</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c} style={{ background: '#0a1628' }}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <label className="block text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
          Description *
        </label>
        <textarea
          value={description}
          onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })) }}
          placeholder="Describe the issue in detail…"
          rows={3}
          className={inputCls('description')}
          style={{ ...inputStyle('description'), resize: 'none' }}
        />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="btn-primary w-full py-3 rounded-xl font-display font-semibold text-white text-sm tracking-wide"
      >
        Submit Complaint →
      </button>

      {/* ── Complaints History ── */}
      {complaints.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-display font-bold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-electric-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            My Complaints ({complaints.length})
          </h3>

          <div className="space-y-3">
            {complaints.map(c => {
              const s = statusStyle(c.status)
              return (
                <div key={c.id}
                     className="rounded-xl p-4 transition-all duration-200"
                     style={{ background: 'rgba(15,31,54,0.5)', border: '1px solid rgba(20,184,166,0.08)' }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-500">{c.id}</span>
                      <span className="text-xs font-display font-semibold text-white">{c.category}</span>
                    </div>
                    <span className="text-xs font-display font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-body mb-1">{c.description}</p>
                  <p className="text-xs text-slate-600 font-mono">{c.date} · {c.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
