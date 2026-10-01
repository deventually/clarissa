// Schermafbeeldingen van pagina's op mobiel en desktop. Gebruik: node tools/shots.mjs <uitmap> [pagina's...]
import puppeteer from 'puppeteer-core';
const [outDir, ...pages] = process.argv.slice(2);
const list = pages.length ? pages : ['/'];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  for (const [name, vp] of [['m', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { width: 1440, height: 900 }]]) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    // Op een hele-paginaopname scrollt er niets, dus de scroll-animaties zouden onderdelen onzichtbaar laten.
    if (process.env.FULL === '1') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const p of list) {
      await page.goto((process.env.BASE ?? 'http://localhost:4321') + p, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 2200));
      const file = `${outDir}/${name}${p.replace(/\//g, '_') || '_'}.png`;
      await page.screenshot({ path: file, fullPage: process.env.FULL === '1' });
      console.log(file);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
