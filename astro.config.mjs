// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const site = process.env.SITE_URL ?? 'https://dominikfrackowiak.com';

// https://astro.build/config
export default defineConfig({
  site,

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pl']
  },
});
