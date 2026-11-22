// Tour gate: bun test/shoot-tour.ts <kind> → test/shots/tour-<kind>-<w>-<mode>-<card>.png (first 3 cards)
import { chromium } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'

const stopPreview = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stopPreview() // Astro keeps a preview server running in the background

const kind = process.argv[2] ?? 'pharmacy'
const PORT = 4398
const server = spawn('bunx', ['astro', 'preview', '--port', '4398'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) {
  if (await fetch(`http://localhost:${PORT}/`).then(() => true, () => false)) break
  await new Promise((r) => setTimeout(r, 250))
}
const browser = await chromium.launch()
try {
  for (const [w, h] of [[360, 780], [1366, 860]])
    for (const mode of ['light', 'dark'] as const) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: mode, hasTouch: w < 900 })
      await page.goto(`http://localhost:4398/tour/${kind}/`)
      await page.waitForTimeout(3500)
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) console.log(`OVERFLOW ${w}`)
      for (let c = 1; c <= 3; c++) {
        await page.screenshot({ path: `test/shots/tour-${kind}-${w}-${mode}-${c}.png` })
        await page.click('[data-next]')
        await page.waitForTimeout(900)
      }
      await page.close()
    }
} finally {
  await browser.close()
  server.kill()
  stopPreview()
}
