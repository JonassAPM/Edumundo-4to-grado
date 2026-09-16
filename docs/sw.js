/**
 * @file sw.js — Service Worker de EduAventura G4
 *
 * Estrategia de Caching Inteligente:
 *   - Network-First para HTML y JavaScript (app.js): Garantiza que cualquier
 *     actualización se reciba de inmediato sin requerir Ctrl+Shift+R, con
 *     fallback a caché para funcionamiento Offline completo.
 *   - Stale-While-Revalidate para assets estáticos (imágenes, iconos, fuentes).
 *   - skipWaiting y clients.claim inmediatos en cada ciclo.
 *   - Purga automática de cachés obsoletos en activate.
 */

'use strict';

// El nombre de caché se actualiza automáticamente con el timestamp en postbuild
const CACHE_NAME = 'eduaventura-build-1789534541719';

const IS_DEV = self.location.hostname === 'localhost' ||
               self.location.hostname === '127.0.0.1';

const PRE_CACHE_ASSETS = IS_DEV
  ? ['/']
  : [
      './',
      './index.html',
      './manifest.json',
      './favicon.svg',
      './favicon.png',
      './assets/app.js',
    ];

// ─── Evento install ───────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE_ASSETS))
      .catch((err) => console.warn('[SW] Pre-cache inicial parcial:', err))
  );
});

// ─── Evento activate ──────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Purgando caché antiguo obsoleto:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ─── Evento fetch ─────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // 1. version.json siempre directo a la red (sin caché para detectar updates al instante)
  if (url.pathname.endsWith('version.json')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // 2. Para HTML (navegación) y scripts (app.js): Network-First con fallback a Caché offline
  const isHtmlOrCode = event.request.mode === 'navigate' ||
                       url.pathname.endsWith('.html') ||
                       url.pathname.endsWith('.js') ||
                       url.pathname === '/' ||
                       url.pathname.endsWith('/');

  if (isHtmlOrCode) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Si no hay conexión (offline), servir desde el caché
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html') || caches.match('./');
            }
            return new Response('', {
              status: 204,
              statusText: 'EduAventura: recurso no disponible offline',
              headers: { 'Content-Type': 'text/plain' },
            });
          });
        })
    );
    return;
  }

  // 3. Para assets estáticos: Cache-First con actualización silenciosa en segundo plano
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
