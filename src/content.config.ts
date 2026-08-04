// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // NEW: Import the glob loader

const blogCollection = defineCollection({
  // NEW: Explicitly tell Astro where to look for the markdown files
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  'blog': blogCollection,
};