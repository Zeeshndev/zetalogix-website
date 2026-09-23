import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://zetalogix.com', 
  output: 'server', 
  adapter: netlify(), 
  integrations: [
    sitemap() 
  ],
  vite: {
    plugins: [tailwindcss()],
  }
});