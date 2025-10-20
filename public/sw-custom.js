// Service Worker Customizado - EcoWaste Green
import { precacheAndRoute, cleanupOutdatedCaches, clientsClaim } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Configurações
const CACHE_NAMES = {
  STATIC: 'ecowaste-static-v1',
  DYNAMIC: 'ecowaste-dynamic-v1',
  API: 'ecowaste-api-v1',
  IMAGES: 'ecowaste-images-v1'
};

// Precache e rotas
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();

// Estratégia para APIs
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: CACHE_NAMES.API,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 horas
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Estratégia para imagens
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: CACHE_NAMES.IMAGES,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
      }),
    ],
  })
);

// Estratégia para recursos estáticos
registerRoute(
  ({ request }) => 
    request.destination === 'script' || 
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.STATIC,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
      }),
    ],
  })
);

// Listener para mensagens
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Listener para instalação
self.addEventListener('install', (event) => {
  console.log('EcoWaste SW: Instalado');
  self.skipWaiting();
});

// Listener para ativação
self.addEventListener('activate', (event) => {
  console.log('EcoWaste SW: Ativado');
  event.waitUntil(clients.claim());
});