import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DIST, files, pages } from './dist-lib'

// Words that must never reach a public page: the old product, the dropped languages,
// and anything internal to a shop's install or to support.
const FORBIDDEN = [
  'Karots POS', 'Tanglish', 'support PIN', 'install ID', 'system user', '0000000001',
  'Konami', 'cheat', 'Pocket Cashier', 'Tailscale', 'Shop Builder', '/admin/', 'Setup → Update', 'DEMO_SHOP', 'make demo', 'make docs-shots', 'go run ',
]

describe('built site', () => {
  it('has pages', () => expect(pages().length).toBeGreaterThan(0))

  it('has no forbidden words', () => {
    for (const p of pages()) {
      const text = p.html.toLowerCase()
      for (const w of FORBIDDEN) expect(text.includes(w.toLowerCase()), `"${w}" on ${p.path}`).toBe(false)
    }
  })

  it('every page has one h1, a title and a description', () => {
    for (const p of pages()) {
      expect(p.html.match(/<h1[\s>]/g)?.length, `h1 count on ${p.path}`).toBe(1)
      expect(p.html, `title on ${p.path}`).toMatch(/<title>[^<]+<\/title>/)
      expect(p.html, `description on ${p.path}`).toMatch(/<meta name="description" content="[^"]+"/)
    }
  })
})

// Pages later tasks build (Task 6 tour, Task 7 the rest). Empty once they exist.
const PENDING: string[] = []

describe('links and content pages', () => {
  it('every internal link resolves', () => {
    const have = new Set(files())
    for (const p of pages())
      for (const [, href] of p.html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
        if (PENDING.some((p) => href.startsWith(p))) continue
        const ok = href.endsWith('/') ? have.has(href + 'index.html') : have.has(href)
        expect(ok, `${href} on ${p.path}`).toBe(true)
      }
  })

  it('no image points outside the site', () => {
    for (const p of pages()) expect(p.html, p.path).not.toMatch(/src="\.\.?\//)
  })

  it('every guide and plugin is a page', () => {
    const paths = new Set(pages().map((p) => p.path))
    for (const g of ['till', 'stock', 'purchasing', 'money', 'reports', 'people', 'printing', 'appearance', 'shelf'])
      expect(paths.has(`/guides/${g}/`), g).toBe(true)
    const plugins = [...paths].filter((p) => /^\/plugins\/[^/]+\/$/.test(p))
    expect(plugins.length).toBe(10)
    expect(paths.has('/guides/')).toBe(true)
    expect(paths.has('/plugins/')).toBe(true)
  })
})

describe('sales pages', () => {
  const page = (path: string) => pages().find((p) => p.path === path)
  it('has home, features per area, pricing, contact, FAQ and a 404', () => {
    for (const p of ['/', '/features/', '/features/till/', '/features/stock/', '/features/purchasing/', '/features/money/',
      '/features/reports/', '/pricing/', '/contact/', '/faq/'])
      expect(page(p), p).toBeDefined()
    expect(pages().some((p) => p.path === '/404.html'), '404').toBe(true)
  })

  it('shows no price until the user sends the list', () => {
    expect(page('/pricing/')!.html).not.toMatch(/Rs\.? ?\d|LKR/)
    for (const p of pages()) expect(p.html, p.path).not.toContain('LKR')
  })

  it('the demo button opens the tour without JavaScript', () => {
    expect(page('/')!.html).toMatch(/id="demo-button"[^>]*href="\/tour\/"|href="\/tour\/"[^>]*id="demo-button"/)
  })
})

describe('tour', () => {
  it('four tour pages, each with the sale flipbook first', () => {
    for (const k of ['pharmacy', 'grocery', 'phone', 'hardware']) {
      const p = pages().find((x) => x.path === `/tour/${k}/`)
      expect(p, k).toBeDefined()
      const flip = p!.html.indexOf('data-flipbook')
      const card = p!.html.indexOf('data-card="screen"')
      expect(flip, `${k} flipbook`).toBeGreaterThan(-1)
      expect(card, `${k} screens`).toBeGreaterThan(flip)
    }
  })
})

describe('SEO', () => {
  const site = 'https://pos.karots.lk'
  // The 404 and the offline page are noindex: no canonical, not in the sitemap.
  const real = () => pages().filter((p) => p.path !== '/404.html' && p.path !== '/offline/')
  const meta = (html: string, prop: string) => html.match(new RegExp(`<meta (?:property|name)="${prop}" content="([^"]*)"`))?.[1]
  const ld = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap((m) => [JSON.parse(m[1])].flat())

  it('every page has its canonical address', () => {
    for (const p of real()) expect(p.html, p.path).toContain(`<link rel="canonical" href="${site}${p.path}">`)
  })

  it('every page has a share card whose image exists', () => {
    const have = new Set(files())
    for (const p of real()) {
      expect(meta(p.html, 'og:title'), p.path).toBeTruthy()
      expect(meta(p.html, 'og:description'), p.path).toBeTruthy()
      const img = meta(p.html, 'og:image') ?? ''
      expect(img.startsWith(site + '/'), `${p.path} og:image ${img}`).toBe(true)
      expect(have.has(img.slice(site.length)), `${p.path} og:image file ${img}`).toBe(true)
      expect(meta(p.html, 'twitter:card'), p.path).toBe('summary_large_image')
    }
  })

  it('structured data: the home page names the business and the software, the FAQ its questions, guides their trail', () => {
    const types = (path: string) => ld(pages().find((p) => p.path === path)!.html).map((x) => x['@type'])
    expect(types('/')).toEqual(expect.arrayContaining(['Organization', 'SoftwareApplication']))
    expect(types('/faq/')).toContain('FAQPage')
    expect(types('/guides/stock/')).toContain('BreadcrumbList')
    expect(types('/plugins/pharmacy/')).toContain('BreadcrumbList')
  })

  it('the sitemap lists every page but the 404', () => {
    const sm = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8')
    for (const p of real()) expect(sm, p.path).toContain(`<loc>${site}${p.path}</loc>`)
    expect(sm).not.toContain('404')
    expect(readFileSync(join(DIST, 'robots.txt'), 'utf8')).toContain(`Sitemap: ${site}/sitemap-index.xml`)
  })

  it('llms.txt lists every guide and plugin; llms-full.txt carries their text', () => {
    const llms = readFileSync(join(DIST, 'llms.txt'), 'utf8')
    const full = readFileSync(join(DIST, 'llms-full.txt'), 'utf8')
    for (const p of real().filter((x) => /^\/(guides|plugins)\/[^/]+\/$/.test(x.path))) expect(llms, p.path).toContain(`${site}${p.path}`)
    expect(llms.startsWith('# Karots Suite')).toBe(true)
    expect(full).toContain('## Products')
    expect(full).not.toMatch(/!\[|\.\.\/assets/)
  })
})
