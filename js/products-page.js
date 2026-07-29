/* =============================================================
   products-page.js — Products listing + category filters
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.getElementById('filter-bar');
  const productsGrid = document.getElementById('products-grid');

  if (!filterBar || !productsGrid || !window.CakeCatalog) {
    return;
  }

  const { CakeCatalog } = window;

  function animateCards(cards) {
    cards.forEach((card) => {
      card.style.display = '';
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  }

  function hideCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.display = 'none';
    }, 300);
  }

  function applyFilter(filter, cards, filterBtns) {
    filterBtns.forEach((btn) => {
      btn.classList.toggle('filter-active', btn.dataset.filter === filter);
    });

    const visibleCards = [];

    cards.forEach((card) => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        visibleCards.push(card);
      } else {
        hideCard(card);
      }
    });

    animateCards(visibleCards);
  }

  function initFilters(cards) {
    const filterBtns = filterBar.querySelectorAll('.filter-btn');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        applyFilter(btn.dataset.filter, cards, filterBtns);
      });
    });

    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      const matchingBtn = Array.from(filterBtns).find(
        (btn) => btn.dataset.filter === categoryParam
      );
      if (matchingBtn) {
        applyFilter(categoryParam, cards, filterBtns);
        return;
      }
    }

    applyFilter('all', cards, filterBtns);
  }

  CakeCatalog.getCatalogData().then(({ categories, products }) => {
    filterBar.innerHTML = [
      '<button class="filter-btn filter-active" data-filter="all">All</button>',
      ...categories.map(
        (category) =>
          `<button class="filter-btn" data-filter="${CakeCatalog.categorySlug(category.name)}">${category.name}</button>`
      ),
    ].join('');

    productsGrid.innerHTML = products
      .map((product) => CakeCatalog.buildProductCardHtml(product))
      .join('');

    const cards = productsGrid.querySelectorAll('.cake-card[data-category]');
    initFilters(cards);
  });
});
