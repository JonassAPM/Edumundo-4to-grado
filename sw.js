// Para que el juego funcione sin internet y guarde los archivos en el navegador
'use strict';

// Nombre del paquete de archivos guardados
// IMPORTANTE: cuando cambies el código, sube este número y el de version.json
const CACHE_NAME = 'eduaventura-v15';

const IS_DEV = self.location.hostname === 'localhost' ||
               self.location.hostname === '127.0.0.1';

const FIREBASE_CDN = 'https://www.gstatic.com/firebasejs/12.19.0/';

const PRE_CACHE_ASSETS = IS_DEV
  ? ['./']
  : [
      './',
      './index.html',
      './manifest.json',
      './favicon.svg',
      './favicon.png',
      './css/style.css',
      './js/app.js',
      './js/controllers/app_controller.js',
      './js/models/firebase.js',
      './js/models/state.js',
      './js/models/storage.js',
      './js/models/data/didactic_guides.js',
      './js/models/data/store_items.js',
      './js/models/data/tasks_data.js',
      './js/views/audio.js',
      './js/views/keypad.js',
      './js/views/modals.js',
      './js/views/roulette.js',
      FIREBASE_CDN + 'firebase-app.js',
      FIREBASE_CDN + 'firebase-auth.js',
      FIREBASE_CDN + 'firebase-firestore.js',
    ];

// Guardar archivos principales al instalar
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE_ASSETS))
      .catch((err) => console.warn('[SW] Pre-cache inicial parcial:', err))
  );
});

// Borrar archivos viejos cuando hay una nueva versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Borrando versión vieja:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Cuando la app pide algún archivo o imagen
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // 1. Revisar siempre si hay actualización disponible
  if (url.pathname.endsWith('version.json')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // 2. Primero busca en internet; si no hay señal saca la copia guardada
  const isHtmlOrCode = event.request.mode === 'navigate' ||
                       url.pathname.endsWith('.html') ||
                       url.pathname.endsWith('.js') ||
                       url.pathname.endsWith('.css') ||
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
          // Si no hay señal, mostrar lo que está guardado
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

  // 3. Para imágenes y sonidos: cargar rápido desde la copia local
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
