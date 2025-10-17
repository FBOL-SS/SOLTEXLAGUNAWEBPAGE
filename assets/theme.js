document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuBtn = document.querySelector('.md\\:hidden button');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const nav = document.querySelector('.md\\:flex');
      nav.classList.toggle('hidden');
    });
  }
  // Otras interacciones como tabs en product-detail
});
