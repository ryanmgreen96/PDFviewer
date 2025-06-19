const CACHE_NAME = 'pwa-cache-v1';
const FILES_TO_CACHE = [
  '/PDFviewer/',
  '/PDFviewer/index.html',
  '/PDFviewer/manifest.json',
  '/PDFviewer/service-worker.js',
  '/PDFviewer/jquery.min.js',
  '/PDFviewer/Centaur.woff2',
  '/PDFviewer/icon.png'
];

// Install: Cache all required files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Clear old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: Serve from cache, fetch-and-store if needed
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // You can add a fallback HTML or image if needed here
        });
    })
  );
});
