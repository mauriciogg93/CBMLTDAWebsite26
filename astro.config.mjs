// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

import { SITE } from './src/site.config';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: 'static',
  // This combo behaves the same on Cloudflare Workers (auto-trailing-slash)
  // and on Apache/LiteSpeed shared hosting. Never change one without the other.
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), icon()],
});
