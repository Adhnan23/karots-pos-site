import { describe, expect, it } from 'vitest'
import { sellOne, type Lot } from '../src/scripts/demos/lots'
import { packPrice } from '../src/scripts/demos/packs'
import { settle } from '../src/scripts/demos/pay'
import { onAccount } from '../src/scripts/demos/credit'

describe('batches', () => {
  const lots: Lot[] = [
    { id: 'A', qty: 1, days: -2 },
    { id: 'B', qty: 1, days: 12 },
    { id: 'C', qty: 1, days: 90 },
    { id: 'D', qty: 1, days: null },
  ]
  it('STK-21: good lots go first, earliest expiry first, no expiry last, an expired lot only when nothing else is left', () => {
    let state = lots
    const order: string[] = []
    for (let i = 0; i < 4; i++) {
      const r = sellOne(state)
      order.push(r.lot!)
      state = r.lots
    }
    expect(order).toEqual(['B', 'C', 'D', 'A'])
  })
  it('STK-21: the sale never stops — with only an expired lot left, it still sells', () => {
    const r = sellOne([{ id: 'A', qty: 1, days: -2 }])
    expect(r.lot).toBe('A')
    expect(r.expired).toBe(true)
  })
  it('nothing left: nothing sold', () => expect(sellOne([{ id: 'A', qty: 0, days: 5 }]).lot).toBeNull())
})

describe('packs', () => {
  it('SALE-3: full cards ring at the card price, the rest loose', () => {
    expect(packPrice(23, 10, 280, 30)).toEqual({ packs: 2, loose: 3, total: 650 })
    expect(packPrice(10, 10, 280, 30)).toEqual({ packs: 1, loose: 0, total: 280 })
    expect(packPrice(7, 10, 280, 30)).toEqual({ packs: 0, loose: 7, total: 210 })
  })
  it('SALE-3: a card never costs more than its tablets bought loose', () => {
    expect(packPrice(10, 10, 350, 30).total).toBe(300)
  })
})

describe('paying', () => {
  it('TEND-1: paid less than the total is refused', () => expect(settle(2725, 0, 2000).ok).toBe(false))
  it('TEND-2: only cash gets change', () => expect(settle(2725, 0, 3000)).toEqual({ ok: true, change: 275, card: 0 }))
  it('TEND-6: card never exceeds what is due, the rest in cash with change', () => {
    expect(settle(2725, 5000, 0).card).toBe(2725)
    expect(settle(2725, 2000, 1000)).toEqual({ ok: true, change: 275, card: 2000 })
  })
})

describe('credit', () => {
  it('CUST-8: available credit = limit − balance', () => {
    expect(onAccount(10000, 6000, 3000, false)).toEqual({ ok: true, available: 4000, flagged: false })
  })
  it('TEND-13: over the limit is refused unless approved, and then flagged', () => {
    expect(onAccount(10000, 6000, 5000, false)).toEqual({ ok: false, available: 4000, flagged: false })
    expect(onAccount(10000, 6000, 5000, true)).toEqual({ ok: true, available: 4000, flagged: true })
  })
})
