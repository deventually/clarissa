// De Afspraak-knoppen openen een sheet. Zonder JavaScript gaan ze gewoon naar /contact#afspraak.
const sheet = document.getElementById('afspraak-sheet') as HTMLDialogElement | null;

if (sheet && typeof sheet.showModal === 'function') {
  document.querySelectorAll<HTMLAnchorElement>('[data-sheet-open]').forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      sheet.showModal();
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        sheet.showModal();
      }
    });
  });

  sheet.querySelector('[data-sheet-close]')?.addEventListener('click', () => sheet.close());

  // tik op de donkere achtergrond sluit de sheet
  sheet.addEventListener('click', (event) => {
    if (event.target !== sheet) return;
    const r = sheet.getBoundingClientRect();
    const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) sheet.close();
  });
}
