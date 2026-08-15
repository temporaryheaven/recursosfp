/* ==========================================================================
   Resources Directory SPA - Option 1 Application Logic
   Vanilla ES6 JavaScript Module with Direct Runtime Markdown Fetching & In-Browser Parsing
   ========================================================================== */

const CATEGORY_ICONS = {
  AIA: '🧠',
  CWS: '👥',
  DEV: '💻',
  FIB: '🖼️',
  IAG: '🎮',
  IDC: '🎨',
  LMS: '🎓',
  OER: '📚',
  REG: '📜',
  SEC: '☀️',
  TOU: '🌍',
  TST: '⚙️'
};

// Helper function to resolve category icon
function getCategoryIcon(cat) {
  if (!cat) return '📁';
  // 1. Check mapping dictionary in app.js
  if (cat.code && CATEGORY_ICONS[cat.code]) {
    return CATEGORY_ICONS[cat.code];
  }
  // 2. Extract emoji embedded in the category name if present in .md
  const emojiMatch = cat.name ? cat.name.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u) : null;
  if (emojiMatch) {
    return emojiMatch[0];
  }
  // 3. Fallback default
  return '📁';
}

const UI_TEXT = {
  ES: {
    appTitle: 'Recursos Gratuitos para Formadores',
    appSubtitle: 'Formación Profesional y Educación de Adultos',
    viewSlides: 'Diapositivas',
    viewExplorer: 'Explorador (77)',
    slideIndexTitle: 'Índice de Diapositivas',
    introBadge: 'Compendio Digital para Docentes',
    introTitle: 'Catálogo de Recursos Online Gratuitos para Formadores',
    introSubtitle: 'Herramientas digitales, software de simulación, repositorios multimedia sin copyright e Inteligencia Artificial aplicada a la Formación Profesional y Educación de Adultos.',
    statTools: 'Herramientas Libres',
    statCategories: 'Áreas de Aplicación',
    statEducational: 'Uso Educativo Directo',
    catMapTitle: 'Categorías de Herramientas',
    catMapSubtitle: 'Selecciona cualquier área para ir directamente a la diapositiva correspondiente:',
    btnCategories: 'Categorías',
    keyboardHint: 'Usa las flechas ← → para navegar',
    btnPrev: '← Anterior',
    btnNext: 'Siguiente →',
    searchPlaceholder: '🔍 Buscar herramienta, categoría o palabra clave...',
    allCategories: 'Todas las categorías',
    allDifficulties: 'Todas las dificultades',
    openWebsite: 'Abrir Sitio Web ↗',
    usageExample: '💡 Ejemplo de Uso:',
    noResults: 'No se encontraron herramientas que coincidan con la búsqueda.',
    resourcesCount: 'recursos',
    resourceSingle: 'recurso',
    drawerIntro: 'Bienvenida e Introducción',
    drawerMap: 'Taxonomía de Áreas de Aplicación'
  },
  EN: {
    appTitle: 'Free Resources for Educators',
    appSubtitle: 'Vocational & Adult Education',
    viewSlides: 'Slides',
    viewExplorer: 'Explorer (77)',
    slideIndexTitle: 'Slide Index',
    introBadge: 'Digital Compendium for Educators',
    introTitle: 'Catalog of Free Online Resources for Trainers',
    introSubtitle: 'Digital tools, simulation software, copyright-free media repositories, and Artificial Intelligence applied to Vocational and Adult Education.',
    statTools: 'Free Tools',
    statCategories: 'Application Areas',
    statEducational: 'Direct Educational Use',
    catMapTitle: 'Tool Categories',
    catMapSubtitle: 'Select any area to jump directly to its corresponding slide:',
    btnCategories: 'Categories',
    keyboardHint: 'Use ← → arrow keys to navigate',
    btnPrev: '← Previous',
    btnNext: 'Next →',
    searchPlaceholder: '🔍 Search tool, category, or keyword...',
    allCategories: 'All categories',
    allDifficulties: 'All difficulties',
    openWebsite: 'Open Website ↗',
    usageExample: '💡 Example Use Case:',
    noResults: 'No tools found matching your search query.',
    resourcesCount: 'resources',
    resourceSingle: 'resource',
    drawerIntro: 'Welcome & Introduction',
    drawerMap: 'Application Areas Taxonomy'
  }
};

// Application State
const state = {
  lang: 'ES',
  viewMode: 'slides', // 'slides' | 'explorer'
  currentSlideIndex: 0, // 0 = Intro, 1 = Map, 2..13 = Category Slides
  isDrawerOpen: false,
  searchQuery: '',
  selectedCategory: 'ALL',
  selectedDifficulty: 'ALL',
  taxonomy: [],
  resources: []
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadData(state.lang);
});

