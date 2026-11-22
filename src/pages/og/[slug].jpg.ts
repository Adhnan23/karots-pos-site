// Draws a 1200×630 share image: the screenshot in the dark frame on the brand's saffron, the logo above.
import type { APIRoute } from 'astro'
import { join } from 'node:path'
import sharp from 'sharp'
import { OG_SHOTS, ogPath } from '../../lib/og'

export function getStaticPaths() {
  return OG_SHOTS.map((shot) => ({ params: { slug: ogPath(shot).slice(4, -4) }, props: { shot } }))
}

const W = 1200, H = 630, SW = 1000, SH = 506
const round = (w: number, h: number, r: number) =>
  Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`)

export const GET: APIRoute = async ({ props }) => {
  const assets = join(process.cwd(), 'src', 'assets')
  const shot = await sharp(join(assets, 'shots', props.shot)).resize(SW, SH, { fit: 'cover', position: 'top' })
    .composite([{ input: round(SW, SH, 14), blend: 'dest-in' }]).png().toBuffer()
  const frame = Buffer.from(`<svg width="${SW + 16}" height="${SH + 16}"><rect width="${SW + 16}" height="${SH + 16}" rx="22" ry="22" fill="#2b2d33"/></svg>`)
  const logo = await sharp(join(assets, 'logo.jpg')).resize(64, 64).composite([{ input: round(64, 64, 14), blend: 'dest-in' }]).png().toBuffer()
  const png = await sharp({ create: { width: W, height: H, channels: 4, background: '#f2a900' } })
    .composite([
      { input: logo, left: (W - 64) / 2, top: 22 },
      { input: frame, left: (W - SW - 16) / 2, top: 108 },
      { input: shot, left: (W - SW) / 2, top: 116 },
    ]).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/jpeg' } })
}
