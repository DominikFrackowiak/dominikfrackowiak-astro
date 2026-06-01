// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Import Zod
import { z } from 'astro/zod';

// 4. Define a `loader` and `schema` for each collection
const projects = defineCollection({
 loader: glob({
  base: './src/content/projects',
  pattern: '**/*.{md,mdx}',
  generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '')
 }),
 schema: z.object({
  title: z.string(),
  subtitle: z.string(),
  lang: z.enum(['en', 'es', 'pl']),
  url: z.string().optional(),
  key: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  slug: z.string(),
  image: z.array(z.string()),
  tags: z.array(z.string())
 }),
});


const blog = defineCollection({
 loader: glob({
  base: './src/content/blog',
  pattern: '**/*.{md,mdx}',
  generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '')
 }),
 schema: z.object({
  title: z.string(),
  lang: z.enum(['en', 'es', 'pl']),
  url: z.string().optional(),
  key: z.string(),
  description: z.string(),
  slug: z.string(),
  image: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
 }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { projects, blog };
