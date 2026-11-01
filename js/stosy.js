// Stosy: kliknięcie w stos otwiera podgląd i pozwala przeglądać jego zawartość.
(function () {
  const dialog = document.getElementById('podglad');
  if (!dialog) return;

  const obraz = dialog.querySelector('img');
  const tytul = dialog.querySelector('[data-tytul]');
  const licznik = dialog.querySelector('[data-licznik]');
  let zdjecia = [];
  let indeks = 0;

  // Polska odmiana: 1 zdjęcie, 2 zdjęcia, 5 zdjęć
  function odmiana(n, [jeden, kilka, wiele]) {
    if (n === 1) return jeden;
    const r10 = n % 10, r100 = n % 100;
    return r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14) ? kilka : wiele;
  }

  function pokaz(i) {
    indeks = (i + zdjecia.length) % zdjecia.length;
    obraz.src = zdjecia[indeks].src;
    obraz.alt = zdjecia[indeks].alt;
    licznik.textContent = `${indeks + 1} / ${zdjecia.length}`;
  }

  document.querySelectorAll('.stosy').forEach((sekcja) => {
    const formy = (sekcja.dataset.formy || 'element,elementy,elementów').split(',');

    sekcja.querySelectorAll('.stos-wrap').forEach((wrap) => {
      const stos = wrap.querySelector('.stos');
      const nazwa = wrap.querySelector('figcaption strong').textContent;
      const n = stos.querySelectorAll('img').length;

      wrap.querySelector('[data-ile]').textContent = `${n} ${odmiana(n, formy)}`;
      stos.setAttribute('aria-label', `Otwórz stos: ${nazwa}`);

      stos.addEventListener('click', () => {
        zdjecia = [...stos.querySelectorAll('img')];
        tytul.textContent = nazwa;
        pokaz(0);
        dialog.showModal();
      });
    });
  });

  dialog.querySelector('[data-poprzednie]').addEventListener('click', () => pokaz(indeks - 1));
  dialog.querySelector('[data-nastepne]').addEventListener('click', () => pokaz(indeks + 1));
  dialog.querySelector('[data-zamknij]').addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') pokaz(indeks - 1);
    if (e.key === 'ArrowRight') pokaz(indeks + 1);
  });

  // Kliknięcie w tło zamyka podgląd
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
})();
