// The areas the Features pages cover: copy from the Suite's README and guides, in an owner's words.
export type Feature = { area: string; short: string; demos?: ('lots' | 'packs' | 'pay' | 'credit')[]; title: string; summary: string; shot: string; alt: string; guide: string; points: string[]; more?: { shot: string; alt: string }[] }

export const FEATURES: Feature[] = [
  {
    area: 'till', short: 'the till', demos: ['pay'], title: 'Sell fast at the counter', guide: 'till',
    summary: 'Scan, search or tap a product. Discounts, split payments, credit, holds and returns, and the till never stops a sale.',
    shot: 'till/sell-light.jpg', alt: 'The till: products on the left, the sale in the middle, payment on the right',
    points: [
      'Works with a scanner and the keyboard alone: every button has a key.',
      'Cash, card, mobile money, cheque, credit or a mix, with the change worked out for you.',
      'A sales person can prepare the bill and send it to the cashier.',
      'Hold a sale, serve the next customer, and pick it up again.',
      'Returns and exchanges from the receipt, with the money and stock put right.',
      'Each screen size gets its own layout, so a small monitor still works.',
    ],
    more: [{ shot: 'till/returns.jpg', alt: 'A return from the receipt, line by line' }, { shot: 'till/tickets.jpg', alt: 'Tickets a sales person sent to the cashier' }, { shot: 'till/credit.jpg', alt: 'Taking a payment on a customer’s credit' }, { shot: 'till/sell-dark.jpg', alt: 'The till in dark mode' }],
  },
  {
    area: 'stock', short: 'stock and expiry', demos: ['lots', 'packs'], title: 'Know your stock', guide: 'stock',
    summary: 'Batches and expiry, packs sold whole or loose, stock-take, intake by scan, and reorder levels it learns on its own.',
    shot: 'stock/batches.jpg', alt: 'Batches with their expiry dates, the ones close to expiry marked',
    points: [
      'Every batch keeps its own expiry date, and the oldest sells first.',
      'Warnings before stock expires, and returns to the supplier when it does.',
      'A card of 10 sells whole or loose; stock is kept in single tablets.',
      'Stock-take on a phone or PC, counted shelf by shelf.',
      'Reorder levels worked out from what you actually sell.',
    ],
    more: [{ shot: 'stock/products.jpg', alt: 'The products list' }, { shot: 'stock/intake.jpg', alt: 'Intake: stock coming in by scan' }, { shot: 'stock/stock-take.jpg', alt: 'A stock-take, counted shelf by shelf' }, { shot: 'stock/categories.jpg', alt: 'Categories' }],
  },
  {
    area: 'purchasing', short: 'suppliers', title: 'Buy from suppliers', guide: 'purchasing',
    summary: 'Purchase orders, receiving with a GRN, supplier credit and returns, and a reorder list that turns into orders.',
    shot: 'purchasing/suppliers.jpg', alt: 'Suppliers with what the shop owes each one',
    points: [
      'A reorder list of what is running low, by supplier, ready to send.',
      'Receive a delivery by scanning it, and print the GRN.',
      'What you owe each supplier, paid by cash, bank or cheque.',
      'Damaged or expired goods go back to the supplier for money or credit.',
    ],
    more: [{ shot: 'purchasing/reorder.jpg', alt: 'The reorder list, by supplier' }, { shot: 'purchasing/purchases.jpg', alt: 'Purchases and deliveries' }, { shot: 'purchasing/returns.jpg', alt: 'Goods sent back to a supplier' }],
  },
  {
    area: 'money', short: 'money', demos: ['credit'], title: 'Follow every rupee', guide: 'money',
    summary: 'Till sessions with counted cash, lockers, cheques, expenses and a cash flow page that adds it all up.',
    shot: 'money/cashflow.jpg', alt: 'Cash flow: money in and out of every locker',
    points: [
      'Open and close the till with counted cash; any difference is shown, never hidden.',
      'Lockers for the safe, the bank and the card machine, with every move between them.',
      'Cheques taken and written, cleared or bounced.',
      'Customer credit with limits, statements and payments.',
    ],
    more: [{ shot: 'money/tills.jpg', alt: 'Till sessions with counted cash' }, { shot: 'money/lockers.jpg', alt: 'Lockers: the safe, the bank, the card machine' }, { shot: 'money/cheques.jpg', alt: 'Cheques taken and written' }, { shot: 'money/finance.jpg', alt: 'Finance: profit and loss' }],
  },
  {
    area: 'reports', short: 'reports', title: 'See how the shop is doing', guide: 'reports',
    summary: 'A live dashboard and 19 reports, all on a phone too, all exportable to Excel.',
    shot: 'reports/sales.jpg', alt: 'The sales report with a chart by day',
    points: [
      "Today's sales, profit and the busiest hours at a glance.",
      'Top products, profit by category, stock value, and what you owe and are owed.',
      'Every report works on a phone and exports to Excel.',
    ],
    more: [{ shot: 'reports/top-products.jpg', alt: 'Top products' }, { shot: 'reports/profit-by-category.jpg', alt: 'Profit by category' }, { shot: 'reports/peak-hours.jpg', alt: 'The busiest hours of the week' }, { shot: 'reports/index.jpg', alt: 'Every report in one place' }],
  },
  {
    area: 'people', short: 'staff and customers', title: 'Staff and customers', guide: 'people',
    summary: 'Logins with a phone number and PIN, roles and rights, credit customers and who did what.',
    shot: 'people/customers.jpg', alt: 'Customers with their credit balances',
    points: [
      'Each person signs in with their own phone number and PIN.',
      'Choose what each cashier may do: credit, cost prices, low stock, counter work.',
      'The till locks itself when nobody is using it.',
      'Every change is kept: who did it and when.',
    ],
    more: [{ shot: 'people/users.jpg', alt: 'Staff logins and what each may do' }, { shot: 'people/activity.jpg', alt: 'Activity: who did what, and when' }],
  },
  {
    area: 'printing', short: 'receipts and labels', title: 'Receipts and labels', guide: 'printing',
    summary: 'Receipts printed as pictures in your shop’s style, with your shop’s name in Sinhala or Tamil, and price labels.',
    shot: 'printing/receipt-styles.jpg', alt: 'The receipt styles side by side',
    points: [
      'Eleven receipt styles, printed on ordinary 80 mm or 58 mm printers.',
      'Barcode and price labels for the shelf.',
      'Ask before printing, or print straight away: your choice.',
    ],
    more: [{ shot: 'printing/labels.jpg', alt: 'Printing price and barcode labels' }, { shot: 'printing/label-styles.jpg', alt: 'Label styles' }],
  },
]

/** The shop kinds the tour covers, in the order the tiles show. */
export const KINDS = [
  { kind: 'pharmacy', name: 'Pharmacy', line: 'Batches, expiry and prescriptions' },
  { kind: 'grocery', name: 'Grocery & mini mart', line: 'Fast scanning, packs and credit' },
  { kind: 'phone', name: 'Mobile & repairs', line: 'Repair jobs, reloads and bills' },
  { kind: 'hardware', name: 'Hardware', line: 'Clearance, customer requests, sold by the metre' },
]
