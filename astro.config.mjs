import { defineConfig } from 'astro/config';

// Alleen in dev: de browser moet een foto altijd opnieuw ophalen. Astro geeft /_image een cache van
// een jaar mee, en het adres verandert niet als een nieuwe uitsnede dezelfde afmetingen heeft. Dan
// blijf je na `npm run images` de oude foto zien. De gebouwde site heeft dit niet: daar zit een hash
// van de inhoud in de bestandsnaam.
const versefotos = {
  name: 'verse-fotos-in-dev',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/_image')) {
          const zet = res.setHeader.bind(res);
          res.setHeader = (naam, waarde) => zet(naam, naam.toLowerCase() === 'cache-control' ? 'no-store' : waarde);
        }
        next();
      });
    },
  },
};

// Zonder omgevingsvariabelen bouwt de site voor het eigen domein. De deploy-workflow naar GitHub Pages
// zet SITE en BASE_PATH, zodat de proefversie op deventually.github.io/clarissa werkt.
export default defineConfig({
  site: process.env.SITE ?? 'https://clarissa-bodyandstyle.nl',
  base: process.env.BASE_PATH ?? '/',
  // /pedicure in plaats van /pedicure/, zodat de oude adressen blijven werken
  build: { format: 'file' },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  integrations: [versefotos],
  // welke proefversie er gebouwd wordt (1 of 2), zie src/versie.ts
  vite: { define: { 'import.meta.env.VERSIE': JSON.stringify(process.env.VERSIE ?? '1') } },
  // dev- en preview-server luisteren op alle netwerkadressen, zodat je de site ook op je telefoon
  // of tablet in hetzelfde wifi-netwerk kunt openen (het adres staat bij het starten onder 'Network')
  server: { host: true, port: 4321 },
});
