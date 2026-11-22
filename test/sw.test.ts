import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { precacheList, swSource } from '../src/lib/sw'
import { DIST, files, pages } from './dist-lib'

describe('precacheList', () => {
  const html = (imgs: string) => `<html><img src="${imgs}" srcset="${imgs} 480w, /_astro/b.720.webp 720w"></html>`
  const list = precacheList(
    ['/index.html', '/offline/index.html', '/tour/index.html', '/tour/pharmacy/index.html', '/guides/stock/index.html',
      '/_astro/site.css', '/_astro/page.js', '/_astro/archivo-latin-wght.woff2', '/_astro/archivo-vietnamese.woff2',
      '/_astro/a.480.webp', '/_astro/b.720.webp', '/_astro/guide.webp', '/manifest.webmanifest', '/icons/icon-192.png'],
    [
      { path: '/tour/pharmacy/', html: html('/_astro/a.480.webp') },
      { path: '/guides/stock/', html: '<img src="/_astro/guide.webp">' },
    ],
  )
  it('takes the shell, the tour pages and every picture the tour shows', () => {
    expect(list).toEqual(expect.arrayContaining(['/', '/offline/', '/tour/', '/tour/pharmacy/', '/_astro/site.css', '/_astro/page.js',
      '/_astro/archivo-latin-wght.woff2', '/_astro/a.480.webp', '/_astro/b.720.webp', '/manifest.webmanifest', '/icons/icon-192.png']))
  })
  it('leaves guide pictures and non-Latin font subsets to be cached on visit', () => {
    expect(list).not.toContain('/_astro/guide.webp')
    expect(list).not.toContain('/guides/stock/')
    expect(list).not.toContain('/_astro/archivo-vietnamese.woff2')
  })
})

describe('swSource', () => {
  it('names its cache by version and deletes the other versions', () => {
    const a = swSource(['/'], 'aaa')
    const b = swSource(['/'], 'bbb')
    expect(a).toContain('ks-site-aaa')
    expect(b).toContain('ks-site-bbb')
    expect(a).toMatch(/caches\.delete/)
    expect(a).toContain('/offline/')
  })
})

describe('built service worker', () => {
  it('precaches all four tours and stays under 15 MB', () => {
    const sw = pages().length && files().includes('/sw.js')
    expect(sw).toBeTruthy()
    const src = readFileSync(join(DIST, 'sw.js'), 'utf8')
    const list = JSON.parse(src.match(/const PRECACHE = (\[.*?\]);/s)![1]) as string[]
    for (const k of ['pharmacy', 'grocery', 'phone', 'hardware']) expect(list, k).toContain(`/tour/${k}/`)
    const bytes = list.reduce((s, f) => s + statSync(join(DIST, f.endsWith('/') ? f + 'index.html' : f)).size, 0)
    expect(bytes).toBeLessThan(15 * 1024 * 1024)
  })
})
