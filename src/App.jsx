// App.jsx — Main application with routing
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'

/**
 * Simple auth check — reads from sessionStorage
 * so login persists within the browser tab session.
 */
function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('em_logged_in') === 'true'
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default: redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public: Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected: Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
