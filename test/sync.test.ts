import { describe, expect, it } from 'vitest'
import { convert, description, dropMentions, rewrite } from '../scripts/sync-lib'

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

describe('raw HTML images', () => {
  it('become Markdown images in one paragraph, so the site can optimise them', () => {
    const md = 'Top.\n\n<p>\n  <img src="../images/admin/dashboard.jpg" width="49%" alt="Light">\n  <img src="../images/admin/dashboard-dark.jpg" width="49%" alt="Dark">\n</p>\n\nEnd.'
    const r = rewrite(md, 'guide', known)
    expect(r.md).toBe('Top.\n\n![Light](../../assets/shots/admin/dashboard.jpg)\n![Dark](../../assets/shots/admin/dashboard-dark.jpg)\n\nEnd.')
    expect(r.images).toEqual(['admin/dashboard.jpg', 'admin/dashboard-dark.jpg'])
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
      '---\ntitle: "Stock"\nsummary: "Everything about what\'s on the shelf. More here."\ndescription: "Everything about what\'s on the shelf. More here."\n---\n\nEverything about **what\'s on** the shelf.\nMore here.\n\n## Products\n',
    )
  })
})

describe('convert: the search description', () => {
  it('refuses a page with no opening paragraph', () => {
    expect(() => convert('# People\n\n## Customers\n\nText.\n', 'guide', known)).toThrow(/opening paragraph/)
  })

  it('adds the next paragraphs to a short summary, cut at a sentence, at most 160 characters', () => {
    const long = 'Every sale is kept on the PC in your shop, and the till starts again in seconds. '.repeat(3)
    const d = description(`Repair jobs.\n\n![x](y.jpg)\n\n## Jobs\n\n${long}\n`)
    expect(d.startsWith('Repair jobs. Every sale is kept')).toBe(true)
    expect(d.length).toBeLessThanOrEqual(160)
    expect(d.endsWith('seconds.')).toBe(true)
  })

  it('leaves out where the admin page is', () => {
    expect(description('Repair jobs. The admin page is under Apps → Repairs.\n\nJobs move from drop-off to pickup.')).toBe('Repair jobs. Jobs move from drop-off to pickup.')
  })

  it('cuts at a word with an ellipsis when no sentence ends in time', () => {
    const d = description('word '.repeat(60))
    expect(d.length).toBeLessThanOrEqual(160)
    expect(d.endsWith('word…')).toBe(true)
  })
})

describe('convert keeps internal detail off the site', () => {
  it('drops admin addresses and the Shop Builder sentence', () => {
    const src = '# Repairs\n\nJobs.\n\nThe admin page is under **Apps → Repairs** (`/admin/x/repairs`). A shop has this plugin only if it was built with it (Install & Shop Builder).\n'
    expect(convert(src, 'plugin', known).md).toContain('The admin page is under **Apps → Repairs**.')
    expect(convert(src, 'plugin', known).md).not.toMatch(/admin\/x|Shop Builder/)
  })

  it('drops remote-access and technician update steps', () => {
    const src = '# Reports\n\nCharts.\n\nTo watch the shop from home, owners connect their phone to the shop PC over Tailscale. The suite\nitself stays on the shop\'s network.\n\nPlug one in later and run\n**Setup → Update** on that PC. On Windows, install the printer first.\n'
    const md = convert(src, 'guide', known).md
    expect(md).not.toMatch(/Tailscale|Setup → Update/)
    expect(md).toContain('On Windows, install the printer first.')
  })
})
