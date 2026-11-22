// The service worker, written after the build (src/integrations/sw.ts): what a phone keeps for offline use.

/** Pages saved on the first visit: the home page, the offline page and the whole tour. */
const PAGES = /^\/(offline\/|tour\/([a-z]+\/)?)?index\.html$/
/** The look and the scripts: CSS, JS, Latin fonts, the manifest and icons. */
const SHELL = /^\/(_astro\/.+\.(css|js)|_astro\/.+latin(?!-ext)[^/]*\.woff2|manifest\.webmanifest|icons\/.+)$/

/**
 * Everything the phone saves when it first opens the site: the shell, the tour pages and every picture the tour
 * pages use. Guides and their pictures are saved as they're read.
 */
export function precacheList(distFiles: string[], pages: { path: string; html: string }[]): string[] {
  const out = new Set<string>()
  for (const f of distFiles) {
    if (PAGES.test(f)) out.add(f.replace(/index\.html$/, ''))
    else if (SHELL.test(f)) out.add(f)
  }
  for (const p of pages.filter((p) => p.path === '/' || p.path.startsWith('/tour/')))
    for (const [, url] of p.html.matchAll(/(?:src="|srcset="|,\s*)(\/_astro\/[^\s",]+)/g)) out.add(url)
  return [...out].filter((f) => f === '/' || distFiles.includes(f) || distFiles.includes(f + 'index.html')).sort()
}

/** The worker: precache on install, drop older caches on activate; pages network-first, everything else cache-first. */
export function swSource(precache: string[], version: string): string {
  return `// Generated at build — src/lib/sw.ts
const CACHE = 'ks-site-${version}'
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('ks-site-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()))
})
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone()
      caches.open(CACHE).then((c) => c.put(req, copy))
      return res
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('/offline/'))))
    return
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)) }
    return res
  })))
})
`
}
