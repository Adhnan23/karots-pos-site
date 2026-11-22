/** Where "See it" goes: a phone (touch or narrow) gets the tour, a PC gets "book a demo". */
export function demoTarget(coarsePointer: boolean, width: number): '/tour/' | '/contact/#demo' {
  return coarsePointer || width < 900 ? '/tour/' : '/contact/#demo'
}

export function wireDemoButtons() {
  const to = demoTarget(matchMedia('(pointer: coarse)').matches, innerWidth)
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-demo]')) {
    a.href = to
    if (to !== '/tour/') a.textContent = a.dataset.pc ?? a.textContent
  }
}
