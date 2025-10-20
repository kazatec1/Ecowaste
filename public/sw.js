// Service Worker para EcoWaste Green V6.1
// Implementa cache offline e sincronização de dados

const CACHE_NAME = 'ecowastegreen-v6.1';
const STATIC_CACHE = 'static-v6.1';
const API_CACHE = 'api-v6.1';

// Recursos para cache offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache First para assets estáticos
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return response;
            });
        })
        .catch(() => {
          // Fallback para imagens offline
          if (request.destination === 'image') {
            return new Response('<svg>...</svg>', {
              headers: { 'Content-Type': 'image/svg+xml' }
            });
          }
        })
    );
    return;
  }

  // Network First para APIs
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache apenas respostas bem-sucedidas
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache quando offline
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Resposta offline padrão para APIs
              return new Response(JSON.stringify({
                error: 'Offline',
                message: 'Dados não disponíveis offline'
              }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              });
            });
        })
    );
    return;
  }

  // Stale While Revalidate para páginas HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return response;
            });

          return response || fetchPromise;
        })
        .catch(() => {
          // Fallback para página offline
          return caches.match('/index.html');
        })
    );
    return;
  }
});

// Background Sync para dados offline
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncOfflineData()
    );
  }
});

// Função para sincronizar dados offline
async function syncOfflineData() {
  try {
    // Recuperar dados pendentes do IndexedDB
    const pendingData = await getOfflineData();
    
    for (const data of pendingData) {
      try {
        await fetch(data.url, {
          method: data.method,
          headers: data.headers,
          body: data.body
        });
        
        // Remover dados sincronizados
        await removeOfflineData(data.id);
        
        console.log('Service Worker: Data synced successfully', data.id);
      } catch (error) {
        console.error('Service Worker: Failed to sync data', data.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Placeholder para funções de IndexedDB
async function getOfflineData() {
  // Implementar recuperação de dados do IndexedDB
  return [];
}

async function removeOfflineData(id) {
  // Implementar remoção de dados do IndexedDB
  console.log('Removing offline data:', id);
}

// Notificações push (placeholder)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'Nova atualização disponível no EcoWaste Green!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('EcoWaste Green', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
