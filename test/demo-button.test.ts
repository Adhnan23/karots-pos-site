import { describe, expect, it } from 'vitest'
import { demoTarget } from '../src/scripts/demo-button'
import { probeDemo, PROBE_URL } from '../src/scripts/live-demo'
import { DEMO_URL } from '../src/data/site'

describe('demoTarget', () => {
  it('a phone (touch) goes to the tour', () => expect(demoTarget(true, 1200, true)).toBe('/tour/'))
  it('a narrow screen goes to the tour', () => expect(demoTarget(false, 400, true)).toBe('/tour/'))
  it('a PC goes to the live Demo Room when it answers', () => expect(demoTarget(false, 1366, true)).toBe(DEMO_URL))
  it('a PC books a demo when the live Demo Room is down', () => expect(demoTarget(false, 1366, false)).toBe('/contact/#demo'))
})

describe('probeDemo', () => {
  it('checks a picture only the Demo Room itself serves (an error page from Cloudflare is not a picture)', () => {
    expect(DEMO_URL).toBe('https://demo.karots.lk/')
    expect(PROBE_URL).toBe('https://demo.karots.lk/__demo/ui/favicon.svg')
  })
  it('up when the picture loads', async () => expect(await probeDemo(async () => true)).toBe(true))
  it('down when it fails', async () => expect(await probeDemo(async () => false)).toBe(false))
  it('down when it takes too long', async () => expect(await probeDemo(() => new Promise(() => {}), 20)).toBe(false))
})
