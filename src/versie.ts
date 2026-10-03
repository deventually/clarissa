// Twee proefversies uit dezelfde code, om aan de opdrachtgever voor te leggen. Alles wat hier niet
// staat (inhoud, bugfixes, nieuwe functies) is gedeeld en komt vanzelf in allebei.
// Welke versie er gebouwd wordt, bepaalt VERSIE bij het bouwen: `npm run dev` is versie 1,
// `npm run dev:v2` versie 2, `npm run dev:beide` allebei (met een wisselknopje rechtsboven).
// De deploy bouwt ze allebei (.github/workflows/deploy.yml).
//
// Een verschil toevoegen:
// - een instelling hieronder, die je in de code uitleest via `versie.<naam>`;
// - in een .astro-bestand: {versie.nummer === 2 && <… />};
// - in CSS: [data-versie='2'] .iets { … } (Base.astro zet data-versie op <html>).

const versies = {
  1: {
    nummer: 1,
    // de tabbalk op mobiel: een glazen eiland boven de onderrand
    dock: 'zwevend',
  },
  2: {
    nummer: 2,
    // de tabbalk op mobiel: over de volle breedte tegen de onderrand
    dock: 'vast',
  },
} as const;

export const versie = import.meta.env.VERSIE === '2' ? versies[2] : versies[1];
