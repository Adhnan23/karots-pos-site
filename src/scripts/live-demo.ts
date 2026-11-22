// Is the live Demo Room answering? Load a picture only it serves: when the VPS is down, Cloudflare answers with an
// error page, which a cross-site fetch can't tell from success — but it isn't a picture, so the image fails.
import { DEMO_URL } from '../data/site'

export const PROBE_URL = `${DEMO_URL}__demo/ui/favicon.svg`

export function loadImage(url: string): Promise<boolean> {
  return new Promise((ok) => {
    const img = new Image()
    img.onload = () => ok(true)
    img.onerror = () => ok(false)
    img.src = `${url}?t=${Date.now()}` // never a cached answer
  })
}

/** True when the Demo Room answers within `ms`. */
export function probeDemo(load: (url: string) => Promise<boolean> = loadImage, ms = 5000): Promise<boolean> {
  return Promise.race([load(PROBE_URL).catch(() => false), new Promise<boolean>((ok) => setTimeout(() => ok(false), ms))])
}

let once: Promise<boolean> | undefined
/** One check per page, shared by every block and button on it. */
export const demoUp = () => (once ??= probeDemo())

/** Sets each [data-live-demo] block to up or down once the check answers. */
export function wireLiveDemo() {
  const blocks = document.querySelectorAll<HTMLElement>('[data-live-demo]')
  if (!blocks.length) return
  demoUp().then((up) => blocks.forEach((b) => (b.dataset.state = up ? 'up' : 'down')))
}
