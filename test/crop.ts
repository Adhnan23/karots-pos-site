// bun test/crop.ts <png> <top> <height> → <png>.crop.png (to look at part of a tall full-page shot)
import sharp from 'sharp'
const [file, top, height] = process.argv.slice(2)
const meta = await sharp(file).metadata()
const h = Math.min(Number(height), meta.height! - Number(top))
await sharp(file).extract({ left: 0, top: Number(top), width: meta.width!, height: h }).toFile(file.replace(/\.png$/, '.crop.png'))
