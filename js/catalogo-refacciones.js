(() => {
  const search = document.querySelector('#searchInput');
  const brand = document.querySelector('#catalog-brand');
  const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const compact = (text) => normalize(text).replace(/[^a-z0-9]/g, '');

  if (search && brand) {
    const status = document.querySelector('#catalog-status');
    const empty = document.querySelector('#catalog-empty');
    const items = Array.from(document.querySelectorAll('.catalog-row'), (row) => ({
      row,
      codes: [row.querySelector('.catalog-code').textContent, ...(row.dataset.aliases || '').split(/\s+/)].filter(Boolean).map(compact),
      text: normalize(row.textContent),
      tokens: row.textContent.split(/\s+/).map(compact)
    }));

    function filterCatalog() {
      const query = normalize(search.value.trim());
      const code = compact(query);
      const words = query.split(/\s+/);
      let count = 0;
      for (const item of items) {
        const matchesQuery = !query || (code && item.codes.some(partCode => partCode.includes(code))) ||
          words.every((word) => item.text.includes(word) ||
            (compact(word).length >= 3 && item.tokens.includes(compact(word))));
        const visible = (!brand.value || item.row.dataset.brand === brand.value || item.row.dataset.machineBrand === brand.value) && matchesQuery;
        item.row.hidden = !visible;
        if (visible) count++;
      }
      status.textContent = count === 1 ? '1 referencia' : count + ' referencias';
      empty.hidden = count !== 0;
    }

    search.addEventListener('input', filterCatalog);
    brand.addEventListener('change', filterCatalog);
    for (const button of document.querySelectorAll('[data-example]')) {
      button.addEventListener('click', () => {
        brand.value = '';
        search.value = button.dataset.example;
        filterCatalog();
        search.focus();
      });
    }
    document.querySelector('#catalog-reset').addEventListener('click', () => {
      brand.value = '';
      search.value = '';
      filterCatalog();
      search.focus();
    });
    filterCatalog();
  }

  const quoteForm = document.getElementById('model-quote-form');
  if (quoteForm) {
    const status = document.getElementById('model-quote-status');
    quoteForm.querySelector('[type="submit"]').hidden = false;
    quoteForm.addEventListener('change', () => { status.textContent = ''; });
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const parts = new FormData(quoteForm).getAll('part');
      if (parts.length === 0) {
        status.textContent = 'Selecciona al menos una pieza.';
        quoteForm.querySelector('input[type="checkbox"]').focus();
        return;
      }
      const message = [
        'Hola SOLTEX, quiero cotizar estas refacciones para ' + quoteForm.dataset.model + ':',
        ...parts.map(part => '• ' + part),
        '',
        '¿Me confirman compatibilidad, precio y disponibilidad?'
      ].join('\n');
      window.location.assign('https://wa.me/528715246072?text=' + encodeURIComponent(message));
    });
  }

  const share = document.querySelector('#catalog-share');
  if (share && navigator.clipboard) {
    const status = document.querySelector('#catalog-share-status');
    share.hidden = false;
    share.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.origin + window.location.pathname);
        status.textContent = 'Enlace copiado.';
      } catch {
        status.textContent = 'Puedes copiar el enlace desde la barra de direcciones.';
      }
    });
  }
})();
