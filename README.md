# ⚡ EnergyGuard — Automated Energy Meter Frontend

A clean, modern React dashboard for real-time energy monitoring with electricity theft detection.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## 🔑 Login
- Any username and any password works (demo mode, no real auth)

## 📡 API
The app fetches live data from:
```
GET https://energy-meter-backend-four.onrender.com/data
```
Auto-refreshes every **2 seconds**.

## 🏗 Project Structure

```
/src
  /components
    Navbar.jsx        ← Top navigation bar
    MetricCard.jsx    ← Individual reading card (Voltage, Current, Power, Energy)
    EnergyChart.jsx   ← Chart.js line graph (power + energy over time)
    TheftAlert.jsx    ← Anomaly / theft detection banner
    StatusBar.jsx     ← API connection status strip
  /pages
    LoginPage.jsx     ← Login screen
    Dashboard.jsx     ← Main citizen dashboard
  App.jsx             ← Router setup
  main.jsx            ← React entry point
  index.css           ← Global Tailwind + custom styles
```

## 🌐 Deploy on Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts, choose "Vite" framework
```

### Option B — Vercel Dashboard
1. Push project to GitHub
2. Go to https://vercel.com/new
3. Import your repo
4. Vercel auto-detects Vite — click **Deploy**
5. Done! ✅

> The `vercel.json` file handles SPA routing so direct URL access (e.g. `/dashboard`) works correctly.

## ⚙️ Build for Production

```bash
npm run build
# Output goes to /dist — upload to any static host
```

## 🛡 Theft Detection Logic
- Voltage below 200V or above 250V → Alert
- Power above 3000W → Alert
- Configurable in `Dashboard.jsx` → `isAnomaly()` function

## 📦 Tech Stack
- **React 18** + Vite
- **Tailwind CSS** (dark theme, glassmorphism)
- **Chart.js** + react-chartjs-2
- **React Router v6**
- Google Fonts: Syne, DM Sans, JetBrains Mono
