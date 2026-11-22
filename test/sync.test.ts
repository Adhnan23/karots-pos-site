import { describe, expect, it } from 'vitest'
import { convert, dropMentions, rewrite } from '../scripts/sync-lib'

const known = new Set(['guide:till', 'guide:stock', 'plugin:repairs', 'plugin:pharmacy'])

describe('rewrite', () => {
  it('points a guide image at the synced shots and lists it', () => {
    const r = rewrite('![Pick](../images/demo/picker.jpg)', 'guide', known)
    expect(r.md).toBe('![Pick](../../assets/shots/demo/picker.jpg)')
    expect(r.images).toEqual(['demo/picker.jpg'])
  })

  it('points a plugin image (two levels up) at the synced shots', () => {
    const r = rewrite('![Pharmacy](../../images/plugins/pharmacy.jpg)', 'plugin', known)
    expect(r.md).toBe('![Pharmacy](../../assets/shots/plugins/pharmacy.jpg)')
    expect(r.images).toEqual(['plugins/pharmacy.jpg'])
  })

  it('turns a guide link into a site URL, keeping the anchor', () => {
    expect(rewrite('[Stock](stock.md#batches)', 'guide', known).md).toBe('[Stock](/guides/stock/#batches)')
  })

  it('turns guide → plugin and plugin → guide links into site URLs', () => {
    expect(rewrite('[Repairs](plugins/repairs.md)', 'guide', known).md).toBe('[Repairs](/plugins/repairs/)')
    expect(rewrite('[Till](../till.md)', 'plugin', known).md).toBe('[Till](/guides/till/)')
    expect(rewrite('[Pharmacy](pharmacy.md)', 'plugin', known).md).toBe('[Pharmacy](/plugins/pharmacy/)')
  })

  it('keeps only the text of a link to a page that is not on the site', () => {
    expect(rewrite('See [Install](install.md) first.', 'guide', known).md).toBe('See Install first.')
    expect(rewrite('[Pocket Cashier](pocketcashier.md)', 'plugin', known).md).toBe('Pocket Cashier')
  })

  it('leaves outside links alone', () => {
    expect(rewrite('[web](https://karots.lk)', 'guide', known).md).toBe('[web](https://karots.lk)')
  })
})

describe('dropMentions', () => {
  it('drops only the sentences that name it, across wrapped lines', () => {
    const md = 'Tickets keep waiting. Tickets need the main PC, and a sales person can\'t sign in to Pocket Cashier: in a\npower cut, one cashier sells. A cashier on [Pocket Cashier](x.md) can open tickets.\n\nNext paragraph.'
    expect(dropMentions(md, 'Pocket Cashier')).toBe('Tickets keep waiting.\n\nNext paragraph.')
  })

  it('drops a list item left empty', () => {
    expect(dropMentions('- One.\n- On Pocket Cashier too.\n- Three.', 'Pocket Cashier')).toBe('- One.\n- Three.')
  })

  it('leaves text without the word unchanged', () => {
    expect(dropMentions('# Title\n\n- a\n- b\n', 'Pocket Cashier')).toBe('# Title\n\n- a\n- b\n')
  })
})

describe('convert', () => {
  it('moves the first heading and paragraph into frontmatter and drops the heading', () => {
    const out = convert('# Stock\n\nEverything about **what\'s on** the [shelf](x.md).\nMore here.\n\n## Products\n', 'guide', known)
    expect(out.md).toBe(
      '---\ntitle: "Stock"\nsummary: "Everything about what\'s on the shelf. More here."\n---\n\nEverything about **what\'s on** the shelf.\nMore here.\n\n## Products\n',
    )
  })
})
