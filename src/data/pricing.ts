// Prices (user, 2026-11-22). The one place the site's figures live: the pricing page, the FAQ, JSON-LD and llms.txt read them.
export const PLANS = [
  {
    id: 'suite', name: 'Karots Suite', price: 100000, featured: true,
    line: 'Everything, with the plugins your shop wants.',
    without: '',
    gets: ['Everything in Core', 'The plugins your kind of shop wants', 'Karots Shelf, the app your staff use to put products in'],
  },
  {
    id: 'core', name: 'Core', price: 80000, featured: false,
    line: 'The whole shop system, without plugins.',
    gets: ['The till, stock and expiry, suppliers, money, reports, staff and printing'],
    without: 'No plugins and no Karots Shelf app.',
  },
]

/** What every shop gets with either plan. */
export const INCLUDED = ['3 months’ warranty', 'Free training for you and your staff']

/** Putting a shop's products in for it. */
export const PRODUCT_ENTRY = 10

export const SERVICE = {
  monthly: 5000,
  yearly: 60000,
  gets: ['Every new feature as it comes out', 'Help any time you need it', 'Cloud backup of your shop', 'And more as Karots Suite grows'],
}

export const rs = (n: number) => `Rs. ${n.toLocaleString('en-US')}`
