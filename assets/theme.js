document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  if (burger && nav) burger.addEventListener('click', () => nav.classList.toggle('open'));

  // Brands dropdown (desktop & mobile)
  const btn = document.querySelector('[data-brands]');
  const panel = document.querySelector('[data-brands-panel]');
  if (btn && panel) {
    const toggle = () => {
      const open = !panel.hasAttribute('hidden');
      if (open){ panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
      else{ panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
    };
    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); } });
    document.addEventListener('click', e => { if(!panel.contains(e.target) && !btn.contains(e.target)){ panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }});
  }

  // Client-side filters
  const form = document.querySelector('[data-filters]');
  const grid = document.querySelector('[data-products]');
  if (form && grid) {
    const number = v => { const n = parseFloat(v); return isNaN(n)?0:n; };
    const apply = () => {
      const vendor = (form.vendor?.value || '').trim();
      const min = number(form.min?.value || '0');
      const max = number(form.max?.value || '0');
      const wantStock = !!form.instock?.checked;

      grid.querySelectorAll('.product-card').forEach(card => {
        const v = card.dataset.vendor || '';
        const p = number(card.dataset.price || '0');
        const s = card.dataset.instock === 'true';
        let show = true;
        if (vendor && v !== vendor) show = false;
        if (min>0 && p < min) show = false;
        if (max>0 && p > max) show = false;
        if (wantStock && !s) show = false;
        card.style.display = show ? '' : 'none';
      });
    };
    form.addEventListener('input', apply);
    apply();
  }
});
