document.addEventListener('DOMContentLoaded', () => {
  // burger
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  if (burger && nav) burger.addEventListener('click', () => nav.classList.toggle('open'));

  // brands dropdown
  const btn = document.querySelector('[data-brands]');
  const panel = document.querySelector('[data-brands-panel]');
  if (btn && panel) {
    btn.addEventListener('click', () => {
      const open = panel.hasAttribute('hidden') ? false : true;
      if (open) { panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
      else { panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
    });
  }

  // client-side filters
  const form = document.querySelector('[data-filters]');
  const grid = document.querySelector('[data-products]');
  if (form && grid) {
    const apply = () => {
      const vendor = (form.vendor?.value || '').trim();
      const min = parseFloat(form.min?.value || '0');
      const max = parseFloat(form.max?.value || '0');
      const wantStock = form.instock?.checked;
      grid.querySelectorAll('.product-card').forEach(card => {
        const v = card.dataset.vendor || '';
        const p = parseFloat(card.dataset.price || '0');
        const s = card.dataset.instock === 'true';
        let show = true;
        if (vendor && v !== vendor) show = false;
        if (!isNaN(min) && min>0 && p < min) show = false;
        if (!isNaN(max) && max>0 && p > max) show = false;
        if (wantStock && !s) show = false;
        card.style.display = show ? '' : 'none';
      });
    };
    form.addEventListener('input', apply);
    apply();
  }
});
