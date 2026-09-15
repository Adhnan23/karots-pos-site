# Karots POS — marketing site

A single-page, fully static showcase for Karots POS. No build step, no runtime
dependencies. Content for the plugins and capability sections is data-driven from
`data/*.json`, so adding a plugin or a feature is a JSON edit — never an HTML
change.

Built to the spec in `DESIGN.md`.

## Files

```
index.html      the page (static sections + mount points)
styles.css      layout, typography, components
theme.css       light/dark design tokens (CSS custom properties)
app.js          inflates icons, renders data sections, theme toggle, demo CTA
assets/icons.js inline SVG icon map
data/
  config.json    site url, demo url, and contact details
  features.json  the 9 core capability groups
  plugins.json   the plugin catalogue
  companion.json the companion / related apps
  pricing.json   the pricing plans and terms
  themes.json    colour palettes (each with a light + dark variant)
favicon.svg
```

## Preview locally

The page fetches `data/*.json` and loads `app.js` as an ES module, so it must be
served over HTTP — opening `index.html` from `file://` will show the fallback
notes instead of the rendered sections. Any static server works:

```sh
make serve                       # then open http://localhost:8080
# or a different port:  make serve PORT=9000
# or without make:      python3 -m http.server 8080   /   npx serve .
```

## Deploy (all zero-config — the site is genuinely static)

- **GitHub Pages** — push the repo, enable Pages on `main` at the root. Done.
- **Netlify** — Import from Git with an empty build command and publish dir `/`,
  or drag-and-drop the folder into the Netlify UI.
- **Cloudflare Pages** — connect the repo, empty build command, output dir `/`.
- **VPS + nginx** — `rsync` the folder to `/var/www/karots-site` and point a
  `server { root /var/www/karots-site; }` block at it. No PHP/Node needed.

## Maintenance

- **Add a plugin** — append an object to the `plugins` array in
  `data/plugins.json` (`id`, `name`, `summary`, optional `icon`, `tags`,
  `status`, `order`). Reload — no HTML edit, no rebuild. See `DESIGN.md` §4 for
  the field reference; `icon` keys into `assets/icons.js` (unknown keys fall back
  to a generic glyph — add a new SVG there if you want a custom one).
- **Add a companion app** — append an object to the `apps` array in
  `data/companion.json` (same fields as a plugin).
- **Add / edit a capability group** — same pattern in `data/features.json`.
- **Add / edit pricing** — edit the `plans` and `notes` in `data/pricing.json`
  (LKR + approximate USD per plan; `featured: true` highlights one).
- **Add / edit a colour palette** — add an object to `themes` in
  `data/themes.json` (an `id`, `name`, and a `light` + `dark` token map). It
  appears in the palette picker automatically; `default` names the starting one.
- **Turn on the live demo** — set `demoUrl` in `data/config.json` to the hosted
  demo's URL. Every "Try the live demo" CTA switches from *Demo coming soon* to a
  live link on next load.
- **Contact / freelance info** — edit `data/config.json`: `contactEmail`,
  `contactPhone`, `github`, `portfolioUrl`, and the `freelance` block (headline,
  text, CTA) that fills the "Hire" band.

## Open questions (from DESIGN.md §10)

Demo timeline, real contact email, self-hosted vs Google Fonts, whether to state
pricing, product screenshots, and the final domain (for canonical/OG tags).
