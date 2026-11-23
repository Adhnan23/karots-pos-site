import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import serviceWorker from './src/integrations/sw'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

// The site's address — changes once, at deploy.
export const SITE = 'https://suite.karots.lk'

// A page's source file, for its last-changed date in the sitemap.
const source = (path) => {
  const m = path.match(/^\/(guides|plugins)\/([^/]+)\/$/)
  if (m) return `src/content/${m[1]}/${m[2]}.md`
  if (/^\/tour\/[^/]+\/$/.test(path)) return 'src/data/tour.ts'
  if (/^\/features\/[^/]+\/$/.test(path)) return 'src/data/features.ts'
  const page = path === '/' ? 'src/pages/index.astro' : `src/pages${path}index.astro`
  return existsSync(page) ? page : `src/pages${path.slice(0, -1)}.astro`
}
// The date of the last commit that touched it (none yet: left out).
const lastmod = (path) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', source(path)], { encoding: 'utf8' }).trim() || undefined
  } catch {
    return undefined
  }
}

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  // One small stylesheet per page: inline it so nothing blocks the first paint.
  build: { inlineStylesheets: 'always' },
  // Every image, Markdown ones too, gets a srcset and resizes to its container.
  image: { layout: 'constrained', responsiveStyles: true },
  integrations: [sitemap({
      filter: (page) => !page.includes('404') && !page.includes('/offline/'),
      xslURL: '/sitemap.xsl',
      serialize: (item) => ({ ...item, lastmod: lastmod(new URL(item.url).pathname) }),
    }), serviceWorker()],
})
