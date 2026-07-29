/* =============================================================
   home-catalog.js — Homepage featured products & categories
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.CakeCatalog) {
    return;
  }

  const { CakeCatalog } = window;
  const featuredGrid = document.getElementById('featured-products-grid');
  const categoriesGrid = document.getElementById('categories-grid');
  const heroFeaturedCard = document.getElementById('hero-featured-card');

  CakeCatalog.getCatalogData().then(({ categories, products }) => {
    const featuredProducts = products.filter((product) => product.isFeatured);

    if (featuredGrid) {
      featuredGrid.innerHTML = featuredProducts
        .map((product) => CakeCatalog.buildProductCardHtml(product, { categoryAttr: false }))
        .join('');
    }

    if (categoriesGrid) {
      categoriesGrid.innerHTML = [
        ...categories.map((category) =>
          CakeCatalog.buildCategoryCardHtml(category, products)
        ),
        CakeCatalog.buildAllProductsCategoryCardHtml(),
      ].join('');
    }

    if (heroFeaturedCard && featuredProducts.length > 0) {
      const heroProduct = featuredProducts[0];
      heroFeaturedCard.innerHTML = `
        <img src="${CakeCatalog.getProductImage(heroProduct)}" alt="${heroProduct.name}" />
        <div class="featured-card-info">
          <h4>${heroProduct.name}</h4>
          <p class="price">${CakeCatalog.formatPrice(heroProduct.price)}</p>
          <a href="products.html" class="btn-small">View</a>
        </div>
      `;
    }
  });
});
