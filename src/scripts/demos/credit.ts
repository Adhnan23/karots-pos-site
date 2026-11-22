// Credit — the Suite's CUST-8 (available = limit − balance) and TEND-13 (over the limit is refused
// unless an admin approves, and then the sale is flagged).
export function onAccount(limit: number, balance: number, sale: number, approved: boolean) {
  const available = limit - balance
  if (sale <= available) return { ok: true, available, flagged: false }
  return { ok: approved, available, flagged: approved }
}

const rs = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 })

export function mount(el: HTMLElement) {
  const limit = 10000
  let balance = 6000
  let msg = 'Mr. Perera has a credit limit of Rs. 10,000 and owes Rs. 6,000.'
  const render = () => {
    el.innerHTML = `
      <p class="demo-what">Owes <b>${rs(balance)}</b> of a <b>${rs(limit)}</b> limit. Can still take <b>${rs(Math.max(0, limit - balance))}</b></p>
      <div class="demo-actions"><button type="button" data-sale="3000">Sale of 3,000 on account</button>
        <button type="button" data-sale="5000" data-ok="1">Sale of 5,000, an admin approves</button>
        <button type="button" data-sale="5000">Sale of 5,000</button><button type="button" data-act="reset" class="ghost">Start again</button></div>
      <p class="demo-msg" aria-live="polite">${msg}</p>`
  }
  el.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button')
    if (!b) return
    if (b.dataset.act === 'reset') { balance = 6000; msg = 'Back to the start.' }
    if (b.dataset.sale) {
      const sale = Number(b.dataset.sale)
      const r = onAccount(limit, balance, sale, !!b.dataset.ok)
      if (r.ok) balance += sale
      msg = !r.ok ? `Refused: that would pass the limit. The cashier can't go over it; an admin can approve.`
        : r.flagged ? `Approved by an admin and put on account. The sale is flagged so you can see it later.`
        : `Put on account. Mr. Perera now owes ${rs(balance)}.`
    }
    render()
  })
  render()
}
