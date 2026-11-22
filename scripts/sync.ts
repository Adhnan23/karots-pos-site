// bun run sync [suitePath] — copies the Suite's owner guides, plugin pages and the screenshots they use into
// src/content/ and src/assets/shots/. The outputs are committed, so a build never needs the Suite repo.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { convert, EXCLUDED_PLUGINS, GUIDES, type Kind } from './sync-lib'

const suite = process.argv[2] ?? join(import.meta.dirname, '..', '..', 'go', 'karots-suite')
const guideDir = join(suite, 'docs', 'guide')
if (!existsSync(guideDir)) throw new Error(`no Suite guides at ${guideDir} — pass the Suite repo's path`)

const site = join(import.meta.dirname, '..')
const plugins = readdirSync(join(guideDir, 'plugins'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.slice(0, -3))
  .filter((p) => !EXCLUDED_PLUGINS.includes(p))
const known = new Set([...GUIDES.map((g) => `guide:${g}`), ...plugins.map((p) => `plugin:${p}`)])

for (const d of ['src/content/guides', 'src/content/plugins', 'src/assets/shots'])
  rmSync(join(site, d), { recursive: true, force: true })

const images = new Set<string>()
function write(kind: Kind, slug: string, source: string) {
  const out = convert(readFileSync(source, 'utf8'), kind, known)
  out.images.forEach((i) => images.add(i))
  const dest = join(site, 'src', 'content', `${kind}s`, `${slug}.md`)
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, out.md)
}
GUIDES.forEach((g) => write('guide', g, join(guideDir, `${g}.md`)))
plugins.forEach((p) => write('plugin', p, join(guideDir, 'plugins', `${p}.md`)))

for (const img of images) {
  const dest = join(site, 'src', 'assets', 'shots', img)
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(join(suite, 'docs', 'images', img), dest)
}
console.log(`synced ${GUIDES.length} guides, ${plugins.length} plugins, ${images.size} images`)
