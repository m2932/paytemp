const STATIC_DATA = [
    './index.html',
    './css/bootstrap.min.css',
    './css/bootstrap.min.css.map',
    './images/icon128.png',
    './images/icon144.png',
    './js/bootstrap.bundle.min.js',
    './js/bootstrap.bundle.min.js.map',
    './js/jquery-3.4.1.slim.min.js',
    './app.js'
  ];
  
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('cache_v2').then(function(cache) {
        return cache.addAll(STATIC_DATA);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
        })
    );
});
  