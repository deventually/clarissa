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

// Kleurbewerkingen. 'salon': de gele gloed van de wachtkamer eruit, lichter, iets naar roze.
// 'gloed': de certificatenmuur in hetzelfde warme lamplicht als de wachtkamer, met een lichte kern
// en donkerdere randen, zodat de twee foto's op Over Clarissa bij elkaar passen.
const looks = {
  salon: {
    recomb: [
      [0.98, 0.02, 0],
      [0, 0.97, 0.03],
      [0.06, 0.06, 1.12],
    ],
    linear: [1.2, 14],
    modulate: { brightness: 1.18, saturation: 1.1, hue: -4 },
  },
  gloed: {
    recomb: [
      [1.08, 0.04, 0],
      [0.02, 0.96, 0.01],
      [0.03, 0.02, 0.92],
    ],
    linear: [1.22, 10],
    modulate: { brightness: 1.04, saturation: 1.2, hue: -3 },
    licht: true,
  },
};

const jobs = [
  // de roze behandelstoel, staand, voor de hero-nagel
  ['hd/werkkamer-stoel.jpg', 'stoel.jpg', { modulate: { brightness: 1.12, saturation: 1.12 } }],
  // gelakte nagels, voor de manicure-tip
  ['hd/manicure.jpg', 'manicure-tip.jpg', { crop: { left: 1580, top: 0, width: 820, height: 1036 } }],
  ['hd/manicure.jpg', 'manicure-band.jpg'],
  // voeten met roze teennagels en een orchidee, voor de pedicure-tip
  ['hd/pedicure-tile.jpg', 'pedicure-tip.jpg', { crop: { left: 256, top: 0, width: 600, height: 740 } }],
  // handen in roze handschoenen verzorgen een voet, voor de tip Voetklachten.
  // Foto: Rune Enstad via Unsplash (Unsplash-licentie, vrij te gebruiken),
  // https://unsplash.com/photos/W0_shKarGCk, gedownload op 2400 px breed.
  ['voetverzorging-unsplash.jpg', 'voetklachten-tip.jpg', { crop: { left: 780, top: 0, width: 1200, height: 1600 } }],
  // de muur met certificaten, staand uitgesneden voor de tip
  ['hd/certificaten.jpg', 'certificaten-tip.jpg', { crop: { left: 760, top: 160, width: 1320, height: 1680 }, ...looks.gloed }],
  ['hd/certificaten.jpg', 'certificaten.jpg', { ...looks.gloed, width: 2000 }],
  // rieten stoel in de wachtkamer
  ['hd/wachtkamer-stoel.jpg', 'wachtkamer-tip.jpg', looks.salon],
  ['wachtkamer.jpg', 'wachtkamer.jpg', looks.salon],
  ['werkkamer.jpg', 'werkkamer.jpg', { modulate: { brightness: 1.1, saturation: 1.1 } }],
  ['hd/hielkloven.jpg', 'hielkloven.jpg'],
  ['hd/likdoorns.jpg', 'likdoorns.jpg'],
  ['hd/nagelbeugel.jpg', 'ingroeiende-teennagel.jpg'],
];

for (const [from, to, o = {}] of jobs) {
  let img = sharp(src(from));
  if (o.crop) img = img.extract(o.crop);
  if (o.width) img = img.resize(o.width);
  if (o.recomb) img = img.recomb(o.recomb);
  if (o.linear) img = img.linear(...o.linear);
  if (o.modulate) img = img.modulate(o.modulate);
  if (o.licht) {
    // lamplicht: randen donkerder (multiply), een warme lichte kern (screen)
    const buf = await img.toBuffer();
    const { width, height } = await sharp(buf).metadata();
    const laag = (stops) =>
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="g" ${stops}</radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
      );
    img = sharp(buf).composite([
      {
        input: laag('cx="0.5" cy="0.4" r="0.75"><stop offset="0.35" stop-color="#fff"/><stop offset="1" stop-color="#8a5a6e" stop-opacity="0.8"/>'),
        blend: 'multiply',
      },
      {
        input: laag('cx="0.5" cy="0.3" r="0.6"><stop offset="0" stop-color="#ffe9d6" stop-opacity="0.45"/><stop offset="1" stop-color="#ffe9d6" stop-opacity="0"/>'),
        blend: 'screen',
      },
    ]);
  }
  await img.jpeg({ quality: 88, mozjpeg: true }).toFile(out(to));
  console.log('✓', to);
}
