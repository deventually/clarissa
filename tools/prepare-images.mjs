// Snijdt de foto's van de oude site bij tot de uitsneden die de nieuwe site gebruikt.
// Bronbestanden staan in /bron, resultaten in /src/assets. Draai met: npm run images
//
// De kleine foto's van de oude site (150 tot 720 px breed) zijn te klein voor de nageltips op een
// retinascherm. Daarom staan in /bron/hd 4x opgeschaalde versies, gemaakt met Real-ESRGAN
// (model realesrgan-x4plus, realesrgan-ncnn-vulkan v0.2.5.0):
//   realesrgan-ncnn-vulkan -i bron/<naam>.jpg -o <naam>.png -n realesrgan-x4plus
// Uitsneden uit /bron/hd zijn dus in pixels van het opgeschaalde beeld (4x het origineel).
// werkkamer-stoel.jpg en wachtkamer-stoel.jpg zijn al uitgesneden (werkkamer.jpg 200,150 740x920 en
// wachtkamer.jpg 150,400 520x660), opgeschaald en daarna op 2x verkleind.
//
// Uitzondering: hd/certificaten.jpg is opgeschaald met EDSR (OpenCV dnn_superres, EDSR_x4). Real-ESRGAN
// verzint letters op de diploma's ("Certificoat"); EDSR is zachter maar blijft bij wat er staat.
import sharp from 'sharp';

const src = (f) => new URL(`../bron/${f}`, import.meta.url).pathname;
const out = (f) => new URL(`../src/assets/${f}`, import.meta.url).pathname;

// Huisstijl, zodat alle foto's bij elkaar horen (de bronnen lopen sterk uiteen: lamplicht van
// oranje tot geel, een koele stockfoto, een grijze certificatenmuur met donkere hoeken):
// 1. foto's met een witte muur (behalve de wachtkamer, zie wachtkamerLook): witbalans, gemeten op een stuk van die muur, naar één warm wit
//    (WIT); daarna licht, met normalise en waar nodig lichtere middentonen (gamma onder 1);
// 2. de certificatenmuur eerst egaal (de hoeken zijn tot 40% donkerder dan het midden) en met een
//    eigen zwart- en witpunt, zodat de muur net zo licht wordt als in de andere foto's maar de tekst
//    op de diploma's donker blijft;
// 3. alle foto's: dezelfde zachte afwerking, met iets opgetilde schaduwen, iets minder contrast en
//    iets minder verzadiging. Rustiger en chiquer dan de felle originelen.
// De muurregio's staan in pixels van de oorspronkelijke foto (/bron, niet /bron/hd).
const WIT = [1, 0.955, 0.93];
const muur = {
  werkkamer: { bestand: 'werkkamer.jpg', regio: { left: 240, top: 400, width: 130, height: 120 } },
  certificaten: { bestand: 'certificaten.jpg', regio: { left: 153, top: 90, width: 54, height: 180 } },
};
// let op: stats() negeert extract() in dezelfde pijplijn en meet dan de hele foto
const gemiddelde = async (bestand, regio) => {
  const stuk = await sharp(bestand).extract(regio).toBuffer();
  const { channels } = await sharp(stuk).stats();
  return channels.slice(0, 3).map((c) => c.mean);
};
const witbalans = {};
for (const [naam, { bestand, regio }] of Object.entries(muur)) {
  const gem = await gemiddelde(src(bestand), regio);
  const winst = gem.map((m, i) => (WIT[i] * gem[0]) / m);
  // alleen kanalen terugschroeven (niets boven 255 laten uitlopen); daarna wordt het licht gemaakt
  const max = Math.max(...winst);
  witbalans[naam] = winst.map((w) => w / max);
}
// voor foto's zonder witte muur: alleen iets warmer
const warmer = [1, 0.985, 0.95];
// De wachtkamer wordt niet naar WIT gezet: zonder het lamplicht bleven er alleen een grijze bank,
// grijze muren en zwarte beelden over, en oogde hij grauw en oud. Daarom op het oog: een deel van
// het geel eruit (blauw omhoog), met een warme, licht perzikkleurige gloed en meer kleur.
const wachtkamerLook = { wit: [1, 0.99, 1.25], helder: true, gamma: 0.85, verzadiging: 1.12 };

