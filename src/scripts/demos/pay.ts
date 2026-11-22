// Paying — the Suite's TEND-1 (paid ≥ total or refused), TEND-2 (only cash gets change),
// TEND-6 (card never more than what's due).
export function settle(total: number, card: number, cash: number) {
  const c = Math.min(card, total)
  const due = total - c
  if (cash < due) return { ok: false, change: 0, card: c }
  return { ok: true, change: cash - due, card: c }
}

const rs = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 })
const TOTAL = 2725
const NOTES = [500, 1000, 2000, 5000]

export function mount(el: HTMLElement) {
  let card = 0
  let cash = 0
  const render = () => {
    const s = settle(TOTAL, card, cash)
    const msg = s.ok
      ? `Paid. ${s.card ? `${rs(s.card)} by card, ` : ''}change to give: <b>${rs(s.change)}</b>`
      : `Still to pay: <b>${rs(TOTAL - s.card - cash)}</b>`
    el.innerHTML = `
      <p class="demo-what">Total <b>${rs(TOTAL)}</b>, card ${rs(Math.min(card, TOTAL))}, cash ${rs(cash)}</p>
      <div class="demo-actions">${NOTES.map((n) => `<button type="button" data-cash="${n}">+ ${n.toLocaleString('en-US')} cash</button>`).join('')}
        <button type="button" data-card="2000">Card 2,000</button><button type="button" data-act="reset" class="ghost">Start again</button></div>
      <p class="demo-msg" aria-live="polite">${msg}</p>`
  }
  el.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button')
    if (!b) return
    if (b.dataset.cash) cash += Number(b.dataset.cash)
    if (b.dataset.card) card = Number(b.dataset.card)
    if (b.dataset.act === 'reset') card = cash = 0
    render()
  })
  render()
}
