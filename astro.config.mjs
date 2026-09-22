import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap'; // 1. Imported the sitemap

export default defineConfig({
  site: 'https://zetalogix.com', // 2. Added domain for the sitemap and canonical URLs
  output: 'server', // Ensures API routes work
  adapter: netlify(), // Tells Astro to package the API for Netlify
  integrations: [
    tailwind(),
    sitemap() // 3. Registered the sitemap integration
  ],
});