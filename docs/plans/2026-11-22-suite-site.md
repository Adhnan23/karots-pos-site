# Karots Suite site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Karots POS promo site in this repo with a multi-page Karots Suite site: phone tour, guides and
plugin pages synced from the Suite, PWA, and full SEO.

**Architecture:** Astro static build (no server code, no runtime framework). A `sync` script copies a whitelist of
the Suite's guides and screenshots into `src/content/` + `src/assets/`; pages render them. The tour's screenshots are
taken in the Suite repo by a new docs-shots spec. A build-time integration writes the Service Worker and checks the
output.

**Tech Stack:** Astro 5, bun, TypeScript, Vitest, `@astrojs/sitemap`, `sharp` (comes with Astro), `@fontsource*`
fonts, Cloudflare Pages (wrangler). Suite side: Playwright (`web/docs-shots`).

**Spec:** `docs/specs/2026-11-22-suite-site-design.md`

## Global Constraints

- English only. The words "Karots POS", "Tamil", "Tanglish" never appear in `dist/`.
- No internal detail in `dist/`: "support PIN", "install ID", "system user", "0000000001", "Konami", "cheat",
  "Pocket Cashier", "DEMO_SHOP", "make ".
- Excluded from sync: `architecture, developer, install, updates-backups, demo-room`, `plugins/pocketcashier`.
- Every page works at 360 px wide with no horizontal scroll; light and dark.
- A new design (frontend-design skill), nothing from the old site's look.
- Files ≤ 500 lines. No Claude / AI attribution in commits. Commit on `main` locally; the user pushes and deploys.
- Pricing shows "Call us" until the user's price list arrives (no figures anywhere).
- Contact: phone `+94 76 962 6396` (`tel:+94769626396`, `https://wa.me/94769626396`), email from old `data/config.json`.
- Precached offline size (shell + tour) < 15 MB. Lighthouse ≥ 95 in all four categories on `/`, `/tour/pharmacy/`,
  `/guides/till/`, mobile.

## Review Focus

1. A guide links to an excluded guide or a missing image → the link becomes plain text, the build never ships a 404
   link (test in Task 3, check in Task 4).
2. A seller's phone opens `/tour/` offline having visited only `/` → the tour still opens (all four kinds precached on
   first visit; test in Task 10).
3. An update deploys while a phone holds the old Service Worker → the new version takes over on next open, no mixed
   old/new pages (versioned cache name + old caches deleted; test in Task 10).
4. A long word / wide figure / screenshot at 360 px overflows its card → checked in every UI gate's 360 px shots
   (Tasks 2, 5, 6).
5. A WhatsApp / Facebook share of any page shows a blank preview → every page has its own `og:image` that exists in
   `dist/` (test in Task 9).

---

### Task 1: Clear the old site, scaffold Astro, dist checker

**Files:**
- Delete: `index.html app.js styles.css theme.css assets/ data/ sw.js manifest.webmanifest llms.txt robots.txt sitemap.xml og.png favicon.svg icons/ Makefile`
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro`,
  `src/layouts/Base.astro`, `test/dist.test.ts`, `vitest.config.ts`, `README.md` (rewritten)

**Interfaces:**
- Produces: scripts `bun run dev | build | check | test | sync`; `Base.astro` props
  `{ title: string; description: string; path: string; ogImage?: string; jsonLd?: object[] }`;
  `test/dist.test.ts` helper `pages(): { path: string; html: string }[]` (every `dist/**/*.html`).

- [ ] **Step 1:** `bun create astro@latest` equivalent by hand: `astro@^5`, `@astrojs/check`, `typescript`, `vitest`;
  `astro.config.mjs` `{ site: 'https://pos.karots.lk', output: 'static', trailingSlash: 'always' }` (domain changes
  at deploy — one constant).
- [ ] **Step 2: Write the failing test** `test/dist.test.ts`:
  `it('has no forbidden words')` — for every page, none of the Global Constraints words (case-insensitive);
  `it('every page has one h1, a title and a description')`.
- [ ] **Step 3:** `bun run build && bun run test` → FAIL (no dist pages yet / no h1).
- [ ] **Step 4:** Minimal `Base.astro` (html lang="en", title, meta description, slot) + `index.astro` with one `<h1>`.
  `test` script = `astro build && vitest run`.
- [ ] **Step 5:** `bun run test` → PASS. `bun run check` → 0 errors.
- [ ] **Step 6: Commit** `feat: start the Karots Suite site — Astro replaces the POS promo site`

### Task 2: Design system and site shell (UI gate)

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/components/{Header,Footer,Button,Section,ThemeToggle}.astro`,
  `docs/design.md` (the chosen direction, one page)
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Produces: CSS custom properties (`--bg --fg --muted --accent --card --line --radius --shadow`, light + dark via
  `prefers-color-scheme` and `[data-theme]`), `Button` props `{ href: string; kind?: 'primary'|'ghost' }`,
  `Section` props `{ id?: string; eyebrow?: string; title: string }`, nav items Home · Features · Plugins · Tour ·
  Guides · Pricing · Contact.

