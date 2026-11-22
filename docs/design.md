# Site design

**Subject:** a shop system for small Sri Lankan shops. **Audience:** a shop owner looking at a seller's phone at the
counter, and anyone who finds the site later. **Job:** show that it is real and made for their shop, fast.

## The one bold thing

A **thermal receipt that prints a real sale** in the hero: Sri Lankan products, rupees, change given. Receipts are
what every shop owner already trusts; the Suite prints them as pictures in the shop's own style. Everything else stays
quiet.

## Colour (the brand's own: the logo and the Suite's Studio palette)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#16171B` | `#F1F1EE` | text |
| `--bg` | `#EEF0F2` | `#131418` | page |
| `--surface` | `#FFFFFF` | `#1D1F25` | panels, screenshots' frames |
| `--saffron` | `#F2A900` | `#F2A900` | the brand: buttons, the signboard tiles, one highlight per screen |
| `--paid` | `#12955A` | `#3CC48A` | only for "paid / done / safe" |
| `--muted` | `#5A5E69` | `#A4A8B3` | secondary text |
| paper | `#FFFFFF` + `#2A2A2A` ink | same | the receipt is paper in both modes |

## Type

- **Archivo**, expanded (`font-stretch: 125%`), 800: headlines, set big and tight, like a painted shop signboard.
- **Atkinson Hyperlegible Next**: body. Built for reading; owners read on small phones in shop light.
- **IBM Plex Mono**: only inside the receipt, because receipts are monospace.

Scale (1.25): 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61 px; headlines `clamp()` between the steps. Body 17 px / 1.6, lines
under 70 characters.

## Layout

Left-aligned, one strong column on phones, two on wide screens. Screens of the Suite sit in a thin device frame (PC
or phone, by what they are). Sections differ by content: shop kinds are big signboard tiles, features are
screenshot + text rows, trust is a short plain list — never a grid of identical cards.

```
 phone                      wide
 ┌──────────────┐           ┌──────────────────────────────┐
 │ Karots   ≡   │           │ Karots   Features Tour …  ☎  │
 │ HEADLINE     │           │ HEADLINE          ┌───────┐  │
 │ HEADLINE     │           │ HEADLINE          │receipt│  │
 │ one line     │           │ one line          │prints │  │
 │ [See it] [☎] │           │ [See it] [Call]   │ ...   │  │
 │  ┌───────┐   │           │                   └───────┘  │
 │  │receipt│   │           └──────────────────────────────┘
```

## Rules

- No all-caps labels, no eyebrows, no middle-dot meta strings, no arrows tacked onto buttons, no mono outside the
  receipt, no gradient washes.
- Corners by size: buttons 12 px, frames 16 px, tiles 20 px. One shadow, used only on the receipt and device frames.
- Motion: the receipt prints once on load; everything else moves only when tapped. `prefers-reduced-motion` shows the
  printed receipt at once.
- Copy: plain words, a shop owner's words. Buttons say what happens ("See it on this phone", "Call Karots").
