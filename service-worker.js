const CACHE_NAME = 'pwa-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/PDFviewer/index.html',
  '/PDFviewer/Centaur.woff2',
  '/PDFviewer/manifest.json',
  '/PDFviewer/jquery.min.js',
  '/PDFviewer/icon.png',
  // Add other relevant assets (CSS, images, etc.) if needed
];

// Install: cache required files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache or fetch-and-cache
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Skip chrome-extension and other unsupported schemes
  if (!req.url.startsWith('http')) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, res.clone());
            return res;
          });
        })
        .catch((err) => {
          console.warn('Fetch failed:', err);
        });
    })
  );
});
