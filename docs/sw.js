/**
 * @file sw.js — Service Worker de EduAventura G4
 *
 * SPEC Referencias:
 *   Parámetro 4  — Registro con scope '/', inicializado en el ciclo de vida de la página.
 *   Parámetro 5  — Estrategia Cache-First Incondicional en el evento fetch.
 *   Parámetro 6  — Pre-caching del 100 % de la app en el evento install.
 *   Parámetro 7  — Control de versiones con CACHE_NAME; limpieza de cachés obsoletos en activate.
 *   Parámetro 2  — Filosofía Offline-First: ningún error fatal ante ausencia de red.
 *   Parámetro 17 — Cero dependencia de servidor en producción.
 */

'use strict';

// ─── Parámetro 7: Nombre de caché semántico y versionado ─────────────────────
const CACHE_NAME = 'eduaventura-v1.0.0-g4';

/**
 * Parámetro 6 — Array de pre-cache para PRODUCCIÓN (/dist).
 *
 * Vite genera nombres con hash (ej. index-BxY3k.js) al compilar.
 * El pre-cache completo de los assets con hash se gestiona en la
 * fase de integración del plugin vite-plugin-pwa (fase futura).
 *
 * Por ahora el SW cachea el shell de la app y los assets estáticos
 * que SÍ tienen nombre fijo (imágenes, fuentes, sonidos en /public).
 *
 * NOTA: En modo desarrollo (npm run dev) el SW solo cachea '/'
 * para no interferir con el HMR de Vite.
 */
const IS_DEV = self.location.hostname === 'localhost' ||
               self.location.hostname === '127.0.0.1';

const PRE_CACHE_ASSETS = IS_DEV
  ? ['/']
  : [
      './',
      './index.html',
      './manifest.json',
      './sw.js',
      // Bundle principal (nombre fijo gracias al vite.config.js IIFE)
      './assets/app.js',
      './assets/index.css',
      // Assets estáticos con nombre fijo (añadir cuando existan)
      // './assets/fonts/Nunito-Bold.woff2',
      // './assets/fonts/Nunito-ExtraBold.woff2',
      // './assets/sounds/sfx_click.mp3',
      // './assets/sounds/bgm_loop.mp3',
    ];

// ─── Evento install — Parámetro 6 ────────────────────────────────────────────
/**
 * Pre-cachea el 100 % de los assets antes de marcar la instalación
 * como completada. `skipWaiting()` activa el SW de inmediato sin
 * esperar al cierre de pestañas anteriores.
 *
 * @param {ExtendableEvent} event
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRE_CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        // No colapsar la instalación ante assets aún no generados (fase de desarrollo)
        console.warn('[SW] install: algunos assets no pudieron cachearse:', err);
      })
  );
});

// ─── Evento activate — Parámetro 7 ───────────────────────────────────────────
/**
 * Elimina todos los cachés cuyo nombre difiere de CACHE_NAME.
 * Garantiza que versiones anteriores queden completamente borradas.
 *
 * @param {ExtendableEvent} event
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Eliminando caché obsoleto:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ─── Evento fetch — Parámetros 5 ─────────────────────────────────────────────
/**
 * Estrategia Cache-First Incondicional:
 *  1. Busca el recurso en el caché local → si existe, lo retorna.
 *  2. Si no existe, intenta un fetch() de red y guarda la respuesta en caché.
 *  3. Si la red también falla, retorna una respuesta nula silenciosa (sin colapsar la UI).
 *
 * Parámetro 5: "si un recurso no se encuentra en el caché local, devolverá
 * una respuesta nula silenciosa sin colapsar la UI".
 *
 * @param {FetchEvent} event
 */
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET (POST, etc. no son cacheables)
  if (event.request.method !== 'GET') return;

  // Ignorar peticiones a extensiones de Chrome o URLs no http(s)
  const url = new URL(event.request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ── CACHE HIT: retornar inmediatamente desde caché ──────────────────────
      if (cachedResponse) {
        return cachedResponse;
      }

      // ── CACHE MISS: intentar red y guardar en caché ─────────────────────────
      return fetch(event.request)
        .then((networkResponse) => {
          // Validar que la respuesta de red sea usable antes de cachear
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type === 'error'
          ) {
            return networkResponse;
          }

          // Clonar antes de usar (un Response solo puede consumirse una vez)
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // ── Parámetro 5: respuesta nula silenciosa ante fallo total de red ──
          // Devolver una Response vacía con estado 204 (No Content) evita
          // que el navegador muestre errores de red en la consola del usuario.
          return new Response('', {
            status: 204,
            statusText: 'EduAventura: recurso no disponible offline',
            headers: { 'Content-Type': 'text/plain' },
          });
        });
    })
  );
});
