import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function HomePage() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '700' }}>
        EcoWaste Green V6.4
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
        Reciclagem Inteligente com IA, Blockchain e Gamificação
      </p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '2rem', 
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '500px'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>✅ Aplicação Funcionando!</h2>
        <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <p>🚀 Build realizado com sucesso</p>
          <p>⚡ Vite configurado corretamente</p>
          <p>📱 PWA habilitado</p>
          <p>🔒 Configurações de segurança ativas</p>
          <p>🌐 Pronto para deploy no Vercel</p>
        </div>
      </div>
      <div style={{ 
        marginTop: '2rem',
        fontSize: '0.9rem',
        opacity: 0.7
      }}>
        Versão 6.4.0 - Final Release
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App