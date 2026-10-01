import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://clarissa-bodyandstyle.nl',
  // /pedicure in plaats van /pedicure/, zodat de oude adressen blijven werken
  build: { format: 'file' },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
});
