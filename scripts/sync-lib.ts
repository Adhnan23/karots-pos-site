// Pure helpers for `bun run sync`: turn the Suite's guide Markdown into the site's content files.

export type Kind = 'guide' | 'plugin'

/** Owner-facing guides the site carries (docs/guide/<slug>.md). Technician / developer pages stay out. */
export const GUIDES = ['till', 'stock', 'purchasing', 'money', 'reports', 'people', 'printing', 'appearance', 'shelf']
/** Plugin pages that stay off the site until the user says (docs/guide/plugins/<slug>.md). */
export const EXCLUDED_PLUGINS = ['pocketcashier', 'README']
/** Named on no public page: sentences that mention them are dropped. */
export const UNMENTIONED = ['Pocket Cashier']

const LINK = /(!?)\[([^\]]*)\]\(([^)\s]+)\)/g

/** The site key ("guide:till", "plugin:repairs") a relative .md link from a `from` page points at. */
function keyOf(path: string, from: Kind): string {
  const file = path.replace(/\.md$/, '')
  if (from === 'guide') return file.startsWith('plugins/') ? `plugin:${file.slice(8)}` : `guide:${file}`
  return file.startsWith('../') ? `guide:${file.slice(3)}` : `plugin:${file}`
}

/** Rewrites image and page links for the site; `known` holds the keys of pages the site has. */
export function rewrite(md: string, from: Kind, known: Set<string>): { md: string; images: string[] } {
  const images: string[] = []
  const out = md.replace(LINK, (all, bang: string, text: string, target: string) => {
    if (/^[a-z]+:/i.test(target)) return all
    const img = target.match(/^(?:\.\.\/)+images\/(.+)$/)
    if (img) {
      images.push(img[1])
      return `${bang}[${text}](../../assets/shots/${img[1]})`
    }
    const [path, anchor] = target.split('#')
    if (!path.endsWith('.md')) return all
    const key = keyOf(path, from)
    if (!known.has(key)) return text
    const [kind, slug] = key.split(':')
    return `[${text}](/${kind}s/${slug}/${anchor ? '#' + anchor : ''})`
  })
  return { md: out, images }
}

const sentences = (s: string) => s.split(/(?<=[.!?])\s+/)
const keepSentences = (s: string, word: string) =>
  sentences(s.replace(/\s*\n\s*/g, ' ')).filter((x) => !x.includes(word)).join(' ').trim()

/** Drops the sentences (and list items left empty) that mention `word`; untouched blocks keep their wrapping. */
export function dropMentions(md: string, word: string): string {
  return md
    .split('\n\n')
    .map((block) => {
      if (!block.includes(word)) return block
      if (!/^\s*[-*] /.test(block)) return keepSentences(block, word)
      const items: string[][] = []
      for (const line of block.split('\n')) {
        if (/^\s*[-*] /.test(line) || !items.length) items.push([line])
        else items[items.length - 1].push(line)
      }
      return items
        .map((lines) => {
          const item = lines.join('\n')
          if (!item.includes(word)) return item
          const [, marker, text] = item.match(/^(\s*[-*] )([\s\S]*)$/)!
          const kept = keepSentences(text, word)
          return kept ? marker + kept : ''
        })
        .filter(Boolean)
        .join('\n')
    })
    .filter((b) => b !== '')
    .join('\n\n')
}

const plain = (s: string) =>
  s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(LINK, '$2').replace(/[*_`]/g, '').replace(/\s*\n\s*/g, ' ').trim()

/** A Suite guide page → the site's content file (frontmatter title + summary, no H1) and the images it uses. */
export function convert(source: string, from: Kind, known: Set<string>): { md: string; images: string[] } {
  let md = source
  for (const w of UNMENTIONED) md = dropMentions(md, w)
  const r = rewrite(md, from, known)
  const m = r.md.match(/^# (.+)\n+/)
  if (!m) throw new Error('a guide page must start with "# Title"')
  const body = r.md.slice(m[0].length)
  const summary = plain(body.split('\n\n')[0])
  const front = `---\ntitle: ${JSON.stringify(m[1].trim())}\nsummary: ${JSON.stringify(summary)}\n---\n\n`
  return { md: front + body, images: r.images }
}
