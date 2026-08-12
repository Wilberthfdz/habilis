// Habilis — service worker mínimo y seguro.
// Estrategia: red primero para navegación (el HTML nunca se queda viejo),
// caché primero para assets con hash de Vite (inmutables por nombre).
const CACHE = "habilis-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;

  // Navegación: red primero, caché como respaldo offline
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const copia = r.clone();
          caches.open(CACHE).then((c) => c.put("/", copia));
          return r;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // Assets hasheados de Vite: caché primero (son inmutables)
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(e.request).then(
        (hit) =>
          hit ||
          fetch(e.request).then((r) => {
            const copia = r.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copia));
            return r;
          })
      )
    );
  }
});
