// bun scripts/icons.ts — the app icons from src/assets/logo.jpg into public/icons (committed; run when the logo changes).
import sharp from 'sharp'
const logo = 'src/assets/logo.jpg'
const out = 'public/icons'
for (const s of [192, 512]) await sharp(logo).resize(s, s).png().toFile(`${out}/icon-${s}.png`)
await sharp(logo).resize(180, 180).png().toFile(`${out}/apple-touch-icon.png`)
await sharp(logo).resize(32, 32).png().toFile(`${out}/favicon-32.png`)
// Maskable: the logo inside the safe zone (80%) on the brand's saffron, so a round or squircle mask never cuts it.
const inner = await sharp(logo).resize(368, 368).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#f2a900' } })
  .composite([{ input: inner, left: 72, top: 72 }]).png().toFile(`${out}/maskable-512.png`)
