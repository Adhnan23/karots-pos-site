// Prices (user, 2026-11-22). The one place the site's figures live: the pricing page, the FAQ, JSON-LD and llms.txt read them.
export const PLANS = [
  {
    id: 'suite', name: 'Karots Suite', price: 100000, featured: true,
    line: 'Everything, with the plugins your shop wants.',
    without: 'Software only: you bring the PC and printers.',
    gets: ['Everything in Core', 'The plugins your kind of shop wants', 'Karots Shelf, the app your staff use to put products in'],
  },
  {
    id: 'core', name: 'Core', price: 80000, featured: false,
    line: 'The whole shop system, without plugins.',
    gets: ['The till, stock and expiry, suppliers, money, reports, staff and printing'],
    without: 'Software only, with no plugins and no Karots Shelf app.',
  },
]

/** A combo, not credit (user, 2026-11-24): Karots Suite at a lower price with 2 years of the service plan; no interest. */
export const EASY_PAY = {
  name: 'Easy Pay',
  options: [
    { months: 24, start: 50000, total: 170000, rest: 50000 },
    { months: 12, start: 65000, total: 125000, rest: 35000 },
  ],
  line: 'A combo: Karots Suite for less, with the service plan for 1 or 2 years. No interest and no loan: each month pays for the service you get that month.',
  gets: [
    'Everything in Karots Suite',
    'The service plan for the whole time: support, upgrades, small changes and cloud backup',
    'Rs. 5,000 a month or Rs. 60,000 a year',
    'After that the licence is fully yours; keep the plan if you like',
    'Genuine bugs fixed free, always',
  ],
  note: 'Stopping early? Pay the rest of the Karots Suite price (Rs. 50,000 on 2 years, Rs. 35,000 on 1 year) and it’s yours, or the licence ends after written notice. Your data always stays yours.',
}

/** Karots Suite with the hardware (user, 2026-11-24): quoted per shop, the price moves with the hardware chosen. */
export const COMPLETE = {
  name: 'Complete Shop', from: 190000, to: 220000,
  line: 'Karots Suite with the hardware, done end to end: we buy it, set it all up at your shop and hand it over ready to sell.',
  gets: [
    'Everything in Karots Suite',
    'A PC set up for your shop',
    'Receipt and label printing: one 2-in-1 printer, or two separate printers',
    'A barcode scanner and a cash drawer, if you want them',
    'Installation and training for you and your staff',
    '6 months of everything the service plan gives, free',
    '6 months’ warranty on the hardware we supply: if it breaks, we sort it out',
  ],
  note: 'The price depends on what you choose: the PC, one printer or two, a scanner, a cash drawer. Extra cashier PCs and other hardware add to it. We quote your shop before anything is bought. Putting your products in is extra, at the same Rs. 10 a product.',
}

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
  { what: 'Network', min: 'None for one PC. Cashier PCs and phones: the shop’s wired network or wifi', rec: 'The same, plus internet now and then for updates and cloud backup' },
  { what: 'Receipt printer', min: 'Optional', rec: 'An 80 mm thermal receipt printer on USB (tested: Xprinter XP-80T)' },
  { what: 'Power', min: 'A normal socket (a power cut loses no finished sale)', rec: 'A UPS, to keep selling through a power cut' },
]

/** A cashier PC only shows the till in a browser from the main PC. */
export const CASHIER_PC = 'Any PC with Windows 10 or 11 or Linux, 2 GB memory, a 1024 × 768 screen and Chrome, Edge or Firefox from 2023 or later'

/** What a year of a busy shop took on the main PC: the program, its database and a week of backups. */
export const DISK_YEAR = 'about 0.5 GB'
export const rs = (n: number) => `Rs. ${n.toLocaleString('en-US')}`
