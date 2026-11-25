// Prices (user, 2026-11-22). The one place the site's figures live: the pricing page, the FAQ, JSON-LD and llms.txt read them.
export const PLANS = [
  { id: 'suite', name: 'Karots Suite', price: 100000 },
  { id: 'core', name: 'Core', price: 80000 },
]

/** The four ways to buy (user, 2026-11-22 and 2026-11-24). Karots Suite and Core are software only. */
export const TIERS = [
  { id: 'core', name: 'Core', price: 'Rs. 80,000', unit: 'one time', for: 'The till, stock, suppliers, money and reports. Software only, no plugins.' },
  { id: 'suite', name: 'Karots Suite', price: 'Rs. 100,000', unit: 'one time', for: 'Everything, with the plugins your kind of shop wants. Software only.', featured: true },
  { id: 'easy', name: 'Easy Pay', price: 'Rs. 50,000', unit: '+ the plan for 2 years (or Rs. 65,000 + 1 year)', for: 'Karots Suite for less up front. A combo, not a loan: no interest.' },
  { id: 'complete', name: 'Complete Shop', price: 'Rs. 190,000', unit: 'to 220,000 or more, quoted for your shop', from: true, for: 'Karots Suite with the PC and printers, done end to end.' },
] as const

/** The comparison: true = included, false = not, text = what it is. Columns follow TIERS. */
export const COMPARE: { what: string; cells: (string | boolean)[] }[] = [
  { what: 'You pay', cells: ['Rs. 80,000 once', 'Rs. 100,000 once', 'Rs. 50,000 + the plan for 2 years, or Rs. 65,000 + 1 year', 'Rs. 190,000 to 220,000 or more, once'] },
  { what: 'Till, stock, suppliers, money, reports', cells: [true, true, true, true] },
  { what: 'Plugins for your kind of shop', cells: [false, true, true, true] },
  { what: 'Karots Shelf app, for setting the shop up', cells: [false, true, true, true] },
  { what: 'Installation and training', cells: [true, true, true, true] },
  { what: 'Service plan included', cells: ['First 3 months', 'First 3 months', 'The whole 1 or 2 years', 'First 6 months'] },
  { what: 'Genuine bugs fixed free, always', cells: [true, true, true, true] },
  { what: 'PC, printers, scanner, cash drawer', cells: ['You bring them', 'You bring them', 'You bring them', 'We supply and set them up'] },
  { what: 'Hardware warranty from us', cells: [false, false, false, '6 months'] },
  { what: 'The licence is fully yours', cells: ['At once', 'At once', 'After the 1 or 2 years', 'At once'] },
]

/** Stopping Easy Pay early: the rest of the Karots Suite price. */
export const EASY_REST = { twoYears: 50000, oneYear: 35000 }

/** A Core shop moving up to Karots Suite pays the difference. */
export const CORE_TO_SUITE = 20000

/** Putting a shop's products in for it. */
export const PRODUCT_ENTRY = 10

export const SERVICE = {
  monthly: 5000,
  yearly: 60000,
  gets: ['Technical support and help', 'Major upgrades', 'Small changes made for your shop', 'Ongoing maintenance', 'Karots cloud backup of your shop', 'The Karots catalogue: 52,000+ real products to make yours from, kept up to date (Catalogue plugin)'],
}

/** Who pays for what (Shop Rules sections 1–5, 9). */
export const WHO_PAYS: { what: string; first: string; plan: string; none: string }[] = [
  { what: 'A genuine bug in Karots Suite', first: 'Free', plan: 'Free', none: 'Free, always' },
  { what: 'Support and help', first: 'Free', plan: 'Included', none: 'Charged by the hour' },
  { what: 'Major upgrades', first: 'Free', plan: 'Included', none: 'Not included' },
  { what: 'Small changes for your shop', first: 'Free', plan: 'Included', none: 'Quoted' },
  { what: 'Karots cloud backup', first: 'Included', plan: 'Included', none: 'Stops' },
  { what: 'The Karots catalogue (Catalogue plugin)', first: 'Included', plan: 'Included', none: 'Taken off your PC (products you made stay)' },
  { what: 'Moving to a new PC, or reinstalling', first: 'Free', plan: 'Free', none: 'Free' },
  { what: 'Large new features, custom work', first: 'Quoted', plan: 'Quoted', none: 'Quoted' },
  { what: 'Hardware faults', first: 'Yours (Complete Shop: ours for 6 months)', plan: 'Yours', none: 'Yours' },
  { what: 'Visits to the shop', first: 'By distance', plan: 'By distance', none: 'By distance' },
]

/** System requirements, as measured (the Suite's docs/guide/install.md, 2026-11-24). */
export const REQUIREMENTS: { what: string; min: string; rec: string }[] = [
  { what: 'Operating system', min: 'Windows 10 (64-bit), or a 64-bit Linux', rec: 'Windows 10 or 11 (64-bit), or Ubuntu / Xubuntu' },
  { what: 'Processor', min: 'Intel Core 2 Duo, or any 64-bit Intel or AMD with 2 cores', rec: 'Intel Core i3 2nd gen or newer, or AMD equal' },
  { what: 'Memory', min: '2 GB', rec: '4 GB or more' },
  { what: 'Storage', min: '5 GB free on a hard disk', rec: '20 GB free on an SSD' },
  { what: 'Screen', min: '1024 × 768', rec: '1366 × 768 or larger' },
  { what: 'Network', min: 'One PC alone: none. More devices (cashier PCs, phones, Karots Shelf): a wifi router or wired network in the shop', rec: 'A wifi router in the shop, the main PC on a cable to it, and internet now and then for updates and cloud backup' },
  { what: 'Receipt printer', min: 'Optional', rec: 'An 80 mm thermal receipt printer on USB (tested: Xprinter XP-80T)' },
  { what: 'Power', min: 'A normal socket (a power cut loses no finished sale)', rec: 'A UPS, to keep selling through a power cut' },
]

/** A cashier PC only shows the till in a browser from the main PC. */
export const CASHIER_PC = 'Any PC with Windows 10 or 11 or Linux, 2 GB memory, a 1024 × 768 screen and Chrome, Edge or Firefox from 2023 or later, on the same wifi or wired network as the main PC'

/** What a year of a busy shop took on the main PC: the program, its database and a week of backups. */
export const DISK_YEAR = 'about 0.5 GB'
export const rs = (n: number) => `Rs. ${n.toLocaleString('en-US')}`
