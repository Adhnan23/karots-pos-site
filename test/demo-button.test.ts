import { expect, it } from 'vitest'
import { demoTarget } from '../src/scripts/demo-button'

it('a phone (touch) goes to the tour', () => expect(demoTarget(true, 1200)).toBe('/tour/'))
it('a narrow screen goes to the tour', () => expect(demoTarget(false, 400)).toBe('/tour/'))
it('a PC goes to book a demo', () => expect(demoTarget(false, 1366)).toBe('/contact/#demo'))
