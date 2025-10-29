import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Header from './components/Header.jsx'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Adicione outras rotas aqui (ex: Scanner, Blockchain, Social) */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
