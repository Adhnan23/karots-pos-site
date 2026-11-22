import type { ImageMetadata } from 'astro'

// Every synced screenshot, by its path under src/assets/shots ("till/sell-light.jpg").
const all = import.meta.glob<{ default: ImageMetadata }>('../assets/shots/**/*.{jpg,png}', { eager: true })

export function shot(key: string): ImageMetadata {
  const img = all[`../assets/shots/${key}`]
  if (!img) throw new Error(`no synced screenshot ${key} — run bun run sync`)
  return img.default
}
