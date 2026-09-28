import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zetalogix.com',
  output: 'server', // Ensures API routes work
  adapter: netlify(), // Tells Astro to package the API for Netlify
  integrations: [
    tailwind(), // Preserves your original Tailwind v3 design
    sitemap()   // Automatically generates sitemap-index.xml on build
  ],
});