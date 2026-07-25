import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server', // Ensures API routes work
  adapter: netlify(), // Tells Astro to package the API for Netlify
  integrations: [tailwind()],
});