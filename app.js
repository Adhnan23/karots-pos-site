// app.js — inflates icons, renders the data-driven sections, and wires the
// theme toggle, mobile nav and live-demo CTA. No framework, no build step.
import { icon } from "./assets/icons.js";
import { art } from "./assets/art.js";
import { initPosDemo } from "./assets/pos-demo.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtLkr = (n) => "LKR " + Number(n).toLocaleString("en-US");
const fmtUsd = (n) => "≈ $" + Number(n).toLocaleString("en-US");

// Contact CTAs (pricing plans) become a pre-filled mailto once config loads.
// Both applyConfig and renderPricing call this, so it works whichever finishes
// first.
let siteEmail = null;
function wireContactCtas() {
  if (!siteEmail) return;
  $$(".js-contact-cta").forEach((el) => {
    const subject = el.dataset.subject || "Karots POS";
    el.href = `mailto:${siteEmail}?subject=${encodeURIComponent(subject)}`;
  });
}

// ---- Inline the hand-picked SVG icons into every placeholder. ----
$$("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
$$("[data-art]").forEach((el) => { el.innerHTML = art(el.dataset.art); });
initPosDemo(document.getElementById("posDemo"));

// ---- Theme: light/dark mode + a named colour palette from data/themes.json. ----
// theme.css paints the default palette on first load; once themes.json arrives,
// applyPalette() sets the chosen palette's tokens as inline vars on <html>,
// overriding the CSS. Mode (light/dark) still follows the toggle or the OS.
const root = document.documentElement;
const themeBtn = $("#themeToggle");

let THEMES = {};
let paletteId = "counter";
try { paletteId = localStorage.getItem("kpos-palette") || paletteId; } catch (e) {}

function effectiveTheme() {
  const set = root.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyPalette() {
  const t = THEMES[paletteId];
  if (!t) return;
  const tokens = t[effectiveTheme()] || {};
  for (const [k, v] of Object.entries(tokens)) root.style.setProperty("--" + k, v);
}
function paintThemeBtn() {
  // Show the icon of the mode you'd switch TO.
  if (themeBtn) themeBtn.querySelector("span").innerHTML = icon(effectiveTheme() === "dark" ? "sun" : "moon");
}
paintThemeBtn();
themeBtn?.addEventListener("click", () => {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("kpos-theme", next); } catch (e) {}
  paintThemeBtn();
  applyPalette();
});
// Follow the OS when there's no explicit light/dark choice.
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { paintThemeBtn(); applyPalette(); });

// ---- Palette picker popover ----
const paletteToggle = $("#paletteToggle");
const palettePanel = $("#palettePanel");
function markActive() {
  palettePanel.querySelectorAll(".swatch").forEach((x) => {
    const on = x.dataset.themeId === paletteId;
    x.classList.toggle("active", on); x.setAttribute("aria-checked", String(on));
  });
}
function buildPalette(list) {
  palettePanel.innerHTML = list.map((t) => `
    <button class="swatch" role="menuitemradio" aria-checked="false" data-theme-id="${esc(t.id)}">
      <span class="swatch-dot" style="background:${esc(t.light.accent)}"></span>${esc(t.name)}
    </button>`).join("");
  palettePanel.querySelectorAll(".swatch").forEach((b) => b.addEventListener("click", () => {
    paletteId = b.dataset.themeId;
    try { localStorage.setItem("kpos-palette", paletteId); } catch (e) {}
    applyPalette(); markActive(); closePalette();
  }));
  markActive();
}
function closePalette() { if (palettePanel) { palettePanel.hidden = true; paletteToggle.setAttribute("aria-expanded", "false"); } }
paletteToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = palettePanel.hidden;
  palettePanel.hidden = !open;
  paletteToggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (e) => { if (palettePanel && !palettePanel.hidden && !e.target.closest(".palette-wrap")) closePalette(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePalette(); });

// ---- Mobile nav ----
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");
function closeNav() { if (matchMedia("(max-width: 860px)").matches) { navLinks.hidden = true; navToggle.setAttribute("aria-expanded", "false"); } }
function syncNav() { navLinks.hidden = matchMedia("(max-width: 860px)").matches; }
syncNav();
addEventListener("resize", syncNav);
navToggle?.addEventListener("click", () => {
  const open = navLinks.hidden;
  navLinks.hidden = !open;
  navToggle.setAttribute("aria-expanded", String(open));
});
$$("#navLinks a").forEach((a) => a.addEventListener("click", closeNav));

// ---- Data-driven sections ----
const getJSON = (path) => fetch(path).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });

function renderFeatures(groups) {
  const host = $("#featureGroups");
  host.innerHTML = groups.map((g, i) => `
    <div class="feature-group reveal">
      <div class="fg-head">
        <span class="fg-icon" aria-hidden="true">${icon(g.icon)}</span>
        <div>
          <h3>${esc(g.title)}</h3>
          <p class="fg-tagline">${esc(g.tagline || "")}</p>
        </div>
      </div>
      <ul class="feature-list ${i % 2 === 0 ? "cols-2" : "cols-3"}">
        ${(g.items || []).map((it) => `<li>${esc(it)}</li>`).join("")}
      </ul>
    </div>`).join("");
  observeReveals(host);
}

