// bun test/a11y.ts — axe on every built page, light and dark: no serious or critical problems.
import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'
import { pages } from './dist-lib'
const stop = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stop()
const server = spawn('bunx', ['astro', 'preview', '--port', '4395'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) { if (await fetch('http://localhost:4395/').then(() => true, () => false)) break; await new Promise((r) => setTimeout(r, 250)) }
const browser = await chromium.launch()
let bad = 0
try {
  for (const mode of ['light', 'dark'] as const) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: mode, reducedMotion: 'reduce' })
    for (const p of pages()) {
      const page = await ctx.newPage()
      await page.goto(`http://localhost:4395${p.path.replace(/404\.html$/, '404.html')}`)
      const r = await new AxeBuilder({ page }).analyze()
      for (const v of r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')) {
        bad++
        console.log(`${mode} ${p.path}: ${v.id} — ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target}`)
      }
      await page.close()
    }
    await ctx.close()
  }
} finally { await browser.close(); server.kill(); stop() }
console.log(bad ? `${bad} problems` : 'A11Y OK')
process.exit(bad ? 1 : 0)
