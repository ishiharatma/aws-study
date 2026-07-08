'use strict';

/**
 * AWS Study - Article Card Grid
 * ARTICLES と ICON_BASE はレイアウト(home-cards.html)の Liquid テンプレートで埋め込まれます。
 */

const CATEGORIES = [
  { key: 'all',                     label: 'すべて' },
  { key: 'basic',                   label: '基礎' },
  { key: 'compute',                 label: 'コンピューティング' },
  { key: 'database',                label: 'データベース' },
  { key: 'networking',              label: 'ネットワーキング' },
  { key: 'storage',                 label: 'ストレージ' },
  { key: 'security',                label: 'セキュリティ' },
  { key: 'containers',              label: 'コンテナ' },
  { key: 'analytics',               label: '分析' },
  { key: 'management',              label: '管理・ガバナンス' },
  { key: 'application-integration', label: 'アプリケーション統合' },
  { key: 'developer-tools',         label: '開発者ツール' },
  { key: 'data-migration',          label: 'データ移行' },
  { key: 'other',                   label: 'その他' },
];

let currentCategory = 'all';
let currentSearch   = '';

// ---- Helpers ----

function getCategoryLabel(key) {
  const found = CATEGORIES.find(c => c.key === key);
  return found ? found.label : key;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

// ---- Category Filter ----

function buildCategoryFilter() {
  const container = document.getElementById('category-filter');
  if (!container) return;

  CATEGORIES.forEach(cat => {
    // 「すべて」以外は、その category の記事が存在するときだけ表示
    if (cat.key !== 'all' && !ARTICLES.some(a => a.category === cat.key)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-outline-secondary category-btn mr-1 mb-1';
    if (cat.key === 'all') btn.classList.add('active');
    btn.dataset.category = cat.key;
    btn.textContent = cat.label;
    container.appendChild(btn);
  });

  container.addEventListener('click', e => {
    const btn = e.target.closest('[data-category]');
    if (!btn) return;
    currentCategory = btn.dataset.category;
    container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards();
  });
}

// ---- Filtering ----

function getFilteredArticles() {
  return ARTICLES
    .filter(article => {
      const matchesCat    = currentCategory === 'all' || article.category === currentCategory;
      const matchesSearch = !currentSearch ||
        article.title.toLowerCase().includes(currentSearch) ||
        (article.description || '').toLowerCase().includes(currentSearch);
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 新しい順
}

// ---- Card HTML ----

function createCardHTML(article) {
  const iconEl = article.icon
    ? `<img src="${ICON_BASE}${escapeHtml(article.icon)}"
            alt="${escapeHtml(article.title)}"
            class="aws-service-icon"
            loading="lazy"
            onerror="this.replaceWith(createIconPlaceholder())">`
    : `<div class="aws-service-icon-placeholder">AWS</div>`;

  const categoryLabel = escapeHtml(getCategoryLabel(article.category));
  const url           = `${escapeHtml(article.id)}/index.html`;
  const safeTitle     = escapeHtml(article.title);
  const safeDesc      = escapeHtml(article.description || '');
  const dateFormatted = formatDate(article.date);

  return `
    <div class="col-12 col-sm-6 col-lg-4 mb-4 article-col" data-category="${escapeHtml(article.category)}">
      <div class="card h-100 article-card shadow-sm">
        <div class="card-body d-flex flex-column p-3">
          <!-- Icon + Category badge -->
          <div class="d-flex align-items-start mb-3">
            ${iconEl}
            <span class="badge-category ml-2">${categoryLabel}</span>
          </div>
          <!-- Title -->
          <h5 class="article-card-title mb-2">${safeTitle}</h5>
          <!-- Description -->
          <p class="article-card-desc flex-grow-1 mb-3">${safeDesc}</p>
          <!-- Footer: date + button -->
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="article-date"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style="margin-right:3px;vertical-align:-1px"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>${dateFormatted}</span>
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn-read">
              読む <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16" style="margin-left:2px"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>`;
}

// ---- Render ----

function renderCards() {
  const articles  = getFilteredArticles();
  const grid      = document.getElementById('cards-grid');
  const countEl   = document.getElementById('article-count');
  const noResults = document.getElementById('no-results');
  if (!grid || !countEl) return;

  countEl.textContent = articles.length;

  if (articles.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }
  if (noResults) noResults.style.display = 'none';
  grid.innerHTML = articles.map(createCardHTML).join('');
}

// ---- Event Listeners ----

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderCards();
    });
  }

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scroll-to-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ---- Boot ----

document.addEventListener('DOMContentLoaded', () => {
  buildCategoryFilter();
  renderCards();
  setupEventListeners();
});
