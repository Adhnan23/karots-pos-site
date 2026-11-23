import type { APIRoute } from 'astro'

// Every page is open to search engines except the offline fallback (noindex; not in the sitemap).
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /offline/\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  )
