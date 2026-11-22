// Structured data (schema.org) for search engines.
import { CONTACT } from '../data/site'
import { PLANS } from '../data/pricing'

export function organization(site: URL) {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'Karots', url: site.href,
    logo: new URL('/icons/icon-512.png', site).href,
    contactPoint: { '@type': 'ContactPoint', telephone: CONTACT.phone, contactType: 'sales', areaServed: 'LK', availableLanguage: 'English' },
  }
}

export function softwareApplication(site: URL) {
  return {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Karots Suite', url: site.href,
    applicationCategory: 'BusinessApplication', operatingSystem: 'Windows, Linux',
    description: 'Till, stock and expiry, suppliers, money and reports for a small Sri Lankan shop, in one program that works without the internet.',
    publisher: { '@type': 'Organization', name: 'Karots' },
    offers: PLANS.map((p) => ({ '@type': 'Offer', name: p.name, price: String(p.price), priceCurrency: 'LKR', url: new URL('/pricing/', site).href })),
  }
}

export function breadcrumbs(site: URL, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: new URL(it.path, site).href })),
  }
}

export function faq(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}
