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

const CACHE_NAME = 'cache_v2.1';
  
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(STATIC_DATA);
        })
    );
});

self.addEventListener('activate', function(e) {
    const cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // ホワイトリストにないキャッシュ(古いキャッシュ)は削除する
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
        })
    );
});
  