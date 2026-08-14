/* Service Worker — catalogue Telegram — V8.0 */
const CACHE_PREFIX = 'catalogue-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v10.0-' + "1786713913027";
const APP_SHELL = ["./index.html", "./manifest.json", './assets/icons/icon-192.png', './assets/icons/icon-512.png'];
self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL).catch(() => {})).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;
  const isDocument = event.request.mode === 'navigate' || event.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname.endsWith('manifest.json');
  if(isDocument){
    event.respondWith(fetch(event.request).then(response => {
      if(response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone())).catch(() => {});
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if(response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone())).catch(() => {});
    return response;
  })));
});
