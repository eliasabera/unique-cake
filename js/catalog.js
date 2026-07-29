/* =============================================================
   catalog.js — Unique Cake House
   Shared product & category data + rendering helpers.
   ============================================================= */

(function () {
  const CATEGORY_PLACEHOLDERS = {
    1: 'images/cakes/images1.jpg',
    2: 'images/cakes/images.jpg',
    3: 'images/cakes/unnamed.png',
    4: 'images/cakes/images (2).jpg',
  };

  const FALLBACK_CATEGORIES = [
    { id: 1, name: 'Wedding Cakes', imageUrl: null, isActive: true },
    { id: 2, name: 'Birthday Cakes', imageUrl: null, isActive: true },
    { id: 3, name: 'Cupcakes', imageUrl: null, isActive: true },
    { id: 4, name: 'Custom Cakes', imageUrl: null, isActive: true },
  ];

  const FALLBACK_PRODUCTS = [
    {
      id: 1,
      name: 'Classic Vanilla Wedding Cake',
      price: '299.99',
      featuredImage: null,
      isAvailable: true,
      isFeatured: true,
      category: { id: 1, name: 'Wedding Cakes' },
    },
    {
      id: 2,
      name: 'Chocolate Dream Cake',
      price: '50.00',
      featuredImage: null,
      isAvailable: true,
      isFeatured: true,
      category: { id: 2, name: 'Birthday Cakes' },
    },
    {
      id: 3,
      name: 'Assorted Cupcake Box',
      price: '200.00',
      featuredImage: null,
      isAvailable: true,
      isFeatured: false,
      category: { id: 3, name: 'Cupcakes' },
    },
    {
      id: 4,
      name: 'updated Cake',
      price: '400.00',
      featuredImage: '"http://localhost:3000/uploads/products/1785235550583-77782603.jpg"',
      isAvailable: true,
      isFeatured: false,
      category: { id: 1, name: 'Wedding Cakes' },
    },
  ];

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
    return CATEGORY_PLACEHOLDERS[category?.id] || 'images/cakes/images.jpg';
  }

  function getProductImage(product) {
    const fromApi = cleanImageUrl(product.featuredImage);
    if (fromApi) return fromApi;
    return CATEGORY_PLACEHOLDERS[product.category?.id] || 'images/cakes/images.jpg';
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
    return `
      <a href="products.html" class="category-card">
        <div class="category-image" style="background-image: url('images/gallery/images (4).jpg');">
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
