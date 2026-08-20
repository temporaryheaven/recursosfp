/* ==========================================================================
   Resources Directory SPA - Option 1 Application Logic
   Vanilla ES6 JavaScript Module with Direct Runtime Markdown Fetching & In-Browser Parsing
   ========================================================================== */

const CATEGORY_ICONS = {
  ACC: '♿',
  AGR: '🌱',
  AIA: '🧠',
  AUD: '🎙️',
  AUT: '⚡',
  BAF: '📊',
  CWS: '👥',
  CYB: '🛡️',
  DAT: '📈',
  DEV: '💻',
  FIB: '🖼️',
  HEA: '🩺',
  HSE: '🦺',
  IAG: '🎮',
  IDC: '🎨',
  LAN: '🗣️',
  LMS: '🎓',
  LOG: '📦',
  OER: '📚',
  PMT: '📋',
  REG: '📜',
  SEC: '☀️',
  TOU: '🌍',
  TST: '⚙️',
  VID: '🎥',
  VRE: '🥽'
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

// Google Apps Script Web App Endpoint URL for Resource Proposals
// Replace this string with your published Google Web App URL (e.g. 'https://script.google.com/macros/s/AKfycb.../exec')
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzGwp1XYOUuFYzmfbDg9zPDoMca2ioGWcG__K4ShJdkk11rAKNe4rQ2l_XDpAf-QXTY/exec';

const UI_TEXT = {
  ES: {
    appTitle: 'Recursos para Formadores',
    appSubtitle: 'Formación Profesional y Educación de Adultos',
    viewSlides: 'Diapositivas',
    viewExplorer: 'Explorador (78)',
    slideIndexTitle: 'Índice de Diapositivas',
    introBadge: 'Compendio Digital para Docentes',
    introTitle: 'Catálogo de Recursos Online para Formadores',
    introSubtitle: 'Herramientas digitales, software de simulación, repositorios multimedia sin copyright e Inteligencia Artificial aplicada a la Formación Profesional y Educación de Adultos.',
    statTools: 'Recursos',
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
    drawerMap: 'Taxonomía de Áreas de Aplicación',
    btnPropose: 'Proponer Recurso',
    modalProposeTitle: 'Proponer Nuevo Recurso',
    modalProposeSubtitle: 'Propón una herramienta digital para incluirla en el compendio. Será revisada por un administrador antes de publicarse.',
    lblPropName: 'Nombre de la Herramienta *',
    lblPropCategory: 'Categoría (o TBD si no existe) *',
    optCategoryTBD: 'TBD - Por determinar (Nueva categoría)',
    lblPropDifficulty: 'Nivel de Dificultad *',
    lblPropUrl: 'Sitio Web (URL) *',
    lblPropDescription: 'Descripción Corta *',
    lblPropExample: 'Ejemplo de Uso Educativo *',
    lblPropEmail: 'Tu Correo Electrónico (Opcional)',
    phPropName: 'Ej: Canva, GeoGebra, GitHub...',
    phPropUrl: 'https://ejemplo.com',
    phPropDesc: 'Resumen del valor y características principales de la herramienta...',
    phPropEx: 'Cómo se puede aplicar concretamente en clase o taller...',
    phPropEmail: 'docente@ejemplo.com (para avisarte si es aprobada)',
    btnCancel: 'Cancelar',
    btnSubmit: 'Enviar Propuesta',
    submitting: 'Enviando propuesta...',
    successMsg: '¡Propuesta enviada con éxito! Queda pendiente de revisión por el administrador.',
    errorMsg: 'Ocurrió un error al enviar la propuesta. Por favor intenta de nuevo.',
    themeDark: 'Oscuro',
    themeLight: 'Claro'
  },
  EN: {
    appTitle: 'Resources for Educators',
    appSubtitle: 'Vocational & Adult Education',
    viewSlides: 'Slides',
    viewExplorer: 'Explorer (78)',
    slideIndexTitle: 'Slide Index',
    introBadge: 'Digital Compendium for Educators',
    introTitle: 'Catalog of Online Resources for Trainers',
    introSubtitle: 'Digital tools, simulation software, copyright-free media repositories, and Artificial Intelligence applied to Vocational and Adult Education.',
    statTools: 'Resources',
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
    drawerMap: 'Application Areas Taxonomy',
    btnPropose: 'Propose Resource',
    modalProposeTitle: 'Propose New Resource',
    modalProposeSubtitle: 'Propose a digital tool to include in the catalog. It will be reviewed by an administrator before publishing.',
    lblPropName: 'Tool Name *',
    lblPropCategory: 'Category (or TBD if not applicable) *',
    optCategoryTBD: 'TBD - To be determined (New category)',
    lblPropDifficulty: 'Difficulty Level *',
    lblPropUrl: 'Website (URL) *',
    lblPropDescription: 'Short Description *',
    lblPropExample: 'Educational Use Example *',
    lblPropEmail: 'Your Email (Optional)',
    phPropName: 'E.g., Canva, GeoGebra, GitHub...',
    phPropUrl: 'https://example.com',
    phPropDesc: 'Brief summary of key features and educational value...',
    phPropEx: 'How to apply this specifically in a classroom or workshop...',
    phPropEmail: 'teacher@example.com (to notify you when approved)',
    btnCancel: 'Cancel',
    btnSubmit: 'Submit Proposal',
    submitting: 'Submitting proposal...',
    successMsg: 'Proposal submitted successfully! Pending administrator review.',
    errorMsg: 'An error occurred while submitting your proposal. Please try again.',
    themeDark: 'Dark',
    themeLight: 'Light'
  }
};

// Application State
const state = {
  lang: 'ES',
  viewMode: 'slides', // 'slides' | 'explorer'
  currentSlideIndex: 0, // 0 = Intro, 1 = Map, 2..13 = Category Slides
  isDrawerOpen: false,
  isProposeModalOpen: false,
  searchQuery: '',
  selectedCategory: 'ALL',
  selectedDifficulty: 'ALL',
  taxonomy: [],
  resources: [],
  theme: localStorage.getItem('app_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
};

// Initialize Application reliably across all browsers & script loading timings
function initApp() {
  initTheme();
  initEventListeners();
  loadData(state.lang);
}

// Theme Switcher Logic (Dark / Light)
function initTheme() {
  applyTheme(state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('app_theme', state.theme);
  applyTheme(state.theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const iconEl = document.getElementById('themeIcon');
  const labelEl = document.getElementById('themeLabel');
  const t = UI_TEXT[state.lang];
  if (iconEl && labelEl && t) {
    if (theme === 'light') {
      iconEl.textContent = '☀️';
      labelEl.textContent = t.themeLight;
    } else {
      iconEl.textContent = '🌙';
      labelEl.textContent = t.themeDark;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Initialize DOM Event Listeners
function initEventListeners() {
  const addSafeListener = (id, event, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  };

  // Mode Switcher
  addSafeListener('btnViewSlides', 'click', () => setViewMode('slides'));
  addSafeListener('btnViewExplorer', 'click', () => setViewMode('explorer'));
  addSafeListener('btnThemeToggle', 'click', toggleTheme);

  // Drawer Toggle
  addSafeListener('btnOpenDrawer', 'click', toggleDrawer);
  addSafeListener('btnCloseDrawer', 'click', closeDrawer);
  addSafeListener('drawerBackdrop', 'click', (e) => {
    if (e.target === document.getElementById('drawerBackdrop')) closeDrawer();
  });

  // Language Toggle
  addSafeListener('btnLangToggle', 'click', toggleLanguage);

  // Nav Buttons
  addSafeListener('btnPrev', 'click', prevSlide);
  addSafeListener('btnNext', 'click', nextSlide);

  // Search & Filters in Explorer
  addSafeListener('searchInput', 'input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    renderExplorer();
  });

  addSafeListener('filterCategory', 'change', (e) => {
    state.selectedCategory = e.target.value;
    renderExplorer();
  });

  addSafeListener('filterDifficulty', 'change', (e) => {
    state.selectedDifficulty = e.target.value;
    renderExplorer();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.isProposeModalOpen) {
        closeProposeModal();
        return;
      }
      if (state.isDrawerOpen) {
        closeDrawer();
        return;
      }
    }

    if (state.viewMode === 'slides' && !state.isProposeModalOpen && !state.isDrawerOpen) {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    }
  });

  // Propose Modal Event Listeners
  addSafeListener('btnOpenPropose', 'click', openProposeModal);
  addSafeListener('btnClosePropose', 'click', closeProposeModal);
  addSafeListener('btnCancelPropose', 'click', closeProposeModal);
  addSafeListener('proposeBackdrop', 'click', (e) => {
    if (e.target === document.getElementById('proposeBackdrop')) closeProposeModal();
  });
  addSafeListener('proposeForm', 'submit', handleProposalSubmit);
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
      const res = await fetch(`${path}?_t=${Date.now()}`, { cache: 'no-cache' });
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

  // Fallback to offline embedded data if fetch fails (e.g. file:// protocol CORS restrictions)
  if (!text) {
    const embeddedData = lang === 'ES' ? window.EMBEDDED_DATA_ES : window.EMBEDDED_DATA_EN;
    if (embeddedData) {
      console.log(`Using embedded offline dataset fallback for ${lang}`);
      text = embeddedData;
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

  // Update Propose Modal UI Text & Placeholders
  document.getElementById('txtProposeBtn').textContent = t.btnPropose;
  document.getElementById('modalProposeTitle').textContent = t.modalProposeTitle;
  document.getElementById('modalProposeSubtitle').textContent = t.modalProposeSubtitle;
  document.getElementById('lblPropName').textContent = t.lblPropName;
  document.getElementById('lblPropCategory').textContent = t.lblPropCategory;
  document.getElementById('lblPropDifficulty').textContent = t.lblPropDifficulty;
  document.getElementById('lblPropUrl').textContent = t.lblPropUrl;
  document.getElementById('lblPropDescription').textContent = t.lblPropDescription;
  document.getElementById('lblPropExample').textContent = t.lblPropExample;
  document.getElementById('lblPropEmail').textContent = t.lblPropEmail;

  document.getElementById('propName').placeholder = t.phPropName;
  document.getElementById('propUrl').placeholder = t.phPropUrl;
  document.getElementById('propDescription').placeholder = t.phPropDesc;
  document.getElementById('propExample').placeholder = t.phPropEx;
  document.getElementById('propEmail').placeholder = t.phPropEmail;
  document.getElementById('btnCancelPropose').textContent = t.btnCancel;
  document.getElementById('txtSubmitBtn').textContent = t.btnSubmit;

  // Populate Propose Category Dropdown
  const propCatSelect = document.getElementById('propCategory');
  if (propCatSelect) {
    propCatSelect.innerHTML = `<option value="TBD">${t.optCategoryTBD}</option>` +
      state.taxonomy.map(cat => `<option value="${cat.code}">${cat.code} - ${cat.name}</option>`).join('');
  }

  applyTheme(state.theme);
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
  const heroBannerName = state.lang === 'ES' ? 'hero_banner_es.jpg?v=5.0' : 'hero_banner.jpg?v=5.0';
  let heroBannerSrc = `./assets/${heroBannerName}`;
  try {
    heroBannerSrc = new URL(`assets/${heroBannerName}`, document.baseURI).href;
  } catch (e) {}

  let html = '';

  // Slide 0: Hero Intro
  html += `
    <div class="slide-content hero-slide ${state.currentSlideIndex === 0 ? 'active' : ''}">
      <div class="hero-banner-container">
        <img src="${heroBannerSrc}" onerror="if(!this.dataset.retry){this.dataset.retry='1';this.src='./assets/${heroBannerName}';}else if(this.dataset.retry==='1'){this.dataset.retry='2';this.src='assets/${heroBannerName}';}" alt="Educación Digital y Formación Profesional Banner" class="hero-banner-img">
      </div>
      <span class="hero-tag">${t.introBadge}</span>
      <h1 class="hero-title">${t.introTitle}</h1>
      <p class="hero-subtitle">${t.introSubtitle}</p>
      <div class="stats-grid">
        <button type="button" class="stat-card stat-card-interactive" onclick="setViewMode('explorer')" title="${state.lang === 'ES' ? 'Ir al Explorador de recursos' : 'Go to Resource Explorer'}">
          <div class="stat-number">${state.resources.length}</div>
          <div class="stat-label">${t.statTools}</div>
        </button>
        <button type="button" class="stat-card stat-card-interactive" onclick="jumpToSlide(1)" title="${state.lang === 'ES' ? 'Ir a Categorías de Herramientas' : 'Go to Tool Categories'}">
          <div class="stat-number">${state.taxonomy.length}</div>
          <div class="stat-label">${t.statCategories}</div>
        </button>
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
  const catObj = state.taxonomy.find(c => c.code === r.category);
  const catIcon = getCategoryIcon(catObj);
  const catName = catObj ? catObj.name : r.category;

  return `
    <div class="resource-card">
      <div>
        <div class="res-category-row">
          <div class="res-category-pill" onclick="jumpToCategorySlide('${r.category}')" title="${catName}">
            <span class="res-cat-icon">${catIcon}</span>
            <span class="res-cat-code">${r.category}</span>
            <span class="res-cat-label">• ${catName}</span>
          </div>
        </div>

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

// Propose Modal Controller & Submission Logic
function openProposeModal() {
  state.isProposeModalOpen = true;
  const proposeBackdrop = document.getElementById('proposeBackdrop');
  if (proposeBackdrop) {
    proposeBackdrop.classList.add('open');
    proposeBackdrop.style.display = 'flex';
  }
  const statusDiv = document.getElementById('proposeStatus');
  if (statusDiv) {
    statusDiv.className = 'form-status-msg';
    statusDiv.style.display = 'none';
  }
}

window.openProposeModal = openProposeModal;

function closeProposeModal() {
  state.isProposeModalOpen = false;
  const proposeBackdrop = document.getElementById('proposeBackdrop');
  if (proposeBackdrop) {
    proposeBackdrop.classList.remove('open');
    proposeBackdrop.style.display = 'none';
  }
}

window.closeProposeModal = closeProposeModal;

async function handleProposalSubmit(e) {
  e.preventDefault();
  const t = UI_TEXT[state.lang];
  const submitBtn = document.getElementById('btnSubmitPropose');
  const statusDiv = document.getElementById('proposeStatus');

  const formData = {
    name: document.getElementById('propName').value.trim(),
    category: document.getElementById('propCategory').value,
    difficulty: document.getElementById('propDifficulty').value,
    url: document.getElementById('propUrl').value.trim(),
    description: document.getElementById('propDescription').value.trim(),
    example: document.getElementById('propExample').value.trim(),
    email: document.getElementById('propEmail').value.trim(),
    submittedAt: new Date().toISOString(),
    lang: state.lang
  };

  submitBtn.disabled = true;
  statusDiv.style.display = 'block';
  statusDiv.className = 'form-status-msg loading';
  statusDiv.textContent = t.submitting;

  if (!GOOGLE_SCRIPT_URL) {
    // Demonstration mode when URL is not configured yet
    setTimeout(() => {
      statusDiv.className = 'form-status-msg success';
      statusDiv.textContent = `${t.successMsg} (${state.lang === 'ES' ? 'Modo demostración: configura GOOGLE_SCRIPT_URL en app.js para vincular tu Google Sheet' : 'Demo mode: set GOOGLE_SCRIPT_URL in app.js to connect your Google Sheet'})`;
      submitBtn.disabled = false;
      document.getElementById('proposeForm').reset();
    }, 700);
    return;
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(formData)
    });

    statusDiv.className = 'form-status-msg success';
    statusDiv.textContent = t.successMsg;
    document.getElementById('proposeForm').reset();
  } catch (err) {
    console.error('Error submitting proposal to Google Sheet:', err);
    statusDiv.className = 'form-status-msg error';
    statusDiv.textContent = t.errorMsg;
  } finally {
    submitBtn.disabled = false;
  }
}
