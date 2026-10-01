// Maakt de kaart van de omgeving voor de contactpagina: src/assets/kaart.jpg. Draai met: npm run map
//
// Een vaste afbeelding in plaats van een ingesloten Google-kaart: geen cookies van derden (dus geen
// cookiemelding nodig), snel, en in de kleuren van de site. Wie de kaart aanklikt, opent Google Maps.
//
// De tegels komen van OpenStreetMap (© OpenStreetMap-bijdragers, ODbL). Die bronvermelding moet bij
// de kaart blijven staan. Dit script haalt zo'n 35 tegels één keer op; draai het niet in een build-stap.
import sharp from 'sharp';

// Clarissa Body & Style volgens OpenStreetMap (Nominatim)
export const pin = { lat: 52.0763342, lon: 4.2636725 };
const zoom = 17;
const W = 1600;
const H = 1000;
const TILE = 256;

const n = 2 ** zoom;
const px = ((pin.lon + 180) / 360) * n * TILE;
const latRad = (pin.lat * Math.PI) / 180;
const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * TILE;

// linksboven van de uitsnede, zo dat de salon precies in het midden staat
const left = Math.round(px - W / 2);
const top = Math.round(py - H / 2);
const tx0 = Math.floor(left / TILE);
const ty0 = Math.floor(top / TILE);
const tx1 = Math.floor((left + W - 1) / TILE);
const ty1 = Math.floor((top + H - 1) / TILE);

const tiles = [];
for (let ty = ty0; ty <= ty1; ty++) {
  for (let tx = tx0; tx <= tx1; tx++) {
    const res = await fetch(`https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`, {
      headers: { 'User-Agent': 'clarissa-bodyandstyle.nl kaart (eenmalig, tools/make-map.mjs)' },
    });
    if (!res.ok) throw new Error(`tegel ${tx},${ty}: ${res.status}`);
    tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: (tx - tx0) * TILE, top: (ty - ty0) * TILE });
  }
}

const mosaic = await sharp({
  create: { width: (tx1 - tx0 + 1) * TILE, height: (ty1 - ty0 + 1) * TILE, channels: 3, background: '#fff' },
})
  .composite(tiles)
  .png()
  .toBuffer();

// In de kleuren van de site: wegen worden parel, huizenblokken blos, tekst en spoor pruim. Zo past de kaart bij de rest en valt de fuchsia speld op.
const { data, info } = await sharp(mosaic)
  .extract({ left: left - tx0 * TILE, top: top - ty0 * TILE, width: W, height: H })
  .grayscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
// grijswaarde (0–1) → kleur. De OSM-ondergrond is lichtgrijs, huizenblokken wat donkerder, tekst donker.
const stops = [
  [0.15, [74, 24, 66]], // tekst en spoor: pruim
  [0.5, [168, 100, 143]], // iconen: orchidee
  [0.84, [242, 222, 232]], // huizenblokken: blos
  [0.94, [250, 240, 245]], // ondergrond: parelroze
  [1, [255, 251, 253]], // wegen: parel
];
const kleur = (v) => {
  if (v <= stops[0][0]) return stops[0][1];
  for (let s = 1; s < stops.length; s++) {
    const [v1, c1] = stops[s];
    const [v0, c0] = stops[s - 1];
    if (v <= v1) return c0.map((c, k) => c + ((c1[k] - c) * (v - v0)) / (v1 - v0));
  }
  return stops.at(-1)[1];
};
const out = Buffer.alloc(info.width * info.height * 3);
for (let i = 0; i < info.width * info.height; i++) {
  const c = kleur(data[i] / 255);
  out[i * 3] = c[0];
  out[i * 3 + 1] = c[1];
  out[i * 3 + 2] = c[2];
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(new URL('../src/assets/kaart.jpg', import.meta.url).pathname);

console.log('✓ kaart.jpg', W, 'x', H, 'zoom', zoom);
