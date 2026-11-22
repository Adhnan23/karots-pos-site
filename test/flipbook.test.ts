import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { nextFrame } from '../src/scripts/flipbook'
import { SALE, TOUR } from '../src/data/tour'

describe('flipbook', () => {
  it('moves to the next frame and loops back to the first', () => {
    expect(nextFrame(0, 6)).toBe(1)
    expect(nextFrame(5, 6)).toBe(0)
  })
})

describe('tour data', () => {
  it('covers the four shop kinds', () => expect(Object.keys(TOUR).sort()).toEqual(['grocery', 'hardware', 'pharmacy', 'phone']))

  it('every tour shot exists in src/assets', () => {
    for (const [kind, t] of Object.entries(TOUR)) {
      for (const f of SALE) expect(existsSync(join('src/assets/shots/tour', kind, `${f.shot}.jpg`)), `${kind} ${f.shot}`).toBe(true)
      for (const c of t.cards) expect(existsSync(join('src/assets/shots/tour', kind, `${c.shot}.jpg`)), `${kind} ${c.shot}`).toBe(true)
    }
  })
})
