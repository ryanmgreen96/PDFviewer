const CACHE_NAME = 'organizer-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/PDFviewer/index.html',
  '/PDFviewer/manifest.json',
  '/PDFviewer/service-worker.js'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) =>
      response || fetch(evt.request)
    )
  );
});
