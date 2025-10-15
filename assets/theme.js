document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initProductFilters();
  initBrandSections();
  initProductSkuWatcher();
});

function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  if (!navToggle || !primaryNav) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.classList.toggle('is-open');
  });

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        event.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('is-open');
      }
    });
  });
}

function initProductFilters() {
  const productGrids = document.querySelectorAll('.product-grid');
  productGrids.forEach((grid) => {
    const filterContainer = grid.querySelector('[data-filters]');
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    if (!filterContainer || cards.length === 0) {
      return;
    }

    const vendorSelect = filterContainer.querySelector('[data-filter-vendor]');
    const qualitySelect = filterContainer.querySelector('[data-filter-quality]');
    const priceMinInput = filterContainer.querySelector('[data-filter-price-min]');
    const priceMaxInput = filterContainer.querySelector('[data-filter-price-max]');
    const instockCheckbox = filterContainer.querySelector('[data-filter-instock]');
    const resetButton = filterContainer.querySelector('[data-filter-reset]');

    populateSelect(vendorSelect, cards, 'vendor');
    populateSelect(qualitySelect, cards, 'quality');

    const applyFilters = () => {
      const vendorValue = (vendorSelect && vendorSelect.value) || '';
      const qualityValue = (qualitySelect && qualitySelect.value) || '';
      const minPrice = priceMinInput && priceMinInput.value ? parseFloat(priceMinInput.value) : null;
      const maxPrice = priceMaxInput && priceMaxInput.value ? parseFloat(priceMaxInput.value) : null;
      const mustBeInStock = instockCheckbox ? instockCheckbox.checked : false;

      cards.forEach((card) => {
        const cardVendor = card.dataset.vendor || '';
        const cardQuality = card.dataset.quality || '';
        const priceCents = parseInt(card.dataset.price || '0', 10);
        const cardPrice = Number.isNaN(priceCents) ? 0 : priceCents / 100;
        const cardInStock = card.dataset.instock === 'true';

        let visible = true;

        if (vendorValue && cardVendor !== vendorValue) {
          visible = false;
        }

        if (qualityValue && cardQuality !== qualityValue) {
          visible = false;
        }

        if (minPrice !== null && cardPrice < minPrice) {
          visible = false;
        }

        if (maxPrice !== null && cardPrice > maxPrice) {
          visible = false;
        }

        if (mustBeInStock && !cardInStock) {
          visible = false;
        }

        card.classList.toggle('is-hidden', !visible);
      });
    };

    vendorSelect && vendorSelect.addEventListener('change', applyFilters);
    qualitySelect && qualitySelect.addEventListener('change', applyFilters);
    priceMinInput && priceMinInput.addEventListener('input', applyFilters);
    priceMaxInput && priceMaxInput.addEventListener('input', applyFilters);
    instockCheckbox && instockCheckbox.addEventListener('change', applyFilters);

    resetButton && resetButton.addEventListener('click', () => {
      if (vendorSelect) vendorSelect.value = '';
      if (qualitySelect) qualitySelect.value = '';
      if (priceMinInput) priceMinInput.value = '';
      if (priceMaxInput) priceMaxInput.value = '';
      if (instockCheckbox) instockCheckbox.checked = false;
      applyFilters();
    });
  });
}

function populateSelect(selectElement, cards, type) {
  if (!selectElement) return;

  const values = new Map();
  cards.forEach((card) => {
    const handleValue = card.dataset[type];
    const labelValue = card.dataset[`${type}Label`];
    if (handleValue && !values.has(handleValue)) {
      values.set(handleValue, labelValue || handleValue);
    }
  });

  values.forEach((label, value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    selectElement.appendChild(option);
  });
}

function initBrandSections() {
  const brandSections = document.querySelectorAll('.brand-section');
  brandSections.forEach((section) => {
    const vendorHandle = section.dataset.vendorHandle;
    if (!vendorHandle) return;

    const cards = Array.from(section.querySelectorAll('.product-card'));
    if (cards.length === 0) return;

    let hasMatching = false;
    cards.forEach((card) => {
      const matches = card.dataset.vendor === vendorHandle;
      card.classList.toggle('is-hidden', !matches);
      if (matches) {
        hasMatching = true;
      }
    });

    if (!hasMatching) {
      // Si no hay coincidencias server-side, mostrar todos para permitir filtrado manual
      cards.forEach((card) => card.classList.remove('is-hidden'));
    }
  });
}

function initProductSkuWatcher() {
  const skuElement = document.querySelector('[data-product-sku]');
  const variantSelector = document.querySelector('[data-product-variant-selector]');

  if (!skuElement || !variantSelector) return;

  const updateSku = () => {
    const selectedOption = variantSelector.options[variantSelector.selectedIndex];
    const sku = selectedOption ? selectedOption.getAttribute('data-variant-sku') : '';
    skuElement.textContent = sku && sku.trim() !== '' ? sku : 'N/D';
  };

  variantSelector.addEventListener('change', updateSku);
  updateSku();
}

