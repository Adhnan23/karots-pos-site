// pos-demo.js — a tiny playable point of sale in the hero. Tap items to build a
// cart, enter cash, and a receipt prints out. No dependencies: plain DOM + CSS
// (a CSS transition does the "printing" slide — no three.js needed).
const ITEMS = [
  { id: "coffee", name: "Coffee",   emoji: "☕", price: 350 },
  { id: "bread",  name: "Bread",    emoji: "🍞", price: 180 },
  { id: "milk",   name: "Milk 1L",  emoji: "🥛", price: 220 },
  { id: "eggs",   name: "Eggs ×6",  emoji: "🥚", price: 240 },
  { id: "rice",   name: "Rice 1kg", emoji: "🍚", price: 320 },
  { id: "soap",   name: "Soap",     emoji: "🧼", price: 120 },
];
const rs = (n) => "Rs " + Number(n).toLocaleString("en-US");
const item = (id) => ITEMS.find((x) => x.id === id);

// Break an amount into Sri-Lankan notes/coins, largest first (like the till's
// float breakdown). Greedy is exact for these denominations.
const DENOMS = [5000, 1000, 500, 100, 50, 20, 10, 5, 2, 1];
function denominate(amount) {
  const out = [];
  let r = Math.round(amount);
  for (const d of DENOMS) { const c = Math.floor(r / d); if (c) { out.push({ d, c }); r -= d * c; } }
  return out;
}