// Initialize DOM Event Listeners
function initEventListeners() {
  // Mode Switcher
  document.getElementById('btnViewSlides').addEventListener('click', () => setViewMode('slides'));
  document.getElementById('btnViewExplorer').addEventListener('click', () => setViewMode('explorer'));
  
  // Drawer Toggle
  document.getElementById('btnOpenDrawer').addEventListener('click', toggleDrawer);
  document.getElementById('btnCloseDrawer').addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', (e) => {
    if (e.target === document.getElementById('drawerBackdrop')) closeDrawer();
  });

  // Language Toggle
  document.getElementById('btnLangToggle').addEventListener('click', toggleLanguage);

  // Nav Buttons
  document.getElementById('btnPrev').addEventListener('click', prevSlide);
  document.getElementById('btnNext').addEventListener('click', nextSlide);

  // Search & Filters in Explorer
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    renderExplorer();
  });

  document.getElementById('filterCategory').addEventListener('change', (e) => {
    state.selectedCategory = e.target.value;
    renderExplorer();
  });

  document.getElementById('filterDifficulty').addEventListener('change', (e) => {
    state.selectedDifficulty = e.target.value;
    renderExplorer();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (state.isDrawerOpen && e.key === 'Escape') {
      closeDrawer();
      return;
    }
    
    if (state.viewMode === 'slides') {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    }
  });
}

// Fetch & Parse Markdown Data with Resilient Fallback Paths and Offline file:// Fallback
async function loadData(lang) {
  const baseName = lang === 'ES' ? 'resources_directory_es.md' : 'resources_directory_en.md';
  const candidatePaths = [
    baseName,
    './' + baseName,
    '../' + baseName,
    '/' + baseName
  ];

  let text = null;

  // Try dynamic server fetch first (for HTTP/HTTPS web servers)
  for (const path of candidatePaths) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        const fetchedText = await res.text();
        // Verify response is actual Markdown content, not an HTML 404 page
        if (fetchedText && !fetchedText.trim().startsWith('<!DOCTYPE') && !fetchedText.trim().startsWith('<html') && fetchedText.includes('|')) {
          text = fetchedText;
          break;
        }
      }
    } catch (err) {
      // CORS block on file:// or network error
    }
  }

  if (text) {
    parseMarkdown(text, lang);
    updateStaticUIText();
    renderUI();
  } else {
    console.error(`Failed to load markdown data for ${lang}.`);
  }
}

// Helper to calculate total slides dynamically (1 Intro + 1 Map + N Category slides)
function getTotalSlides() {
  return 2 + (state.taxonomy ? state.taxonomy.length : 0);
}

// In-Browser Markdown Parser
function parseMarkdown(text, lang) {
  if (!text || typeof text !== 'string') return;

  const taxonomy = [];
  const resources = [];
  const lines = text.split('\n');
  let mode = null;

  for (let rawLine of lines) {
    const line = rawLine.replace(/\r/g, '').trim();
    const lower = line.toLowerCase();

    // Section Headers (must start with ## to avoid matching title line 1)
    if (lower.startsWith('##') && (lower.includes('taxonomía') || lower.includes('taxonomy'))) {
      mode = 'tax';
      continue;
    } else if (lower.startsWith('##') && (lower.includes('tabla') || lower.includes('table') || lower.includes('directorio') || lower.includes('directory'))) {
      mode = 'res';
      continue;
    }

    if (mode === 'tax') {
      if (line.startsWith('|') && !line.includes('---')) {
        const rawParts = line.split('|').map(p => p.trim());
        if (rawParts.length >= 4) {
          const code = rawParts[1];
          const name = rawParts[2];
          const desc = rawParts[3];
          if (code && name && !code.includes('Código') && !code.includes('Code') && !code.includes('Category')) {
            taxonomy.push({ code, name, description: desc || '' });
          }
        }
      }
    } else if (mode === 'res') {
      if (line.startsWith('|') && !line.includes('---')) {
        const rawParts = line.split('|').map(p => p.trim());
        if (rawParts.length >= 7) {
          const category = rawParts[1];
          const name = rawParts[2];
          const description = rawParts[3];
          const example = rawParts[4];
          const difficulty = rawParts[5];
          const url = rawParts[6];
          if (category && name && !category.includes('Área') && !category.includes('Area')) {
            resources.push({
              category,
              name,
              description: description || '',
              example: example || '',
              difficulty: difficulty || 'Fácil',
              url: url || '#'
            });
          }
        }
      }
    }
  }

  state.taxonomy = taxonomy;
  state.resources = resources;

  // Clamp current slide index if taxonomy shrank
  const maxIdx = getTotalSlides() - 1;
  if (state.currentSlideIndex > maxIdx) {
    state.currentSlideIndex = maxIdx;
  }
}

