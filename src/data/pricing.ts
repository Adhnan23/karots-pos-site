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
export const INCLUDED = ['Installation and training for you and your staff', '3 months of everything the service plan gives, free', 'Genuine bugs fixed free, always']

/** A Core shop moving up to Karots Suite pays the difference. */
export const CORE_TO_SUITE = 20000

/** Putting a shop's products in for it. */
export const PRODUCT_ENTRY = 10

export const SERVICE = {
  monthly: 5000,
  yearly: 60000,
  gets: ['Technical support and help', 'Major upgrades', 'Small changes made for your shop', 'Ongoing maintenance', 'Karots cloud backup of your shop'],
}

/** Who pays for what (Shop Rules sections 1–5, 9). */
export const WHO_PAYS: { what: string; first: string; plan: string; none: string }[] = [
  { what: 'A genuine bug in Karots Suite', first: 'Free', plan: 'Free', none: 'Free, always' },
  { what: 'Support and help', first: 'Free', plan: 'Included', none: 'Charged by the hour' },
  { what: 'Major upgrades', first: 'Free', plan: 'Included', none: 'Not included' },
  { what: 'Small changes for your shop', first: 'Free', plan: 'Included', none: 'Quoted' },
  { what: 'Karots cloud backup', first: 'Included', plan: 'Included', none: 'Stops' },
  { what: 'Moving to a new PC, or reinstalling', first: 'Free', plan: 'Free', none: 'Free' },
  { what: 'Large new features, custom work', first: 'Quoted', plan: 'Quoted', none: 'Quoted' },
  { what: 'Hardware, and visits to the shop', first: 'Yours / by distance', plan: 'Yours / by distance', none: 'Yours / by distance' },
]

/** System requirements, as measured (the Suite's docs/guide/install.md, 2026-11-24). */
export const REQUIREMENTS: { what: string; min: string; rec: string }[] = [
  { what: 'Operating system', min: 'Windows 10 (64-bit), or a 64-bit Linux', rec: 'Windows 10 or 11 (64-bit), or Ubuntu / Xubuntu' },
  { what: 'Processor', min: 'Intel Core 2 Duo, or any 64-bit Intel or AMD with 2 cores', rec: 'Intel Core i3 2nd gen or newer, or AMD equal' },
  { what: 'Memory', min: '2 GB', rec: '4 GB or more' },
  { what: 'Storage', min: '5 GB free on a hard disk', rec: '20 GB free on an SSD' },
  { what: 'Screen', min: '1024 × 768', rec: '1366 × 768 or larger' },
  { what: 'Network', min: 'None for one PC. Cashier PCs and phones: the shop’s wired network or wifi', rec: 'The same, plus internet now and then for updates and cloud backup' },
  { what: 'Receipt printer', min: 'Optional', rec: 'An 80 mm thermal receipt printer on USB (tested: Xprinter XP-80T)' },
  { what: 'Power', min: 'A normal socket (a power cut loses no finished sale)', rec: 'A UPS, to keep selling through a power cut' },
]

/** A cashier PC only shows the till in a browser from the main PC. */
export const CASHIER_PC = 'Any PC with Windows 10 or 11 or Linux, 2 GB memory, a 1024 × 768 screen and Chrome, Edge or Firefox from 2023 or later'

/** What a year of a busy shop took on the main PC: the program, its database and a week of backups. */
export const DISK_YEAR = 'about 0.5 GB'
export const rs = (n: number) => `Rs. ${n.toLocaleString('en-US')}`
