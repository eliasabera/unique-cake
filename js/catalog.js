/* =============================================================
   catalog.js — Unique Cake House
   Shared product & category data + rendering helpers.
   ============================================================= */

(function () {
  const FALLBACK_CATEGORIES = [
    { id: 1, name: 'BirthDay', imageUrl: null, isActive: true },
    { id: 2, name: 'Weeding', imageUrl: null, isActive: true },
    { id: 3, name: 'Graduation', imageUrl: null, isActive: true },
    { id: 4, name: 'Anniversary', imageUrl: null, isActive: true },
    { id: 5, name: 'Custom', imageUrl: null, isActive: true },
  ];

  const FALLBACK_PRODUCTS = [
    {
      id: 1,
      name: 'Chocolate Fudge Delight',
      price: '1500.00',
      featuredImage: 'http://unique-cake.sigimoworeda.com/uploads/products/1785333427216-88005415.jpg',
      isAvailable: true,
      isFeatured: false,
      category: { id: 1, name: 'BirthDay' },
    },
    {
      id: 2,
      name: 'Classic Vanilla Dream',
      price: '1200.00',
      featuredImage: 'http://unique-cake.sigimoworeda.com/uploads/products/1785333444197-370262285.png',
      isAvailable: true,
      isFeatured: false,
      category: { id: 1, name: 'BirthDay' },
    },
    {
      id: 3,
      name: 'Elegant White Wedding',
      price: '2500.00',
      featuredImage: 'http://unique-cake.sigimoworeda.com/uploads/products/1785333468297-264250880.jpg',
      isAvailable: true,
      isFeatured: false,
      category: { id: 2, name: 'Weeding' },
    },
    {
      id: 4,
      name: 'Royal Chocolate Tower',
      price: '3500.00',
      featuredImage: 'http://unique-cake.sigimoworeda.com/uploads/products/1785333481017-180858993.jpg',
      isAvailable: true,
      isFeatured: false,
      category: { id: 2, name: 'Weeding' },
    },
    {
      id: 5,
      name: 'Graduation Celebration',
      price: '1800.00',
      featuredImage: 'http://unique-cake.sigimoworeda.com/uploads/products/1785333496813-40944148.JPG',
      isAvailable: true,
      isFeatured: false,
      category: { id: 3, name: 'Graduation' },
    },
    {
      id: 6,
      name: 'Golden Anniversary',
      price: '2000.00',
      featuredImage: 'http://unique-cake.sigimoworeda.com/uploads/products/1785333515267-86721920.jpg',
      isAvailable: true,
      isFeatured: false,
      category: { id: 4, name: 'Anniversary' },
    },
    {
      id: 7,
      name: 'Strawberry Rose Garden',
      price: '1600.00',
      featuredImage: 'http://unique-cake.sigimoworeda.com/uploads/products/1785333526213-760769352.png',
      isAvailable: true,
      isFeatured: false,
      category: { id: 5, name: 'Custom' },
    },
    {
      id: 8,
      name: 'Tropical Mango Bliss',
      price: '1400.00',
      featuredImage: '"http://localhost:3000/uploads/products/1785250950334-234767154.jpg"',
      isAvailable: true,
      isFeatured: false,
      category: { id: 5, name: 'Custom' },
    },
  ];

  const CATEGORY_PLACEHOLDERS = {
    1: FALLBACK_PRODUCTS[0].featuredImage,
    2: FALLBACK_PRODUCTS[2].featuredImage,
    3: FALLBACK_PRODUCTS[4].featuredImage,
    4: FALLBACK_PRODUCTS[5].featuredImage,
    5: FALLBACK_PRODUCTS[6].featuredImage,
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function categorySlug(name) {
    return String(name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function cleanImageUrl(value) {
    if (value == null || value === '') return null;
    const cleaned = String(value).replace(/^["']+|["']+$/g, '').trim();
    return cleaned || null;
  }

  function formatPrice(price) {
    const amount = Number.parseFloat(price);
    const currency = window.CAKE_CONFIG?.CURRENCY || 'ETB';
    if (Number.isNaN(amount)) return `${currency} 0.00`;
    return `${currency} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function getCategoryImage(category) {
    const fromApi = cleanImageUrl(category?.imageUrl);
    if (fromApi) return fromApi;
    return CATEGORY_PLACEHOLDERS[category?.id] || FALLBACK_PRODUCTS[0].featuredImage;
  }

  function getProductImage(product) {
    const fromApi = cleanImageUrl(product.featuredImage);
    if (fromApi) return fromApi;
    return CATEGORY_PLACEHOLDERS[product.category?.id] || FALLBACK_PRODUCTS[0].featuredImage;
  }

  function countProductsInCategory(products, categoryId) {
    return products.filter(
      (product) => product.isAvailable && product.category?.id === categoryId
    ).length;
  }

  function buildProductCardHtml(product, options = {}) {
    const {
      showBadge = true,
      orderHref = 'contact.html',
      categoryAttr = true,
    } = options;

    const slug = categorySlug(product.category?.name);
    const badgeHtml =
      showBadge && product.isFeatured
        ? '<span class="cake-badge">Featured</span>'
        : '';
    const categoryData = categoryAttr ? ` data-category="${slug}"` : '';

    return [
      `<div class="cake-card"${categoryData}>`,
      '<div class="cake-image">',
      `<img src="${getProductImage(product)}" alt="${escapeHtml(product.name)}" loading="lazy" />`,
      badgeHtml,
      '</div>',
      '<div class="cake-info">',
      `<h3 class="cake-name">${escapeHtml(product.name)}</h3>`,
      `<p class="cake-category">${escapeHtml(product.category?.name || '')}</p>`,
      `<p class="cake-price">${formatPrice(product.price)}</p>`,
      `<a href="${orderHref}" class="btn btn-primary btn-sm">Order Now</a>`,
      '</div>',
      '</div>',
    ]
      .join('');
  }

  function buildCategoryCardHtml(category, products) {
    const count = countProductsInCategory(products, category.id);
    const countLabel = count === 1 ? '1 Design' : `${count} Designs`;
    const imageUrl = getCategoryImage(category);

    return `
      <a href="products.html?category=${categorySlug(category.name)}" class="category-card">
        <div class="category-image" style="background-image: url('${imageUrl}');">
          <div class="category-overlay">
            <h3>${escapeHtml(category.name)}</h3>
            <span>${count > 0 ? countLabel : 'Coming Soon'}</span>
          </div>
        </div>
      </a>
    `;
  }

  function buildAllProductsCategoryCardHtml() {
    const cover = cleanImageUrl(FALLBACK_PRODUCTS[0].featuredImage);
    return `
      <a href="products.html" class="category-card">
        <div class="category-image" style="background-image: url('${cover}');">
          <div class="category-overlay">
            <h3>All Products</h3>
            <span>View All</span>
          </div>
        </div>
      </a>
    `;
  }

  function getCatalogData() {
    const categories = FALLBACK_CATEGORIES.filter((category) => category.isActive);
    const products = FALLBACK_PRODUCTS.filter((product) => product.isAvailable);
    return Promise.resolve({ categories, products });
  }

  window.CakeCatalog = {
    categorySlug,
    cleanImageUrl,
    formatPrice,
    getCategoryImage,
    getProductImage,
    countProductsInCategory,
    buildProductCardHtml,
    buildCategoryCardHtml,
    buildAllProductsCategoryCardHtml,
    getCatalogData,
  };
})();
