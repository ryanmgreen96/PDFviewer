const CACHE_NAME = "pdfviewer-cache-v1";
const urlsToCache = [
  "/PDFviewer/",
  "/PDFviewer/index.html",
  "/PDFviewer/manifest.json",
  "/PDFviewer/service-worker.js",
  "/PDFviewer/icon.png",         // Make sure this matches your icon name
  "/PDFviewer/jquery.js",  
  "/PDFviewer/Centaur.woff2"   // Include offline jQuery copy
  // Add other local files like:
  // "/PDFviewer/style.css",
  // "/PDFviewer/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
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
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // fallback if offline
          if (event.request.mode === "navigate") {
            return caches.match("/PDFviewer/index.html");
          }
        })
      );
    })
  );
});
