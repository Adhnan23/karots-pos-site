// sw.js — a small offline cache for the static site so the demos keep working
// with no connection. Cache-first for same-origin GETs; navigations fall back
// to the cached index. Bump CACHE to ship new assets.
const CACHE = "kpos-site-v1";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./theme.css", "./app.js",
  "./assets/icons.js", "./assets/art.js", "./assets/pos-demo.js", "./assets/feature-demos.js",
  "./data/features.json", "./data/plugins.json", "./data/companion.json",
  "./data/pricing.json", "./data/config.json", "./data/themes.json",
  "./favicon.svg", "./og.png", "./icons/icon-192.png", "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return; // let cross-origin (fonts, JsBarcode) hit the network
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => (req.mode === "navigate" ? caches.match("./index.html") : Response.error()))
    )
  );
});
