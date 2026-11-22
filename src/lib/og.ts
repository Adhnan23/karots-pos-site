// Share images (WhatsApp, Facebook, X): one per screenshot a page names, drawn at build time.
import { FEATURES } from '../data/features'
import { TOUR } from '../data/tour'

export const DEFAULT_OG = 'till/sell-light.jpg'

/** Every screenshot a page may use as its share image. */
export const OG_SHOTS = [
  DEFAULT_OG,
  'appearance/appearance.jpg',
  ...FEATURES.map((f) => f.shot),
  ...['recharge', 'repairs', 'alternatives', 'clearance', 'productplus', 'requests', 'aicatalog', 'combos', 'documents', 'pharmacy'].map((p) => `plugins/${p}.jpg`),
  ...Object.keys(TOUR).map((k) => `tour/${k}/03-sale-cart.jpg`),
].filter((s, i, all) => all.indexOf(s) === i)

/** The share image's address for a screenshot ("till/sell-light.jpg" → "/og/till-sell-light.jpg"). */
export const ogPath = (shot: string) => `/og/${shot.replace(/\.(jpg|png)$/, '').replace(/\//g, '-')}.jpg`

/** A guide's share screenshot: its feature's, else the default. */
export const guideShot = (slug: string) =>
  slug === 'appearance' ? 'appearance/appearance.jpg' : (FEATURES.find((f) => f.guide === slug)?.shot ?? DEFAULT_OG)
