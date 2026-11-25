(() => {
  const search = document.querySelector('#searchInput');
  const brand = document.querySelector('#catalog-brand');
  const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const compact = (text) => normalize(text).replace(/[^a-z0-9]/g, '');

  if (search && brand) {
    const results = document.getElementById('catalog-results');
    const status = document.getElementById('catalog-status');
    const empty = document.getElementById('catalog-empty');
    const pagination = document.getElementById('sku-pagination');
    const previous = document.getElementById('sku-previous');
    const next = document.getElementById('sku-next');
    const pageLabel = document.getElementById('sku-page-label');
    const pageSize = 25;
    const number = new Intl.NumberFormat('es-MX');
    const skuKey = code => code.trim().toUpperCase();
    const byCode = new Map();
    const items = Array.from(results.querySelectorAll('.catalog-row'), row => {
      const code = row.querySelector('.catalog-code').textContent;
      const aliases = (row.dataset.aliases || '').split(/\s+/).filter(Boolean);
      const item = {
        row, code, codes: [code, ...aliases].map(compact),
        brand: row.dataset.brand, machineBrand: row.dataset.machineBrand,
        text: normalize(row.textContent),
        tokens: row.textContent.split(/\s+/).map(compact)
      };
      byCode.set(skuKey(code), item);
      return item;
    });

    function inventoryRow(item) {
      const li = document.createElement('li');
      li.className = 'catalog-row';
      const code = document.createElement('a');
      code.className = 'catalog-code';
      code.href = '/refacciones.html?codigo=' + encodeURIComponent(item.code) + '#buscador-refacciones';
      code.textContent = item.code;
      const application = document.createElement('p');
      application.textContent = item.names.join(' / ');
      const brandCell = document.createElement('span');
      brandCell.className = 'catalog-brand';
      brandCell.textContent = '—';
      const quote = document.createElement('a');
      quote.className = 'catalog-quote';
      quote.href = 'https://wa.me/528715246072?text=' + encodeURIComponent(
        'Hola SOLTEX, quiero cotizar la refacción ' + item.code + '. ¿Me confirman precio, disponibilidad y la variante?'
      );
      quote.textContent = 'Cotizar';
      quote.setAttribute('aria-label', 'Cotizar ' + item.code + ' por WhatsApp');
      quote.target = '_blank';
      quote.rel = 'noopener noreferrer';
      li.append(code, brandCell, application, quote);
      item.row = li;
      return li;
    }

    const fromLink = new URLSearchParams(location.search).get('codigo');
    if (fromLink) search.value = fromLink.slice(0, 200);
    let page = 0;
    let loading = true;
    let exactLink = Boolean(fromLink);

    function filterCatalog() {
      const query = normalize(search.value.trim());
      const code = compact(query);
      const words = query.split(/\s+/);
      const matching = items.filter(item => {
        if (brand.value && brand.value !== item.brand && brand.value !== item.machineBrand) return false;
        if (!query) return true;
        if (exactLink) return item.codes.includes(code);
        return (code && item.codes.some(partCode => partCode.includes(code))) ||
          words.every(word => item.text.includes(word) ||
            (compact(word).length >= 3 && item.tokens.includes(compact(word))));
      });
      if (code) {
        matching.sort((a, b) => Number(b.codes.includes(code)) - Number(a.codes.includes(code)));
      }
      const count = matching.length;
      const pages = Math.max(1, Math.ceil(count / pageSize));
      page = Math.min(page, pages - 1);
      results.replaceChildren(...matching.slice(page * pageSize, (page + 1) * pageSize)
        .map(item => item.row || inventoryRow(item)));
      status.textContent = number.format(count) + (count === 1 ? ' referencia' : ' referencias') +
        (loading ? ' · Cargando el índice completo…' : '');
      empty.hidden = loading || count !== 0;
      pagination.hidden = pages === 1;
      previous.disabled = page === 0;
      next.disabled = page === pages - 1;
      pageLabel.textContent = 'Página ' + (page + 1) + ' de ' + pages;
    }

    function resetPage() {
      page = 0;
      exactLink = false;
      filterCatalog();
    }

    search.addEventListener('input', resetPage);
    brand.addEventListener('change', resetPage);
    document.getElementById('catalog-reset').addEventListener('click', () => {
      brand.value = '';
      search.value = '';
      resetPage();
      search.focus();
    });
    function turnPage(offset) {
      page += offset;
      filterCatalog();
      status.focus({ preventScroll: true });
      document.getElementById('buscador-refacciones').scrollIntoView({ block: 'start' });
    }
    previous.addEventListener('click', () => turnPage(-1));
    next.addEventListener('click', () => turnPage(1));
    filterCatalog();

    fetch('/data/catalogo-skus.json').then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el catálogo');
      return response.json();
    }).then(({ products, variants }) => {
      for (const [code, names] of products) {
        const key = skuKey(code);
        const featured = byCode.get(key) || (variants[key] && byCode.get(variants[key]));
        if (featured) {
          if (!featured.codes.includes(compact(code))) featured.codes.push(compact(code));
          continue;
        }
        const text = normalize(code + ' ' + names.join(' '));
        items.push({ code, names, codes: [compact(code)], text, tokens: text.split(/\s+/).map(compact) });
      }
    }).catch(() => {
      document.getElementById('sku-load-error').hidden = false;
    }).finally(() => {
      loading = false;
      filterCatalog();
    });
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
