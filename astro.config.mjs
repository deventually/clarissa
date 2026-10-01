import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://clarissa-bodyandstyle.nl',
  // /pedicure in plaats van /pedicure/, zodat de oude adressen blijven werken
  build: { format: 'file' },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  // dev- en preview-server luisteren op alle netwerkadressen, zodat je de site ook op je telefoon
  // of tablet in hetzelfde wifi-netwerk kunt openen (het adres staat bij het starten onder 'Network')
  server: { host: true, port: 4321 },
});
