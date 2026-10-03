import { hours } from '../data/salon';

const weekday: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Huidige dag en minuut in Nederlandse tijd, ongeacht de tijdzone van het toestel. */
function amsterdamNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  return { day: weekday[get('weekday')], minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const byDay = (day: number) => hours.find((h) => h.day === day)!;

export function openStatus(now = amsterdamNow()) {
  const today = byDay(now.day);
  if (today.open && today.close) {
    if (now.minutes < toMinutes(today.open)) return { state: 'soon', text: `Open om ${today.open}` };
    if (now.minutes < toMinutes(today.close)) return { state: 'open', text: `Open tot ${today.close}` };
  }
  for (let k = 1; k <= 7; k++) {
    const next = byDay((now.day + k) % 7);
    if (next.open) {
      // kort, zoals 'Di–za vanaf 10:00' zonder JavaScript: de status staat op mobiel naast het logo
      const when = k === 1 ? 'Morgen' : next.name[0].toUpperCase() + next.name[1];
      return { state: 'closed', text: `${when} vanaf ${next.open}` };
    }
  }
  return { state: 'closed', text: 'gesloten' };
}

function render() {
  const now = amsterdamNow();
  const { state, text } = openStatus(now);
  document.querySelectorAll<HTMLElement>('[data-status]').forEach((el) => {
    el.dataset.state = state;
    const label = el.querySelector('[data-status-text]');
    if (label && label.textContent !== text) label.textContent = text;
  });
  document.querySelectorAll('[data-hours] .hours__row').forEach((row) => {
    if (Number((row as HTMLElement).dataset.day) === now.day) row.setAttribute('aria-current', 'date');
    else row.removeAttribute('aria-current');
  });
}

render();
setInterval(render, 60_000);
