// llms.txt (llmstxt.org): what the site is, then every page with its one-line summary; llms-full.txt adds the text.
import { FEATURES } from '../data/features'
import { TOUR } from '../data/tour'
import { guides, plugins } from './content'

const ABOUT = `# Karots Suite

> The shop system for small Sri Lankan retail: till, stock and expiry, suppliers, money and reports in one
> program on the shop's own PC. It sells without the internet, a power cut loses no finished sale, and every admin page and
> report works on a phone. Plugins add pharmacy, repairs, reloads and bills, print and copy, combos, clearance and more.

Made by Karots, Sri Lanka. Karots Suite Rs. 100,000 once (with the shop's plugins and the Karots Shelf app); Core
Rs. 80,000 (no plugins or Shelf); both with installation, training and the first 3 months of the service plan free.
Complete Shop (Karots Suite + PC, printers, scanner, drawer as chosen, set up): about Rs. 190,000 to 220,000 or more,
quoted per shop, with 6 months of the plan and 6 months' hardware warranty. Easy Pay (a combo, no interest): Karots Suite
for Rs. 50,000 + the plan for 2 years (Rs. 170,000), or Rs. 65,000 + 1 year (Rs. 125,000); then the licence is the shop's.
Genuine bugs are fixed free, always. Service plan Rs. 5,000 a month or Rs. 60,000 a year: support, major upgrades, small
changes, maintenance, cloud backup. One licence = the one PC that runs it. Main PC: 64-bit Windows 10 / 11 or Linux;
recommended Core i3 2nd gen, 4 GB, 20 GB free SSD, 1366 × 768; minimum Core 2 Duo, 2 GB, 5 GB free hard disk, 1024 × 768.
Products put in for Rs. 10 each. Call +94 76 962 6396.
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