// tussen elke stap een ruwe buffer: sharp voert bewerkingen binnen één pijplijn in een vaste
// volgorde uit, niet in de volgorde van aanroepen
const stap = async (img, bewerk) => {
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return bewerk(sharp(data, { raw: info }));
};
// middentonen lichter (gamma < 1) zonder de hoge lichten te laten uitlopen
const gamma = async (img, g) => {
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const lut = Uint8Array.from({ length: 256 }, (_, v) => Math.round(255 * (v / 255) ** g));
  for (let i = 0; i < data.length; i++) data[i] = lut[data[i]];
  return sharp(data, { raw: info });
};
const kanalen = (w) => [
  [w[0], 0, 0],
  [0, w[1], 0],
  [0, 0, w[2]],
];
// donkere hoeken ophalen: een wit verloop dat in het midden doorzichtig is, over de foto 'gescreend'
// het midden van het verloop ligt rechtsonder: de certificatenfoto is linksboven het donkerst
const egaal = async (img, sterkte) => {
  const buf = await img.png().toBuffer();
  const { width, height } = await sharp(buf).metadata();
  const verloop = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="g" cx="0.62" cy="0.6" r="0.75"><stop offset="0.25" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="${sterkte}"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  return sharp(await sharp(buf).composite([{ input: verloop, blend: 'screen' }]).png().toBuffer());
};

// het egaal maken (wit gescreend) maakt de muur ook wat koeler; een tikje warmer brengt hem bij de rest
const certificatenLook = {
  egaal: 0.4,
  wit: witbalans.certificaten.map((w, i) => w * [1, 0.98, 0.955][i]),
  niveaus: [14, 150],
};

const jobs = [
  // de roze behandelstoel, staand, voor de hero-nagel
  ['hd/werkkamer-stoel.jpg', 'stoel.jpg', { wit: witbalans.werkkamer, helder: true }],
  // gelakte nagels, voor de manicure-tip
  ['hd/manicure.jpg', 'manicure-tip.jpg', { crop: { left: 1580, top: 0, width: 820, height: 1036 } }],
  ['hd/manicure.jpg', 'manicure-band.jpg'],
  // voeten met roze teennagels en een orchidee, voor de pedicure-tip
  ['hd/pedicure-tile.jpg', 'pedicure-tip.jpg', { crop: { left: 256, top: 0, width: 600, height: 740 } }],
  // handen in roze handschoenen verzorgen een voet, voor de tip Voetklachten.
  // Foto: Rune Enstad via Unsplash (Unsplash-licentie, vrij te gebruiken),
  // https://unsplash.com/photos/W0_shKarGCk, gedownload op 2400 px breed.
  ['voetverzorging-unsplash.jpg', 'voetklachten-tip.jpg', { crop: { left: 780, top: 0, width: 1200, height: 1600 }, wit: warmer }],
  // de muur met certificaten, staand uitgesneden voor de tip
  ['hd/certificaten.jpg', 'certificaten-tip.jpg', { crop: { left: 760, top: 160, width: 1320, height: 1680 }, ...certificatenLook }],
  ['hd/certificaten.jpg', 'certificaten.jpg', { width: 2000, ...certificatenLook }],
  // rieten stoel in de wachtkamer
  ['hd/wachtkamer-stoel.jpg', 'wachtkamer-tip.jpg', wachtkamerLook],
  // de wachtkamer: raam, rieten stoel, beeld en bank, zonder de stapel tijdschriften onder de salontafel
  ['wachtkamer.jpg', 'wachtkamer.jpg', { crop: { left: 260, top: 0, width: 1067, height: 800 }, ...wachtkamerLook }],
  // de behandelkamer: magnolia, nageltipsrek, koffie en de stoel; rechts (steelstofzuiger,
  // prullenbak, draadmand en de werkplek) valt weg
  ['werkkamer.jpg', 'werkkamer.jpg', { crop: { left: 0, top: 0, width: 940, height: 1079 }, wit: witbalans.werkkamer, helder: true }],
  ['hd/hielkloven.jpg', 'hielkloven.jpg'],
  ['hd/likdoorns.jpg', 'likdoorns.jpg'],
  ['hd/nagelbeugel.jpg', 'ingroeiende-teennagel.jpg'],
];

for (const [from, to, o = {}] of jobs) {
  let img = sharp(src(from));
  // egaal maken gaat over de hele foto, vóór het uitsnijden: het verloop hoort bij het origineel
  if (o.egaal) img = await egaal(img, o.egaal);
  if (o.crop) img = img.extract(o.crop);
  if (o.width) img = img.resize(o.width);
  if (o.wit) img = await stap(img, (i) => i.recomb(kanalen(o.wit)));
  if (o.helder) img = await stap(img, (i) => i.normalise({ lower: 0.5, upper: 99.6 }));
  if (o.niveaus) {
    const [zwart, wit] = o.niveaus;
    img = await stap(img, (i) => i.linear(255 / (wit - zwart), (-255 * zwart) / (wit - zwart)));
  }
  if (o.gamma) img = await gamma(img, o.gamma);
  // de gezamenlijke afwerking
  img = await stap(img, (i) => i.linear(0.93, 12));
  img = await stap(img, (i) => i.modulate({ saturation: o.verzadiging ?? 0.94 }));
  await img.jpeg({ quality: 88, mozjpeg: true }).toFile(out(to));
  console.log('✓', to);
}