- [ ] **Step 1:** Load the `frontend-design` skill; pick a direction (type pairing self-hosted via `@fontsource`,
  colour taken from the Suite's palettes so screenshots sit well), write it in `docs/design.md`.
- [ ] **Step 2:** Build tokens, shell, mobile menu (`<details>`-based, no JS needed), theme toggle (localStorage,
  try/catch).
- [ ] **Step 3: UI gate:** Playwright screenshots of `/` at 360 × 780 and 1366 × 800, light and dark, into
  `test/shots/` (gitignored); review them yourself: no overflow, contrast, nothing default-looking.
- [ ] **Step 4:** `bun run test` → PASS.
- [ ] **Step 5: Commit** `feat: the site's design system and shell`

### Task 3: Sync guides and screenshots from the Suite

**Files:**
- Create: `scripts/sync.ts`, `scripts/sync-lib.ts`, `test/sync.test.ts`, `src/content.config.ts`
- Output (committed): `src/content/guides/*.md`, `src/content/plugins/*.md`, `src/assets/shots/**`

**Interfaces:**
- Produces (`sync-lib.ts`):
  - `GUIDES = ['till','stock','purchasing','money','reports','people','printing','appearance','shelf']`
  - `EXCLUDED_PLUGINS = ['pocketcashier']`
  - `rewrite(md: string, from: 'guide'|'plugin', known: Set<string>): { md: string; images: string[] }` —
    `../images/x/y.jpg` / `../../images/…` → `../../assets/shots/x/y.jpg` (relative to the content file);
    `till.md` / `plugins/repairs.md` / `../till.md` links → `/guides/till/`, `/plugins/repairs/`; a link to anything not
    in `known` → its text only; anchors kept.
  - Content collections `guides` and `plugins`: schema `{ title: string (first # heading), summary: string (first
    paragraph) }`, filled by sync as frontmatter.
- `bun run sync [suitePath=../go/karots-suite]`.

- [ ] **Step 1: Write the failing tests** (`test/sync.test.ts`):
  - image link `![Pick](../images/demo/picker.jpg)` → `../../assets/shots/demo/picker.jpg`, `images` = `['demo/picker.jpg']`
  - `[Stock](stock.md#batches)` → `[Stock](/guides/stock/#batches)`
  - `[Install](install.md)` → `Install`
  - from a plugin page, `[Pocket Cashier](pocketcashier.md)` → `Pocket Cashier`
  - frontmatter title/summary taken from the first heading / paragraph
- [ ] **Step 2:** `bunx vitest run test/sync.test.ts` → FAIL.
- [ ] **Step 3:** Implement `sync-lib.ts`, then `sync.ts` (reads the Suite, writes outputs, copies only the images
  referenced, deletes stale outputs, fails loudly if the Suite path is missing).
- [ ] **Step 4:** Tests PASS; `bun run sync` against the real Suite; `git diff --stat` shows the guides and shots.
- [ ] **Step 5: Commit** `feat: sync owner guides, plugin pages and screenshots from the Suite`

### Task 4: Guides and plugin pages

**Files:**
- Create: `src/pages/guides/index.astro`, `src/pages/guides/[slug].astro`, `src/pages/plugins/index.astro`,
  `src/pages/plugins/[slug].astro`, `src/components/Prose.astro`, `src/components/Breadcrumbs.astro`
- Modify: `test/dist.test.ts`

**Interfaces:**
- Consumes: collections `guides`, `plugins` (Task 3).
- Produces: URLs `/guides/<slug>/`, `/plugins/<slug>/`; `Breadcrumbs` props `{ items: { name: string; path: string }[] }`
  (Task 9 adds its JSON-LD).

- [ ] **Step 1: Failing test:** `it('every internal link resolves')` — every `href` starting with `/` points to a page
  or file in `dist/`; `it('every guide and plugin is a page')` — 9 guides + 10 plugins (README.md is the index, not a plugin).
- [ ] **Step 2:** FAIL. **Step 3:** Build the pages (Astro `<Image>` for the shots: responsive widths 360/720/1200,
  webp/avif, `loading="lazy"` after the first). **Step 4:** PASS + 360 px gate on `/guides/stock/`.
- [ ] **Step 5: Commit** `feat: guide and plugin pages from the synced docs`

### Task 5: Tour screenshots (Suite repo)

**Files (in `~/Projects/go/karots-suite`):**
- Create: `web/docs-shots/tour.spec.ts`
- Modify: `web/playwright.docs.config.ts` (`testMatch: /(shots|tour)\.spec\.ts/`), `web/docs-shots/demo.ts`
  (`startShop(page, key)` generalising `superStore`), `Makefile` (`tour-shots:` same as `docs-shots` with
  `DOCS_ONLY` unset and `-g tour`)

**Interfaces:**
- Produces: `docs/images/tour/<kind>/<NN>-<name>.jpg`, kinds `pharmacy grocery phone hardware` (Demo Room keys).
  Per kind: `01..06-sale-*` (till at 1366 × 768: empty → scanned 1 → scanned 3 → Pay dialog → change shown → receipt
  on the paper strip), `07-products`, `08-batches`, `09-suppliers`, `10-reorder`, `11-low-stock`, `12-dashboard`
  (phone 390 × 844 for admin screens). Hardware / phone kinds: `08` = their plugin's headline screen instead of
  batches (repairs for phone, quotes/invoices for hardware).
- The site's sync (Task 3) adds `docs/images/tour/**` to its copy list.

- [ ] **Step 1:** Write `tour.spec.ts` with `startShop` per kind, reusing `scan`, `session`, `cashier`, `owner`.
- [ ] **Step 2:** Start the Demo Room, `make tour-shots`; review every frame yourself (real products, no demo
  chrome, sale frames tell the story in order).
- [ ] **Step 3:** `cd web && bunx tsc -b` clean; `make check-core` clean.
- [ ] **Step 4: Commit (Suite)** `docs(shots): tour screenshots per shop kind for the website`
- [ ] **Step 5 (site):** add `tour` to sync, `bun run sync`, commit `feat: tour screenshots synced`

### Task 6: The tour

**Files:**
- Create: `src/data/tour.ts`, `src/pages/tour/index.astro`, `src/pages/tour/[kind].astro`,
  `src/components/Flipbook.astro`, `src/components/TourCard.astro`, `src/scripts/flipbook.ts`, `test/flipbook.test.ts`

**Interfaces:**
- Produces: `TOUR: Record<'pharmacy'|'grocery'|'phone'|'hardware', { name: string; cards: { shot: string; title:
  string; caption: string }[] }>` (captions: one plain sentence each, written for a shop owner);
  `nextFrame(i: number, n: number): number` (loops), `Flipbook` props `{ frames: string[]; ms?: number }` (default
  1100 ms, pauses on tap, respects `prefers-reduced-motion` → shows frames as a static strip).
- Last card: "See it at your shop" → call / WhatsApp buttons.

- [ ] **Step 1: Failing tests:** `nextFrame(5, 6) === 0`; `it('every tour shot exists in src/assets')`;
  dist test `it('four tour pages, each with the sale flipbook first')`.
- [ ] **Step 2:** FAIL. **Step 3:** Build: swipe = CSS scroll-snap, dots, arrow keys on desktop. **Step 4:** PASS.
- [ ] **Step 5: UI gate** at 360 and 390 px, light/dark; the flipbook reads as a sale. **Step 6: Commit**
  `feat: phone tour — pick a shop kind, watch a sale, swipe the screens`

### Task 7: Home, Features, Trust, Pricing, Contact, FAQ, 404, Demo button

**Files:**
- Create: `src/pages/features/index.astro`, `src/pages/features/[area].astro`, `src/data/features.ts`,
  `src/pages/pricing.astro`, `src/pages/contact.astro`, `src/pages/faq.astro`, `src/data/faq.ts`, `src/pages/404.astro`,
  `src/components/{Trust,DemoButton,Hero}.astro`, `src/scripts/demo-button.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- `FEATURES: { area: string; title: string; summary: string; shot: string; guide: string; points: string[] }[]` for
  till, stock (incl. batches + expiry), purchasing (suppliers, reorder), money, reports, people, printing — text drawn
  from the README's "What it does" and the guides.
- `demoTarget(coarsePointer: boolean, width: number): '/tour/' | '/contact/#demo'` — phone (coarse pointer or
  width < 900) → tour.
- Trust copy (plain words): money and stock checked by thousands of automated shop days; survives power cuts;
  works with no internet; automatic backups, a copy on USB / network and optional cloud.
- Pricing: "Call us for a price" + what every shop gets (install, training) — no figures.

- [ ] **Step 1: Failing tests:** `demoTarget(true, 1200) === '/tour/'`, `demoTarget(false, 1366) === '/contact/#demo'`,
  `demoTarget(false, 400) === '/tour/'`; dist: no `Rs ` / `LKR` on any page.
- [ ] **Step 2:** FAIL. **Step 3:** Build pages; the button's `href` defaults to `/tour/` (works without JS).
  **Step 4:** PASS. **Step 5: UI gate** (`/`, `/features/stock/`, `/pricing/` at 360 / 1366, light/dark).
- [ ] **Step 6: Commit** `feat: home, features, trust, pricing, contact, FAQ`

### Task 8: Interactive demos, true to the Suite

**Files:**
- Create: `src/scripts/demos/{till,lots,credit,split,discount,return,profit,label}.ts` (only those kept),
  `src/components/Demo.astro`, `test/demos.test.ts`
- Reference: old `assets/pos-demo.js`, `assets/feature-demos.js` (git history, commit `0dd6f6c`)

**Interfaces:**
- Each demo: pure `reduce(state, action) → state` + `mount(el: HTMLElement)`. Placed on `/` (till) and the matching
  `/features/<area>/`.

- [ ] **Step 1:** For each old demo, read the matching Suite rules (`docs/rules/` in the Suite: `SALE-`, `DISC-`,
  `TEND-`, `RET-`, lots / expiry, credit) and list, in the commit message, what changes or why it's dropped (e.g. an
  expired lot never blocks the sale — it sells and is flagged; check the rule, don't assume).
- [ ] **Step 2: Failing tests** in `test/demos.test.ts`: one per kept demo naming the rule id it follows
  (`it('LOT-…: …')`) with the Suite's numbers.
- [ ] **Step 3:** FAIL. **Step 4:** Port + rewrite. **Step 5:** PASS; UI gate at 360 px.
- [ ] **Step 6: Commit** `feat: playable demos that follow the Suite's rules`

### Task 9: SEO, social cards, llms.txt

**Files:**
- Create: `src/components/Seo.astro`, `src/lib/jsonld.ts`, `scripts/og.ts`, `src/pages/llms.txt.ts`,
  `src/pages/llms-full.txt.ts`, `public/robots.txt`
- Modify: `Base.astro`, `astro.config.mjs` (`@astrojs/sitemap`), `test/dist.test.ts`

**Interfaces:**
- `jsonld.ts`: `organization()`, `softwareApplication()` (`applicationCategory: 'BusinessApplication'`,
  `operatingSystem: 'Windows, Linux'`, no `offers` until prices), `breadcrumbs(items)`, `faq(items)`.
- `og.ts` (run in `build` before `astro build`): 1200 × 630 PNG per page into `public/og/<path>.png` — the page's
  shot + title on the brand background, composited with `sharp` (SVG text overlay). `Seo.astro` points
  `og:image` / `twitter:image` there.
- `llms.txt`: site summary, then one line per guide / plugin / feature page (title, URL, summary);
  `llms-full.txt`: every guide and plugin page as plain Markdown.

- [ ] **Step 1: Failing dist tests:** every page has `link[rel=canonical]` = `site + path`, `og:title`,
  `og:description`, `og:image` whose file exists, valid JSON-LD (parses; home has `Organization` +
  `SoftwareApplication`; FAQ has `FAQPage`; guides have `BreadcrumbList`); `sitemap-index.xml` lists every page
  except 404; `llms.txt` lists every guide; `robots.txt` names the sitemap.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat: SEO — canonical, social cards, JSON-LD, sitemap, llms.txt`

### Task 10: PWA and offline

**Files:**
- Create: `src/integrations/sw.ts` (Astro integration, `astro:build:done`), `src/sw-template.js`,
  `src/pages/offline.astro`, `public/manifest.webmanifest`, `public/icons/*` (from the Suite's `docs/images/logo.jpg`:
  192, 512, maskable 512, apple-touch 180), `src/scripts/register-sw.ts`, `test/sw.test.ts`

**Interfaces:**
- `precacheList(distFiles: string[]): string[]` — shell (CSS, JS, fonts, `/`, `/offline/`, icons) + all `/tour/**`
  pages and the image widths they use (≤ 720 px); `swSource(list: string[], version: string): string` — cache name
  `ks-site-<version>` (version = hash of the list's contents); install precaches, activate deletes other `ks-site-*`
  caches and claims; navigations network-first → cache → `/offline/`; images / assets cache-first, stored on visit.
- Manifest: `name` "Karots Suite", `short_name` "Karots", `start_url` `/`, `display` `standalone`, shortcut "Tour"
  → `/tour/`.

- [ ] **Step 1: Failing tests:** `precacheList` includes `/tour/pharmacy/` and its flipbook frames, excludes guide
  shots; total precache bytes < 15 MB; `swSource` with two versions yields different cache names and deletes the
  old one.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5:** Playwright (offline context): open `/`, wait for SW ready, go offline, open `/tour/hardware/` →
  renders; open an unvisited guide → offline page.
- [ ] **Step 6: Commit** `feat: installable, works offline — the tour is saved on first visit`

### Task 11: Quality gate and deploy setup

**Files:**
- Create: `wrangler.jsonc` (`pages_build_output_dir: ./dist`), `test/a11y.spec.ts` (Playwright + `@axe-core/playwright`)
- Modify: `README.md` (what the site is, `bun run sync / dev / build / test`, deploy, where content comes from),
  `docs/specs/…` and this plan deleted at the end (git keeps them)

- [ ] **Step 1:** axe on every page: no serious / critical violations.
- [ ] **Step 2:** Lighthouse (mobile) via `bunx lighthouse` with the system Chromium on the four pages in Global
  Constraints: all ≥ 95; fix what falls short.
- [ ] **Step 3:** Full review of the site against the spec; 360 px / 1366 px × light / dark screenshots of every page
  type, self-reviewed.
- [ ] **Step 4: Commit** `chore: quality gate, deploy config, README`
- [ ] **Step 5:** Tell the user: deploy (`bunx wrangler pages deploy dist`), domain, GitHub rename to
  `karots-suite-site` are theirs to run / approve. Then delete the spec and this plan in one commit.
