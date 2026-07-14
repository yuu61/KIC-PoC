import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*'], base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products };
