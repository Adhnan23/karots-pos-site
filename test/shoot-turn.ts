// Tour on a phone held upright and sideways → test/shots/turn-*.png (build first).
import { chromium } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'
const stop = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stop()
const server = spawn('bunx', ['astro', 'preview', '--port', '4391'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) { if (await fetch('http://localhost:4391/').then(() => true, () => false)) break; await new Promise((r) => setTimeout(r, 250)) }
const browser = await chromium.launch()
try {
  for (const [w, h, n] of [[390, 844, 'upright'], [844, 390, 'sideways']] as const) {
    const p = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 })
    await p.goto('http://localhost:4391/tour/pharmacy/')
    await p.waitForTimeout(2500)
    if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) console.log('OVERFLOW', n)
    await p.screenshot({ path: `test/shots/turn-${n}.png` })
  }
} finally { await browser.close(); server.kill(); stop() }
