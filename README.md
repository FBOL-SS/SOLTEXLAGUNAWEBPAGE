# Tema SOLTEX / SEWING

Tema ligero de Shopify Online Store 2.0 en español, diseñado para la marca SOLTEX / SEWING. Incluye navegación completa, páginas informativas y catálogo con filtros nativos en el cliente.

## Estructura
- `layout/theme.liquid`: estructura base con cabecera y pie reutilizables.
- `sections/`: secciones reutilizables (hero, texto, grilla de productos, marcas, contacto).
- `templates/`: archivos JSON para cada página requerida (inicio, colecciones, búsqueda, marcas y contacto).
- `snippets/product-card.liquid`: tarjeta de producto con SKU visible.
- `sections/main-product.liquid` y `templates/product.json`: ficha de producto con SKU dinámico por variante.
- `assets/styles.css`: estilos en CSS puro.
- `assets/theme.js`: lógica mínima para menú móvil y filtros.
- `locales/es.default.json`: traducciones en español.
- `config/settings_schema.json`: ajustes de tema.

## Características clave
- Navegación con menú desplegable de marcas y versión móvil con botón hamburguesa.
- Páginas de marcas que muestran productos filtrados por vendor.
- Grilla de productos con filtros de marca, calidad, precio y disponibilidad en `/collections/all` y búsqueda.
- Página de producto mostrará SKU gracias al snippet reutilizado (cuando se incluya en plantillas de producto).
- Formulario de contacto nativo de Shopify con campos requeridos y bloque editable de información.

## Personalización
1. Carga el tema en Shopify y asigna las plantillas de página correspondientes a cada URL requerida.
2. Desde el editor de temas puedes ajustar textos, imágenes y listas de cada sección.
3. Para aprovechar los filtros, asegúrate de cargar los metafields `product.metafields.custom.calidad` y los SKU en variantes.

## Desarrollo
No requiere dependencias adicionales. Los cambios pueden probarse utilizando [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) con `shopify theme dev`.
