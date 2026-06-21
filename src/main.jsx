import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import './index.css'

createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <Routes>
      {/* Default route → redirect ke /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>
)
