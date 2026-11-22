import { describe, expect, it } from 'vitest'
import { pages } from './dist-lib'

// Words that must never reach a public page: the old product, the dropped languages,
// and anything internal to a shop's install or to support.
const FORBIDDEN = [
  'Karots POS', 'Tamil', 'Tanglish', 'support PIN', 'install ID', 'system user', '0000000001',
  'Konami', 'cheat', 'Pocket Cashier', 'DEMO_SHOP', 'make demo', 'make docs-shots', 'go run ',
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
