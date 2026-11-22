// Packs — the Suite's SALE-3: full packs ring at the pack price, the rest loose,
// and a pack never costs more than its units bought loose.
export function packPrice(qty: number, per: number, pack: number, unit: number) {
  const packs = Math.floor(qty / per)
  const loose = qty % per
  return { packs, loose, total: packs * Math.min(pack, per * unit) + loose * unit }
}

const rs = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 })

export function mount(el: HTMLElement) {
  let qty = 23
  const render = () => {
    const p = packPrice(qty, 10, 280, 30)
    el.innerHTML = `
      <p class="demo-what">Paracetamol 500mg: a card of 10 is ${rs(280)}, one tablet ${rs(30)}.</p>
      <div class="demo-qty"><button type="button" data-d="-1" aria-label="One tablet less">−</button><output aria-live="polite">${qty} tablets</output><button type="button" data-d="1" aria-label="One tablet more">+</button></div>
      <p class="demo-msg">${p.packs} card${p.packs === 1 ? '' : 's'} + ${p.loose} loose = <b>${rs(p.total)}</b></p>`
  }
  el.addEventListener('click', (e) => {
    const d = Number((e.target as HTMLElement).closest('button')?.dataset.d ?? 0)
    qty = Math.max(1, Math.min(60, qty + d))
    render()
  })
  render()
}
