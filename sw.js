// Offline cache. Bump VERSION whenever any file changes so phones pick up the update.
const VERSION = 'v1';
const FILES = ['./', 'index.html', 'quran.json', 'tafsir.json', 'manifest.webmanifest',
  'fonts/amiri-400.woff2', 'fonts/plex-400.woff2', 'fonts/plex-600.woff2', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
