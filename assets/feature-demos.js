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

// ---- Split payment (multiple tenders) -----------------------------------
// One sale settled across cash / card / credit until it's covered.
export function initSplitDemo(mount) {
  if (!mount) return;
  const TOTAL = 2750;
  let paid;
  const sum = () => paid.reduce((s, p) => s + p.amount, 0);
  const amt = () => Number((mount.querySelector("#sAmt")?.value || "").replace(/\D/g, "")) || 0;
  function fresh() { paid = []; }
  function add(method) {
    const remaining = TOTAL - sum();
    if (remaining <= 0) return;
    let a = amt(); if (a <= 0) a = remaining; // blank = pay the rest
    paid.push({ method, amount: a });
  }
  function render() {
    const remaining = TOTAL - sum(), done = remaining <= 0, change = done ? sum() - TOTAL : 0;
    mount.innerHTML = `
      <div class="mini">
        <div class="mini-head"><span class="mini-title">💳 Split payment</span>
          <button class="mini-reset" data-act="reset" type="button" title="Reset" aria-label="Reset">⟲</button></div>
        <div class="pay-total"><span>Sale total</span><strong>${rs(TOTAL)}</strong></div>
        <ul class="pay-lines">${paid.map((p) => `<li><span>${p.method}</span><span>${rs(p.amount)}</span></li>`).join("")}</ul>
        <div class="pay-remain ${done ? "is-done" : ""}">${done ? (change > 0 ? `✓ Paid — change ${rs(change)}` : "✓ Paid in full") : `Remaining ${rs(remaining)}`}</div>
        ${done ? "" : `
          <label class="cust-amt" for="sAmt"><span>Amount (blank = rest)</span><input id="sAmt" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="${remaining}"></label>
          <div class="mini-actions pay-btns">
            <button class="btn btn-secondary" data-act="cash" type="button">Cash</button>
            <button class="btn btn-secondary" data-act="card" type="button">Card</button>
            <button class="btn btn-secondary" data-act="credit" type="button">Credit</button>
          </div>`}
      </div>`;
  }
  mount.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    ({ cash: () => add("Cash"), card: () => add("Card"), credit: () => add("Credit (on account)"), reset: fresh })[b.dataset.act]?.();
    render();
  });
  fresh(); render();
}

// ---- Live discount ------------------------------------------------------
// A percent or fixed discount on the bill; total and "You saved" update live.
export function initDiscountDemo(mount) {
  if (!mount) return;
  const SUB = 1000;
  let type = "percent", value = 10;
  const disc = () => Math.max(0, Math.min(SUB, Math.round(type === "percent" ? SUB * value / 100 : value)));
  mount.innerHTML = `
    <div class="mini">
      <div class="mini-head"><span class="mini-title">🏷️ Discount</span>
        <button class="mini-reset" data-act="reset" type="button" title="Reset" aria-label="Reset">⟲</button></div>
      <div class="disc-toggle">
        <button class="chip" data-t="percent" type="button">%</button>
        <button class="chip" data-t="fixed" type="button">Rs</button>
        <input id="dVal" class="disc-in" type="text" inputmode="numeric" pattern="[0-9]*">
      </div>
      <div class="r-rows">
        <div class="pay-total"><span>Subtotal</span><span>${rs(SUB)}</span></div>
        <div class="pay-total disc-line"><span id="dLabel"></span><span id="dDisc"></span></div>
        <div class="pay-total"><span><strong>Total</strong></span><strong id="dTotal"></strong></div>
      </div>
      <p class="disc-saved" id="dSaved"></p>
    </div>`;
  const val = mount.querySelector("#dVal");
  function paint() {
    const d = disc();
    mount.querySelector("#dLabel").textContent = "Discount" + (type === "percent" ? ` (${value}%)` : "");
    mount.querySelector("#dDisc").textContent = "-" + rs(d);
    mount.querySelector("#dTotal").textContent = rs(SUB - d);
    mount.querySelector("#dSaved").textContent = "★ You saved " + rs(d);
    mount.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-on", c.dataset.t === type));
  }
  function reset() { type = "percent"; value = 10; val.value = "10"; paint(); }
  val.addEventListener("input", () => { value = Number(val.value.replace(/\D/g, "")) || 0; paint(); });
  mount.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip"); if (chip) { type = chip.dataset.t; paint(); return; }
    if (e.target.closest('[data-act="reset"]')) reset();
  });
  reset();
}

