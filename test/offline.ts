// bun test/offline.ts — a phone opens the home page once, loses its connection, and still shows the tour.
import { chromium } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'
const stop = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stop()
const server = spawn('bunx', ['astro', 'preview', '--port', '4396'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) { if (await fetch('http://localhost:4396/').then(() => true, () => false)) break; await new Promise((r) => setTimeout(r, 250)) }
const browser = await chromium.launch()
const fail = (m: string) => { throw new Error(m) }
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4396/')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.waitForFunction(async () => (await caches.keys()).length > 0 && (await (await caches.open((await caches.keys())[0])).keys()).length > 150, null, { timeout: 30_000 })
  await ctx.setOffline(true)
  await page.goto('http://localhost:4396/tour/hardware/')
  if ((await page.locator('h1').textContent())?.trim() !== 'Hardware') fail('tour page not offline')
  const shown = await page.locator('[data-frame].on').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)
  if (!shown) fail('tour frame not offline')
  await page.goto('http://localhost:4396/guides/money/')
  if (!(await page.locator('h1').textContent())?.includes('No connection')) fail('unvisited page did not show the offline page')
  console.log('OFFLINE OK: tour opens, an unsaved page shows the offline page')
} finally { await browser.close(); server.kill(); stop() }
