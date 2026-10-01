// WCAG 2.2 AA-check met axe-core op mobiel en desktop. Draai met de dev-server aan: npm run a11y
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const pages = ['/', '/pedicure', '/manicure', '/aandoeningen', '/over-clarissa', '/certificering', '/contact', '/404'];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  for (const vp of [{ width: 375, height: 812 }, { width: 1280, height: 900 }]) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    // Zonder beweging: anders meet axe het contrast van onderdelen die nog half ingefaded zijn.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const p of pages) {
      await page.goto((process.env.BASE ?? 'http://localhost:4321') + p, { waitUntil: 'networkidle0' });
      await page.addScriptTag({ content: axe });
      const res = await page.evaluate(async () => {
        const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] });
        return r.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.length}x ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
      });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      console.log(vp.width, p, overflow ? 'HORIZONTAL OVERFLOW' : '', res.length ? '\n  ' + res.join('\n  ') : 'ok');
    }
    await page.close();
  }
} finally {
  await browser.close();
}
