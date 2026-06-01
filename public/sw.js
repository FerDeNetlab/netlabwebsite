// Netlab Admin — Service Worker
// Estrategia: Network-first para API, Cache-first para assets estáticos

const CACHE_NAME = 'netlab-admin-v1'
const STATIC_ASSETS = [
  '/admin',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-icon.png',
]

// Install — pre-cache shell del admin
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Si algún asset falla (aún no existe), seguir igual
      })
    }).then(() => self.skipWaiting())
  )
})

// Activate — limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch — estrategia por tipo de request
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // No interceptar requests externos o no-HTTP
  if (!url.protocol.startsWith('http')) return
  if (url.origin !== self.location.origin) return

  // API calls — Network-first, sin caché
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Sin conexión' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )
    return
  }

  // Auth — siempre red
  if (url.pathname.startsWith('/api/auth')) {
    event.respondWith(fetch(request))
    return
  }

  // Assets estáticos (_next/static) — Cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // Páginas admin — Network-first con fallback a caché
  if (url.pathname.startsWith('/admin')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/admin')))
    )
    return
  }
})