// ---- Count the drawer (denomination float) ------------------------------
// Count notes/coins denomination by denomination; the float total tallies live.
export function initFloatDemo(mount) {
  if (!mount) return;
  const DENOMS = [5000, 1000, 500, 100, 50, 20, 10];
  let counts;
  function fresh() { counts = {}; DENOMS.forEach((d) => (counts[d] = 0)); }
  const total = () => DENOMS.reduce((s, d) => s + d * counts[d], 0);
  function render() {
    mount.innerHTML = `
      <div class="mini">
        <div class="mini-head"><span class="mini-title">💰 Count the drawer</span>
          <button class="mini-reset" data-act="reset" type="button" title="Reset" aria-label="Reset">⟲</button></div>
        <ul class="float-rows">
          ${DENOMS.map((d) => `<li>
            <span class="float-denom">${rs(d)}</span>
            <span class="float-step">
              <button class="till-step" data-d="${d}" data-s="-1" type="button" aria-label="one less ${d}">−</button>
              <span class="float-c">${counts[d]}</span>
              <button class="till-step" data-d="${d}" data-s="1" type="button" aria-label="one more ${d}">+</button>
            </span>
            <span class="float-sub">${rs(d * counts[d])}</span>
          </li>`).join("")}
        </ul>
        <div class="pay-total float-total"><span><strong>Float total</strong></span><strong>${rs(total())}</strong></div>
      </div>`;
  }
  mount.addEventListener("click", (e) => {
    const s = e.target.closest("[data-d]");
    if (s) { const d = +s.dataset.d; counts[d] = Math.max(0, counts[d] + +s.dataset.s); return render(); }
    if (e.target.closest('[data-act="reset"]')) { fresh(); render(); }
  });
  fresh(); render();
}

// ---- Return by receipt --------------------------------------------------
// Pull up a past receipt, pick an item, refund it or issue a warranty swap.
export function initReturnDemo(mount) {
  if (!mount) return;
  const ITEMS = [{ n: "Coffee", p: 350 }, { n: "Milk 1L", p: 220 }, { n: "Phone charger", p: 1800, w: true }];
  let sel, done, msg;
  function fresh() { sel = null; done = {}; msg = "Tap an item from the receipt, then refund it or issue a warranty swap."; }
  function refund() { if (sel === null) return; done[sel] = "refunded"; msg = `Refunded ${rs(ITEMS[sel].p)} to the customer.`; sel = null; }
  function replace() {
    if (sel === null) return;
    if (!ITEMS[sel].w) { msg = `${ITEMS[sel].n} has no warranty — refund it instead.`; return; }
    done[sel] = "replaced"; msg = `Warranty swap for ${ITEMS[sel].n} — ships as a warranty cost (Losses & Recovery).`; sel = null;
  }
  function render() {
    mount.innerHTML = `
      <div class="mini">
        <div class="mini-head"><span class="mini-title">↩️ Return by receipt</span>
          <button class="mini-reset" data-act="reset" type="button" title="Reset" aria-label="Reset">⟲</button></div>
        <div class="ret-no">Receipt S-3028 · 3 items</div>
        <ul class="ret-items">
          ${ITEMS.map((it, i) => `<li class="ret-item ${sel === i ? "is-sel" : ""} ${done[i] ? "is-done" : ""}" data-i="${i}">
            <span>${it.n}${it.w ? ` <span class="ret-w">warranty</span>` : ""}</span>
            <span>${done[i] ? `<em>${done[i]}</em>` : rs(it.p)}</span></li>`).join("")}
        </ul>
        <p class="mini-msg">${msg}</p>
        <div class="mini-actions">
          <button class="btn btn-secondary" data-act="refund" type="button" ${sel === null ? "disabled" : ""}>Refund</button>
          <button class="btn btn-secondary" data-act="replace" type="button" ${sel === null ? "disabled" : ""}>Warranty swap</button>
        </div>
      </div>`;
  }
  mount.addEventListener("click", (e) => {
    const row = e.target.closest("[data-i]");
    if (row) { const i = +row.dataset.i; if (!done[i]) { sel = sel === i ? null : i; render(); } return; }
    const b = e.target.closest("[data-act]"); if (!b) return;
    ({ refund, replace, reset: fresh })[b.dataset.act]?.();
    render();
  });
  fresh(); render();
}

