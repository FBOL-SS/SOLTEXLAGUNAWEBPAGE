// Ejemplo simple: Toggle mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.querySelector('nav').classList.toggle('open');
    });
  }
});