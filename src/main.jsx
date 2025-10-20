import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// Notificações de atualização do SW
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Mostrar notificação de atualização
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
      ">
        <strong>🎉 Atualização Instalada!</strong>
        <p>Nova versão do EcoWaste Green disponível.</p>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #10B981;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          margin-top: 0.5rem;
          cursor: pointer;
        ">
          Recarregar
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 10 segundos
    setTimeout(() => {
      notification.remove();
    }, 10000);
  });
}