import { getCollection } from 'astro:content'
import { GUIDES } from '../../scripts/sync-lib'

/** Guides in the order owners meet them (the sync's list). */
export async function guides() {
  const all = await getCollection('guides')
  return GUIDES.map((slug) => all.find((g) => g.id === slug)!).filter(Boolean)
}

/** Plugins by name. */
export async function plugins() {
  return (await getCollection('plugins')).sort((a, b) => a.data.title.localeCompare(b.data.title))
}
