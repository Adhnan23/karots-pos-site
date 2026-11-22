/** The tour's cards: swipe (CSS scroll-snap), the arrow buttons or the keyboard; the counter follows. */
export function initDeck() {
  const deck = document.querySelector<HTMLElement>('[data-deck]')
  if (!deck) return
  const cards = [...deck.children] as HTMLElement[]
  const count = document.querySelector('[data-count]')
  const go = (step: number) => {
    const i = Math.round(deck.scrollLeft / deck.clientWidth)
    const to = Math.max(0, Math.min(cards.length - 1, i + step))
    deck.scrollTo({ left: to * deck.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  document.querySelector('[data-prev]')?.addEventListener('click', () => go(-1))
  document.querySelector('[data-next]')?.addEventListener('click', () => go(1))
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  })
  const seen = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting && count) count.textContent = `${cards.indexOf(e.target as HTMLElement) + 1} / ${cards.length}`
  }, { root: deck, threshold: 0.6 })
  cards.forEach((c) => seen.observe(c))
}
