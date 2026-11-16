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

// Avisos push (los manda el Worker de Cloudflare; el contenido viaja cifrado: t=título, c=texto, u=link)
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (_) { }
  e.waitUntil(self.registration.showNotification(d.t || 'Růnica', { body: d.c || '', icon: 'icon-192.png', badge: 'badge-96.png', tag: d.e || 'runica', data: { u: d.u || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close(); const url = new URL((e.notification.data && e.notification.data.u) || './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => { for (const c of cs) if ('focus' in c) return c.focus(); return clients.openWindow(url); }));
});
