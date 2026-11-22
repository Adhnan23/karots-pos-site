import { describe, expect, it } from 'vitest'
import { files, pages } from './dist-lib'

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
const PENDING = ['/tour/']

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
