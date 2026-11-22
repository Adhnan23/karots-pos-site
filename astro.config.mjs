import { defineConfig } from 'astro/config'

// The site's address — changes once, at deploy.
export const SITE = 'https://pos.karots.lk'

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  // Every image, Markdown ones too, gets a srcset and resizes to its container.
  image: { layout: 'constrained', responsiveStyles: true },
})
