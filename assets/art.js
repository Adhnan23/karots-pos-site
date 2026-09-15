// art.js — flat abstract vector-art backgrounds, one per section, each a
// different motif so the page doesn't feel repetitive. All shapes use
// currentColor with low opacity, so they inherit the active palette (and turn
// white on the accent-filled demo band). app.js inflates any [data-art] span.
const A = (inner, w = 520, h = 520, pa = "xMidYMid slice") =>
  `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${pa}" fill="none" stroke="currentColor" aria-hidden="true">${inner}</svg>`;

const ART = {
  // Hero — concentric rings + a dot cluster + a tilted square.
  rings: A(`
    <circle cx="380" cy="150" r="170" fill="currentColor" fill-opacity=".08"/>
    <circle cx="380" cy="150" r="170" stroke-width="2" stroke-opacity=".20"/>
    <circle cx="380" cy="150" r="115" stroke-width="2" stroke-opacity=".14"/>
    <path d="M120 30 Q260 120 200 260 T260 500" stroke-width="2" stroke-opacity=".12"/>
    <g fill="currentColor" fill-opacity=".45">
      <circle cx="470" cy="330" r="4"/><circle cx="500" cy="360" r="4"/><circle cx="440" cy="360" r="4"/>
      <circle cx="470" cy="390" r="4"/><circle cx="500" cy="300" r="4"/><circle cx="440" cy="300" r="4"/>
    </g>
    <rect x="60" y="360" width="120" height="120" rx="22" fill="currentColor" fill-opacity=".06" transform="rotate(-12 120 420)"/>`),

  // Pricing — sweeping arcs + a soft disc.
  arcs: A(`
    <path d="M-20 380 Q120 300 260 370 T540 360" stroke-width="2" stroke-opacity=".18"/>
    <path d="M-20 420 Q140 340 300 410 T560 400" stroke-width="2" stroke-opacity=".12"/>
    <circle cx="110" cy="360" r="150" fill="currentColor" fill-opacity=".07"/>
    <circle cx="110" cy="360" r="95" stroke-width="2" stroke-opacity=".16"/>
    <rect x="330" y="60" width="140" height="140" rx="24" fill="currentColor" fill-opacity=".06" transform="rotate(18 400 130)"/>`),

  // Positioning — a tidy dot grid.
  gridDots: A(`
    <defs><pattern id="art-grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="2.4" fill="currentColor" fill-opacity=".35" stroke="none"/>
    </pattern></defs>
    <rect width="520" height="520" fill="url(#art-grid)"/>`),

  // Product — concentric rounded squares (nested "modules", clean not lumpy).
  blob: A(`
    <rect x="70" y="110" width="330" height="330" rx="52" fill="currentColor" fill-opacity=".05"/>
    <rect x="140" y="180" width="250" height="250" rx="44" stroke-width="2" stroke-opacity=".13"/>
    <rect x="210" y="250" width="150" height="150" rx="32" stroke-width="2" stroke-opacity=".10"/>`),

  // Plugins — scattered plus signs.
  plus: A(`
    <defs><pattern id="art-plus" width="38" height="38" patternUnits="userSpaceOnUse">
      <path d="M19 11v16M11 19h16" stroke="currentColor" stroke-width="2" stroke-opacity=".24"/>
    </pattern></defs>
    <rect width="520" height="520" fill="url(#art-plus)"/>`),

  // Companion — scattered rounded squares.
  squares: A(`
    <g fill="currentColor">
      <rect x="60" y="60" width="90" height="90" rx="18" fill-opacity=".07"/>
      <rect x="210" y="150" width="60" height="60" rx="14" fill-opacity=".05"/>
      <rect x="330" y="70" width="120" height="120" rx="22" fill-opacity=".06" transform="rotate(12 390 130)"/>
      <rect x="150" y="300" width="80" height="80" rx="16" fill-opacity=".05" transform="rotate(-8 190 340)"/>
    </g>
    <rect x="270" y="300" width="70" height="70" rx="16" stroke-width="2" stroke-opacity=".16"/>`),

  // Deploy — diagonal hatching.
  lines: A(`
    <defs><pattern id="art-lines" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="20" stroke="currentColor" stroke-width="2" stroke-opacity=".13"/>
    </pattern></defs>
    <rect width="520" height="520" fill="url(#art-lines)"/>`),

  // Demo band — a wave along the bottom (renders white over the accent fill).
  wave: A(`
    <path d="M0 90 Q130 30 260 90 T520 90 V210 H0 Z" fill="currentColor" fill-opacity=".10"/>
    <path d="M0 120 Q130 60 260 120 T520 120" fill="none" stroke-width="2" stroke-opacity=".22"/>
    <path d="M0 150 Q130 96 260 150 T520 150" fill="none" stroke-width="2" stroke-opacity=".14"/>`, 520, 210, "none"),
};

export const art = (name) => ART[name] || "";
export default ART;
