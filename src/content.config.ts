import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    date: z.coerce.date(),
    // Only allow https:// links, so a typo or a pasted javascript: URL can't end up on the site.
    demo: z.string().regex(/^https:\/\//, 'must start with https://').optional(),
    github: z.string().regex(/^https:\/\//, 'must start with https://').optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };