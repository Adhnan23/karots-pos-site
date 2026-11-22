// bun test/live-demo.ts — on a PC the site offers the live Demo Room only when it answers (build first).
import { chromium, type Page } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'
const stop = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stop()
const server = spawn('bunx', ['astro', 'preview', '--port', '4392'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) { if (await fetch('http://localhost:4392/').then(() => true, () => false)) break; await new Promise((r) => setTimeout(r, 250)) }
const browser = await chromium.launch()
const fail = (m: string) => { throw new Error(m) }
async function check(down: boolean) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 860 } })
  if (down) await ctx.route('**/__demo/ui/favicon.svg*', (r) => r.abort())
  const page: Page = await ctx.newPage()
  await page.goto('http://localhost:4392/contact/')
  await page.waitForFunction(() => document.querySelector<HTMLElement>('[data-live-demo]')?.dataset.state !== 'checking', null, { timeout: 8000 })
  const state = await page.locator('[data-live-demo]').getAttribute('data-state')
  await page.locator('[data-live-demo]').scrollIntoViewIfNeeded()
  await page.screenshot({ path: `test/shots/live-${down ? 'down' : 'up'}.png` })
  await page.goto('http://localhost:4392/')
  await page.waitForTimeout(down ? 1500 : 3000)
  const btn = page.locator('#demo-button')
  const [text, href] = [await btn.textContent(), await btn.getAttribute('href')]
  console.log(down ? 'DOWN' : 'UP', state, '|', text?.trim(), href)
  if (state !== (down ? 'down' : 'up')) fail(`block state ${state}`)
  if (down ? href !== '/contact/#demo' : href !== 'https://demo.karots.lk/') fail(`hero href ${href}`)
  await ctx.close()
}
try { await check(false); await check(true) } finally { await browser.close(); server.kill(); stop() }
