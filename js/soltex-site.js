(() => {
  const button = document.querySelector('.soltex-menu-toggle');
  const nav = document.getElementById('soltex-menu');
  if (button && nav) {
    const mobile = window.matchMedia('(max-width: 960px)');
    function setMenu(open) {
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Cerrar menú' : 'Menú';
      nav.hidden = mobile.matches && !open;
    }
    function resizeMenu() {
      button.hidden = !mobile.matches;
      setMenu(false);
    }
    button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
      if (mobile.matches && event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        button.focus();
      }
    });
    mobile.addEventListener('change', resizeMenu);
    resizeMenu();
  }
  window.lucide?.createIcons();
})();