function renderPlugins(plugins) {
  const grid = $("#pluginGrid");
  plugins.sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));
  grid.innerHTML = plugins.map((p) => `
    <article class="card reveal" id="plugin-${esc(p.id)}">
      <div class="card-top">
        <span class="card-icon" aria-hidden="true">${icon(p.icon)}</span>
        <h3>${esc(p.name)}</h3>
        ${p.status ? `<span class="badge">${esc(p.status)}</span>` : ""}
      </div>
      <p class="summary">${esc(p.summary || "")}</p>
      ${(p.tags && p.tags.length) ? `<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    </article>`).join("");
  observeReveals(grid);
}

function renderCompanion(apps) {
  const grid = $("#companionGrid");
  apps.sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));
  grid.innerHTML = apps.map((a) => `
    <article class="card reveal" id="app-${esc(a.id)}">
      <div class="card-top">
        <span class="card-icon" aria-hidden="true">${icon(a.icon)}</span>
        <h3>${esc(a.name)}</h3>
        ${a.status ? `<span class="badge">${esc(a.status)}</span>` : ""}
      </div>
      <p class="summary">${esc(a.summary || "")}</p>
      ${(a.tags && a.tags.length) ? `<ul class="tags">${a.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    </article>`).join("");
  observeReveals(grid);
}

function renderPricing(data) {
  const plans = data.plans || [];
  $("#pricingGrid").innerHTML = plans.map((p) => {
    const price = p.price || {};
    const rec = p.recurring;
    return `
    <article class="plan reveal ${p.featured ? "featured" : ""}" id="plan-${esc(p.id)}">
      ${p.badge ? `<span class="plan-badge">${esc(p.badge)}</span>` : ""}
      <h3>${esc(p.name)}</h3>
      <p class="plan-tagline">${esc(p.tagline || "")}</p>
      <div class="plan-price">
        <span class="amount">${fmtLkr(price.lkr)}</span>
        <span class="unit">${esc(price.unit || "")}</span>
        <span class="usd">${fmtUsd(price.usd)}</span>
      </div>
      ${rec ? `<div class="plan-recurring">+ ${fmtLkr(rec.lkr)} <span class="unit">${esc(rec.unit || "")}</span> <span class="usd">${fmtUsd(rec.usd)}</span></div>` : ""}
      <ul class="plan-features">
        ${(p.features || []).map((f) => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("")}
      </ul>
      ${p.note ? `<p class="plan-note">${esc(p.note)}</p>` : ""}
      <a class="btn ${p.featured ? "btn-primary" : "btn-secondary"} js-contact-cta" data-subject="Karots POS — ${esc(p.name)}" href="mailto:">${esc(p.cta || "Ask about this")}</a>
    </article>`;
  }).join("");
  $("#pricingNotes").innerHTML = (data.notes || []).map((n) => `<li>${esc(n)}</li>`).join("");
  observeReveals($("#pricing"));
  wireContactCtas();
}

function applyConfig(cfg) {
  const url = cfg && cfg.demoUrl;
  $$(".js-demo-cta").forEach((el) => {
    if (url) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
      el.classList.remove("is-disabled");
    } else {
      // No demo yet: mute the CTA, drop the link, don't scroll anywhere.
      el.classList.add("is-disabled");
      el.setAttribute("aria-disabled", "true");
      if (el.closest(".demo")) el.textContent = "Demo coming soon";
    }
  });
  if (!url) { const note = $("#demoNote"); if (note) note.hidden = false; }

  const set = (sel, fn) => { const el = $(sel); if (el) fn(el); };
  if (cfg && cfg.contactEmail) { siteEmail = cfg.contactEmail; wireContactCtas(); }
  if (cfg && cfg.contactEmail) set("#contactLink", (el) => { el.href = `mailto:${cfg.contactEmail}`; el.textContent = cfg.contactEmail; });
  if (cfg && cfg.contactPhone) set("#contactPhone", (el) => { el.href = `tel:${cfg.contactPhone}`; el.textContent = cfg.contactPhoneDisplay || cfg.contactPhone; });
  if (cfg && cfg.github) set("#contactGithub", (el) => { el.href = cfg.github; });
  if (cfg && cfg.contactName) set("#builtBy", (el) => { el.textContent = cfg.contactName; });
  if (cfg && cfg.portfolioUrl) set("#portfolioLink", (el) => { el.href = cfg.portfolioUrl; });

  // Generic text fill from a dotted config path, e.g. data-cfg="freelance.text".
  $$("[data-cfg]").forEach((el) => {
    const val = el.dataset.cfg.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), cfg);
    if (val != null) el.textContent = val;
  });
}

// ---- Scroll-into-view reveal (respects reduced motion via CSS). ----
let io;
function observeReveals(scope) {
  if (!("IntersectionObserver" in window)) { $$(".reveal", scope).forEach((e) => e.classList.add("in")); return; }
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -10% 0px" });
  $$(".reveal", scope).forEach((e) => io.observe(e));
}
observeReveals(document);

// ---- Boot ----
getJSON("data/features.json").then((d) => renderFeatures(d.groups || []))
  .catch(() => { $("#featureFallback").hidden = false; });
getJSON("data/plugins.json").then((d) => renderPlugins(d.plugins || []))
  .catch(() => { $("#pluginFallback").hidden = false; });
getJSON("data/companion.json").then((d) => renderCompanion(d.apps || []))
  .catch(() => { $("#companionFallback").hidden = false; });
getJSON("data/pricing.json").then(renderPricing)
  .catch(() => { $("#pricingFallback").hidden = false; });
getJSON("data/config.json").then(applyConfig)
  .catch(() => applyConfig({ demoUrl: null }));
getJSON("data/themes.json").then((d) => {
  (d.themes || []).forEach((t) => { THEMES[t.id] = t; });
  if (!THEMES[paletteId]) paletteId = d.default || (d.themes && d.themes[0] && d.themes[0].id) || "counter";
  buildPalette(d.themes || []);
  applyPalette();
}).catch(() => {});
