<?xml version="1.0" encoding="UTF-8"?>
<!-- Shows the sitemap as a page in a browser; search engines read the XML underneath. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap — Karots Suite</title>
        <style>
          :root { color-scheme: light dark; --bg: #faf7f2; --ink: #16171b; --mute: #6b6b6b; --line: #e6e0d6; --link: #b4530a }
          @media (prefers-color-scheme: dark) { :root { --bg: #16171b; --ink: #f1ede6; --mute: #a39e96; --line: #2c2d33; --link: #f2a23a } }
          body { margin: 0; padding: 2rem 1rem; background-color: var(--bg); color: var(--ink); font: 15px/1.5 system-ui, sans-serif }
          main { max-width: 52rem; margin: 0 auto }
          h1 { font-size: 1.5rem; margin: 0 0 0.25rem }
          p { color: var(--mute); margin: 0 0 1.5rem }
          table { width: 100%; border-collapse: collapse }
          th, td { text-align: left; padding: 0.5rem 0.25rem; border-bottom: 1px solid var(--line) }
          th { color: var(--mute); font-weight: 500 }
          td:last-child { white-space: nowrap; color: var(--mute) }
          a { color: var(--link); word-break: break-all }
        </style>
      </head>
      <body>
        <main>
          <h1>Karots Suite sitemap</h1>
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <p>The site's page lists.</p>
              <table><tr><th>List</th></tr>
                <xsl:for-each select="s:sitemapindex/s:sitemap">
                  <tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td></tr>
                </xsl:for-each>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <p><xsl:value-of select="count(s:urlset/s:url)"/> pages, as search engines see them.</p>
              <table><tr><th>Page</th><th>Last changed</th></tr>
                <xsl:for-each select="s:urlset/s:url">
                  <tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td><td><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td></tr>
                </xsl:for-each>
              </table>
            </xsl:otherwise>
          </xsl:choose>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
