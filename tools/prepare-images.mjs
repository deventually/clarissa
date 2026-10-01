// Snijdt de foto's van de oude site bij tot de uitsneden die de nieuwe site gebruikt.
// Bronbestanden staan in /bron, resultaten in /src/assets. Draai met: npm run images
import sharp from 'sharp';

const src = (f) => new URL(`../bron/${f}`, import.meta.url).pathname;
const out = (f) => new URL(`../src/assets/${f}`, import.meta.url).pathname;

const jobs = [
  // de roze behandelstoel, staand, voor de hero-nagel
  ['werkkamer.jpg', 'stoel.jpg', { left: 200, top: 150, width: 740, height: 920 }, { brightness: 1.12, saturation: 1.12 }],
  // gelakte nagels, voor de manicure-tip
  ['manicure.jpg', 'manicure-tip.jpg', { left: 395, top: 0, width: 205, height: 259 }],
  ['manicure.jpg', 'manicure-band.jpg'],
  ['pedicure-tile.jpg', 'pedicure-tip.jpg', { left: 64, top: 0, width: 150, height: 185 }],
  // de muur met certificaten, staand uitgesneden voor de tip
  ['certificaten.jpg', 'certificaten-tip.jpg', { left: 190, top: 40, width: 330, height: 420 }, { brightness: 1.15 }],
  ['certificaten.jpg', 'certificaten.jpg', null, { brightness: 1.15 }],
  // rieten stoel in de wachtkamer
  ['wachtkamer.jpg', 'wachtkamer-tip.jpg', { left: 150, top: 400, width: 520, height: 660 }, { brightness: 1.2, saturation: 1.05 }],
  ['wachtkamer.jpg', 'wachtkamer.jpg', null, { brightness: 1.2 }],
  ['werkkamer.jpg', 'werkkamer.jpg', null, { brightness: 1.1, saturation: 1.1 }],
  ['hielkloven.jpg', 'hielkloven.jpg'],
  ['likdoorns.jpg', 'likdoorns.jpg'],
  ['nagelbeugel.jpg', 'ingroeiende-teennagel.jpg'],
];

for (const [from, to, crop, mod] of jobs) {
  let img = sharp(src(from));
  if (crop) img = img.extract(crop);
  if (mod) img = img.modulate(mod);
  await img.jpeg({ quality: 88, mozjpeg: true }).toFile(out(to));
  console.log('✓', to);
}