// Update Static UI Text Labels based on Language
function updateStaticUIText() {
  const t = UI_TEXT[state.lang];
  document.getElementById('appTitle').textContent = t.appTitle;
  document.getElementById('appSubtitle').textContent = t.appSubtitle;
  document.getElementById('txtViewSlides').textContent = t.viewSlides;
  document.getElementById('txtViewExplorer').textContent = `${t.viewExplorer.split('(')[0].trim()} (${state.resources.length})`;
  document.getElementById('langLabel').textContent = state.lang;
  document.getElementById('drawerTitleText').textContent = t.slideIndexTitle;
  document.getElementById('btnPrev').innerHTML = t.btnPrev;
  document.getElementById('btnNext').innerHTML = t.btnNext;
  document.getElementById('searchInput').placeholder = t.searchPlaceholder;

  // Populate Category Filter Dropdown
  const catFilter = document.getElementById('filterCategory');
  catFilter.innerHTML = `<option value="ALL">${t.allCategories}</option>` + 
    state.taxonomy.map(cat => `<option value="${cat.code}">${cat.code} - ${cat.name}</option>`).join('');

  const diffFilter = document.getElementById('filterDifficulty');
  diffFilter.innerHTML = `
    <option value="ALL">${t.allDifficulties}</option>
    <option value="Fácil">${state.lang === 'ES' ? 'Fácil' : 'Easy'}</option>
    <option value="Media">${state.lang === 'ES' ? 'Media' : 'Medium'}</option>
    <option value="Difícil">${state.lang === 'ES' ? 'Difícil' : 'Difficult'}</option>
  `;
}

// Main UI Render Controller
function renderUI() {
  renderSlides();
  renderDrawer();
  renderExplorer();
  updateNavigation();
}

