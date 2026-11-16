// Růnica: abre al instante y sin internet con la última versión vista; se actualiza en segundo plano.
const C = 'runica-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    const red = fetch(r).then(x => { if (x.ok) c.put(r, x.clone()); return x; }).catch(() => hit);
    return hit || red;
  }));
});
