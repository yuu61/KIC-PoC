import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// index.md がトップページ本文、それ以外の .md は詳細ページになる
const pages = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*'], base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
    order: z.number().default(0),
    repo: z.url().optional(),
    demo: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages };
