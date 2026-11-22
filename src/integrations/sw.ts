// After the build: write dist/sw.js with the precache list and a version that changes whenever any of it does.
import type { AstroIntegration } from 'astro'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'
import { precacheList, swSource } from '../lib/sw'

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))

export default function serviceWorker(): AstroIntegration {
  return {
    name: 'ks-service-worker',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir)
        const all = walk(root).map((f) => '/' + relative(root, f))
        const pages = all.filter((f) => f.endsWith('.html')).map((f) => ({ path: f.replace(/index\.html$/, ''), html: readFileSync(join(root, f), 'utf8') }))
        const list = precacheList(all, pages)
        const hash = createHash('sha256')
        for (const f of list) hash.update(f).update(readFileSync(join(root, f.endsWith('/') ? f + 'index.html' : f)))
        writeFileSync(join(root, 'sw.js'), swSource(list, hash.digest('hex').slice(0, 12)))
      },
    },
  }
}
