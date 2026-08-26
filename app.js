/* ==========================================================================
   Resources Directory SPA - Application Logic & State Controller
   Vanilla ES6 JavaScript Module with Direct Runtime Markdown Fetching,
   Offline Fallback, Google Drive OAuth & Cross-Device Favorites Sync
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
  if (cat.code && CATEGORY_ICONS[cat.code]) {
    return CATEGORY_ICONS[cat.code];
  }
  const emojiMatch = cat.name ? cat.name.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u) : null;
  if (emojiMatch) {
    return emojiMatch[0];
  }
  return '📁';
}

// Google Apps Script Web App Endpoint URL for Resource Proposals
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyr2tAlAVOfuZwQfJsFMmW4_RhTbkZ7RyyaFuMdycymdcIwbkt5mBga_jrdJnxYZ01/exec'

//old 'https://script.google.com/macros/s/AKfycbzGwp1XYOUuFYzmfbDg9zPDoMca2ioGWcG__K4ShJdkk11rAKNe4rQ2l_XDpAf-QXTY/exec';

// Google Drive OAuth 2.0 Web Client ID
let GOOGLE_DRIVE_CLIENT_ID = localStorage.getItem('vet_custom_gdrive_client_id') || '428111596741-e02ns1rk7t5f7cr61pumjlms1vqqrvgd.apps.googleusercontent.com';

let tokenClient = null;
let googleAccessToken = null;
let googleTokenExpiresAt = 0;

const UI_TEXT = {
  ES: {
    appTitle: 'Recursos para Formadores',
    appSubtitle: 'Formación Profesional y Educación de Adultos',
    viewSlides: 'Diapositivas',
    viewExplorer: 'Explorador',
    viewFavorites: 'Favoritos',
    slideIndexTitle: 'Índice de Diapositivas',
    introBadge: 'Compendio Digital para Docentes',
    introTitle: 'Catálogo de Recursos Online para Formadores',
    introSubtitle: 'Herramientas digitales, software de simulación, repositorios multimedia sin copyright e Inteligencia Artificial aplicada a la Formación Profesional y Educación de Adultos.',
    statTools: 'Recursos',
    statCategories: 'Áreas de Aplicación',
    statFavorites: 'Favoritos',
    statEducational: 'Uso Educativo Directo',
    catMapTitle: 'Categorías de Herramientas',
    catMapSubtitle: 'Selecciona cualquier área para ir directamente a la diapositiva correspondiente:',
    btnCategories: 'Categorías',
    keyboardHint: 'Usa las flechas ← → para navegar',
    btnPrev: '← Anterior',
    btnNext: 'Siguiente →',
    searchPlaceholder: '🔍 Buscar herramienta, categoría o palabra clave...',
    favSearchPlaceholder: '🔍 Buscar en tus favoritos...',
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
    errorMsg: 'Ocurrió un error al procesar la solicitud. Por favor intenta de nuevo.',
    // Feedback & Suggestions Modal
    btnFeedback: 'Feedback',
    modalFeedbackTitle: 'Enviar Sugerencia o Feedback',
    modalFeedbackSubtitle: 'Propón nuevas funciones, cambios, mejoras o reporta incidencias sobre la aplicación al administrador.',
    lblFbType: 'Tipo de Aportación *',
    optFbFeature: '💡 Nueva Funcionalidad',
    optFbImprovement: '🛠️ Mejora o Cambio',
    optFbBug: '🐛 Reporte de Error',
    optFbGeneral: '💬 Comentario General',
    lblFbSubject: 'Asunto / Título *',
    phFbSubject: 'Resumen breve de tu sugerencia...',
    lblFbMessage: 'Descripción Detallada *',
    phFbMessage: 'Explica tu idea, mejora o el problema encontrado con el mayor detalle posible...',
    lblFbEmail: 'Tu Correo Electrónico (Opcional)',
    phFbEmail: 'tu-email@ejemplo.com (si deseas recibir respuesta)',
    btnSubmitFeedback: 'Enviar Mensaje',
    feedbackSubmitting: 'Enviando mensaje...',
    feedbackSuccessMsg: '¡Mensaje enviado con éxito! Muchas gracias por colaborar en la mejora de la aplicación.',
    feedbackErrorMsg: 'Ocurrió un error al enviar tu mensaje. Por favor intenta de nuevo.',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
    // Favorites & Backup
    favTooltipAdd: 'Añadir a favoritos',
    favTooltipRemove: 'Quitar de favoritos',
    favEmptyTitle: 'Sin favoritos guardados',
    favEmptyDesc: 'Explora el catálogo y haz clic en la estrella de cualquier recurso para guardarlo aquí y tenerlo siempre a mano.',
    favEmptyBtn: 'Explorar Recursos',
    btnBackup: 'Sincronizar / Copia',
    btnClearFavorites: 'Limpiar',
    favClearConfirm: '¿Estás seguro de que deseas eliminar todos tus favoritos guardados?',
    modalBackupTitle: 'Copia de Seguridad y Sincronización',
    modalBackupSubtitle: 'Guarda y restaura tus recursos favoritos en Google Drive o transfiérelos entre dispositivos sin perder tu selección.',
    gdriveTitle: 'Google Drive (Nube)',
    gdriveDesc: 'Sincroniza directamente con tu cuenta personal de Google.',
    btnSaveGDrive: 'Guardar en Google Drive',
    btnRestoreGDrive: 'Restaurar de Google Drive',
    tabExport: 'Exportar',
    tabImport: 'Importar',
    exportJSONTitle: 'Archivo JSON',
    exportJSONDesc: 'Descarga un archivo con tus favoritos para guardarlo donde quieras.',
    btnExportJSON: 'Descargar Archivo',
    exportLinkTitle: 'Enlace Portátil (URL)',
    exportLinkDesc: 'Abre este enlace en otro dispositivo para cargar tus favoritos al instante.',
    btnCopyLink: 'Copiar Enlace',
    exportCodeTitle: 'Código de Respaldo',
    exportCodeDesc: 'Copia un texto compacto para enviártelo por mensaje o notas.',
    btnCopyCode: 'Copiar Código',
    lblRestoreMode: '⚙️ Modo al restaurar:',
    mergeModeMerge: 'Combinar con actuales',
    mergeModeReplace: 'Sobrescribir / Reemplazar todo',
    dropzonePrompt: 'Haz clic para seleccionar tu archivo JSON de respaldo',
    lblImportCode: 'O pega un código / enlace de respaldo:',
    btnApplyImport: 'Restaurar',
    copiedToClipboard: '¡Copiado al portapapeles con éxito!',
    gdriveConnecting: 'Conectando con Google Drive...',
    gdriveSaved: '¡Favoritos guardados en tu Google Drive con éxito!',
    gdriveRestored: '¡Favoritos restaurados desde tu Google Drive!',
    gdriveNotFound: 'No se encontró el archivo de copia previa en tu Google Drive.',
    gdriveNeedClientId: 'Configura tu Google Client ID para habilitar la sincronización directa con Google Drive.',
    gdriveSaveError: 'Error al guardar en Google Drive: {detail}',
    gdriveRestoreError: 'Error al restaurar de Google Drive: {detail}',
    gdriveAuthError: 'Error de autenticación con Google: {detail}',
    syncPromptIncoming: 'Se han detectado {count} favoritos en este enlace. ¿Deseas cargarlos en tu aplicación?',
    restoreSuccess: '¡Favoritos restaurados con éxito! ({count} favoritos guardados)',
    restoreSuccessReplaced: '¡Favoritos sobrescritos con éxito! ({count} favoritos guardados)',
    restoreSuccessMerged: '¡Favoritos combinados con éxito! ({count} favoritos guardados)',
    restoreInvalid: 'El archivo o código de respaldo no es válido.'
  },
  EN: {
    appTitle: 'Resources for Educators',
    appSubtitle: 'Vocational & Adult Education',
    viewSlides: 'Slides',
    viewExplorer: 'Explorer',
    viewFavorites: 'Favourites',
    slideIndexTitle: 'Slide Index',
    introBadge: 'Digital Compendium for Educators',
    introTitle: 'Catalog of Online Resources for Trainers',
    introSubtitle: 'Digital tools, simulation software, copyright-free media repositories, and Artificial Intelligence applied to Vocational and Adult Education.',
    statTools: 'Resources',
    statCategories: 'Application Areas',
    statFavorites: 'Favourites',
    statEducational: 'Direct Educational Use',
    catMapTitle: 'Tool Categories',
    catMapSubtitle: 'Select any area to jump directly to its corresponding slide:',
    btnCategories: 'Categories',
    keyboardHint: 'Use ← → arrow keys to navigate',
    btnPrev: '← Previous',
    btnNext: 'Next →',
    searchPlaceholder: '🔍 Search tool, category, or keyword...',
    favSearchPlaceholder: '🔍 Search in your favourites...',
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
    errorMsg: 'An error occurred while processing your request. Please try again.',
    // Feedback & Suggestions Modal
    btnFeedback: 'Feedback',
    modalFeedbackTitle: 'Send Suggestion or Feedback',
    modalFeedbackSubtitle: 'Propose new features, changes, improvements, or report issues directly to the administrator.',
    lblFbType: 'Feedback Type *',
    optFbFeature: '💡 Feature Request',
    optFbImprovement: '🛠️ Improvement or Change',
    optFbBug: '🐛 Bug Report',
    optFbGeneral: '💬 General Feedback',
    lblFbSubject: 'Subject / Title *',
    phFbSubject: 'Brief summary of your suggestion...',
    lblFbMessage: 'Detailed Description *',
    phFbMessage: 'Explain your idea, improvement, or the issue found with as much detail as possible...',
    lblFbEmail: 'Your Email (Optional)',
    phFbEmail: 'your-email@example.com (if you wish to receive a reply)',
    btnSubmitFeedback: 'Send Feedback',
    feedbackSubmitting: 'Sending feedback...',
    feedbackSuccessMsg: 'Message sent successfully! Thank you for helping improve the application.',
    feedbackErrorMsg: 'An error occurred while sending your message. Please try again.',
    themeDark: 'Dark',
    themeLight: 'Light',
    // Favorites & Backup
    favTooltipAdd: 'Add to favourites',
    favTooltipRemove: 'Remove from favourites',
    favEmptyTitle: 'No favourites saved yet',
    favEmptyDesc: 'Explore the catalog and click the star on any resource to bookmark it here for quick access.',
    favEmptyBtn: 'Explore Resources',
    btnBackup: 'Sync / Backup',
    btnClearFavorites: 'Clear',
    favClearConfirm: 'Are you sure you want to remove all saved favourites?',
    modalBackupTitle: 'Backup & Synchronization',
    modalBackupSubtitle: 'Save and restore your favourite resources to Google Drive or transfer them across devices seamlessly.',
    gdriveTitle: 'Google Drive (Cloud)',
    gdriveDesc: 'Sync directly with your personal Google account.',
    btnSaveGDrive: 'Save to Google Drive',
    btnRestoreGDrive: 'Restore from Google Drive',
    tabExport: 'Export',
    tabImport: 'Import',
    exportJSONTitle: 'JSON File',
    exportJSONDesc: 'Download a backup file with your favourites to store anywhere.',
    btnExportJSON: 'Download File',
    exportLinkTitle: 'Portable Link (URL)',
    exportLinkDesc: 'Open this link on another device to load your favourites instantly.',
    btnCopyLink: 'Copy Link',
    exportCodeTitle: 'Backup Code',
    exportCodeDesc: 'Copy a compact text code to transfer via messaging or notes.',
    btnCopyCode: 'Copy Code',
    lblRestoreMode: '⚙️ Restore mode:',
    mergeModeMerge: 'Merge with current',
    mergeModeReplace: 'Overwrite / Replace all',
    dropzonePrompt: 'Click to select your JSON backup file',
    lblImportCode: 'Or paste a backup code / sync link:',
    btnApplyImport: 'Restore',
    copiedToClipboard: 'Successfully copied to clipboard!',
    gdriveConnecting: 'Connecting to Google Drive...',
    gdriveSaved: 'Favourites successfully saved to your Google Drive!',
    gdriveRestored: 'Favourites successfully restored from your Google Drive!',
    gdriveNotFound: 'No previous backup found in your Google Drive.',
    gdriveNeedClientId: 'Please configure your Google Client ID to enable direct Google Drive sync.',
    gdriveSaveError: 'Error saving to Google Drive: {detail}',
    gdriveRestoreError: 'Error restoring from Google Drive: {detail}',
    gdriveAuthError: 'Google authentication error: {detail}',
    syncPromptIncoming: '{count} favourites detected in this link. Would you like to load them?',
    restoreSuccess: 'Favourites restored successfully! ({count} saved)',
    restoreSuccessReplaced: 'Favourites overwritten successfully! ({count} saved)',
    restoreSuccessMerged: 'Favourites merged successfully! ({count} saved)',
    restoreInvalid: 'The backup file or code provided is invalid.'
  }
};

// Application State
const state = {
  lang: 'ES',
  viewMode: 'slides', // 'slides' | 'explorer' | 'favorites'
  currentSlideIndex: 0, // 0 = Intro, 1 = Map, 2..N = Category Slides
  isDrawerOpen: false,
  isProposeModalOpen: false,
  isFeedbackModalOpen: false,
  isBackupModalOpen: false,
  searchQuery: '',
  selectedCategory: 'ALL',
  selectedDifficulty: 'ALL',
  favSearchQuery: '',
  favSelectedCategory: 'ALL',
  taxonomy: [],
  resources: [],
  favorites: loadStoredFavorites(),
  theme: localStorage.getItem('app_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
};

// Persistent Storage Helpers
function loadStoredFavorites() {
  try {
    const raw = localStorage.getItem('vet_resources_favorites');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (e) {
    console.warn('Could not parse stored favorites', e);
  }
  return new Set();
}

function saveStoredFavorites() {
  try {
    localStorage.setItem('vet_resources_favorites', JSON.stringify(Array.from(state.favorites)));
  } catch (e) {
    console.warn('Could not save favorites to localStorage', e);
  }
}

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
  addSafeListener('btnViewFavorites', 'click', () => setViewMode('favorites'));
  addSafeListener('btnThemeToggle', 'click', toggleTheme);

  // Drawer Toggle
  addSafeListener('btnOpenDrawer', 'click', toggleDrawer);
  addSafeListener('btnCloseDrawer', 'click', closeDrawer);
  addSafeListener('drawerBackdrop', 'click', (e) => {
    if (e.target === document.getElementById('drawerBackdrop')) closeDrawer();
  });

  // Language Toggle
  addSafeListener('btnLangToggle', 'click', toggleLanguage);

  // Nav Buttons (Slides)
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

  // Search & Filters in Favorites
  addSafeListener('favSearchInput', 'input', (e) => {
    state.favSearchQuery = e.target.value.toLowerCase();
    renderFavorites();
  });

  addSafeListener('favFilterCategory', 'change', (e) => {
    state.favSelectedCategory = e.target.value;
    renderFavorites();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.isFeedbackModalOpen) {
        closeFeedbackModal();
        return;
      }
      if (state.isBackupModalOpen) {
        closeBackupModal();
        return;
      }
      if (state.isProposeModalOpen) {
        closeProposeModal();
        return;
      }
      if (state.isDrawerOpen) {
        closeDrawer();
        return;
      }
    }

    if (state.viewMode === 'slides' && !state.isProposeModalOpen && !state.isFeedbackModalOpen && !state.isDrawerOpen && !state.isBackupModalOpen) {
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

  // Feedback Modal Event Listeners
  addSafeListener('btnOpenFeedback', 'click', openFeedbackModal);
  addSafeListener('btnCloseFeedback', 'click', closeFeedbackModal);
  addSafeListener('btnCancelFeedback', 'click', closeFeedbackModal);
  addSafeListener('feedbackBackdrop', 'click', (e) => {
    if (e.target === document.getElementById('feedbackBackdrop')) closeFeedbackModal();
  });
  addSafeListener('feedbackForm', 'submit', handleFeedbackSubmit);

  // Backup Modal Backdrop Click
  addSafeListener('backupBackdrop', 'click', (e) => {
    if (e.target === document.getElementById('backupBackdrop')) closeBackupModal();
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
      const res = await fetch(`${path}?_t=${Date.now()}`, { cache: 'no-cache' });
      if (res.ok) {
        const fetchedText = await res.text();
        if (fetchedText && !fetchedText.trim().startsWith('<!DOCTYPE') && !fetchedText.trim().startsWith('<html') && fetchedText.includes('|')) {
          text = fetchedText;
          break;
        }
      }
    } catch (err) {
      // Network/CORS block
    }
  }

  // Fallback to offline embedded dataset
  if (!text) {
    const embeddedData = lang === 'ES' ? window.EMBEDDED_DATA_ES : window.EMBEDDED_DATA_EN;
    if (embeddedData) {
      text = embeddedData;
    }
  }

  if (text) {
    parseMarkdown(text, lang);
    updateStaticUIText();
    renderUI();
    checkURLSyncParams();
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
  document.getElementById('txtViewExplorer').textContent = `${t.viewExplorer} (${state.resources.length})`;
  document.getElementById('txtViewFavorites').textContent = `${t.viewFavorites} (${state.favorites.size})`;
  document.getElementById('langLabel').textContent = state.lang;
  document.getElementById('drawerTitleText').textContent = t.slideIndexTitle;
  document.getElementById('btnPrev').innerHTML = t.btnPrev;
  document.getElementById('btnNext').innerHTML = t.btnNext;
  document.getElementById('searchInput').placeholder = t.searchPlaceholder;

  // Favorites UI Text
  const favSearchInput = document.getElementById('favSearchInput');
  if (favSearchInput) favSearchInput.placeholder = t.favSearchPlaceholder;
  const txtFavEmptyTitle = document.getElementById('txtFavEmptyTitle');
  if (txtFavEmptyTitle) txtFavEmptyTitle.textContent = t.favEmptyTitle;
  const txtFavEmptyDesc = document.getElementById('txtFavEmptyDesc');
  if (txtFavEmptyDesc) txtFavEmptyDesc.textContent = t.favEmptyDesc;
  const txtFavEmptyBtn = document.getElementById('txtFavEmptyBtn');
  if (txtFavEmptyBtn) txtFavEmptyBtn.textContent = t.favEmptyBtn;
  const txtBackupBtn = document.getElementById('txtBackupBtn');
  if (txtBackupBtn) txtBackupBtn.textContent = t.btnBackup;
  const txtClearBtn = document.getElementById('txtClearBtn');
  if (txtClearBtn) txtClearBtn.textContent = t.btnClearFavorites;

  // Populate Category Filter Dropdown (Explorer)
  const catFilter = document.getElementById('filterCategory');
  catFilter.innerHTML = `<option value="ALL">${t.allCategories}</option>` +
    state.taxonomy.map(cat => `<option value="${cat.code}">${cat.code} - ${cat.name}</option>`).join('');

  // Populate Category Filter Dropdown (Favorites)
  const favCatFilter = document.getElementById('favFilterCategory');
  if (favCatFilter) {
    favCatFilter.innerHTML = `<option value="ALL">${t.allCategories}</option>` +
      state.taxonomy.map(cat => `<option value="${cat.code}">${cat.code} - ${cat.name}</option>`).join('');
  }

  const diffFilter = document.getElementById('filterDifficulty');
  diffFilter.innerHTML = `
    <option value="ALL">${t.allDifficulties}</option>
    <option value="Fácil">${state.lang === 'ES' ? 'Fácil' : 'Easy'}</option>
    <option value="Media">${state.lang === 'ES' ? 'Media' : 'Medium'}</option>
    <option value="Difícil">${state.lang === 'ES' ? 'Difícil' : 'Difficult'}</option>
  `;

  // Backup Modal UI Texts
  const modalBackupTitle = document.getElementById('modalBackupTitle');
  if (modalBackupTitle) modalBackupTitle.textContent = t.modalBackupTitle;
  const modalBackupSubtitle = document.getElementById('modalBackupSubtitle');
  if (modalBackupSubtitle) modalBackupSubtitle.textContent = t.modalBackupSubtitle;
  const txtGDriveTitle = document.getElementById('txtGDriveTitle');
  if (txtGDriveTitle) txtGDriveTitle.textContent = t.gdriveTitle;
  const txtGDriveDesc = document.getElementById('txtGDriveDesc');
  if (txtGDriveDesc) txtGDriveDesc.textContent = t.gdriveDesc;
  const txtBtnSaveGDrive = document.getElementById('txtBtnSaveGDrive');
  if (txtBtnSaveGDrive) txtBtnSaveGDrive.textContent = t.btnSaveGDrive;
  const txtBtnRestoreGDrive = document.getElementById('txtBtnRestoreGDrive');
  if (txtBtnRestoreGDrive) txtBtnRestoreGDrive.textContent = t.btnRestoreGDrive;

  const txtTabExport = document.getElementById('txtTabExport');
  if (txtTabExport) txtTabExport.textContent = t.tabExport;
  const txtTabImport = document.getElementById('txtTabImport');
  if (txtTabImport) txtTabImport.textContent = t.tabImport;

  const txtExportJSONTitle = document.getElementById('txtExportJSONTitle');
  if (txtExportJSONTitle) txtExportJSONTitle.textContent = t.exportJSONTitle;
  const txtExportJSONDesc = document.getElementById('txtExportJSONDesc');
  if (txtExportJSONDesc) txtExportJSONDesc.textContent = t.exportJSONDesc;
  const txtBtnExportJSON = document.getElementById('txtBtnExportJSON');
  if (txtBtnExportJSON) txtBtnExportJSON.textContent = t.btnExportJSON;

  const txtExportLinkTitle = document.getElementById('txtExportLinkTitle');
  if (txtExportLinkTitle) txtExportLinkTitle.textContent = t.exportLinkTitle;
  const txtExportLinkDesc = document.getElementById('txtExportLinkDesc');
  if (txtExportLinkDesc) txtExportLinkDesc.textContent = t.exportLinkDesc;
  const txtBtnCopyLink = document.getElementById('txtBtnCopyLink');
  if (txtBtnCopyLink) txtBtnCopyLink.textContent = t.btnCopyLink;

  const txtExportCodeTitle = document.getElementById('txtExportCodeTitle');
  if (txtExportCodeTitle) txtExportCodeTitle.textContent = t.exportCodeTitle;
  const txtExportCodeDesc = document.getElementById('txtExportCodeDesc');
  if (txtExportCodeDesc) txtExportCodeDesc.textContent = t.exportCodeDesc;
  const txtBtnCopyCode = document.getElementById('txtBtnCopyCode');
  if (txtBtnCopyCode) txtBtnCopyCode.textContent = t.btnCopyCode;

  const lblRestoreMode = document.getElementById('lblRestoreMode');
  if (lblRestoreMode) lblRestoreMode.textContent = t.lblRestoreMode;
  const txtMergeModeMerge = document.getElementById('txtMergeModeMerge');
  if (txtMergeModeMerge) txtMergeModeMerge.textContent = t.mergeModeMerge;
  const txtMergeModeReplace = document.getElementById('txtMergeModeReplace');
  if (txtMergeModeReplace) txtMergeModeReplace.textContent = t.mergeModeReplace;
  const txtDropzonePrompt = document.getElementById('txtDropzonePrompt');
  if (txtDropzonePrompt) txtDropzonePrompt.textContent = t.dropzonePrompt;
  const lblImportCode = document.getElementById('lblImportCode');
  if (lblImportCode) lblImportCode.textContent = t.lblImportCode;
  const txtBtnApplyImport = document.getElementById('txtBtnApplyImport');
  if (txtBtnApplyImport) txtBtnApplyImport.textContent = t.btnApplyImport;

  // Propose Modal UI Text
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

  const propCatSelect = document.getElementById('propCategory');
  if (propCatSelect) {
    propCatSelect.innerHTML = `<option value="TBD">${t.optCategoryTBD}</option>` +
      state.taxonomy.map(cat => `<option value="${cat.code}">${cat.code} - ${cat.name}</option>`).join('');
  }

  // Feedback Modal UI Text
  const txtFeedbackBtn = document.getElementById('txtFeedbackBtn');
  if (txtFeedbackBtn) txtFeedbackBtn.textContent = t.btnFeedback;
  const modalFeedbackTitle = document.getElementById('modalFeedbackTitle');
  if (modalFeedbackTitle) modalFeedbackTitle.textContent = t.modalFeedbackTitle;
  const modalFeedbackSubtitle = document.getElementById('modalFeedbackSubtitle');
  if (modalFeedbackSubtitle) modalFeedbackSubtitle.textContent = t.modalFeedbackSubtitle;
  const lblFbType = document.getElementById('lblFbType');
  if (lblFbType) lblFbType.textContent = t.lblFbType;
  const optFbFeature = document.getElementById('optFbFeature');
  if (optFbFeature) optFbFeature.textContent = t.optFbFeature;
  const optFbImprovement = document.getElementById('optFbImprovement');
  if (optFbImprovement) optFbImprovement.textContent = t.optFbImprovement;
  const optFbBug = document.getElementById('optFbBug');
  if (optFbBug) optFbBug.textContent = t.optFbBug;
  const optFbGeneral = document.getElementById('optFbGeneral');
  if (optFbGeneral) optFbGeneral.textContent = t.optFbGeneral;
  const lblFbSubject = document.getElementById('lblFbSubject');
  if (lblFbSubject) lblFbSubject.textContent = t.lblFbSubject;
  const fbSubject = document.getElementById('fbSubject');
  if (fbSubject) fbSubject.placeholder = t.phFbSubject;
  const lblFbMessage = document.getElementById('lblFbMessage');
  if (lblFbMessage) lblFbMessage.textContent = t.lblFbMessage;
  const fbMessage = document.getElementById('fbMessage');
  if (fbMessage) fbMessage.placeholder = t.phFbMessage;
  const lblFbEmail = document.getElementById('lblFbEmail');
  if (lblFbEmail) lblFbEmail.textContent = t.lblFbEmail;
  const fbEmail = document.getElementById('fbEmail');
  if (fbEmail) fbEmail.placeholder = t.phFbEmail;
  const btnCancelFeedback = document.getElementById('btnCancelFeedback');
  if (btnCancelFeedback) btnCancelFeedback.textContent = t.btnCancel;
  const txtSubmitFeedbackBtn = document.getElementById('txtSubmitFeedbackBtn');
  if (txtSubmitFeedbackBtn) txtSubmitFeedbackBtn.textContent = t.btnSubmitFeedback;

  applyTheme(state.theme);
}

// Main UI Render Controller
function renderUI() {
  renderSlides();
  renderDrawer();
  renderExplorer();
  renderFavorites();
  updateNavigation();
  updateFavoriteBadges();
}

// Render Slide View
function renderSlides() {
  const container = document.getElementById('slideViewport');
  const t = UI_TEXT[state.lang];
  const heroBannerName = state.lang === 'ES' ? 'hero_banner_es.jpg?v=5.1' : 'hero_banner.jpg?v=5.1';
  let heroBannerSrc = `./assets/${heroBannerName}`;
  try {
    heroBannerSrc = new URL(`assets/${heroBannerName}`, document.baseURI).href;
  } catch (e) { }

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
        <button type="button" class="stat-card stat-card-interactive" onclick="setViewMode('favorites')" title="${state.lang === 'ES' ? 'Ver mis Favoritos' : 'View my Favourites'}">
          <div class="stat-number" id="heroFavCounter">${state.favorites.size}</div>
          <div class="stat-label">⭐ ${t.statFavorites}</div>
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

// Render Single Resource Card Component with Bookmarking
function renderResourceCard(r) {
  const t = UI_TEXT[state.lang];
  const diffClass = r.difficulty.toLowerCase();
  const catObj = state.taxonomy.find(c => c.code === r.category);
  const catIcon = getCategoryIcon(catObj);
  const catName = catObj ? catObj.name : r.category;
  const isFav = state.favorites.has(r.name);
  const escapedName = r.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');

  return `
    <div class="resource-card ${isFav ? 'is-favorited' : ''}">
      <button type="button" 
              class="btn-fav-toggle ${isFav ? 'active' : ''}" 
              data-resource="${r.name.replace(/"/g, '&quot;')}"
              onclick="toggleFavorite(event, '${escapedName}')"
              title="${isFav ? t.favTooltipRemove : t.favTooltipAdd}"
              aria-label="${isFav ? t.favTooltipRemove : t.favTooltipAdd}"
              aria-pressed="${isFav ? 'true' : 'false'}">
        <span class="fav-star">★</span>
      </button>

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

// Favorites Controller & Interaction
function toggleFavorite(e, resourceName) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  if (state.favorites.has(resourceName)) {
    state.favorites.delete(resourceName);
  } else {
    state.favorites.add(resourceName);
  }

  saveStoredFavorites();
  updateFavoriteBadges();

  if (state.viewMode === 'favorites') {
    renderFavorites();
  } else {
    const isFav = state.favorites.has(resourceName);
    document.querySelectorAll(`.btn-fav-toggle[data-resource="${CSS.escape(resourceName)}"]`).forEach(btn => {
      btn.classList.toggle('active', isFav);
      btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
      btn.title = isFav ? UI_TEXT[state.lang].favTooltipRemove : UI_TEXT[state.lang].favTooltipAdd;
      const card = btn.closest('.resource-card');
      if (card) card.classList.toggle('is-favorited', isFav);
    });
  }
}

window.toggleFavorite = toggleFavorite;

function updateFavoriteBadges() {
  const count = state.favorites.size;
  const t = UI_TEXT[state.lang];
  const navBtn = document.getElementById('txtViewFavorites');
  if (navBtn) navBtn.textContent = `${t.viewFavorites} (${count})`;
  const heroFavCounter = document.getElementById('heroFavCounter');
  if (heroFavCounter) heroFavCounter.textContent = count;
}

// Render Favorites View
function renderFavorites() {
  const gridContainer = document.getElementById('favoritesGrid');
  const emptyStateEl = document.getElementById('favoritesEmptyState');
  if (!gridContainer || !emptyStateEl) return;

  const t = UI_TEXT[state.lang];
  const favResources = state.resources.filter(r => state.favorites.has(r.name));

  if (favResources.length === 0) {
    gridContainer.style.display = 'none';
    emptyStateEl.style.display = 'flex';
    return;
  }

  gridContainer.style.display = 'grid';
  emptyStateEl.style.display = 'none';

  let filtered = favResources.filter(r => {
    if (state.favSearchQuery) {
      const q = state.favSearchQuery;
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchEx = r.example.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchEx && !matchCat) return false;
    }
    if (state.favSelectedCategory !== 'ALL' && r.category !== state.favSelectedCategory) {
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

function confirmClearFavorites() {
  const t = UI_TEXT[state.lang];
  if (state.favorites.size === 0) return;
  if (confirm(t.favClearConfirm)) {
    state.favorites.clear();
    saveStoredFavorites();
    updateFavoriteBadges();
    renderFavorites();
    renderExplorer();
    renderSlides();
  }
}

window.confirmClearFavorites = confirmClearFavorites;

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
    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchEx = r.example.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchEx && !matchCat) return false;
    }
    if (state.selectedCategory !== 'ALL' && r.category !== state.selectedCategory) {
      return false;
    }
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

  document.getElementById('slideCounter').innerHTML = `
    <span class="dot"></span> ${currentNum} / ${totalSlides}
  `;

  document.getElementById('btnPrev').disabled = state.currentSlideIndex === 0;
  document.getElementById('btnNext').disabled = state.currentSlideIndex === totalSlides - 1;

  const dotsContainer = document.getElementById('paginationDots');
  dotsContainer.innerHTML = Array.from({ length: totalSlides }).map((_, i) => `
    <div class="dot-item ${i === state.currentSlideIndex ? 'active' : ''}" onclick="jumpToSlide(${i})"></div>
  `).join('');
}

// Slide Actions
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
  document.getElementById('btnViewFavorites').classList.toggle('active', mode === 'favorites');

  document.getElementById('slideViewport').style.display = mode === 'slides' ? 'flex' : 'none';
  document.getElementById('bottomNav').style.display = mode === 'slides' ? 'flex' : 'none';
  document.getElementById('explorerView').classList.toggle('active', mode === 'explorer');
  document.getElementById('favoritesView').classList.toggle('active', mode === 'favorites');

  if (mode === 'favorites') {
    renderFavorites();
  }
}

window.setViewMode = setViewMode;

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

// Propose Modal Controller
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
    setTimeout(() => {
      statusDiv.className = 'form-status-msg success';
      statusDiv.textContent = t.successMsg;
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

// Feedback & Suggestions Modal Controller
function openFeedbackModal() {
  state.isFeedbackModalOpen = true;
  const feedbackBackdrop = document.getElementById('feedbackBackdrop');
  if (feedbackBackdrop) {
    feedbackBackdrop.classList.add('open');
    feedbackBackdrop.style.display = 'flex';
  }
  const statusDiv = document.getElementById('feedbackStatus');
  if (statusDiv) {
    statusDiv.className = 'form-status-msg';
    statusDiv.style.display = 'none';
  }
}

window.openFeedbackModal = openFeedbackModal;

function closeFeedbackModal() {
  state.isFeedbackModalOpen = false;
  const feedbackBackdrop = document.getElementById('feedbackBackdrop');
  if (feedbackBackdrop) {
    feedbackBackdrop.classList.remove('open');
    feedbackBackdrop.style.display = 'none';
  }
}

window.closeFeedbackModal = closeFeedbackModal;

async function handleFeedbackSubmit(e) {
  e.preventDefault();
  const t = UI_TEXT[state.lang];
  const submitBtn = document.getElementById('btnSubmitFeedback');
  const statusDiv = document.getElementById('feedbackStatus');

  const formData = {
    type: 'feedback',
    feedbackType: document.getElementById('fbType').value,
    subject: document.getElementById('fbSubject').value.trim(),
    message: document.getElementById('fbMessage').value.trim(),
    email: document.getElementById('fbEmail').value.trim(),
    context: {
      viewMode: state.viewMode,
      activeSlideIndex: state.currentSlideIndex,
      lang: state.lang
    },
    submittedAt: new Date().toISOString(),
    lang: state.lang
  };

  submitBtn.disabled = true;
  statusDiv.style.display = 'block';
  statusDiv.className = 'form-status-msg loading';
  statusDiv.textContent = t.feedbackSubmitting;

  if (!GOOGLE_SCRIPT_URL) {
    setTimeout(() => {
      statusDiv.className = 'form-status-msg success';
      statusDiv.textContent = t.feedbackSuccessMsg;
      submitBtn.disabled = false;
      document.getElementById('feedbackForm').reset();
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
    statusDiv.textContent = t.feedbackSuccessMsg;
    document.getElementById('feedbackForm').reset();
  } catch (err) {
    console.error('Error submitting feedback to Google Sheet:', err);
    statusDiv.className = 'form-status-msg error';
    statusDiv.textContent = t.feedbackErrorMsg;
  } finally {
    submitBtn.disabled = false;
  }
}

// Backup & Sync Modal Controller
function openBackupModal() {
  state.isBackupModalOpen = true;
  const backdrop = document.getElementById('backupBackdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    backdrop.style.display = 'flex';
  }
  const statusDiv = document.getElementById('backupStatus');
  if (statusDiv) {
    statusDiv.style.display = 'none';
    statusDiv.className = 'form-status-msg';
  }
}

window.openBackupModal = openBackupModal;

function closeBackupModal() {
  state.isBackupModalOpen = false;
  const backdrop = document.getElementById('backupBackdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    backdrop.style.display = 'none';
  }
}

window.closeBackupModal = closeBackupModal;

function switchBackupTab(tabName) {
  const tabExportBtn = document.getElementById('tabBtnExport');
  const tabImportBtn = document.getElementById('tabBtnImport');
  const contentExport = document.getElementById('tabContentExport');
  const contentImport = document.getElementById('tabContentImport');

  if (tabName === 'export') {
    tabExportBtn.classList.add('active');
    tabImportBtn.classList.remove('active');
    contentExport.classList.add('active');
    contentImport.classList.remove('active');
  } else {
    tabExportBtn.classList.remove('active');
    tabImportBtn.classList.add('active');
    contentExport.classList.remove('active');
    contentImport.classList.add('active');
  }
}

window.switchBackupTab = switchBackupTab;

function showBackupStatus(msg, type = 'success') {
  const statusDiv = document.getElementById('backupStatus');
  if (statusDiv) {
    statusDiv.style.display = 'block';
    statusDiv.className = `form-status-msg ${type}`;
    statusDiv.textContent = msg;
  }
}

// Helper to extract detailed Google Drive API error messages
async function extractDriveApiError(res, contextMsg) {
  let detail = '';
  try {
    const data = await res.json();
    if (data && data.error) {
      if (typeof data.error === 'string') {
        detail = data.error;
      } else if (data.error.message) {
        detail = data.error.message;
        if (data.error.errors && Array.isArray(data.error.errors) && data.error.errors.length > 0) {
          const reason = data.error.errors[0].reason;
          if (reason && !detail.includes(reason)) {
            detail += ` [${reason}]`;
          }
        }
      }
    }
  } catch (e) {
    try {
      detail = await res.text();
    } catch (e2) {
      detail = res.statusText || `HTTP ${res.status}`;
    }
  }
  if (!detail) {
    detail = res.statusText || `HTTP ${res.status}`;
  }
  return `${contextMsg} (${res.status}): ${detail}`;
}

// Google Drive OAuth 2.0 (Google Identity Services)
function initGoogleDriveOAuth(onSuccess) {
  const t = UI_TEXT[state.lang];

  if (!GOOGLE_DRIVE_CLIENT_ID) {
    const promptMsg = state.lang === 'ES'
      ? 'Introduce tu Google OAuth Client ID (obtenido en Google Cloud Console, consulta GOOGLE_DRIVE_SETUP.md):'
      : 'Enter your Google OAuth Client ID (from Google Cloud Console, see GOOGLE_DRIVE_SETUP.md):';
    const userEntered = prompt(promptMsg, GOOGLE_DRIVE_CLIENT_ID);
    if (userEntered && userEntered.trim()) {
      GOOGLE_DRIVE_CLIENT_ID = userEntered.trim();
      localStorage.setItem('vet_custom_gdrive_client_id', GOOGLE_DRIVE_CLIENT_ID);
    } else {
      showBackupStatus(t.gdriveNeedClientId, 'error');
      return;
    }
  }

  if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    showBackupStatus(
      state.lang === 'ES'
        ? 'El servicio Google Identity SDK no se pudo cargar. Comprueba tu conexión a Internet o extensiones de bloqueo.'
        : 'Google Identity SDK could not be loaded. Please check your network connection or ad-blockers.',
      'error'
    );
    return;
  }

  if (googleAccessToken && Date.now() < googleTokenExpiresAt - 60000) {
    if (onSuccess) onSuccess(googleAccessToken);
    return;
  }

  showBackupStatus(t.gdriveConnecting, 'loading');

  try {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_DRIVE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          console.error('Google OAuth token error:', tokenResponse);
          const errorMsg = tokenResponse.error_description || tokenResponse.error;
          const template = t.gdriveAuthError || `${t.errorMsg} ({detail})`;
          showBackupStatus(template.replace('{detail}', errorMsg), 'error');
          return;
        }
        googleAccessToken = tokenResponse.access_token;
        const expiresInSec = parseInt(tokenResponse.expires_in, 10) || 3599;
        googleTokenExpiresAt = Date.now() + (expiresInSec * 1000);
        if (onSuccess) onSuccess(googleAccessToken);
      }
    });

    tokenClient.requestAccessToken({ prompt: '' });
  } catch (err) {
    console.error('Failed to request Google OAuth token', err);
    const detailMsg = err && err.message ? err.message : String(err);
    const template = t.gdriveAuthError || `${t.errorMsg} ({detail})`;
    showBackupStatus(template.replace('{detail}', detailMsg), 'error');
  }
}

async function uploadToGoogleDrive(accessToken, fileId, jsonStr) {
  const metadata = {
    name: 'vet_favoritos_backup.json',
    mimeType: 'application/json',
    description: 'Copia de seguridad de recursos favoritos - VET Resources SPA'
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([jsonStr], { type: 'application/json' }));

  const url = fileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

  const method = fileId ? 'PATCH' : 'POST';

  console.log(`[GoogleDrive] Enviando ${method} a: ${url}`);

  return await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`
      // Note: No Content-Type header set manually; the browser creates multipart/form-data with the correct boundary
    },
    body: form
  });
}

async function saveFavoritesToGoogleDrive() {
  const t = UI_TEXT[state.lang];
  initGoogleDriveOAuth(async (accessToken) => {
    try {
      showBackupStatus(t.submitting, 'loading');
      const backupData = {
        app: 'VET_Resources_SPA',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        count: state.favorites.size,
        favorites: Array.from(state.favorites)
      };
      const jsonStr = JSON.stringify(backupData, null, 2);

      // 1. Search for existing file
      let existingFileId = null;
      try {
        const searchRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name%3D%27vet_favoritos_backup.json%27+and+trashed%3Dfalse&fields=files(id%2Cname)`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.files && searchData.files.length > 0) {
            existingFileId = searchData.files[0].id;
            console.log('[GoogleDrive] Archivo previo encontrado ID:', existingFileId);
          }
        } else if (searchRes.status === 401) {
          googleAccessToken = null;
          throw new Error(await extractDriveApiError(searchRes, 'Error de autorización'));
        }
      } catch (searchErr) {
        console.warn('[GoogleDrive] Error buscando archivo previo:', searchErr);
      }

      let saveRes = null;

      // 2. If existing file found, try updating it with PATCH
      if (existingFileId) {
        try {
          saveRes = await uploadToGoogleDrive(accessToken, existingFileId, jsonStr);
          console.log('[GoogleDrive] Respuesta PATCH:', saveRes.status);
          if (!saveRes.ok && (saveRes.status === 404 || saveRes.status === 403)) {
            console.warn('[GoogleDrive] No se pudo sobrescribir archivo previo (403/404), creando nuevo...');
            saveRes = null; // trigger POST fallback
          }
        } catch (patchErr) {
          console.warn('[GoogleDrive] Falló PATCH, intentando POST nuevo...', patchErr);
          saveRes = null;
        }
      }

      // 3. If no existing file or PATCH failed, create new with POST
      if (!saveRes) {
        saveRes = await uploadToGoogleDrive(accessToken, null, jsonStr);
        console.log('[GoogleDrive] Respuesta POST nuevo:', saveRes.status);
      }

      if (!saveRes.ok) {
        if (saveRes.status === 401) googleAccessToken = null;
        const context = state.lang === 'ES' ? 'Error guardando en Google Drive' : 'Error saving to Google Drive';
        const errDetail = await extractDriveApiError(saveRes, context);
        throw new Error(errDetail);
      }

      showBackupStatus(t.gdriveSaved, 'success');
    } catch (err) {
      console.error('Error saving to Google Drive:', err);
      let detailMsg = err && err.message ? err.message : String(err);
      if (detailMsg.toLowerCase().includes('failed to fetch')) {
        detailMsg = state.lang === 'ES'
          ? 'Error de red o conexión bloqueada (CORS). Comprueba tu conexión o que tu URL esté en los orígenes autorizados de Google Cloud.'
          : 'Network error or CORS block. Check your connection or Authorized JavaScript origins in Google Cloud Console.';
      }
      const template = t.gdriveSaveError || `${t.errorMsg} ({detail})`;
      showBackupStatus(template.replace('{detail}', detailMsg), 'error');
    }
  });
}

window.saveFavoritesToGoogleDrive = saveFavoritesToGoogleDrive;

async function restoreFavoritesFromGoogleDrive() {
  const t = UI_TEXT[state.lang];
  initGoogleDriveOAuth(async (accessToken) => {
    try {
      showBackupStatus(t.submitting, 'loading');
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name%3D%27vet_favoritos_backup.json%27+and+trashed%3Dfalse&fields=files(id%2Cname)`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!searchRes.ok) {
        if (searchRes.status === 401) googleAccessToken = null;
        const context = state.lang === 'ES' ? 'Error buscando copia en Google Drive' : 'Error searching backup in Google Drive';
        const errDetail = await extractDriveApiError(searchRes, context);
        throw new Error(errDetail);
      }

      const searchData = await searchRes.json();
      if (!searchData.files || searchData.files.length === 0) {
        showBackupStatus(t.gdriveNotFound, 'error');
        return;
      }

      const fileId = searchData.files[0].id;
      const fileRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!fileRes.ok) {
        if (fileRes.status === 401) googleAccessToken = null;
        const context = state.lang === 'ES' ? 'Error descargando archivo de Google Drive' : 'Error downloading file from Google Drive';
        const errDetail = await extractDriveApiError(fileRes, context);
        throw new Error(errDetail);
      }
      const backupData = await fileRes.json();
      const mergeMode = document.querySelector('input[name="restoreMergeMode"]:checked')?.value || 'merge';
      applyFavoritesImport(backupData.favorites || backupData, mergeMode);
    } catch (err) {
      console.error('Error restoring from Google Drive:', err);
      const detailMsg = err && err.message ? err.message : String(err);
      const template = t.gdriveRestoreError || `${t.errorMsg} ({detail})`;
      showBackupStatus(template.replace('{detail}', detailMsg), 'error');
    }
  });
}

window.restoreFavoritesFromGoogleDrive = restoreFavoritesFromGoogleDrive;

// JSON File Export & Import
function exportFavoritesJSON() {
  const backupData = {
    app: 'VET_Resources_SPA',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    count: state.favorites.size,
    favorites: Array.from(state.favorites)
  };
  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vet_favoritos_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showBackupStatus(UI_TEXT[state.lang].copiedToClipboard.replace('portapapeles', 'disco'), 'success');
}

window.exportFavoritesJSON = exportFavoritesJSON;

function handleFileImport(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const parsed = JSON.parse(evt.target.result);
      const items = Array.isArray(parsed) ? parsed : (parsed.favorites || []);
      const mergeMode = document.querySelector('input[name="restoreMergeMode"]:checked')?.value || 'merge';
      applyFavoritesImport(items, mergeMode);
    } catch (err) {
      showBackupStatus(UI_TEXT[state.lang].restoreInvalid, 'error');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

window.handleFileImport = handleFileImport;

// Portable URL Sync Link
function generateSyncLink() {
  const indices = [];
  state.resources.forEach((r, idx) => {
    if (state.favorites.has(r.name)) {
      indices.push(idx);
    }
  });
  const url = new URL(window.location.href.split('?')[0]);
  url.searchParams.set('favs', indices.join(','));
  return url.toString();
}

function copySyncLink() {
  const link = generateSyncLink();
  navigator.clipboard.writeText(link).then(() => {
    showBackupStatus(UI_TEXT[state.lang].copiedToClipboard, 'success');
  }).catch(() => {
    prompt(state.lang === 'ES' ? 'Copia este enlace:' : 'Copy this link:', link);
  });
}

window.copySyncLink = copySyncLink;

// Compact Clipboard Code Sync
function generateSyncCode() {
  const indices = [];
  state.resources.forEach((r, idx) => {
    if (state.favorites.has(r.name)) {
      indices.push(idx);
    }
  });
  return `VET-FAV:1:${indices.join(',')}:${Math.floor(Date.now() / 1000)}`;
}

function copySyncCode() {
  const code = generateSyncCode();
  navigator.clipboard.writeText(code).then(() => {
    showBackupStatus(UI_TEXT[state.lang].copiedToClipboard, 'success');
  }).catch(() => {
    prompt(state.lang === 'ES' ? 'Copia este código:' : 'Copy this code:', code);
  });
}

window.copySyncCode = copySyncCode;

function handleCodeImport() {
  const inputEl = document.getElementById('importCodeInput');
  const val = inputEl ? inputEl.value.trim() : '';
  if (!val) return;

  const mergeMode = document.querySelector('input[name="restoreMergeMode"]:checked')?.value || 'merge';

  if (val.includes('?favs=') || val.includes('&favs=')) {
    try {
      const parsedUrl = new URL(val, window.location.origin);
      const favsParam = parsedUrl.searchParams.get('favs');
      if (favsParam) {
        parseAndApplyIndices(favsParam, mergeMode);
        inputEl.value = '';
        return;
      }
    } catch (e) { }
  }

  if (val.startsWith('VET-FAV:')) {
    const parts = val.split(':');
    if (parts.length >= 3) {
      parseAndApplyIndices(parts[2], mergeMode);
      inputEl.value = '';
      return;
    }
  }

  try {
    const parsed = JSON.parse(val);
    const items = Array.isArray(parsed) ? parsed : (parsed.favorites || []);
    applyFavoritesImport(items, mergeMode);
    inputEl.value = '';
    return;
  } catch (e) { }

  showBackupStatus(UI_TEXT[state.lang].restoreInvalid, 'error');
}

window.handleCodeImport = handleCodeImport;

function parseAndApplyIndices(indicesStr, mode) {
  const indices = indicesStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  const importedNames = [];
  indices.forEach(idx => {
    if (state.resources[idx]) {
      importedNames.push(state.resources[idx].name);
    }
  });
  applyFavoritesImport(importedNames, mode);
}

function applyFavoritesImport(namesArray, mode = 'merge') {
  if (!Array.isArray(namesArray)) {
    showBackupStatus(UI_TEXT[state.lang].restoreInvalid, 'error');
    return;
  }

  if (mode === 'replace') {
    state.favorites.clear();
  }

  namesArray.forEach(name => {
    if (typeof name === 'string' && name.trim()) {
      state.favorites.add(name.trim());
    }
  });

  saveStoredFavorites();
  renderFavorites();
  updateFavoriteBadges();
  renderSlides();
  renderExplorer();

  const t = UI_TEXT[state.lang];
  const msgTemplate = mode === 'replace' ? t.restoreSuccessReplaced : t.restoreSuccessMerged;
  showBackupStatus(msgTemplate.replace('{count}', state.favorites.size), 'success');
}

function checkURLSyncParams() {
  const params = new URLSearchParams(window.location.search);
  const favsParam = params.get('favs');
  if (favsParam && state.resources.length > 0) {
    const count = favsParam.split(',').filter(x => x.trim().length > 0).length;
    const t = UI_TEXT[state.lang];
    const confirmMsg = t.syncPromptIncoming.replace('{count}', count);
    if (confirm(confirmMsg)) {
      parseAndApplyIndices(favsParam, 'merge');
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      setViewMode('favorites');
    }
  }
}
