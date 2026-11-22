// Batches and expiry — the Suite's STK-21: good lots first, earliest expiry first, no expiry last,
// and an expired lot only when nothing else is left (the sale never stops).
export type Lot = { id: string; qty: number; days: number | null } // days to expiry; null = none, < 0 = expired

export function sellOne(lots: Lot[]): { lots: Lot[]; lot: string | null; expired: boolean } {
  const live = lots.filter((l) => l.qty > 0)
  const good = live.filter((l) => l.days === null || l.days >= 0)
  const rank = (l: Lot) => (l.days === null ? Infinity : l.days)
  const pick = (good.length ? good : live).slice().sort((a, b) => rank(a) - rank(b))[0]
  if (!pick) return { lots, lot: null, expired: false }
  return { lots: lots.map((l) => (l === pick ? { ...l, qty: l.qty - 1 } : l)), lot: pick.id, expired: pick.days !== null && pick.days < 0 }
}

const START: Lot[] = [
  { id: 'A', qty: 2, days: -3 },
  { id: 'B', qty: 3, days: 12 },
  { id: 'C', qty: 2, days: 140 },
]
const label = (l: Lot) => (l.days === null ? 'no expiry' : l.days < 0 ? `expired ${-l.days} days ago` : `expires in ${l.days} days`)

export function mount(el: HTMLElement) {
  let lots = START
  let msg = 'Sell one and see which batch it comes from. The expired batch A stays on the shelf for you to give back.'
  const render = () => {
    el.innerHTML = `
      <ul class="demo-lots">${lots.map((l) => `<li class="${l.days !== null && l.days < 0 ? 'bad' : l.days !== null && l.days <= 30 ? 'soon' : ''}">
        <b>Batch ${l.id}</b><span>${label(l)}</span><span class="n">${l.qty} left</span></li>`).join('')}</ul>
      <p class="demo-msg" aria-live="polite">${msg}</p>
      <div class="demo-actions"><button type="button" data-act="sell">Sell one</button><button type="button" data-act="reset" class="ghost">Start again</button></div>`
  }
  el.addEventListener('click', (e) => {
    const act = (e.target as HTMLElement).closest('button')?.dataset.act
    if (act === 'reset') { lots = START; msg = 'Back to the start.' }
    if (act === 'sell') {
      const r = sellOne(lots)
      lots = r.lots
      msg = !r.lot ? 'Nothing left to sell.' : r.expired ? `Only the expired batch ${r.lot} was left, so the sale took it: the sale never stops.` : `Sold from batch ${r.lot}, the one that expires first.`
    }
    render()
  })
  render()
}
