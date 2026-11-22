// Design-gate screenshots: bun test/shoot.ts /path/ [/other/] → test/shots/<name>-<w>-<mode>.png
// Serves dist/ itself (astro preview), so build first.
import { chromium } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'

const stopPreview = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stopPreview() // Astro keeps a preview server running in the background

const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/']
const PORT = 4399
const server = spawn('bunx', ['astro', 'preview', '--port', '4399'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) {
  if (await fetch(`http://localhost:${PORT}/`).then(() => true, () => false)) break
  await new Promise((r) => setTimeout(r, 250))
}
const browser = await chromium.launch()
try {
  for (const path of paths)
    for (const [w, h] of [[360, 780], [1366, 860]])
      for (const mode of ['light', 'dark'] as const) {
        const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: mode })
        await page.goto(`http://localhost:4399${path}`)
        await page.waitForTimeout(3000) // the receipt finishes printing
        const name = path.replace(/\//g, '_') || '_'
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
        if (overflow) console.log(`OVERFLOW ${path} at ${w}px`)
        await page.screenshot({ path: `test/shots/${name}-${w}-${mode}.png`, fullPage: true })
        await page.close()
      }
} finally {
  await browser.close()
  server.kill()
  stopPreview()
}
