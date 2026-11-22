import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import serviceWorker from './src/integrations/sw'

// The site's address — changes once, at deploy.
export const SITE = 'https://pos.karots.lk'

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  // One small stylesheet per page: inline it so nothing blocks the first paint.
  build: { inlineStylesheets: 'always' },
  // Every image, Markdown ones too, gets a srcset and resizes to its container.
  image: { layout: 'constrained', responsiveStyles: true },
  integrations: [sitemap({ filter: (page) => !page.includes('404') && !page.includes('/offline/') }), serviceWorker()],
})
