// Registro do Service Worker - EcoWaste Green
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('EcoWaste SW: Registrado com sucesso', registration);
      
      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            if (confirm('Nova versão disponível! Deseja atualizar?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
      
      // Listener para controle do SW
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      
    } catch (error) {
      console.error('EcoWaste SW: Erro no registro', error);
    }
  });
}

// Verificar se está online/offline
window.addEventListener('online', () => {
  console.log('EcoWaste: Conectado');
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  console.log('EcoWaste: Desconectado');
  document.body.classList.add('offline');
});