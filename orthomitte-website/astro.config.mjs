// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Offizielle Hauptdomain der Praxis (Canonical-URLs, Sitemap, strukturierte Daten).
export const SITE_URL = 'https://www.orthomitte.de';

export default defineConfig({
  site: SITE_URL,
  // Die alten Wix-URLs hatten keinen abschließenden Schrägstrich (/aerzte).
  // build.format "file" erzeugt aerzte.html, Cloudflare liefert sie unter /aerzte aus.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
