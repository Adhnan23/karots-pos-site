// bun test/overflow.ts — every built page at 360px: nothing wider than the screen (build first).
import { chromium } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'
import { pages } from './dist-lib'
const stop = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stop()
const server = spawn('bunx', ['astro', 'preview', '--port', '4393'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) { if (await fetch('http://localhost:4393/').then(() => true, () => false)) break; await new Promise((r) => setTimeout(r, 250)) }
const browser = await chromium.launch()
let bad = 0
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 780 } })
  for (const p of pages()) {
    await page.goto(`http://localhost:4393${p.path}`)
    const wide = await page.evaluate(() => {
      if (document.documentElement.scrollWidth <= innerWidth) return []
      return [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > innerWidth + 1 && !el.closest('[data-deck], table'))
        .slice(0, 3).map((el) => el.tagName + '.' + el.className)
    })
    if (wide.length) { bad++; console.log(`${p.path}: ${wide.join(', ')}`) }
  }
} finally { await browser.close(); server.kill(); stop() }
console.log(bad ? `${bad} pages overflow` : 'NO OVERFLOW at 360px')
process.exit(bad ? 1 : 0)
