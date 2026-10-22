/* Pal Optical Master Price List Application Engine */
import { INITIAL_PRICE_LIST_DATA } from './data/priceListData.js';

const STORAGE_KEY = 'pal_optical_price_list_v1';
const CALC_STORAGE_KEY = 'pal_optical_quote_cart';

export class PriceListEngine {
  constructor() {
    this.data = this.loadData();
    this.quoteItems = this.loadQuoteCart();
    
    // Check URL query param for default view
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    this.currentView = (viewParam && ['all', 'page1', 'page2', 'page3', 'cheatsheet', 'directory'].includes(viewParam))
      ? viewParam
      : 'all';

    this.isEditing = false;
    this.searchQuery = '';
    this.activeDiagramTarget = null;
    this.selectedModalPreset = 'thickness-bevel';
    this.transitionsDarkness = 85; // 0 (clear) to 100 (full dark)
    this.arActive = true;

    this.initDOM();
    this.syncActiveTabUI();
    this.bindEvents();
    this.render();
  }

  syncActiveTabUI() {
    if (this.viewTabs) {
      this.viewTabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === this.currentView);
      });
    }
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load price list from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_PRICE_LIST_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.showToast('Changes saved to local storage');
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  loadQuoteCart() {
    try {
      const saved = localStorage.getItem(CALC_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  }

  saveQuoteCart() {
    try {
      localStorage.setItem(CALC_STORAGE_KEY, JSON.stringify(this.quoteItems));
    } catch (e) {}
    this.updateCalculatorUI();
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2400);
  }

  initDOM() {
    this.viewport = document.getElementById('sheets-viewport');
    this.editToggle = document.getElementById('edit-toggle');
    this.searchInput = document.getElementById('lens-search');
    this.viewTabs = document.getElementById('view-tabs');
    this.calcDock = document.getElementById('calculator-dock');
    this.calcCount = document.getElementById('calc-count');
    this.calcTotalVal = document.getElementById('calc-total-val');
    this.calcItemsList = document.getElementById('calc-items-list');

    this.diagramModal = document.getElementById('diagram-modal');
  }

  bindEvents() {
    // Tab switching
    if (this.viewTabs) {
      this.viewTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        this.viewTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentView = btn.dataset.view;
        this.render();
      });
    }

    // Edit toggle
    if (this.editToggle) {
      this.editToggle.addEventListener('change', (e) => {
        this.isEditing = e.target.checked;
        document.body.classList.toggle('is-editing', this.isEditing);
        const text = document.getElementById('edit-mode-text');
        if (text) text.textContent = this.isEditing ? 'Editing Active' : 'Edit Mode';
        this.render();
      });
    }

    // Search filter
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.applySearchFilter();
      });
    }

    // Calculator Dock Toggle
    const toggleCalcBtn = document.getElementById('btn-toggle-calc');
    if (toggleCalcBtn) {
      toggleCalcBtn.addEventListener('click', () => {
        if (this.calcDock) {
          const isHidden = this.calcDock.style.display === 'none';
          this.calcDock.style.display = isHidden ? 'flex' : 'none';
        }
      });
    }

    const calcCloseBtn = document.getElementById('calc-close-btn');
    if (calcCloseBtn) {
      calcCloseBtn.addEventListener('click', () => {
        if (this.calcDock) this.calcDock.style.display = 'none';
      });
    }

    const calcClearBtn = document.getElementById('calc-clear-btn');
    if (calcClearBtn) {
      calcClearBtn.addEventListener('click', () => {
        this.quoteItems = [];
        this.saveQuoteCart();
      });
    }

    const calcCopyBtn = document.getElementById('calc-copy-btn');
    if (calcCopyBtn) {
      calcCopyBtn.addEventListener('click', () => {
        this.copyQuoteToClipboard();
      });
    }

    // Backup & Export JSON
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportJSON());
    }

    // Reset Defaults
    const resetBtn = document.getElementById('btn-reset-defaults');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all prices, notes, and diagrams to original shop defaults? Custom edits will be replaced.')) {
          this.data = JSON.parse(JSON.stringify(INITIAL_PRICE_LIST_DATA));
          this.saveData();
          this.render();
          this.showToast('Reset to original default price list.');
        }
      });
    }

    // Print
    const printBtn = document.getElementById('btn-print');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Modal Diagram Select
    if (this.diagramModal) {
      const closeBtn = document.getElementById('modal-diagram-close');
      const cancelBtn = document.getElementById('modal-diagram-cancel');
      const saveBtn = document.getElementById('modal-diagram-save');

      const closeModal = () => this.diagramModal.classList.remove('active');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

      // Preset click
      const presets = this.diagramModal.querySelectorAll('.preset-card');
      presets.forEach(card => {
        card.addEventListener('click', () => {
          presets.forEach(p => p.classList.remove('selected'));
          card.classList.add('selected');
          this.selectedModalPreset = card.dataset.preset;
        });
      });

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          this.saveDiagramSelection();
          closeModal();
        });
      }
    }
  }

  render() {
    if (!this.viewport) return;
    this.viewport.innerHTML = '';

    const showAll = this.currentView === 'all';

    if (showAll || this.currentView === 'page1') {
      this.viewport.appendChild(this.createSheetElement(1, this.data.page1));
    }
    if (showAll || this.currentView === 'page2') {
      this.viewport.appendChild(this.createSheetElement(2, this.data.page2));
    }
    if (showAll || this.currentView === 'page3') {
      this.viewport.appendChild(this.createSheetElement(3, this.data.page3));
    }
    if (showAll || this.currentView === 'cheatsheet') {
      this.viewport.appendChild(this.createCheatSheetElement());
    }
    if (showAll || this.currentView === 'directory') {
      this.viewport.appendChild(this.createDirectorySheetElement());
    }

    this.updateCalculatorUI();
    this.bindSheetInteractions();
    if (this.searchQuery) {
      this.applySearchFilter();
    }
  }

  createSheetElement(pageNumber, pageData) {
    const sheet = document.createElement('article');
    sheet.className = `price-sheet page-${pageNumber}`;
    sheet.id = `sheet-page-${pageNumber}`;

    // Subtitle text for each page
    let subDesc = 'Clear Optical Lenses & High Performance Progressives';
    if (pageNumber === 2) subDesc = 'Transitions® Light Intelligent & Variable Sunwear Lenses';
    if (pageNumber === 3) subDesc = 'Polarized, Ray-Ban Authentic, Coatings, Lab & Dispensary Fees';

    // Header
    const headerHTML = `
      <header class="sheet-header">
        <div class="header-logo-group">
          <h1 class="brand-h1">Pal Optical <em>Price List</em></h1>
          <span class="header-subtext">${subDesc}</span>
        </div>
        <div class="header-page-tag">PAGE ${pageNumber} OF 3</div>
      </header>
    `;

    // Sections partition into 2 columns
    const half = Math.ceil(pageData.sections.length / 2);
    const col1Sections = pageData.sections.slice(0, half);
    const col2Sections = pageData.sections.slice(half);

    const renderSections = (sections) => {
      return sections.map(sec => {
        let themeClass = 'theme-blue';
        if (sec.id.includes('poly')) themeClass = 'theme-teal';
        if (sec.id.includes('trivex')) themeClass = 'theme-indigo';
        if (sec.id.includes('hi-index')) themeClass = 'theme-purple';
        if (sec.id.includes('glass')) themeClass = 'theme-charcoal';
        if (sec.id.includes('coatings') || sec.id.includes('rayban')) themeClass = 'theme-amber';

        const noticeBannerHTML = sec.noticeBanner ? `
          <div class="notice-box notice-info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            ${sec.noticeBanner}
          </div>
        ` : '';

        const warningBannerHTML = sec.warningBanner ? `
          <div class="notice-box notice-warning">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            ${sec.warningBanner}
          </div>
        ` : '';

        const rowsHTML = sec.items.map(item => {
          const formattedPrice = item.price !== null ? `$${Number(item.price).toFixed(2)}` : (item.priceNote || '—');
          const isStar = item.star ? '<span class="item-star" title="Popular House Favorite">★</span>' : '';
          const unitHTML = item.unit ? `<span class="unit-tag">${item.unit}</span>` : '';
          const highClass = item.highlighted ? 'highlighted-row' : '';

          return `
            <tr class="${highClass}" data-item-id="${item.id}" data-sec-id="${sec.id}" data-page="${pageNumber}">
              <td class="item-name-cell">
                <span class="${this.isEditing ? 'editable-cell' : ''}" 
                      contenteditable="${this.isEditing}" 
                      data-field="name" 
                      spellcheck="false">${item.name}</span>${isStar}
              </td>
              <td class="item-price-cell price-clickable" title="Click to add to Quote Calculator">
                <span class="${this.isEditing ? 'editable-cell' : ''}" 
                      contenteditable="${this.isEditing}" 
                      data-field="price" 
                      spellcheck="false">${formattedPrice}</span>${unitHTML}
              </td>
              <td class="edit-row-actions">
                <button class="btn-delete-row" title="Delete item" data-item-id="${item.id}">&times;</button>
              </td>
            </tr>
          `;
        }).join('');

        return `
          <div class="category-card ${themeClass}" data-sec-id="${sec.id}">
            <div class="cat-header">
              <div class="cat-title-group">
                <span class="${this.isEditing ? 'editable-cell' : ''}" contenteditable="${this.isEditing}" data-field="sec-title">${sec.title}</span>
              </div>
              <span class="cat-badge ${this.isEditing ? 'editable-cell' : ''}" contenteditable="${this.isEditing}" data-field="sec-badge">${sec.badge || ''}</span>
            </div>
            ${noticeBannerHTML}
            ${warningBannerHTML}
            <table class="price-table">
              <tbody>
                ${rowsHTML}
              </tbody>
            </table>
            <div class="add-row-wrapper">
              <button class="btn-add-item" data-sec-id="${sec.id}" data-page="${pageNumber}">
                + Add Item to ${sec.title}
              </button>
            </div>
          </div>
        `;
      }).join('');
    };

    // Diagram HTML
    const diagramHTML = this.renderDiagramZone(pageNumber, pageData.diagram);

    sheet.innerHTML = `
      ${headerHTML}
      <div class="sheet-grid">
        <div class="sheet-column">
          ${renderSections(col1Sections)}
        </div>
        <div class="sheet-column">
          ${renderSections(col2Sections)}
          ${diagramHTML}
        </div>
      </div>
      <footer class="sheet-footer">
        <span class="footer-brand">Pal Optical • Lexington, KY</span>
        <span>(859) 266-3003 • paloptical18@gmail.com</span>
        <span>${this.data.meta.effectiveDate} Price List</span>
      </footer>
    `;

    return sheet;
  }

  renderDiagramZone(pageNumber, diagramData) {
    if (!diagramData) return '';

    let contentHTML = '';

    if (diagramData.type === 'custom' && diagramData.customImageUrl) {
      contentHTML = `
        <img src="${diagramData.customImageUrl}" alt="${diagramData.title}" style="max-width: 100%; max-height: 140px; object-fit: contain; border-radius: 4px;">
      `;
    } else {
      // Preset interactive vector diagrams
      if (diagramData.presetName === 'thickness-bevel') {
        contentHTML = this.getThicknessBevelSVG();
      } else if (diagramData.presetName === 'transitions-comparison') {
        contentHTML = this.getTransitionsComparisonHTML();
      } else if (diagramData.presetName === 'ar-night-driving') {
        contentHTML = this.getARSimulationHTML();
      } else if (diagramData.presetName === 'rayban-guide') {
        contentHTML = this.getRayBanGuideSVG();
      } else {
        contentHTML = this.getThicknessBevelSVG();
      }
    }

    return `
      <div class="diagram-zone" id="zone-page-${pageNumber}">
        <div class="diagram-zone-header">
          <div class="diagram-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            ${diagramData.title}
          </div>
          <button class="diagram-btn-change no-print" data-page="${pageNumber}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Change Image / Diagram
          </button>
        </div>
        <div class="diagram-canvas-box">
          ${contentHTML}
        </div>
        <div class="diagram-caption">${diagramData.caption || ''}</div>
      </div>
    `;
  }

  // Diagram 1: Lens Thickness & Bevel Profile SVG
  getThicknessBevelSVG() {
    return `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 4px;">
        <svg viewBox="0 0 380 95" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="lensGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#bfdbfe" stop-opacity="0.9"/>
              <stop offset="50%" stop-color="#eff6ff" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#bfdbfe" stop-opacity="0.9"/>
            </linearGradient>
            <linearGradient id="lensGradHi" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.9"/>
              <stop offset="50%" stop-color="#eff6ff" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.9"/>
            </linearGradient>
          </defs>

          <!-- CR-39 1.50 Standard Thickness -->
          <g transform="translate(10, 5)">
            <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#1e3a8a">1.50 CR-39</text>
            <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">Abbe 58 • Baseline</text>
            <!-- Thick concave lens (-4.00D profile) -->
            <path d="M 5,26 C 25,36 40,36 60,26 L 60,58 C 40,48 25,48 5,58 Z" fill="url(#lensGrad1)" stroke="#2563eb" stroke-width="1.2"/>
            <line x1="64" y1="26" x2="64" y2="58" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 1"/>
            <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">6.5mm</text>
          </g>

          <!-- 1.59 Polycarbonate -->
          <g transform="translate(105, 5)">
            <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#0d9488">1.59 Poly</text>
            <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">20% Thinner • Impact</text>
            <!-- Medium concave lens -->
            <path d="M 5,29 C 25,36 40,36 60,29 L 60,55 C 40,48 25,48 5,55 Z" fill="url(#lensGrad1)" stroke="#0d9488" stroke-width="1.2"/>
            <line x1="64" y1="29" x2="64" y2="55" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 1"/>
            <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">5.2mm</text>
          </g>

          <!-- 1.67 High Index -->
          <g transform="translate(200, 5)">
            <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#7c3aed">1.67 Hi-Index</text>
            <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">35% Thinner • Sleek</text>
            <!-- Sleek concave lens -->
            <path d="M 5,32 C 25,37 40,37 60,32 L 60,52 C 40,47 25,47 5,52 Z" fill="url(#lensGradHi)" stroke="#7c3aed" stroke-width="1.2"/>
            <line x1="64" y1="32" x2="64" y2="52" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 1"/>
            <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">4.2mm</text>
          </g>

          <!-- 1.74 Ultra Slim -->
          <g transform="translate(295, 5)">
            <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#b45309">1.74 Ultra Hi</text>
            <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">50% Thinner • Flat</text>
            <!-- Ultra sleek profile -->
            <path d="M 5,34 C 25,38 40,38 60,34 L 60,50 C 40,46 25,46 5,50 Z" fill="url(#lensGradHi)" stroke="#b45309" stroke-width="1.2"/>
            <line x1="64" y1="34" x2="64" y2="50" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2 1"/>
            <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">3.2mm</text>
          </g>

          <!-- Bevel Guide Callout footer -->
          <g transform="translate(10, 76)">
            <rect width="360" height="15" rx="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8"/>
            <text x="180" y="11" font-size="6.5" font-weight="700" fill="#334155" text-anchor="middle">
              Standard V-Bevel (Zyl / Metal Frames) • Semi-Rimless Grooved Nylon • Roll & Polish for High-Minus Edges
            </text>
          </g>
        </svg>
      </div>
    `;
  }

  // Diagram 2: Transitions Colors & Interactive Tint Simulator
  getTransitionsComparisonHTML() {
    const swatches = [
      { name: 'Grey', color: '#374151' },
      { name: 'Brown', color: '#78350f' },
      { name: 'Graphite Green', color: '#14532d' },
      { name: 'Sapphire', color: '#1d4ed8' },
      { name: 'Amethyst', color: '#6d28d9' },
      { name: 'Amber', color: '#b45309' },
      { name: 'Emerald', color: '#047857' },
      { name: 'Ruby', color: '#991b1b' }
    ];

    const swatchesHTML = swatches.map(s => {
      const opacity = 0.2 + (this.transitionsDarkness / 100) * 0.8;
      return `
        <div class="swatch-item">
          <div class="swatch-circle" style="background-color: ${s.color}; opacity: ${opacity};" title="${s.name}"></div>
          <div class="swatch-name">${s.name}</div>
        </div>
      `;
    }).join('');

    return `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
          <span style="font-size: 0.62rem; font-weight: 800; color: #1e3a8a;">TRANSITIONS® GEN S™ 8 VIVID COLORS</span>
          <div style="display: flex; align-items: center; gap: 6px;" class="no-print">
            <span style="font-size: 0.58rem; color: #64748b;">Indoor</span>
            <input type="range" id="transitions-slider" min="15" max="95" value="${this.transitionsDarkness}" style="width: 70px; height: 4px; accent-color: #2563eb;">
            <span style="font-size: 0.58rem; color: #64748b; font-weight: 700;">Outdoor</span>
          </div>
        </div>

        <div class="transitions-swatches">
          ${swatchesHTML}
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px; font-size: 0.56rem;">
          <div style="border-right: 1px solid #e2e8f0; padding-right: 2px;">
            <strong style="color: #1e3a8a; display: block;">GEN S™</strong>
            Everyday lens, fastest dark-to-clear fadeback.
          </div>
          <div style="border-right: 1px solid #e2e8f0; padding-right: 2px;">
            <strong style="color: #b45309; display: block;">XTRActive®</strong>
            Extra dark outdoors, activates behind car windshield.
          </div>
          <div style="border-right: 1px solid #e2e8f0; padding-right: 2px;">
            <strong style="color: #047857; display: block;">XTRActive Polarized</strong>
            Dynamic polarization outdoors cuts reflective water/road glare.
          </div>
          <div>
            <strong style="color: #7c3aed; display: block;">Drivewear®</strong>
            Always tinted & polarized. Shifts olive to copper to dark red.
          </div>
        </div>
      </div>
    `;
  }

  // Diagram 3: Anti-Reflective Glare Simulator (With AR vs Without AR)
  getARSimulationHTML() {
    return `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">
          <span style="font-size: 0.62rem; font-weight: 800; color: #0284c7;">NIGHT DRIVING HEADLIGHT GLARE COMPARISON</span>
          <div class="no-print" style="display: flex; gap: 4px;">
            <button id="toggle-ar-btn" style="background: ${this.arActive ? '#047857' : '#ef4444'}; color: #fff; border: none; font-size: 0.58rem; font-weight: 700; padding: 2px 7px; border-radius: 3px; cursor: pointer;">
              ${this.arActive ? 'Showing: WITH ANTI-GLARE' : 'Showing: WITHOUT ANTI-GLARE'}
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #0f172a; border-radius: 4px; padding: 6px; color: #fff;">
          <!-- Without AR -->
          <div style="text-align: center; border: 1px solid ${!this.arActive ? '#f87171' : 'rgba(255,255,255,0.1)'}; border-radius: 4px; padding: 4px; position: relative;">
            <div style="font-size: 0.56rem; font-weight: 700; color: #f87171; margin-bottom: 3px;">WITHOUT ANTI-GLARE (AR)</div>
            <svg viewBox="0 0 100 40" style="width: 100%; height: auto;">
              <!-- Severe glare & starburst -->
              <circle cx="50" cy="20" r="14" fill="rgba(254, 240, 138, 0.35)"/>
              <circle cx="50" cy="20" r="8" fill="rgba(254, 240, 138, 0.6)"/>
              <circle cx="50" cy="20" r="4" fill="#ffffff"/>
              <!-- Halos & spikes -->
              <line x1="20" y1="20" x2="80" y2="20" stroke="#fef08a" stroke-width="1.5" opacity="0.8"/>
              <line x1="50" y1="5" x2="50" y2="35" stroke="#fef08a" stroke-width="1.5" opacity="0.8"/>
              <line x1="30" y1="10" x2="70" y2="30" stroke="#fef08a" stroke-width="1.2" opacity="0.7"/>
              <line x1="30" y1="30" x2="70" y2="10" stroke="#fef08a" stroke-width="1.2" opacity="0.7"/>
            </svg>
            <div style="font-size: 0.5rem; color: #cbd5e1;">Blinding starbursts, headlight reflections & eye fatigue</div>
          </div>

          <!-- With AR -->
          <div style="text-align: center; border: 1px solid ${this.arActive ? '#34d399' : 'rgba(255,255,255,0.1)'}; border-radius: 4px; padding: 4px; position: relative;">
            <div style="font-size: 0.56rem; font-weight: 700; color: #34d399; margin-bottom: 3px;">WITH PREMIUM AR (CRIZAL ROCK / UNITY)</div>
            <svg viewBox="0 0 100 40" style="width: 100%; height: auto;">
              <!-- Crisp clean headlight with subtle green AR reflex -->
              <circle cx="50" cy="20" r="5" fill="#ffffff"/>
              <ellipse cx="50" cy="20" rx="9" ry="7" fill="none" stroke="#10b981" stroke-width="0.8" opacity="0.7"/>
            </svg>
            <div style="font-size: 0.5rem; color: #cbd5e1;">99.6% Light transmittance, razor sharp night clarity & halo elimination</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-around; background: #f1f5f9; border-radius: 3px; padding: 2px 4px; font-size: 0.54rem; font-weight: 700; color: #334155;">
          <span>Oleophobic (Smudge-Resistant)</span>
          <span>•</span>
          <span>Hydrophobic (Water-Repellent)</span>
          <span>•</span>
          <span>Anti-Static (Dust-Repelling)</span>
          <span>•</span>
          <span>2-Year Warranty</span>
        </div>
      </div>
    `;
  }

  // Diagram 4: Ray-Ban Authentic Guide SVG
  getRayBanGuideSVG() {
    return `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 4px;">
        <svg viewBox="0 0 380 85" style="width: 100%; height: auto;">
          <!-- Left Lens RB Etch -->
          <g transform="translate(15, 10)">
            <rect width="160" height="65" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <text x="80" y="16" font-size="7.5" font-weight="800" text-anchor="middle" fill="#dc2626">LEFT LENS: 'RB' LASER ENGRAVING</text>
            <circle cx="80" cy="40" r="16" fill="#eff6ff" stroke="#93c5fd" stroke-width="1"/>
            <text x="80" y="44" font-size="11" font-weight="900" font-family="'JetBrains Mono', monospace" fill="#1e3a8a" text-anchor="middle">RB</text>
            <text x="80" y="60" font-size="5.5" font-weight="600" fill="#64748b" text-anchor="middle">Subtle micro-laser etched signature on temporal side</text>
          </g>

          <!-- Right Lens Ray-Ban Script -->
          <g transform="translate(205, 10)">
            <rect width="160" height="65" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <text x="80" y="16" font-size="7.5" font-weight="800" text-anchor="middle" fill="#dc2626">RIGHT LENS: Ray-Ban LOGO</text>
            <text x="80" y="42" font-size="14" font-weight="900" font-style="italic" fill="#dc2626" text-anchor="middle">Ray-Ban</text>
            <text x="80" y="60" font-size="5.5" font-weight="600" fill="#64748b" text-anchor="middle">Digital Surfacing matches Ray-Ban base curve & bevel perfectly</text>
          </g>
        </svg>
      </div>
    `;
  }

  // BONUS CHAIRSIDE CHEAT SHEET (PDF 2)
  createCheatSheetElement() {
    const cs = this.data.opticianCheatSheet;
    const sheet = document.createElement('article');
    sheet.className = 'price-sheet cheatsheet-page';

    const troubleshootingRows = cs.troubleshooting.map(cat => {
      const rows = cat.items.map(it => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 4px 6px; font-weight: 700; color: #b91c1c; font-size: 0.65rem; width: 33%; vertical-align: top;">
            ${it.complaint}
          </td>
          <td style="padding: 4px 6px; color: #334155; font-size: 0.64rem; width: 33%; vertical-align: top;">
            ${it.cause}
          </td>
          <td style="padding: 4px 6px; color: #047857; font-weight: 600; font-size: 0.64rem; width: 34%; vertical-align: top;">
            ${it.fix}
          </td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom: 8px;">
          <div style="background: #1e3a8a; color: #fff; padding: 3px 8px; font-size: 0.68rem; font-weight: 800; border-radius: 4px 4px 0 0;">
            ${cat.category}
          </div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-top: none;">
            <thead>
              <tr style="background: #f8fafc; font-size: 0.6rem; font-weight: 700; color: #475569; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 3px 6px; text-align: left;">CUSTOMER COMPLAINT</th>
                <th style="padding: 3px 6px; text-align: left;">WHAT IS HAPPENING</th>
                <th style="padding: 3px 6px; text-align: left;">HOW TO FIX AT THE BENCH</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;
    }).join('');

    sheet.innerHTML = `
      <header class="sheet-header">
        <div class="header-logo-group">
          <h1 class="brand-h1">Optician <em>Essential Cheat Sheet</em></h1>
          <span class="header-subtext">Chairside Troubleshooting, Transposition, Fitting Heights & Nose Pad Angles</span>
        </div>
        <div class="header-page-tag">PRACTICAL GUIDE</div>
      </header>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
        <!-- Transposition Rule Card -->
        <div class="category-card theme-blue">
          <div class="cat-header">
            <span>◆ PRESCRIPTION POWER SWAP (TRANSPOSITION)</span>
          </div>
          <div style="padding: 6px 8px; font-size: 0.65rem; color: #1e293b; line-height: 1.4;">
            <p><strong>1. Main Power (Sphere):</strong> Add first two numbers together (+/-).</p>
            <p><strong>2. Flip Astigmatism Sign:</strong> Change (+) to (-) or (-) to (+). Keep number same.</p>
            <p><strong>3. Turn Axis by 90°:</strong> If original &le; 90°, add 90. If &gt; 90°, subtract 90.</p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 4px 6px; margin-top: 4px;">
              <strong>Worked Example:</strong> -2.00 +1.50 x 045 &rarr; <span style="color: #1d4ed8; font-weight: 800;">-0.50 -1.50 x 135</span>
            </div>
          </div>
        </div>

        <!-- Nose Pad Angles Card -->
        <div class="category-card theme-teal">
          <div class="cat-header">
            <span>◆ NOSE PAD ANGLES (HOW TO ANGLE THEM)</span>
          </div>
          <div style="padding: 6px 8px; font-size: 0.65rem; color: #1e293b; line-height: 1.35;">
            <p><strong>Front Angle (~20°):</strong> Tops closer together than bottoms to follow nose slope.</p>
            <p><strong>Side Angle (Splay ~25°-30°):</strong> Front edges closer than backs as nose widens.</p>
            <p><strong>Upright Tilt (~10°-15°):</strong> Tops tilt forward slightly so pad sits flat without digging.</p>
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px; padding: 4px 6px; margin-top: 4px; font-weight: 700; color: #047857;">
              ★ Golden Rule: Entire flat surface must touch skin—never just an edge or corner.
            </div>
          </div>
        </div>
      </div>

      <!-- Fitting Heights & Face Shapes -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
        <div class="category-card theme-purple">
          <div class="cat-header">
            <span>◆ WHERE TO LINE UP BIFOCALS & PROGRESSIVES</span>
          </div>
          <div style="padding: 6px 8px; font-size: 0.64rem; color: #1e293b; line-height: 1.35;">
            <p><strong>No-Line Progressives (PALs):</strong> Center of pupil at eye level. 14-18mm below pupil. Cheek tilt 8-12°.</p>
            <p><strong>Lined Bifocals:</strong> Top line at lower eyelid (lower limbus). Drop 1mm for drivers/hikers.</p>
            <p><strong>Trifocals & Office:</strong> Upper line at bottom of pupil. Office: Center pupil or +1mm above.</p>
          </div>
        </div>

        <div class="category-card theme-charcoal">
          <div class="cat-header">
            <span>◆ 3 CRUCIAL FRAME ANGLES TO CHECK FIRST</span>
          </div>
          <div style="padding: 6px 8px; font-size: 0.64rem; color: #1e293b; line-height: 1.35;">
            <p><strong>1. Pantoscopic Tilt (8°-12°):</strong> Lenses must tilt inward toward cheeks to widen reading channel.</p>
            <p><strong>2. Panoramic Face Wrap:</strong> Frame must curve slightly around face to avoid fishbowl sides.</p>
            <p><strong>3. Vertex Distance (~12mm):</strong> Closer without lashes touching widens field of view.</p>
          </div>
        </div>
      </div>

      <!-- Expanded Chairside Troubleshooting Table -->
      <div style="flex: 1;">
        <div style="font-size: 0.72rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; text-transform: uppercase;">
          EXPANDED CHAIRSIDE TROUBLESHOOTING GUIDE (CUSTOMER COMPLAINTS & BENCH FIXES)
        </div>
        ${troubleshootingRows}
      </div>

      <footer class="sheet-footer">
        <span class="footer-brand">Pal Optical • Lexington, KY</span>
        <span>Everyday Chairside & Counter Guide</span>
        <span>${this.data.meta.effectiveDate}</span>
      </footer>
    `;

    return sheet;
  }

  // BONUS DIRECTORY (PDF 3)
  createDirectorySheetElement() {
    const dir = this.data.directory;
    const sheet = document.createElement('article');
    sheet.className = 'price-sheet directory-page';

    const renderCard = (title, items, badge = '') => {
      const itemsHTML = items.map(it => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; margin-bottom: 3px; font-size: 0.64rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="color: #1e3a8a; font-size: 0.68rem;">${it.name}</strong>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0284c7;">${it.phone || ''}</span>
          </div>
          ${it.doctor ? `<div style="color: #475569; font-weight: 600;">${it.doctor}</div>` : ''}
          ${it.spec ? `<div style="color: #64748b; font-size: 0.58rem;">${it.spec}</div>` : ''}
          ${it.addr ? `<div style="color: #64748b; font-size: 0.58rem;">${it.addr}</div>` : ''}
          ${it.fax ? `<div style="color: #94a3b8; font-size: 0.56rem;">Fax: ${it.fax} ${it.ref ? '• Ref: ' + it.ref : ''}</div>` : ''}
          ${it.acct ? `<div style="color: #b45309; font-weight: 800; font-size: 0.58rem;">OUR ACCT #: ${it.acct}</div>` : ''}
          ${it.providerPhone ? `<div style="color: #0d9488; font-weight: 700;">Provider: ${it.providerPhone} • Member: ${it.memberPhone}</div>` : ''}
        </div>
      `).join('');

      return `
        <div class="category-card theme-blue" style="margin-bottom: 6px;">
          <div class="cat-header">
            <span>${title}</span>
            ${badge ? `<span class="cat-badge">${badge}</span>` : ''}
          </div>
          <div style="padding: 4px;">
            ${itemsHTML}
          </div>
        </div>
      `;
    };

    sheet.innerHTML = `
      <header class="sheet-header">
        <div class="header-logo-group">
          <h1 class="brand-h1">Eye Care, Surgeons, Labs <em>& Plans Directory</em></h1>
          <span class="header-subtext">Lexington Specialists, LensCrafters/EyeMax ODs, Lab Accounts & Insurance Verification</span>
        </div>
        <div class="header-page-tag">DIRECTORY</div>
      </header>

      <div class="sheet-grid">
        <div class="sheet-column">
          ${renderCard('EYE SURGEONS & OPHTHALMOLOGY SPECIALISTS', dir.surgeons, 'SURGICAL')}
          ${renderCard('OPTICAL LABS & ORDERING ACCOUNTS', dir.labs, 'LAB ACCOUNTS')}
          <div class="notice-box notice-alert">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            DO NOT SEND P.H.I. VIA UNENCRYPTED EMAIL. USE FAX COVER SHEETS FOR ALL OUTGOING RECORDS.
          </div>
        </div>
        <div class="sheet-column">
          ${renderCard('DOCTORS & EYEWEAR CENTERS', dir.doctors, 'LOCAL OD')}
          ${renderCard('VISION PLANS & INSURANCE VERIFICATION', dir.plans, 'PAYERS')}
        </div>
      </div>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 6px 12px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem;">
        <div>
          <strong style="color: #1e3a8a; font-size: 0.72rem;">PAL OPTICAL STORE & DOCTOR SIDE</strong>
          <div style="color: #475569;">1555 E New Circle Rd Ste. 146, Lexington, KY 40509</div>
        </div>
        <div style="text-align: right;">
          <div><strong style="color: #1d4ed8;">Pal Front:</strong> (859) 266-3003 • <strong style="color: #0d9488;">Doc Side:</strong> (859) 269-6921</div>
          <div><strong>Fax:</strong> (859) 266-9504 • <strong>Email:</strong> paloptical18@gmail.com</div>
        </div>
      </div>

      <footer class="sheet-footer">
        <span class="footer-brand">Pal Optical • Lexington, KY</span>
        <span>Doctor & Lab Reference Directory</span>
        <span>${this.data.meta.effectiveDate}</span>
      </footer>
    `;

    return sheet;
  }

  // Bind interactive handlers
  bindSheetInteractions() {
    if (!this.viewport) return;

    // Price clicking adds to Quick Estimate
    this.viewport.querySelectorAll('.price-clickable').forEach(cell => {
      cell.addEventListener('click', (e) => {
        if (this.isEditing) return; // In edit mode, don't trigger quote add
        const row = cell.closest('tr');
        if (!row) return;
        const nameEl = row.querySelector('[data-field="name"]');
        const priceEl = row.querySelector('[data-field="price"]');
        if (!nameEl || !priceEl) return;

        const name = nameEl.textContent.trim();
        const priceStr = priceEl.textContent.replace(/[^0-9.]/g, '');
        const price = parseFloat(priceStr);

        if (!isNaN(price) && price > 0) {
          this.addToQuoteCart(name, price);
        }
      });
    });

    // Inline edit listeners
    if (this.isEditing) {
      this.viewport.querySelectorAll('.editable-cell').forEach(cell => {
        cell.addEventListener('blur', () => this.handleCellEdit(cell));
        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            cell.blur();
          }
        });
      });

      // Add item buttons
      this.viewport.querySelectorAll('.btn-add-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const secId = btn.dataset.secId;
          const page = btn.dataset.page;
          this.addNewItemToSection(page, secId);
        });
      });

      // Delete row buttons
      this.viewport.querySelectorAll('.btn-delete-row').forEach(btn => {
        btn.addEventListener('click', () => {
          const itemId = btn.dataset.itemId;
          const row = btn.closest('tr');
          const page = row.dataset.page;
          const secId = row.dataset.secId;
          this.deleteItem(page, secId, itemId);
        });
      });
    }

    // Diagram Change buttons
    this.viewport.querySelectorAll('.diagram-btn-change').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeDiagramTarget = btn.dataset.page;
        this.openDiagramModal();
      });
    });

    // Transitions slider
    const tSlider = this.viewport.querySelector('#transitions-slider');
    if (tSlider) {
      tSlider.addEventListener('input', (e) => {
        this.transitionsDarkness = parseInt(e.target.value);
        const circles = this.viewport.querySelectorAll('.swatch-circle');
        const opacity = 0.2 + (this.transitionsDarkness / 100) * 0.8;
        circles.forEach(c => c.style.opacity = opacity);
      });
    }

    // AR Simulator button
    const arBtn = this.viewport.querySelector('#toggle-ar-btn');
    if (arBtn) {
      arBtn.addEventListener('click', () => {
        this.arActive = !this.arActive;
        this.render();
      });
    }
  }

  handleCellEdit(cell) {
    const field = cell.dataset.field;
    const row = cell.closest('tr');

    if (row) {
      const page = row.dataset.page;
      const secId = row.dataset.secId;
      const itemId = row.dataset.itemId;
      const pageKey = `page${page}`;

      const sec = this.data[pageKey].sections.find(s => s.id === secId);
      if (!sec) return;
      const item = sec.items.find(i => i.id === itemId);
      if (!item) return;

      if (field === 'name') {
        item.name = cell.textContent.trim().toUpperCase();
      } else if (field === 'price') {
        const raw = cell.textContent.replace(/[^0-9.]/g, '');
        const val = parseFloat(raw);
        if (!isNaN(val)) {
          item.price = val;
          cell.textContent = `$${val.toFixed(2)}`;
        }
      }
      this.saveData();
    } else {
      // Header or badge edit
      const card = cell.closest('.category-card');
      if (card) {
        const secId = card.dataset.secId;
        for (let p = 1; p <= 3; p++) {
          const sec = this.data[`page${p}`].sections.find(s => s.id === secId);
          if (sec) {
            if (field === 'sec-title') sec.title = cell.textContent.trim().toUpperCase();
            if (field === 'sec-badge') sec.badge = cell.textContent.trim().toUpperCase();
            this.saveData();
            break;
          }
        }
      }
    }
  }

  addNewItemToSection(page, secId) {
    const pageKey = `page${page}`;
    const sec = this.data[pageKey].sections.find(s => s.id === secId);
    if (!sec) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      name: 'NEW LENS OPTION',
      price: 150.00,
      highlighted: false
    };

    sec.items.push(newItem);
    this.saveData();
    this.render();
    this.showToast(`Added new item to ${sec.title}`);
  }

  deleteItem(page, secId, itemId) {
    const pageKey = `page${page}`;
    const sec = this.data[pageKey].sections.find(s => s.id === secId);
    if (!sec) return;

    sec.items = sec.items.filter(i => i.id !== itemId);
    this.saveData();
    this.render();
    this.showToast('Item removed.');
  }

  // Diagram Modal
  openDiagramModal() {
    if (!this.diagramModal) return;
    const heading = document.getElementById('modal-diagram-heading');
    if (heading) heading.textContent = `Change Diagram for Page ${this.activeDiagramTarget}`;
    this.diagramModal.classList.add('active');
  }

  saveDiagramSelection() {
    if (!this.activeDiagramTarget) return;
    const pageKey = `page${this.activeDiagramTarget}`;
    const fileInput = document.getElementById('custom-diagram-file');
    const urlInput = document.getElementById('custom-diagram-url');

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.data[pageKey].diagram = {
          id: `diag-${Date.now()}`,
          title: 'Custom Uploaded Diagram',
          type: 'custom',
          customImageUrl: e.target.result,
          caption: 'Custom User Provided Diagram'
        };
        this.saveData();
        this.render();
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else if (urlInput && urlInput.value.trim()) {
      this.data[pageKey].diagram = {
        id: `diag-${Date.now()}`,
        title: 'Custom Online Diagram',
        type: 'custom',
        customImageUrl: urlInput.value.trim(),
        caption: 'Custom Image'
      };
      this.saveData();
      this.render();
    } else {
      // Preset
      this.data[pageKey].diagram = {
        id: `diag-${Date.now()}`,
        title: this.getPresetTitle(this.selectedModalPreset),
        type: 'preset',
        presetName: this.selectedModalPreset,
        customImageUrl: '',
        caption: this.getPresetCaption(this.selectedModalPreset)
      };
      this.saveData();
      this.render();
    }
  }

  getPresetTitle(preset) {
    switch (preset) {
      case 'thickness-bevel': return 'Clear Lens Cross-Section & Bevel Profile Guide';
      case 'transitions-comparison': return 'Transitions® Color Palette & Activation Chart';
      case 'ar-night-driving': return 'Anti-Glare (AR) Driving Simulator & Reflection Guide';
      case 'rayban-guide': return 'Ray-Ban® Authentic Laser Engraving Guide';
      default: return 'Optical Reference Diagram';
    }
  }

  getPresetCaption(preset) {
    switch (preset) {
      case 'thickness-bevel': return 'Index of Refraction vs. Edge Thickness (CR-39 1.50 • Trivex 1.53 • Poly 1.59 • Hi-Index 1.67 / 1.74)';
      case 'transitions-comparison': return 'Gen S 8 Vivid Colors & Technology Comparison: Gen S, XTRActive, XTRActive Polarized, Drivewear';
      case 'ar-night-driving': return 'AR Eliminates Distracting Headlight Glare & Halos for Night Driving';
      case 'rayban-guide': return 'Authentic "RB" laser engraving on temporal edge of left lens with digital surfacing curve';
      default: return '';
    }
  }

  // Calculator cart
  addToQuoteCart(name, price) {
    this.quoteItems.push({
      id: `quote-${Date.now()}-${Math.random()}`,
      name,
      price
    });
    this.saveQuoteCart();

    if (this.calcDock && this.calcDock.style.display === 'none') {
      this.calcDock.style.display = 'flex';
    }
    this.showToast(`Added ${name} ($${price.toFixed(2)}) to quote.`);
  }

  removeFromQuoteCart(id) {
    this.quoteItems = this.quoteItems.filter(i => i.id !== id);
    this.saveQuoteCart();
  }

  updateCalculatorUI() {
    if (!this.calcCount || !this.calcTotalVal || !this.calcItemsList) return;

    this.calcCount.textContent = this.quoteItems.length;
    const total = this.quoteItems.reduce((acc, curr) => acc + curr.price, 0);
    this.calcTotalVal.textContent = `$${total.toFixed(2)}`;

    if (this.quoteItems.length === 0) {
      this.calcItemsList.innerHTML = `
        <div style="color: #94a3b8; font-size: 0.68rem; text-align: center; padding: 12px 0;">
          Click any price on the sheets to add it to this live quote.
        </div>
      `;
      return;
    }

    this.calcItemsList.innerHTML = this.quoteItems.map(item => `
      <div class="calc-item">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 190px;" title="${item.name}">
          ${item.name}
        </span>
        <div style="display: flex; align-items: center;">
          <span style="font-weight: 700; color: #10b981; font-family: 'JetBrains Mono', monospace;">
            $${item.price.toFixed(2)}
          </span>
          <button data-remove-id="${item.id}" title="Remove item">&times;</button>
        </div>
      </div>
    `).join('');

    this.calcItemsList.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.removeFromQuoteCart(btn.dataset.removeId);
      });
    });
  }

  copyQuoteToClipboard() {
    if (this.quoteItems.length === 0) return;
    const total = this.quoteItems.reduce((acc, curr) => acc + curr.price, 0);
    const date = new Date().toLocaleDateString();

    let text = `=== PAL OPTICAL EYEWEAR QUOTE (${date}) ===\n`;
    this.quoteItems.forEach((it, idx) => {
      text += `${idx + 1}. ${it.name}: $${it.price.toFixed(2)}\n`;
    });
    text += `------------------------------------\n`;
    text += `TOTAL ESTIMATE: $${total.toFixed(2)}\n`;
    text += `Pal Optical • 1555 E New Circle Rd Ste 146 • (859) 266-3003\n`;

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Eyewear Quote copied to clipboard!');
    }).catch(() => {
      prompt('Copy quote below:', text);
    });
  }

  // Real-time Search Highlight & Filter
  applySearchFilter() {
    const q = this.searchQuery;
    const allRows = this.viewport.querySelectorAll('.price-table tr');

    if (!q) {
      allRows.forEach(r => {
        r.style.display = '';
        const nameEl = r.querySelector('[data-field="name"]');
        if (nameEl) nameEl.innerHTML = nameEl.textContent;
      });
      return;
    }

    allRows.forEach(r => {
      const nameEl = r.querySelector('[data-field="name"]');
      if (!nameEl) return;
      const text = nameEl.textContent;
      const lower = text.toLowerCase();

      if (lower.includes(q)) {
        r.style.display = '';
        // Highlight matched text
        const regex = new RegExp(`(${q})`, 'gi');
        nameEl.innerHTML = text.replace(regex, '<span style="background: #fde047; color: #000; padding: 0 2px; border-radius: 2px;">$1</span>');
      } else {
        r.style.display = 'none';
      }
    });
  }

  // JSON Export / Backup
  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Pal_Optical_Price_List_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast('Exported price list backup JSON.');
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.priceListApp = new PriceListEngine();
});