// Render Slide View
function renderSlides() {
  const container = document.getElementById('slideViewport');
  const t = UI_TEXT[state.lang];

  let html = '';

  // Slide 0: Hero Intro
  html += `
    <div class="slide-content hero-slide ${state.currentSlideIndex === 0 ? 'active' : ''}">
      <span class="hero-tag">${t.introBadge}</span>
      <h1 class="hero-title">${t.introTitle}</h1>
      <p class="hero-subtitle">${t.introSubtitle}</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${state.resources.length}</div>
          <div class="stat-label">${t.statTools}</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${state.taxonomy.length}</div>
          <div class="stat-label">${t.statCategories}</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">100%</div>
          <div class="stat-label">${t.statEducational}</div>
        </div>
      </div>
    </div>
  `;

  // Slide 1: Category Map Grid (Taxonomy)
  html += `
    <div class="slide-content category-map-slide ${state.currentSlideIndex === 1 ? 'active' : ''}">
      <h2>${t.catMapTitle}</h2>
      <p class="subtitle">${t.catMapSubtitle}</p>
      <div class="category-grid">
        ${state.taxonomy.map(cat => {
          const count = state.resources.filter(r => r.category === cat.code).length;
          const icon = getCategoryIcon(cat);
          return `
            <div class="category-card" onclick="jumpToCategorySlide('${cat.code}')">
              <div>
                <div class="cat-header-top">
                  <div class="cat-icon-badge">${icon}</div>
                  <span class="cat-code-badge">${cat.code}</span>
                </div>
                <div class="cat-name">${cat.name}</div>
                <div class="cat-desc">${cat.description}</div>
              </div>
              <div class="cat-footer">
                <span>${count} ${count === 1 ? t.resourceSingle : t.resourcesCount}</span>
                <span class="arrow">→</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Category Detail Slides
  state.taxonomy.forEach((cat, idx) => {
    const slideIdx = idx + 2;
    const catResources = state.resources.filter(r => r.category === cat.code);
    const icon = getCategoryIcon(cat);

    html += `
      <div class="slide-content category-detail-slide ${state.currentSlideIndex === slideIdx ? 'active' : ''}">
        <div class="category-detail-header">
          <div class="cat-info-left">
            <div class="cat-title-row">
              <span class="cat-lg-badge">${cat.code}</span>
              <h2 class="cat-title-text">${cat.name}</h2>
            </div>
            <p class="cat-summary-text">${cat.description}</p>
          </div>
          <div class="cat-info-right">
            <button class="btn-back-cats" onclick="jumpToSlide(1)">${t.btnCategories}</button>
            <span class="cat-count-chip">${catResources.length} ${catResources.length === 1 ? t.resourceSingle : t.resourcesCount}</span>
          </div>
        </div>

        <div class="resources-grid">
          ${catResources.map(r => renderResourceCard(r)).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Render Single Resource Card Component
function renderResourceCard(r) {
  const t = UI_TEXT[state.lang];
  const diffClass = r.difficulty.toLowerCase();
  return `
    <div class="resource-card">
      <div>
        <div class="res-header">
          <h3 class="res-name">${r.name}</h3>
          <span class="difficulty-badge ${diffClass}">${r.difficulty}</span>
        </div>
        <p class="res-desc">${r.description}</p>
        <div class="res-example-box">
          <strong>${t.usageExample}</strong> ${r.example}
        </div>
      </div>
      <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="res-link-btn">
        ${t.openWebsite}
      </a>
    </div>
  `;
}

// Render Slide Drawer List
function renderDrawer() {
  const listContainer = document.getElementById('drawerList');
  const t = UI_TEXT[state.lang];

  let items = [
    { badge: 'INTRO', title: t.drawerIntro, index: 0 },
    { badge: 'MAPA', title: t.drawerMap, index: 1 },
    ...state.taxonomy.map((cat, i) => ({
      badge: cat.code,
      title: cat.name,
      index: i + 2
    }))
  ];

  listContainer.innerHTML = items.map(item => `
    <div class="drawer-item ${state.currentSlideIndex === item.index ? 'active' : ''}" onclick="jumpToSlide(${item.index})">
      <div class="drawer-item-left">
        <span class="drawer-badge">${item.badge}</span>
        <span class="drawer-item-title">${item.title}</span>
      </div>
      <span class="arrow">›</span>
    </div>
  `).join('');
}

// Render Explorer Grid View
function renderExplorer() {
  const gridContainer = document.getElementById('explorerGrid');
  const t = UI_TEXT[state.lang];

  let filtered = state.resources.filter(r => {
    // Search Filter
    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchEx = r.example.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchEx && !matchCat) return false;
    }
    // Category Filter
    if (state.selectedCategory !== 'ALL' && r.category !== state.selectedCategory) {
      return false;
    }
    // Difficulty Filter
    if (state.selectedDifficulty !== 'ALL' && r.difficulty.toLowerCase() !== state.selectedDifficulty.toLowerCase()) {
      return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">${t.noResults}</div>`;
    return;
  }

  gridContainer.innerHTML = filtered.map(r => renderResourceCard(r)).join('');
}

// Navigation Controls Update
function updateNavigation() {
  const totalSlides = getTotalSlides();
  const currentNum = state.currentSlideIndex + 1;

  // Counter badge
  document.getElementById('slideCounter').innerHTML = `
    <span class="dot"></span> ${currentNum} / ${totalSlides}
  `;

  // Buttons state
  document.getElementById('btnPrev').disabled = state.currentSlideIndex === 0;
  document.getElementById('btnNext').disabled = state.currentSlideIndex === totalSlides - 1;

  // Pagination Dots
  const dotsContainer = document.getElementById('paginationDots');
  dotsContainer.innerHTML = Array.from({ length: totalSlides }).map((_, i) => `
    <div class="dot-item ${i === state.currentSlideIndex ? 'active' : ''}" onclick="jumpToSlide(${i})"></div>
  `).join('');
}

// Actions
function nextSlide() {
  const totalSlides = getTotalSlides();
  if (state.currentSlideIndex < totalSlides - 1) {
    state.currentSlideIndex++;
    renderUI();
  }
}

function prevSlide() {
  if (state.currentSlideIndex > 0) {
    state.currentSlideIndex--;
    renderUI();
  }
}

function jumpToSlide(index) {
  state.currentSlideIndex = index;
  closeDrawer();
  if (state.viewMode !== 'slides') setViewMode('slides');
  renderUI();
}

window.jumpToSlide = jumpToSlide;

function jumpToCategorySlide(categoryCode) {
  const idx = state.taxonomy.findIndex(cat => cat.code === categoryCode);
  if (idx !== -1) {
    jumpToSlide(idx + 2);
  }
}

window.jumpToCategorySlide = jumpToCategorySlide;

function setViewMode(mode) {
  state.viewMode = mode;
  document.getElementById('btnViewSlides').classList.toggle('active', mode === 'slides');
  document.getElementById('btnViewExplorer').classList.toggle('active', mode === 'explorer');
  
  document.getElementById('slideViewport').style.display = mode === 'slides' ? 'flex' : 'none';
  document.getElementById('bottomNav').style.display = mode === 'slides' ? 'flex' : 'none';
  document.getElementById('explorerView').classList.toggle('active', mode === 'explorer');
}

function toggleDrawer() {
  state.isDrawerOpen = !state.isDrawerOpen;
  document.getElementById('drawerBackdrop').classList.toggle('open', state.isDrawerOpen);
}

function closeDrawer() {
  state.isDrawerOpen = false;
  document.getElementById('drawerBackdrop').classList.remove('open');
}

function toggleLanguage() {
  state.lang = state.lang === 'ES' ? 'EN' : 'ES';
  loadData(state.lang);
}