// ---- Profit by category (mini report) -----------------------------------
// The four columns from the real report (net revenue, COGS, profit, margin),
// with Today / This month / This year presets that swap the data like the POS.
export function initProfitDemo(mount) {
  if (!mount) return;
  const DATA = {
    today: { label: "Today", cats: [
      { n: "Groceries", rev: 4200, cogs: 3300 }, { n: "Drinks", rev: 2100, cogs: 1150 },
      { n: "Household", rev: 1500, cogs: 1080 }, { n: "Snacks", rev: 1200, cogs: 760 },
      { n: "Personal care", rev: 1650, cogs: 1120 }] },
    month: { label: "This month", cats: [
      { n: "Groceries", rev: 52000, cogs: 40000 }, { n: "Drinks", rev: 24000, cogs: 12500 },
      { n: "Household", rev: 18500, cogs: 13800 }, { n: "Snacks", rev: 15000, cogs: 9600 },
      { n: "Personal care", rev: 21000, cogs: 14200 }] },
    year: { label: "This year", cats: [
      { n: "Groceries", rev: 610000, cogs: 470000 }, { n: "Drinks", rev: 285000, cogs: 150000 },
      { n: "Household", rev: 210000, cogs: 158000 }, { n: "Snacks", rev: 176000, cogs: 112000 },
      { n: "Personal care", rev: 248000, cogs: 168000 }] },
  };
  Object.values(DATA).forEach((d) => d.cats.forEach((c) => { c.profit = c.rev - c.cogs; c.margin = Math.round(c.profit / c.rev * 100); }));
  let period = "month", sel = 0;
  function render() {
    const d = DATA[period], cats = d.cats, max = Math.max(...cats.map((c) => c.profit)), c = cats[sel];
    mount.innerHTML = `
      <div class="mini">
        <div class="mini-head"><span class="mini-title">📊 Profit by category</span></div>
        <div class="label-chips prof-periods">${Object.entries(DATA).map(([k, v]) => `<button class="chip ${period === k ? "is-on" : ""}" data-per="${k}" type="button">${v.label}</button>`).join("")}</div>
        <ul class="prof-bars">
          ${cats.map((x, i) => `<li class="prof-bar ${i === sel ? "is-sel" : ""}" data-i="${i}">
            <span class="prof-name">${x.n}</span>
            <span class="prof-track"><span style="width:${Math.max(4, Math.round(x.profit / max * 100))}%"></span></span>
            <span class="prof-val">${rs(x.profit)}</span></li>`).join("")}
        </ul>
        <div class="prof-detail">
          <div class="pay-total"><span>Net revenue</span><span>${rs(c.rev)}</span></div>
          <div class="pay-total"><span>COGS</span><span>${rs(c.cogs)}</span></div>
          <div class="pay-total"><span>Profit</span><span>${rs(c.profit)}</span></div>
          <div class="pay-total"><span><strong>Margin</strong></span><strong>${c.margin}%</strong></div>
        </div>
        <p class="mini-msg">${c.n} · ${d.label}. Margin = profit ÷ net revenue.</p>
      </div>`;
  }
  mount.addEventListener("click", (e) => {
    const per = e.target.closest("[data-per]"); if (per) { period = per.dataset.per; sel = 0; return render(); }
    const b = e.target.closest("[data-i]"); if (b) { sel = +b.dataset.i; render(); }
  });
  render();
}

