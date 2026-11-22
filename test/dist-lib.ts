import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

export const DIST = join(import.meta.dirname, '..', 'dist')

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
}

/** Every file in dist/, as site paths ("/tour/index.html"). */
export const files = (): string[] => (existsSync(DIST) ? walk(DIST).map((f) => '/' + relative(DIST, f)) : [])

/** Every built page: its URL path ("/tour/") and its HTML. */
export function pages(): { path: string; html: string }[] {
  return files()
    .filter((f) => f.endsWith('.html'))
    .map((f) => ({ path: f.replace(/index\.html$/, ''), html: readFileSync(join(DIST, f), 'utf8') }))
}
