// feature-demos.js — small playable demos for a few flagship POS behaviours,
// dropped into the product section. Each is self-contained with its own reset,
// a husk of the real thing styled to the site. No dependencies.
const rs = (n) => "Rs " + Number(n).toLocaleString("en-US");

// ---- Batches: auto-FIFO, ask only when needed ---------------------------
// Sales run automatically oldest-first (FIFO). The till only asks the cashier to
// choose a batch when the lots disagree on price OR a lot is expired — otherwise
// there's no prompt at all. This demo shows the expired-lot case.
export function initLotsDemo(mount) {
  if (!mount) return;
  const START = [{ id: "A", qty: 5, days: -1 }, { id: "B", qty: 8, days: 12 }, { id: "C", qty: 3, days: 90 }];
  let lots, pending, msg;

  const label = (d) => d < 0 ? "expired" : `exp in ${d}d`;
  const cls = (d) => d < 0 ? "is-exp" : d <= 14 ? "is-soon" : "";
  const next = () => lots.filter((l) => l.qty > 0).sort((a, b) => a.days - b.days)[0];

  function fresh() { lots = START.map((l) => ({ ...l })); pending = null; msg = "Sales are automatic FIFO — the till only asks when batch prices differ or a lot is expired, like Batch A here. Add it to a sale."; }
  function sell() {
    const l = next();
    if (!l) { msg = "No stock left — reset to try again."; return; }
    if (l.days < 0) { pending = l.id; msg = `Batch ${l.id} is expired. The till won't sell it silently — write it off, or override to sell anyway.`; return; }
    l.qty--; msg = `Sold from Batch ${l.id} — good for ${l.days} more days.`;
  }
  function writeOff() { const l = lots.find((x) => x.id === pending); l.qty = 0; pending = null; msg = `Wrote off Batch ${l.id} as damaged — the next sale uses the following batch.`; }
  function anyway() { const l = lots.find((x) => x.id === pending); l.qty--; pending = null; msg = `Sold Batch ${l.id} anyway — the override is logged.`; }

  function render() {
    mount.innerHTML = `
      <div class="mini">
        <div class="mini-head"><span class="mini-title">🧺 Batches & expiry</span>
          <button class="mini-reset" data-act="reset" type="button" title="Reset" aria-label="Reset">⟲</button></div>
        <div class="lot-row">
          ${lots.map((l) => `<div class="lot ${l.qty === 0 ? "is-empty" : ""}">
            <span class="lot-id">Batch ${l.id}</span>
            <span class="lot-qty">${l.qty} left</span>
            <span class="lot-exp ${cls(l.days)}">${l.days < 0 ? "⚠ " : ""}${label(l.days)}</span>
          </div>`).join("")}
        </div>
        <p class="mini-msg">${msg}</p>
        ${pending
          ? `<div class="mini-actions"><button class="btn btn-secondary" data-act="writeoff" type="button">Write off damaged</button><button class="btn btn-secondary" data-act="anyway" type="button">Sell anyway</button></div>`
          : `<div class="mini-actions"><button class="btn btn-primary" data-act="sell" type="button">Add to sale</button></div>`}
      </div>`;
  }

  mount.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    ({ sell, writeoff: writeOff, anyway, reset: fresh })[b.dataset.act]?.();
    render();
  });
  fresh(); render();
}

// ---- Credit customer ----------------------------------------------------
// A credit customer runs a running balance (what they owe) against a limit.
// Enter an amount, then either sell more on credit (balance up — over the limit
// needs a manager override) or collect a payment (balance down). Mirrors the
// POS's "credit as a payment type" + Credit Collection.
export function initCreditDemo(mount) {
  if (!mount) return;
  const LIMIT = 5000;
  let balance, pending, msg;

  const amt = () => Number((mount.querySelector("#cAmt")?.value || "").replace(/\D/g, "")) || 0;
  function fresh() { balance = 1200; pending = null; msg = `Nimal owes ${rs(1200)}. Sell more on credit, or collect a payment.`; }
  function sell() {
    if (balance > LIMIT) { msg = `Already over the ${rs(LIMIT)} limit — collect a payment first.`; return; }
    const a = amt();
    if (a <= 0) { msg = "Enter an amount first."; return; }
    const next = balance + a;
    if (next > LIMIT) { pending = a; msg = `That takes Nimal to ${rs(next)}, over the ${rs(LIMIT)} limit. Approve with a manager override?`; return; }
    balance = next; msg = `Sold ${rs(a)} on credit — Nimal now owes ${rs(balance)}.`;
  }
  function collect() {
    const a = amt();
    if (a <= 0) { msg = "Enter an amount first."; return; }
    const pay = Math.min(a, balance);
    const change = a - pay;
    balance -= pay;
    if (change > 0) msg = `Collected ${rs(pay)} — account cleared. Give back ${rs(change)} change.`;
    else if (balance === 0) msg = `Collected ${rs(pay)} — account cleared. 🎉`;
    else msg = `Collected ${rs(pay)} — Nimal now owes ${rs(balance)}.`;
  }
  function ovr() { balance += pending; msg = `Override approved — sold ${rs(pending)} on credit. Nimal owes ${rs(balance)} (over limit).`; pending = null; }
  function cancel() { msg = `Cancelled — Nimal still owes ${rs(balance)}.`; pending = null; }

  function render() {
    const pct = Math.min(100, Math.round(balance / LIMIT * 100));
    const over = balance > LIMIT;
    mount.innerHTML = `
      <div class="mini">
        <div class="mini-head"><span class="mini-title">👤 Credit customer</span>
          <button class="mini-reset" data-act="reset" type="button" title="Reset" aria-label="Reset">⟲</button></div>
        <div class="cust"><span class="cust-name">Nimal Perera</span>
          <span class="cust-bal ${over ? "is-over" : ""}">owes ${rs(balance)} <small>/ ${rs(LIMIT)}</small></span></div>
        <div class="cust-bar"><span class="${over ? "is-over" : ""}" style="width:${pct}%"></span></div>
        ${over ? `<p class="cust-warn">⚠ Over the ${rs(LIMIT)} credit limit — collect a payment to bring it back.</p>` : ""}
        ${pending
          ? `<p class="mini-msg">${msg}</p>
             <div class="mini-actions"><button class="btn btn-primary" data-act="ovr" type="button">Manager override</button><button class="btn btn-secondary" data-act="cancel" type="button">Cancel</button></div>`
          : `<label class="cust-amt" for="cAmt"><span>Amount</span><input id="cAmt" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="0"></label>
             <p class="mini-msg">${msg}</p>
             <div class="mini-actions"><button class="btn btn-primary" data-act="sell" type="button" ${over ? "disabled" : ""}>Sell on credit</button><button class="btn btn-secondary" data-act="collect" type="button">Collect payment</button></div>`}
      </div>`;
  }

  mount.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    ({ sell, collect, ovr, cancel, reset: fresh })[b.dataset.act]?.();
    render();
  });
  fresh(); render();
}
