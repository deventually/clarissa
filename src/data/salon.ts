// Alle feiten van de salon op één plek. Prijzen of tijden aanpassen? Alleen hier.

export const salon = {
  name: 'Clarissa Body & Style',
  street: 'Goudenregenplein 59',
  postcode: '2565 GK',
  city: 'Den Haag',
  phoneDisplay: '06 57 666 797',
  phoneHref: 'tel:+31657666797',
  whatsappHref:
    'https://wa.me/31657666797?text=' +
    encodeURIComponent('Hallo Clarissa, ik wil graag een afspraak maken voor '),
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Goudenregenplein 59, 2565 GK Den Haag'),
  url: 'https://clarissa-bodyandstyle.nl',
  cancellation:
    'Kun je niet komen? Bel dan uiterlijk 24 uur van tevoren af. Anders moeten we de hele behandeling in rekening brengen.',
};

/** Weekdag volgens Date.getDay(): 0 = zondag. Tijden in Nederlandse tijd. */
export type Day = { day: number; name: string; open?: string; close?: string };

export const hours: Day[] = [
  { day: 1, name: 'maandag' },
  { day: 2, name: 'dinsdag', open: '10:00', close: '19:00' },
  { day: 3, name: 'woensdag', open: '10:00', close: '19:00' },
  { day: 4, name: 'donderdag', open: '10:00', close: '19:00' },
  { day: 5, name: 'vrijdag', open: '10:00', close: '19:00' },
  { day: 6, name: 'zaterdag', open: '10:00', close: '17:00' },
  { day: 0, name: 'zondag' },
];

export type Treatment = { name: string; price: number; description?: string };

export const pedicure: Treatment[] = [
  {
    name: 'Korte pedicure',
    price: 35,
    description:
      'Anamnese, nagels knippen, de huid rond de nagels reinigen en verzorgen, en een korte voetmassage tijdens het incrèmen.',
  },
  {
    name: 'Uitgebreide pedicure',
    price: 50,
    description:
      'Voor je eerste bezoek. Anamnese, nagels knippen, de huid rond de nagels reinigen en verzorgen, eelt en likdoorns verwijderen, en een korte voetmassage tijdens het incrèmen.',
  },
  {
    name: 'Uitgebreide pedicure, binnen 8 weken terug',
    price: 48.5,
    description:
      'Dezelfde uitgebreide behandeling, als je binnen 8 weken na je vorige afspraak terugkomt.',
  },
  {
    name: 'Likdoornbehandeling',
    price: 17.5,
    description: 'Het verwijderen van een likdoorn, per stuk. Kan ook los van een pedicure.',
  },
  {
    name: 'Correctie met Tampogass of Clauden',
    price: 17.5,
    description:
      'Een tamponadestrook voor een ingegroeide nagel. De strook voorkomt dat de nagel rechtstreeks in de huid prikt, en de zalf erin gaat verkleven met de wond tegen.',
  },
  {
    name: 'Nagelbeugel plaatsen',
    price: 28,
    description: 'Voorkomt dat een nagel verder ingroeit en stuurt de groei van de nagel.',
  },
  {
    name: 'Nagelbeugel verzetten of verwijderen, met pedicure',
    price: 16.5,
  },
  {
    name: 'Nagelbeugel verzetten of verwijderen, zonder pedicure',
    price: 22.5,
  },
  { name: 'Nagels lakken', price: 10, description: 'In een kleur naar keuze.' },
];

export const manicure: Treatment[] = [
  {
    name: 'Manicure',
    price: 32.5,
    description:
      'Nagelriemen verzorgen, nagels vijlen en polijsten, en een korte handmassage tijdens het incrèmen.',
  },
  {
    name: 'Gellak',
    price: 34,
    description:
      'Gellak is een dunne gel met veel pigment: hij smeert als lak, maar is zo sterk als gel. Je nagels blijven minstens drie weken mooi. Wil je een nieuwe kleur? Het eraf vijlen rekenen we niet extra.',
  },
  { name: 'Acrylnagel of nagelreparatie met acryl', price: 8.5 },
  { name: 'Nagels lakken', price: 10, description: 'In een kleur naar keuze.' },
];

export const euro = (n: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);

/** Tekst van de oude aandoeningenpagina: inhoud ongewijzigd, alleen gecorrigeerd en in je-vorm. */
export const conditions = [
  {
    id: 'hielkloven',
    name: 'Hielkloven',
    intro:
      'Hielkloven herken je aan witte verticale en/of horizontale barstjes en een harde, vaak ook droge rand op de hiel. De huid is daardoor minder elastisch of zelfs stug en beweegt niet meer mee met de bewegingen van de voet.',
    causes:
      'Hielkloven komen vaak voor, zowel bij mannen als bij vrouwen. Er zijn verschillende oorzaken, zoals een staand beroep, overgewicht, een droge huid en diabetes; ook ouderdom kan een rol spelen. Bij mensen met een staand beroep en mensen met overgewicht is er vooral sprake van meer druk op de hielen, omdat de hielen het lichaamsgewicht dragen. Bij mensen met een droge huid, diabetici en oudere mensen kan de huid ook sneller vocht verliezen, waardoor deze eerder uitdroogt.',
    care:
      'Door de hielkloven met een uitgebreide behandeling aan te pakken, wordt het eelt tot een minimum teruggebracht of helemaal verwijderd. Door de huid van je voeten goed te blijven verzorgen en door meerdere pedicurebehandelingen kunnen verdere problemen voorkomen worden. Smeer je voeten consequent in met een hydraterende, vochtinbrengende crème; zo draag je er zeker aan bij dat je voeten er in korte tijd weer mooi verzorgd uitzien.',
  },
  {
    id: 'likdoorns',
    name: 'Likdoorns',
    intro:
      'Een likdoorn, ook wel eksteroog genoemd, herken je aan een pijnlijke, eeltige verdikking van de huid. De pijn wordt vaak omschreven als stekend.',
    causes:
      'Likdoorns ontstaan door constante druk en/of wrijving op de huid. Daardoor wordt eelt gevormd dat zich opbouwt. Uiteindelijk ontstaat er een likdoorn doordat het eelt zich naar binnen keert. De plek in de huid krijgt de vorm van een ijshoorntje.',
    care:
      'De likdoorn wordt zowel aan de buitenkant als in de huid zorgvuldig verwijderd. Je kunt ook los van een pedicurebehandeling een afspraak maken voor een likdoornbehandeling.',
  },
  {
    id: 'ingroeiende-teennagel',
    name: 'Ingroeiende teennagel',
    intro:
      'Dit probleem komt vooral voor bij een of bij beide grote teennagels. De nagel groeit dan in de huid. Ook kan een nagel groeien in de vorm van een tunnel of een ronde stand aannemen; dat kan verschillende oorzaken hebben.',
    causes:
      'De voornaamste oorzaak is het te kort knippen van de nagels. De huid onder de teen komt, als je erop staat, iets omhoog door het lichaamsgewicht. De nagel blijft in dezelfde stand staan en groeit door het te kort afknippen recht de huid in. Een nagel kan ook een tunnel- of ronde vorm aannemen, bijvoorbeeld door een schimmelinfectie, druk van schoenen of erfelijkheid, al dan niet in combinatie met te kort knippen.',
    care:
      'Er zijn diverse nagelbeugels, en welke we gebruiken hangt af van je gezondheid en de conditie van de nagel. Tijdens de controles zorgen we door de beugel te plaatsen, te verzetten of te vervangen ervoor dat de nagel niet meer ingroeit.',
  },
];