// ---- Barcode labels (custom label print) --------------------------------
// Mirrors the POS label form: pick a product, choose the top/bottom line from
// its fields, set a qty, and print a strip of CODE128 labels. The strip prints
// from the printer into a fixed-height slot (so the card never resizes) and
// tears off — same printer mechanics as the receipt.
export function initLabelDemo(mount) {
  if (!mount) return;
  const PRODUCTS = [
    { name: "Coffee 200g", price: 350, barcode: "4791234567890", category: "Groceries" },
    { name: "Milk 1L", price: 220, barcode: "4791234500011", category: "Drinks" },
    { name: "Dish Soap", price: 120, barcode: "4791234509902", category: "Household" },
  ];
  const OPTS = [["name", "Name"], ["price", "Price"], ["category", "Category"], ["barcode", "Barcode"]];
  const val = (k, p) => k === "price" ? rs(p.price) : k === "barcode" ? p.barcode : k === "category" ? p.category : p.name;
  let pi = 0, top = "name", bottom = "price", qty = 3, printed = false;

  const oneLabel = (p, i) => `<div class="plabel" style="--i:${i}"><div class="plabel-top">${val(top, p)}</div><svg class="bc" data-code="${p.barcode}"></svg><div class="label-code">${p.barcode}</div><div class="plabel-bot">${val(bottom, p)}</div></div>`;
  function drawBarcodes() {
    if (!window.JsBarcode) return;
    mount.querySelectorAll("svg.bc").forEach((el) => {
      try { window.JsBarcode(el, el.dataset.code, { format: "CODE128", displayValue: false, height: 30, width: 1.3, margin: 0 }); } catch (e) {}
    });
  }

  function render() {
    const p = PRODUCTS[pi];
    mount.innerHTML = `
      <div class="mini">
        <div class="mini-head"><span class="mini-title">🏷️ Barcode labels</span>
          <button class="mini-reset" data-act="reset" type="button" title="Reset" aria-label="Reset">⟲</button></div>
        <div class="label-pick"><span>Product</span><div class="label-chips">${PRODUCTS.map((x, i) => `<button class="chip ${pi === i ? "is-on" : ""}" data-p="${i}" type="button">${x.name}</button>`).join("")}</div></div>
        <div class="label-pick"><span>Top</span><div class="label-chips">${OPTS.map(([k, l]) => `<button class="chip ${top === k ? "is-on" : ""}" data-top="${k}" type="button">${l}</button>`).join("")}</div></div>
        <div class="label-pick"><span>Bottom</span><div class="label-chips">${OPTS.map(([k, l]) => `<button class="chip ${bottom === k ? "is-on" : ""}" data-bot="${k}" type="button">${l}</button>`).join("")}</div></div>
        <div class="label-pick"><span>Qty</span>
          <span class="float-step"><button class="till-step" data-q="-1" type="button" aria-label="fewer">−</button><span class="float-c">${qty}</span><button class="till-step" data-q="1" type="button" aria-label="more">+</button></span>
          <button class="btn btn-primary label-print" data-act="print" type="button">Print ${qty}</button></div>
        <div class="print-area">
          <div class="printer" aria-hidden="true">${printed ? `<button class="printer-tear" data-act="tear" type="button" title="Tear off" aria-label="Tear off strip">✂</button>` : ""}</div>
          <div class="label-strip ${printed ? "printed" : ""}">${printed ? Array.from({ length: qty }, (_, i) => oneLabel(p, i)).join("") : ""}</div>
        </div>
      </div>`;
    drawBarcodes();
  }
  function tear() {
    const strip = mount.querySelector(".label-strip");
    if (strip) strip.classList.add("torn");
    setTimeout(() => { printed = false; render(); }, 420);
  }
  mount.addEventListener("click", (e) => {
    const p = e.target.closest("[data-p]"); if (p) { pi = +p.dataset.p; return render(); }
    const t = e.target.closest("[data-top]"); if (t) { top = t.dataset.top; return render(); }
    const b = e.target.closest("[data-bot]"); if (b) { bottom = b.dataset.bot; return render(); }
    const q = e.target.closest("[data-q]"); if (q) { qty = Math.max(1, Math.min(6, qty + +q.dataset.q)); return render(); }
    const a = e.target.closest("[data-act]"); if (!a) return;
    if (a.dataset.act === "print") { printed = true; render(); }
    else if (a.dataset.act === "tear") { tear(); }
    else if (a.dataset.act === "reset") { pi = 0; top = "name"; bottom = "price"; qty = 3; printed = false; render(); }
  });
  render();
}
