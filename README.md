# Karots Suite site

The public site for Karots Suite, written for **shop owners** (not developers): what it does, a phone tour sellers
show at the counter, the owner guides and plugin pages, pricing, questions and contact. Static Astro, served by a
Cloudflare Worker (assets only). Installable and works offline: the home page and the whole tour are saved on a phone's first visit.

The old Karots POS site is kept on the `archive/karots-pos` branch.

## Work on it

```sh
bun install
bun run dev            # http://localhost:4321
bun run test           # types, build, then checks on every built page
bun run test:offline   # a phone opens the site once, goes offline, and the tour still works (Playwright)
bun test/a11y.ts       # axe on every page, light and dark (build first)
```

## Where the content comes from

| What | Source | Update with |
|---|---|---|
| Guides and plugin pages | the Suite's `docs/guide/` (owner guides only) | `bun run sync` |
| Their screenshots | the Suite's `docs/images/` | `make docs-shots` in the Suite, then `bun run sync` |
| Tour frames and screens | the Suite's `docs/images/tour/` | `make tour-shots` in the Suite (a Demo Room running), then `bun run sync` |
| Features, tour captions, FAQ, contact | `src/data/*.ts` | by hand |
| App icons | `src/assets/logo.jpg` | `bun run icons` |

`bun run sync` (`scripts/sync.ts`) leaves internal detail out: developer and technician guides, Pocket Cashier,
the Shop Builder, remote access and in-app addresses. `bun run test` fails if any of it, the old product's name or a
price reaches a page.

Every claim on the site comes from the Suite's guides or rule book; the playable demos (`src/scripts/demos/`) each
follow a rule (STK-21, SALE-3, TEND-1/2/6/13, CUST-8) and their tests name it.

## Search and sharing

Each page has its title, description, canonical address and a share image drawn from its screenshot
(`src/pages/og/`). Structured data (`src/lib/jsonld.ts`), `sitemap-index.xml`, `robots.txt`, `llms.txt` and
`llms-full.txt` are built with the site. The address is set once, as `SITE` in `astro.config.mjs`.

## Deploy

```sh
bun run test && bun run build
bunx wrangler deploy
```

Prices: `/pricing/` says "call us" until the price list is ready; add figures there and an `offers` block to
`softwareApplication()` in `src/lib/jsonld.ts`.
