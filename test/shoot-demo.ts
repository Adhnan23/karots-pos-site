// Demo gate: plays the stock demos at 360px → test/shots/demo-*.png
import { chromium } from '@playwright/test'
import { execSync, spawn } from 'node:child_process'
const stop = () => { try { execSync('bunx astro preview stop', { stdio: 'ignore' }) } catch {} }
stop()
const server = spawn('bunx', ['astro', 'preview', '--port', '4397'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) { if (await fetch('http://localhost:4397/').then(() => true, () => false)) break; await new Promise((r) => setTimeout(r, 250)) }
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 780 }, colorScheme: 'dark' })
  await page.goto('http://localhost:4397/features/stock/')
  const lots = page.locator('[data-demo-kind="lots"]')
  for (let i = 0; i < 6; i++) await lots.getByRole('button', { name: 'Sell one' }).click()
  await lots.scrollIntoViewIfNeeded()
  await page.screenshot({ path: 'test/shots/demo-lots.png' })
  const pay = await browser.newPage({ viewport: { width: 360, height: 780 } })
  await pay.goto('http://localhost:4397/features/till/')
  const box = pay.locator('[data-demo-kind="pay"]')
  await box.getByRole('button', { name: 'Card 2,000' }).click()
  await box.getByRole('button', { name: '+ 1,000 cash' }).click()
  await box.scrollIntoViewIfNeeded()
  await pay.screenshot({ path: 'test/shots/demo-pay.png' })
  if (await pay.evaluate(() => document.documentElement.scrollWidth > innerWidth)) console.log('OVERFLOW till')
} finally { await browser.close(); server.kill(); stop() }
