/** The frame after `i` of `n`, looping back to the first. */
export function nextFrame(i: number, n: number): number {
  return (i + 1) % n
}

/** Plays every [data-flipbook]: frames advance every data-ms; a tap pauses or plays; reduced motion starts paused. */
export function initFlipbooks() {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  for (const book of document.querySelectorAll<HTMLElement>('[data-flipbook]')) {
    const frames = [...book.querySelectorAll<HTMLElement>('[data-frame]')]
    const caps = [...book.querySelectorAll<HTMLElement>('[data-cap]')]
    const dots = [...book.querySelectorAll<HTMLButtonElement>('[data-dot]')]
    const toggle = book.querySelector<HTMLButtonElement>('[data-toggle]')!
    let i = 0
    let timer = 0
    const show = (n: number) => {
      i = n
      frames.forEach((f, k) => f.classList.toggle('on', k === i))
      caps.forEach((c, k) => (c.hidden = k !== i))
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)))
    }
    const play = (on: boolean) => {
      clearInterval(timer)
      if (on) timer = window.setInterval(() => show(nextFrame(i, frames.length)), Number(book.dataset.ms) || 1600)
      toggle.dataset.playing = String(on)
      toggle.setAttribute('aria-label', on ? 'Pause the sale' : 'Play the sale')
    }
    dots.forEach((d, k) => d.addEventListener('click', () => { play(false); show(k) }))
    toggle.addEventListener('click', () => play(toggle.dataset.playing !== 'true'))
    book.querySelector('[data-stage]')?.addEventListener('click', () => play(toggle.dataset.playing !== 'true'))
    show(0)
    play(!still)
  }
}
