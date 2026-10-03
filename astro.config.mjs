import { defineConfig } from 'astro/config';

// Zonder omgevingsvariabelen bouwt de site voor het eigen domein. De deploy-workflow naar GitHub Pages
// zet SITE en BASE_PATH, zodat de proefversie op deventually.github.io/clarissa werkt.
export default defineConfig({
  site: process.env.SITE ?? 'https://clarissa-bodyandstyle.nl',
  base: process.env.BASE_PATH ?? '/',
  // /pedicure in plaats van /pedicure/, zodat de oude adressen blijven werken
  build: { format: 'file' },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  // welke proefversie er gebouwd wordt (1 of 2), zie src/versie.ts
  vite: { define: { 'import.meta.env.VERSIE': JSON.stringify(process.env.VERSIE ?? '1') } },
  // dev- en preview-server luisteren op alle netwerkadressen, zodat je de site ook op je telefoon
  // of tablet in hetzelfde wifi-netwerk kunt openen (het adres staat bij het starten onder 'Network')
  server: { host: true, port: 4321 },
});
