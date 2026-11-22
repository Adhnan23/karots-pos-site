// The phone tour: per shop kind, a sale as frames, then the screens an owner asks about.
// Shots are synced from the Suite (make tour-shots): src/assets/shots/tour/<kind>/<shot>.jpg.

export type Kind = 'pharmacy' | 'grocery' | 'phone' | 'hardware'
export type Card = { shot: string; title: string; caption: string }

/** The sale, frame by frame: the same story in every shop. */
export const SALE: { shot: string; caption: string }[] = [
  { shot: '01-sale-empty', caption: 'The cashier’s screen, ready for the next customer.' },
  { shot: '02-sale-scan', caption: 'Scan the first item. It goes straight into the sale.' },
  { shot: '03-sale-cart', caption: 'Scan the rest. The total adds up as you go.' },
  { shot: '04-sale-pay', caption: 'The customer pays cash. Tap the note they gave and the change shows at once.' },
  { shot: '05-sale-done', caption: 'Complete the sale. The change to give stays on the screen.' },
  { shot: '06-sale-receipt', caption: 'The receipt prints in the shop’s own style.' },
]

const common = (headline: Card): Card[] => [
  { shot: '07-products', title: 'Products', caption: 'Every product with its price, cost and how many are left, right on your phone.' },
  headline,
  { shot: '09-suppliers', title: 'Suppliers', caption: 'What you owe each supplier, and what they owe you.' },
  { shot: '10-reorder', title: 'Reorder', caption: 'What is running low, by supplier, ready to order.' },
  { shot: '11-low-stock', title: 'Stock on hand', caption: 'How much of everything is on the shelf, and what it is worth.' },
  { shot: '12-dashboard', title: 'Today at a glance', caption: 'Today’s sales and profit against the days before, on your phone.' },
]

const expiry = (caption: string): Card => ({ shot: '08-headline', title: 'Batches and expiry', caption })

export const TOUR: Record<Kind, { name: string; shop: string; cards: Card[] }> = {
  pharmacy: {
    name: 'Pharmacy', shop: 'CityCare Pharmacy',
    cards: common(expiry('Every batch keeps its own expiry date. The oldest sells first, and you see what is expiring before it does.')),
  },
  grocery: {
    name: 'Grocery & mini mart', shop: 'Sunrise Mini Mart',
    cards: common(expiry('Milk, bread and anything with a date: see what is close to expiry and act before it becomes a loss.')),
  },
  phone: {
    name: 'Mobile & repairs', shop: 'Galaxy Mobile & Repairs',
    cards: common({ shot: '08-headline', title: 'Repair jobs', caption: 'Every repair from drop-off to pickup: whose it is, what is wrong, when it is due and whether it is ready.' }),
  },
  hardware: {
    name: 'Hardware', shop: 'Lanka Build Hardware',
    cards: common({ shot: '08-headline', title: 'Clearance', caption: 'Slow and expiring stock marked down by rules you set, always keeping a safe margin.' }),
  },
}
