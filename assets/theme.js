
(() => {
  const menuBtn = document.querySelector('[data-menu]');
  const drawer = document.querySelector('[data-drawer]');
  if (menuBtn && drawer){
    menuBtn.addEventListener('click', () => {
      drawer.toggleAttribute('open');
      document.body.style.overflow = drawer.hasAttribute('open') ? 'hidden' : '';
    });
  }
})();
