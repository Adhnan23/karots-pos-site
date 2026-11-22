# Karots Suite site — design

*2026-11-22. Takes over the Karots POS promo site (this repo) and turns it into the Karots Suite site.*

## Why

The user and a friend sell Karots Suite door to door, without a laptop. Shop owners ask to see it **on the
seller's phone** there and then; today that means a second visit with the laptop and the Demo Room. The site
must let a seller show the Suite from a phone on the first visit, and stand as the Suite's public home (the old
site only knows Karots POS, which the Suite is independent of).

Success: a seller opens the site (or its home-screen icon) on a phone, picks the shop's kind, and the owner sees a
sale ring up, stock, batches and expiry, suppliers — enough to book a proper demo or sign.

## Goals

- A multi-page Karots Suite site: Home, Features (per area), Plugins (one page each), Guides, Tour, Pricing,
  Contact.
- **The phone tour** (`/tour`): pick a shop kind → swipe through real screens; first card is a sale playing as a
  flipbook (scan → cart → Pay → change → receipt), then inventory, batches + expiry, suppliers / reorder,
  low stock, dashboard / reports, then contact.
- Works on a phone at 360 px, installable to the home screen, **works offline** once opened (Service Worker).
- Content comes from the Suite repo, not rewritten: guides (`docs/guide/*.md`) and screenshots (`docs/images/`).
- English only.

## Non-goals

- The online Demo Room (the real suite on the web for PC visitors) — a separate project, next. Until then the
  Demo button opens the tour on a phone and "Book a demo" (contact) on a PC.
- Real prices — the user sends the list later; Pricing is a placeholder ("Call us") until then.
- Tamil / Tanglish, the i18n code, companion apps, the "Hire me" freelance band, the Online plan (all POS-site
  only).
- Per-seller links / seller contact pages (user: not now).

## Anti-goals

- Anything that says Karots POS, or describes POS behaviour the Suite doesn't have.
- Plain, default-looking pages — the user rejects those (same bar as the Suite's screens).
- Guide text forked into the site by hand: it drifts from the Suite.
- Internal detail on a public page: support PINs, install IDs, the system user, cheat keys, developer / technician
  material, unreviewed legal text.

## Approaches

- **A. Astro, static output, content synced from the Suite (picked).** The user already runs Astro on Cloudflare
  Pages (`portfolio`). Guides and shots are copied in by one command and rendered as pages; mini demos stay as
  small vanilla scripts. Cost: a build step.
- B. Keep the no-build HTML site, add pages by hand. Header / footer repeated per page; guides copied by hand
  drift.
- C. React SPA like the Suite's web app. Too much for a sales site; worse for search and WhatsApp link previews.

## Decided

- **Stack:** Astro (static), bun, deployed to Cloudflare Pages. No server code.
- **Repo:** this repo becomes `karots-suite-site` (the family's 4th repo). The old site's files are replaced; git
  history keeps them.
- **Sync from the Suite:** `bun run sync` copies a **whitelist** from `../go/karots-suite`:
  owner guides (`till, stock, purchasing, money, reports, people, printing, appearance, shelf`) and plugin
  pages (`docs/guide/plugins/*.md`), plus the images they use. Image links are rewritten to the site's paths.
  Synced files are committed (the build never needs the Suite repo).
- **Excluded from sync:** `architecture`, `developer`, `install`, `updates-backups`, `demo-room` (technician /
  developer / internal), and `pocketcashier` (*my call:* the user doesn't mention Pocket Cashier to shops yet —
  flip when they do).
- **Tour shots:** new shots in the Suite's `web/docs-shots/shots.spec.ts` (screenshots only, no behaviour change):
  a sale's frames (~6) and the tour screens for each shop kind from its Demo Room shop — Pharmacy (CityCare),
  Grocery (Sunrise), Mobile (Galaxy), Hardware (Lanka Build). Phone-sized crops where the screen is admin; the till
  shown as the PC screen it is.
- **Mini demos:** the old site's playable till and demos (lots, credit, split, discount, float, return, profit,
  label) are kept **only where they match the Suite**; each is checked against the Suite's rule book and rewritten
  where the Suite behaves differently (e.g. the Suite never stops a sale on an expired lot the way the POS demo
  does — check `docs/rules/` first). One that can't be made true is dropped.
- **Look:** the Suite's own tokens and a built-in palette (Studio light / Night dark, `docs/design/theme.md`),
  light and dark. Screens and site look like one product.
- **"Rules" (*my call*, user to confirm):** a "Built to be trusted" section on Home and Features — battle-tested
  money and stock, survives power cuts, works offline, automatic backups + cloud — in plain words, no internal
  names. The Shop Rules (free vs paid, refunds) go on the site **after** the lawyer review and the price list,
  never as an unreviewed draft.
- **Contact:** phone + email from the old site's `config.json`; WhatsApp link.

## Left to the builder

- Page layouts, navigation, how a guide page is chunked, the tour's swipe mechanics (CSS scroll-snap first).
- Image sizes / formats for the tour (keep the offline cache small: target < 15 MB).
- Domain: `pos.karots.lk` today; move to a Suite domain at deploy (user's call then).
- GitHub repo rename is the user's (outward-facing).
