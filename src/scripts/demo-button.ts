import { DEMO_URL } from '../data/site'
import { demoUp } from './live-demo'

/** Where "See it" goes: a phone (touch or narrow) gets the tour; a PC the live Demo Room if it answers, else "book a demo". */
export function demoTarget(coarsePointer: boolean, width: number, demoIsUp: boolean): string {
  if (coarsePointer || width < 900) return '/tour/'
  return demoIsUp ? DEMO_URL : '/contact/#demo'
}

export async function wireDemoButtons() {
  const buttons = document.querySelectorAll<HTMLAnchorElement>('[data-demo]')
  const phone = matchMedia('(pointer: coarse)').matches || innerWidth < 900
  if (!buttons.length || phone) return // the tour, as the page already says
  const up = await demoUp()
  for (const a of buttons) {
    a.href = demoTarget(false, innerWidth, up)
    a.textContent = up ? (a.dataset.live ?? a.textContent) : (a.dataset.pc ?? a.textContent)
  }
}