export function initPosDemo(mount) {
  if (!mount) return;
  const cart = new Map(); // id -> qty

  mount.innerHTML = `
    <div class="till">
      <div class="till-head">
        <span class="till-brand">🧾 Karots POS</span>
        <span class="till-head-right">
          <button class="till-reset" id="tillReset" type="button" title="New sale" aria-label="New sale">⟲</button>
          <span class="till-demo-tag">DEMO</span>
        </span>
      </div>
      <div class="till-items">
        ${ITEMS.map((it) => `
          <button class="till-item" type="button" data-id="${it.id}">
            <span class="till-item-emoji" aria-hidden="true">${it.emoji}</span>
            <span class="till-item-name">${it.name}</span>
            <span class="till-item-price">${rs(it.price)}</span>
          </button>`).join("")}
      </div>
      <div class="till-cart">
        <ul class="till-lines" id="tillLines" aria-live="polite"></ul>
        <p class="till-empty" id="tillEmpty">Tap an item to ring up a sale.</p>
      </div>
      <div class="till-total-row"><span>Total</span><strong id="tillTotal">Rs 0</strong></div>
      <div class="till-pay">
        <label class="till-cash" for="tillCash"><span>Cash received</span>
          <input id="tillCash" type="number" inputmode="numeric" min="0" step="10" placeholder="0"></label>
        <p class="till-status" id="tillStatus" aria-live="polite"></p>
        <div class="till-break" id="tillBreak" aria-live="polite"></div>
        <button class="btn btn-primary till-print" id="tillPrint" type="button" disabled>Print receipt</button>
        <button class="btn btn-secondary till-tear" id="tillTear" type="button" hidden>✂ Tear off &amp; new sale</button>
      </div>
      <div class="printer" aria-hidden="true"></div>
      <div class="receipt-slot" id="tillSlot"><div class="receipt" id="tillReceipt"></div></div>
    </div>`;

  const q = (s) => mount.querySelector(s);
  const linesEl = q("#tillLines"), emptyEl = q("#tillEmpty"), totalEl = q("#tillTotal");
  const cashEl = q("#tillCash"), statusEl = q("#tillStatus"), printBtn = q("#tillPrint");
  const slot = q("#tillSlot"), receipt = q("#tillReceipt"), breakEl = q("#tillBreak");
  const tearBtn = q("#tillTear");

  const total = () => [...cart].reduce((s, [id, qty]) => s + item(id).price * qty, 0);

  function change(id, delta) {
    const n = (cart.get(id) || 0) + delta;
    if (n <= 0) cart.delete(id); else cart.set(id, n);
    slot.classList.remove("open"); tearBtn.hidden = true; // a fresh touch starts a new sale
    render();
  }

  function reset() { cart.clear(); cashEl.value = ""; slot.classList.remove("open"); tearBtn.hidden = true; render(); }

  // Tear off the printed slip: the paper drops away, then the till snaps back to
  // a fresh sale with no animation (so the slip doesn't spring back through view).
  function tear() {
    receipt.classList.add("torn");
    setTimeout(() => {
      slot.classList.add("no-anim");
      slot.classList.remove("open");
      receipt.classList.remove("torn");
      cart.clear(); cashEl.value = ""; tearBtn.hidden = true; render();
      void slot.offsetHeight;               // commit the instant reset
      slot.classList.remove("no-anim");
    }, 460);
  }

  function render() {
    emptyEl.hidden = cart.size > 0;
    linesEl.innerHTML = [...cart].map(([id, qty]) => {
      const it = item(id);
      return `<li class="till-line">
        <span class="till-line-name">${it.name}</span>
        <span class="till-line-qty">
          <button type="button" class="till-step" data-step="-1" data-id="${id}" aria-label="One less ${it.name}">−</button>
          <span class="till-line-q">${qty}</span>
          <button type="button" class="till-step" data-step="1" data-id="${id}" aria-label="One more ${it.name}">+</button>
        </span>
        <span class="till-line-amt">${rs(it.price * qty)}</span>
      </li>`;
    }).join("");
    totalEl.textContent = rs(total());
    updatePay();
  }

  function updatePay() {
    const t = total();
    if (t === 0 || !cashEl.value) {
      statusEl.textContent = t === 0 ? "" : "Enter cash to see the change.";
      statusEl.className = "till-status";
      breakEl.innerHTML = "";
      printBtn.disabled = true;
      return;
    }
    const diff = Number(cashEl.value || 0) - t;
    statusEl.textContent = diff < 0 ? "Short by " + rs(-diff) : "Change " + rs(diff);
    statusEl.className = "till-status " + (diff < 0 ? "is-short" : "is-ok");
    // Note-by-note change breakdown, like the till's cash-drawer float.
    breakEl.innerHTML = diff > 0
      ? denominate(diff).map((x) => `<span class="till-chip">${rs(x.d)} <b>×${x.c}</b></span>`).join("")
      : "";
    printBtn.disabled = diff < 0;
  }

  // Mirrors the real POS web receipt (templates/pages/cashier/receipt.templ):
  // shop header → Receipt/Date/Cashier → items table → Subtotal/TOTAL/Cash/CHANGE
  // → "Thank you! Come again." The note-by-note change lives in the till (the
  // drawer float), not on the printed slip — same as the real receipt.
  function print() {
    const t = total(), cash = Number(cashEl.value || 0), now = new Date();
    const rsr = (n) => "Rs " + Number(n).toFixed(2);
    const no = "S-" + String(Math.floor(Math.random() * 9000) + 1000);
    const when = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    receipt.innerHTML = `
      <div class="r-center r-shop">KAROTS POS</div>
      <div class="r-center r-small">Demo Store · Colombo</div>
      <div class="r-center r-small">Tel: +94 76 962 6396</div>
      <div class="r-hr"></div>
      <div class="r-row r-small"><span>Receipt:</span><span>${no}</span></div>
      <div class="r-row r-small"><span>Date:</span><span>${when}</span></div>
      <div class="r-row r-small"><span>Cashier:</span><span>Adhnan</span></div>
      <div class="r-hr"></div>
      <table class="r-items"><tbody>
        ${[...cart].map(([id, qty]) => { const it = item(id); return `
          <tr class="r-item-name"><td colspan="3">${it.name}</td></tr>
          <tr class="r-item-line"><td>${qty} × ${rsr(it.price)}</td><td></td><td class="r-right">${rsr(it.price * qty)}</td></tr>`; }).join("")}
      </tbody></table>
      <div class="r-hr"></div>
      <div class="r-row"><span>Subtotal</span><span>${rsr(t)}</span></div>
      <div class="r-row r-total"><span>TOTAL</span><span>${rsr(t)}</span></div>
      <div class="r-row"><span class="r-cap">Cash</span><span>${rsr(cash)}</span></div>
      <div class="r-row r-big"><span>CHANGE</span><span>${rsr(cash - t)}</span></div>
      <div class="r-hr"></div>
      <div class="r-center r-small">Exchanges within 7 days with receipt.</div>
      <div class="r-center r-small">Thank you! Come again.</div>
      <div class="r-center r-tiny">POS built by Adhnan</div>
      <div class="r-center r-tiny">adhnanmsa@gmail.com | 0769626396</div>`;
    void slot.offsetHeight; // reflow so the slide transition runs every time
    slot.classList.add("open");
    tearBtn.hidden = false;
  }

  mount.addEventListener("click", (e) => {
    const it = e.target.closest(".till-item");
    if (it) return change(it.dataset.id, 1);
    const step = e.target.closest(".till-step");
    if (step) return change(step.dataset.id, Number(step.dataset.step));
    if (e.target.closest("#tillReset")) return reset();
    if (e.target.closest("#tillTear")) return tear();
    if (e.target.closest("#tillPrint")) print();
  });
  cashEl.addEventListener("input", updatePay);
  render();
}
