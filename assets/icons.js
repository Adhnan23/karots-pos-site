// icons.js — hand-picked inline SVG set. Stroke-based, 1.5px, currentColor so
// they inherit theme colour. Keyed by name; `icon(name)` falls back to `module`.
// No icon font, no external CDN.

const P = 'stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const svg = (inner) => `<svg viewBox="0 0 24 24" aria-hidden="true" ${P}>${inner}</svg>`;

const ICONS = {
  // brand mark — a stylised receipt/carrot wedge
  logo: svg('<path d="M6 3h9l3 3v15l-2-1.3L14 21l-2-1.3L10 21l-2-1.3L6 21z"/><path d="M9 8h6M9 12h6M9 16h4"/>'),

  // feature groups
  barcode: svg('<path d="M4 5v14M7 5v14M10 5v10M13 5v14M16 5v10M20 5v14"/>'),
  box: svg('<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>'),
  truck: svg('<path d="M2 5h11v11H2zM13 8h4l3 3v5h-7z"/><circle cx="6.5" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>'),
  coins: svg('<ellipse cx="8" cy="7" rx="5" ry="2.5"/><path d="M3 7v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7"/><ellipse cx="16" cy="14" rx="5" ry="2.5"/><path d="M11 14v3c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-3"/>'),
  card: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M6.5 15h4"/>'),
  chart: svg('<path d="M4 4v16h16"/><path d="M8 15v-3M12 15V8M16 15v-6"/>'),
  shield: svg('<path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z"/><path d="m9 12 2 2 4-4"/>'),
  settings: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  printer: svg('<path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="8" rx="1.5"/><path d="M7 13h10v6H7z"/><circle cx="17" cy="11" r=".6" fill="currentColor" stroke="none"/>'),

  // plugins
  sparkles: svg('<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/>'),
  layers: svg('<path d="M12 3 3 8l9 5 9-5z"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/>'),
  tag: svg('<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1.4"/>'),
  gift: svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8S9.5 3 7.5 4.5 9 8 12 8zM12 8s2.5-5 4.5-3.5S15 8 12 8z"/>'),
  sliders: svg('<path d="M4 6h10M4 12h6M4 18h12"/><circle cx="17" cy="6" r="2"/><circle cx="13" cy="12" r="2"/><circle cx="19" cy="18" r="2"/>'),
  phone: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  wrench: svg('<path d="M15.5 3.5a5 5 0 0 0-6.2 6.4L3 16.2 6.8 20l6.3-6.3a5 5 0 0 0 6.4-6.2l-3 3-2.5-2.5z"/>'),
  clipboard: svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V4M9 11h6M9 15h4"/>'),

  // misc
  check: svg('<path d="m5 12 4 4 10-11"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>'),
  moon: svg('<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  palette: svg('<path d="M12 3a9 9 0 1 0 3 17.5c1-.4.8-1.6 0-2.2-.7-.6-.5-1.8.5-2H17A4.5 4.5 0 0 0 21 11.8C21 6.9 17 3 12 3z"/><circle cx="7.5" cy="11.5" r="1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7.8" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="17" cy="11.5" r="1" fill="currentColor" stroke="none"/>'),
  module: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/>'),
};

export const icon = (name) => ICONS[name] || ICONS.module;
export default ICONS;
