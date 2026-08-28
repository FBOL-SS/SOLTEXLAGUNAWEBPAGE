// Personaliza los enlaces de WhatsApp dentro de tarjetas de producto/refacción
// para que el mensaje llegue precargado con el nombre del modelo.
// Esto convierte cada clic en un lead calificado (SOLTEX ya sabe qué pidieron).
(function () {
  function nombreDeTarjeta(card) {
    var titulo = card.querySelector('h3');
    return titulo ? titulo.textContent.trim() : '';
  }

  function personalizarEnlaces() {
    var tarjetas = document.querySelectorAll('.machine-card, .part-card, .solution-card, .service-card');
    tarjetas.forEach(function (card) {
      var producto = nombreDeTarjeta(card);
      if (!producto) return;

      var enlace = card.querySelector('a[href*="wa.me"]');
      if (!enlace || enlace.href.indexOf('text=') !== -1) return;

      var mensaje = 'Hola, me interesa cotizar: ' + producto + '. ¿Me pueden dar precio y disponibilidad?';
      var separador = enlace.href.indexOf('?') === -1 ? '?' : '&';
      enlace.href = enlace.href + separador + 'text=' + encodeURIComponent(mensaje);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', personalizarEnlaces);
  } else {
    personalizarEnlaces();
  }
})();
