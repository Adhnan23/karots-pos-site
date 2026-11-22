import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const page = z.object({ title: z.string(), summary: z.string() })

export const collections = {
  guides: defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/guides' }), schema: page }),
  plugins: defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/plugins' }), schema: page }),
}
