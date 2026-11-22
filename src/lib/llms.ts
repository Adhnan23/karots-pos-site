// llms.txt (llmstxt.org): what the site is, then every page with its one-line summary; llms-full.txt adds the text.
import { FEATURES } from '../data/features'
import { TOUR } from '../data/tour'
import { guides, plugins } from './content'

const ABOUT = `# Karots Suite

> The shop system for small Sri Lankan retail: till, stock and expiry, suppliers, money and reports in one
> program on the shop's own PC. It sells without the internet, survives power cuts, and every admin page and
> report works on a phone. Plugins add pharmacy, repairs, reloads and bills, print and copy, combos, clearance and more.

Made by Karots, Sri Lanka. Karots Suite Rs. 100,000 once (with the shop's plugins and the Karots Shelf app); Core
Rs. 80,000 (no plugins or Shelf); both with 3 months' warranty and free training. Service plan Rs. 5,000 a month or
Rs. 60,000 a year: new features, help any time, cloud backup. Products put in for Rs. 10 each. Call +94 76 962 6396.
`

const line = (site: URL, path: string, title: string, summary: string) => `- [${title}](${new URL(path, site).href}): ${summary}`

export async function llmsTxt(site: URL) {
  const g = await guides()
  const p = await plugins()
  return [
    ABOUT,
    '## Features',
    ...FEATURES.map((f) => line(site, `/features/${f.area}/`, f.title, f.summary)),
    '', '## Guides',
    ...g.map((x) => line(site, `/guides/${x.id}/`, x.data.title, x.data.summary)),
    '', '## Plugins',
    ...p.map((x) => line(site, `/plugins/${x.id}/`, x.data.title, x.data.summary)),
    '', '## Tour',
    ...Object.entries(TOUR).map(([k, t]) => line(site, `/tour/${k}/`, `${t.name} tour`, `a sale at ${t.shop} from scan to receipt, then the owner's screens`)),
    '', '## Optional',
    line(site, '/faq/', 'Questions', 'answers for shop owners'),
    line(site, '/pricing/', 'Pricing', 'Karots Suite Rs. 100,000, Core Rs. 80,000, service plan Rs. 5,000 a month'),
    line(site, '/contact/', 'Contact', 'phone, WhatsApp and email'),
    line(site, '/llms-full.txt', 'Full text', 'every guide and plugin page as plain Markdown'),
    '',
  ].join('\n')
}

/** Markdown without images, with site-relative links made absolute. */
const clean = (md: string, site: URL) =>
  md.replace(/^!\[[^\]]*\]\([^)]*\)\n?/gm, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\]\((\/[^)]*)\)/g, (_, p: string) => `](${new URL(p, site).href})`).replace(/\n{3,}/g, '\n\n')

export async function llmsFull(site: URL) {
  const pages = [...(await guides()), ...(await plugins())]
  return [ABOUT, ...pages.map((x) => `# ${x.data.title}\n\n${clean(x.body ?? '', site).trim()}\n`)].join('\n')
}
