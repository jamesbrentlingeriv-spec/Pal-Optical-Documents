/* Pal Optical Forms Web App - Native Master Price List Form Component */
import { INITIAL_PRICE_LIST_DATA } from '../data/priceListData.js';

const STORAGE_KEY = 'pal_optical_price_list_v1';
const CALC_STORAGE_KEY = 'pal_optical_quote_cart';

export class PriceListForm {
  constructor(container, state = {}, onStateChange, defaultView = 'all') {
    this.container = container;
    this.state = state;
    this.onStateChange = onStateChange;
    this.currentView = defaultView;
    this.isEditing = false;
    this.searchQuery = '';
    this.quoteItems = this.loadQuoteCart();
    this.data = this.loadData();
    this.activeDiagramTarget = null;
    this.selectedModalPreset = 'thickness-bevel';
    this.transitionsDarkness = 85;
    this.arActive = true;

    this.render();
    this.bindEvents();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return JSON.parse(JSON.stringify(INITIAL_PRICE_LIST_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.showToast('Changes saved to local storage');
      if (typeof this.onStateChange === 'function') {
        this.onStateChange(this.data);
      }
    } catch (e) {
      console.error(e);
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
    const toast = this.container.querySelector('#native-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2400);
  }

  render() {
    this.container.innerHTML = `
      <div class="pricelist-native-wrapper">
        <!-- Internal Toolbar -->
        <div class="pricelist-toolbar no-print">
          <div class="pricelist-tabs" id="pl-tabs">
            <button class="pl-tab-btn ${this.currentView === 'all' ? 'active' : ''}" data-view="all">Master (All 3 Pages)</button>
            <button class="pl-tab-btn ${this.currentView === 'page1' ? 'active' : ''}" data-view="page1">Page 1: Clear Lenses</button>
            <button class="pl-tab-btn ${this.currentView === 'page2' ? 'active' : ''}" data-view="page2">Page 2: Transitions</button>
            <button class="pl-tab-btn ${this.currentView === 'page3' ? 'active' : ''}" data-view="page3">Page 3: Sunwear & Fees</button>
            <button class="pl-tab-btn ${this.currentView === 'cheatsheet' ? 'active' : ''}" data-view="cheatsheet">Chairside Guide</button>
            <button class="pl-tab-btn ${this.currentView === 'directory' ? 'active' : ''}" data-view="directory">Directory</button>
          </div>

          <div class="pricelist-tools">
            <div class="pl-search-wrap">
              <input type="text" id="pl-search-input" placeholder="Search lenses, coatings..." autocomplete="off">
            </div>

            <button class="pl-btn ${this.isEditing ? 'pl-btn-active' : ''}" id="pl-edit-toggle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>${this.isEditing ? 'Editing Active' : 'Edit Mode'}</span>
            </button>

            <button class="pl-btn" id="pl-quote-toggle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/></svg>
              Quote (<span id="pl-quote-badge">${this.quoteItems.length}</span>)
            </button>

            <button class="pl-btn" id="pl-reset-btn" title="Reset to original defaults">
              Reset
            </button>

            <button class="pl-btn pl-btn-primary" id="pl-print-btn" title="Print this price list">
              Print
            </button>
          </div>
        </div>

        <!-- Main Sheets Display Area -->
        <div class="pricelist-sheets-container" id="pl-sheets-container">
          ${this.renderSheet(1, this.data.page1)}
          ${this.renderSheet(2, this.data.page2)}
          ${this.renderSheet(3, this.data.page3)}
          ${this.renderCheatSheet()}
          ${this.renderDirectorySheet()}
        </div>

        <!-- Floating Calculator Dock -->
        <aside class="calculator-dock no-print" id="pl-calc-dock" style="display: none;">
          <div class="calc-header">
            <div class="calc-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/></svg>
              Quick Quote Calculator
            </div>
            <button class="btn-secondary btn" id="pl-calc-close" style="padding: 1px 6px; font-size: 0.65rem;">Hide</button>
          </div>
          <div class="calc-items-list" id="pl-calc-list"></div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700;">TOTAL ESTIMATE:</span>
            <span class="calc-total" id="pl-calc-total">$0.00</span>
          </div>
          <div style="display: flex; gap: 6px; margin-top: 4px;">
            <button class="btn btn-secondary" style="flex: 1; font-size: 0.68rem;" id="pl-calc-clear">Clear</button>
            <button class="btn btn-primary" style="flex: 1; font-size: 0.68rem;" id="pl-calc-copy">Copy Quote</button>
          </div>
        </aside>

        <!-- Diagram Modal -->
        <div class="modal-overlay no-print" id="pl-diagram-modal">
          <div class="modal-card">
            <div class="modal-header">
              <h3 id="pl-modal-title">Select or Upload Diagram</h3>
              <button class="modal-close" id="pl-modal-close">&times;</button>
            </div>
            <div class="modal-body">
              <p style="font-size: 0.75rem; color: #475569;">
                Choose an informative optical reference diagram below, or upload a custom image from your computer to appear on this page.
              </p>
              <div class="modal-preset-grid">
                <div class="preset-card selected" data-preset="thickness-bevel">
                  <div class="preset-title">🔍 Lens Thickness Profile</div>
                  <div class="preset-desc">1.50 vs 1.53 vs 1.59 vs 1.67 vs 1.74 thickness guide.</div>
                </div>
                <div class="preset-card" data-preset="transitions-comparison">
                  <div class="preset-title">🌈 Transitions® Gen S Palette</div>
                  <div class="preset-desc">8 colors, activation comparison matrix.</div>
                </div>
                <div class="preset-card" data-preset="ar-night-driving">
                  <div class="preset-title">🚗 AR Night-Time Driving</div>
                  <div class="preset-desc">Headlight glare reduction simulator.</div>
                </div>
                <div class="preset-card" data-preset="rayban-guide">
                  <div class="preset-title">🕶️ Ray-Ban® Authentic</div>
                  <div class="preset-desc">RB laser etching spec and bevels.</div>
                </div>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px;">
                <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">
                  Or Upload Custom Image / Diagram:
                </label>
                <input type="file" id="pl-custom-file" accept="image/*" style="font-size: 0.75rem;">
              </div>
              <div>
                <label style="font-size: 0.75rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 4px;">
                  Or Image URL:
                </label>
                <input type="text" id="pl-custom-url" placeholder="https://example.com/diagram.png" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.75rem;">
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
                <button class="btn btn-secondary" id="pl-modal-cancel">Cancel</button>
                <button class="btn btn-primary" id="pl-modal-save">Apply Diagram</button>
              </div>
            </div>
          </div>
        </div>

        <div id="native-toast" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px); background: #0f172a; color: #fff; padding: 8px 18px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2000; pointer-events: none;"></div>
      </div>
    `;

    this.updateViewVisibility();
    this.updateCalculatorUI();
  }

  renderSheet(pageNum, pageData) {
    let subDesc = 'Clear Optical Lenses & High Performance Progressives';
    if (pageNum === 2) subDesc = 'Transitions® Light Intelligent & Variable Sunwear Lenses';
    if (pageNum === 3) subDesc = 'Polarized, Ray-Ban Authentic, Coatings, Lab & Dispensary Fees';

    const half = Math.ceil(pageData.sections.length / 2);
    const col1 = pageData.sections.slice(0, half).map(s => this.renderSectionHTML(s, pageNum)).join('');
    const col2 = pageData.sections.slice(half).map(s => this.renderSectionHTML(s, pageNum)).join('');

    let diagramHTML = '';
    if (pageNum === 1) diagramHTML = this.getThicknessDiagramHTML();
    if (pageNum === 2) diagramHTML = this.getTransitionsDiagramHTML();
    if (pageNum === 3) diagramHTML = this.getARDiagramHTML();

    return `
      <article class="price-sheet page-${pageNum}" id="pl-sheet-${pageNum}">
        <header class="sheet-header">
          <div class="header-logo-group">
            <h1 class="brand-h1">Pal Optical <em>Price List</em></h1>
            <span class="header-subtext">${subDesc}</span>
          </div>
          <div class="header-page-tag">PAGE ${pageNum} OF 3</div>
        </header>
        <div class="sheet-grid">
          <div class="sheet-column">
            ${col1}
            ${pageNum === 3 ? diagramHTML : ''}
          </div>
          <div class="sheet-column">
            ${col2}
            ${pageNum !== 3 ? diagramHTML : ''}
          </div>
        </div>
        <footer class="sheet-footer">
          <span class="footer-brand">Pal Optical • Lexington, KY</span>
          <span>(859) 266-3003 • paloptical18@gmail.com</span>
          <span>${this.data.meta.effectiveDate} Price List</span>
        </footer>
      </article>
    `;
  }

  renderSectionHTML(sec, pageNum) {
    let themeClass = 'theme-blue';
    if (sec.id.includes('poly')) themeClass = 'theme-teal';
    if (sec.id.includes('trivex')) themeClass = 'theme-indigo';
    if (sec.id.includes('hi-index')) themeClass = 'theme-purple';
    if (sec.id.includes('glass')) themeClass = 'theme-charcoal';
    if (sec.id.includes('coatings') || sec.id.includes('rayban')) themeClass = 'theme-amber';

    const noticeBannerHTML = sec.noticeBanner ? `
      <div class="notice-box notice-info">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        <span>${sec.noticeBanner}</span>
      </div>
    ` : '';

    const warningBannerHTML = sec.warningBanner ? `
      <div class="notice-box notice-warning">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        <span>${sec.warningBanner}</span>
      </div>
    ` : '';

    const rowsHTML = sec.items.map(item => {
      const formattedPrice = item.price !== null ? `$${Number(item.price).toFixed(2)}` : (item.priceNote || '—');
      const isStar = item.star ? '<span class="item-star" title="Popular House Favorite">★</span>' : '';
      const unitHTML = item.unit ? `<span class="unit-tag">${item.unit}</span>` : '';
      const highClass = item.highlighted ? 'highlighted-row' : '';

      return `
        <tr class="${highClass}" data-item-id="${item.id}" data-sec-id="${sec.id}" data-page="${pageNum}">
          <td class="item-name-cell">
            <span class="editable-cell" 
                  contenteditable="${this.isEditing ? 'true' : 'false'}" 
                  data-field="name" 
                  spellcheck="false">${item.name}</span>${isStar}
          </td>
          <td class="item-price-cell price-clickable" title="Click to add to Quote Calculator">
            <span class="editable-cell" 
                  contenteditable="${this.isEditing ? 'true' : 'false'}" 
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
      <div class="category-card ${themeClass}" data-sec-id="${sec.id}" data-page="${pageNum}">
        <div class="cat-header">
          <div class="cat-title-group">
            <span class="editable-cell" contenteditable="${this.isEditing ? 'true' : 'false'}" data-field="sec-title">${sec.title}</span>
          </div>
          <span class="cat-badge editable-cell" contenteditable="${this.isEditing ? 'true' : 'false'}" data-field="sec-badge">${sec.badge || ''}</span>
        </div>
        ${noticeBannerHTML}
        ${warningBannerHTML}
        <table class="price-table">
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
        <div class="add-row-wrapper" style="display: ${this.isEditing ? 'block' : 'none'};">
          <button class="btn-add-item" data-sec-id="${sec.id}" data-page="${pageNum}">
            + Add Item to ${sec.title}
          </button>
        </div>
      </div>
    `;
  }

  getThicknessDiagramHTML() {
    return `
      <div class="diagram-zone" id="native-zone-1">
        <div class="diagram-zone-header">
          <div class="diagram-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Clear Lens Cross-Section & Bevel Profile Guide
          </div>
          <button class="diagram-btn-change no-print" data-page="1">Change Diagram</button>
        </div>
        <div class="diagram-canvas-box" id="native-canvas-1">
          <svg viewBox="0 0 380 95" style="width: 100%; height: auto;">
            <defs>
              <linearGradient id="nLensGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#bfdbfe" stop-opacity="0.9"/>
                <stop offset="50%" stop-color="#eff6ff" stop-opacity="0.5"/>
                <stop offset="100%" stop-color="#bfdbfe" stop-opacity="0.9"/>
              </linearGradient>
            </defs>
            <g transform="translate(10, 5)">
              <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#1e3a8a">1.50 CR-39</text>
              <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">Abbe 58 • Baseline</text>
              <path d="M 5,26 C 25,36 40,36 60,26 L 60,58 C 40,48 25,48 5,58 Z" fill="url(#nLensGrad1)" stroke="#2563eb" stroke-width="1.2"/>
              <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">6.5mm</text>
            </g>
            <g transform="translate(105, 5)">
              <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#0d9488">1.59 Poly</text>
              <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">20% Thinner</text>
              <path d="M 5,29 C 25,36 40,36 60,29 L 60,55 C 40,48 25,48 5,55 Z" fill="url(#nLensGrad1)" stroke="#0d9488" stroke-width="1.2"/>
              <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">5.2mm</text>
            </g>
            <g transform="translate(200, 5)">
              <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#7c3aed">1.67 Hi-Index</text>
              <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">35% Thinner</text>
              <path d="M 5,32 C 25,37 40,37 60,32 L 60,52 C 40,47 25,47 5,52 Z" fill="url(#nLensGrad1)" stroke="#7c3aed" stroke-width="1.2"/>
              <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">4.2mm</text>
            </g>
            <g transform="translate(295, 5)">
              <text x="32" y="10" font-size="8" font-weight="800" text-anchor="middle" fill="#b45309">1.74 Ultra Hi</text>
              <text x="32" y="18" font-size="6.5" font-weight="600" text-anchor="middle" fill="#64748b">50% Thinner</text>
              <path d="M 5,34 C 25,38 40,38 60,34 L 60,50 C 40,46 25,46 5,50 Z" fill="url(#nLensGrad1)" stroke="#b45309" stroke-width="1.2"/>
              <text x="64" y="67" font-size="6" font-weight="700" fill="#ef4444" text-anchor="middle">3.2mm</text>
            </g>
            <g transform="translate(10, 76)">
              <rect width="360" height="15" rx="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8"/>
              <text x="180" y="11" font-size="6.5" font-weight="700" fill="#334155" text-anchor="middle">
                Standard V-Bevel (Zyl / Metal) • Semi-Rimless Grooved Nylon • Roll & Polish for High-Minus
              </text>
            </g>
          </svg>
        </div>
        <div class="diagram-caption">Index of Refraction vs. Edge Thickness (CR-39 1.50 • Trivex 1.53 • Poly 1.59 • Hi-Index 1.67 / 1.74)</div>
      </div>
    `;
  }

  getTransitionsDiagramHTML() {
    return `
      <div class="diagram-zone" id="native-zone-2">
        <div class="diagram-zone-header">
          <div class="diagram-title">Transitions® Gen S 8 Vivid Colors</div>
          <button class="diagram-btn-change no-print" data-page="2">Change Diagram</button>
        </div>
        <div class="diagram-canvas-box" id="native-canvas-2">
          <div style="width: 100%; display: flex; flex-direction: column; gap: 4px;">
            <div class="transitions-swatches">
              <div class="swatch-item"><div class="swatch-circle" style="background:#374151; opacity:0.88;"></div><div class="swatch-name">Grey</div></div>
              <div class="swatch-item"><div class="swatch-circle" style="background:#78350f; opacity:0.88;"></div><div class="swatch-name">Brown</div></div>
              <div class="swatch-item"><div class="swatch-circle" style="background:#14532d; opacity:0.88;"></div><div class="swatch-name">Graphite</div></div>
              <div class="swatch-item"><div class="swatch-circle" style="background:#1d4ed8; opacity:0.88;"></div><div class="swatch-name">Sapphire</div></div>
              <div class="swatch-item"><div class="swatch-circle" style="background:#6d28d9; opacity:0.88;"></div><div class="swatch-name">Amethyst</div></div>
              <div class="swatch-item"><div class="swatch-circle" style="background:#b45309; opacity:0.88;"></div><div class="swatch-name">Amber</div></div>
              <div class="swatch-item"><div class="swatch-circle" style="background:#047857; opacity:0.88;"></div><div class="swatch-name">Emerald</div></div>
              <div class="swatch-item"><div class="swatch-circle" style="background:#991b1b; opacity:0.88;"></div><div class="swatch-name">Ruby</div></div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px; font-size: 0.56rem;">
              <div><strong style="color: #1e3a8a;">GEN S™:</strong> Everyday speed & style.</div>
              <div><strong style="color: #b45309;">XTRActive®:</strong> Extra dark, in car.</div>
              <div><strong style="color: #047857;">XTRActive Polar:</strong> Water & road glare.</div>
              <div><strong style="color: #7c3aed;">Drivewear®:</strong> Variable driving polar.</div>
            </div>
          </div>
        </div>
        <div class="diagram-caption">Gen S 8 Vivid Colors & Technology Comparison: Gen S, XTRActive, XTRActive Polarized, Drivewear</div>
      </div>
    `;
  }

  getARDiagramHTML() {
    return `
      <div class="diagram-zone" id="native-zone-3">
        <div class="diagram-zone-header">
          <div class="diagram-title">Anti-Glare (AR) Driving Simulator</div>
          <button class="diagram-btn-change no-print" data-page="3">Change Diagram</button>
        </div>
        <div class="diagram-canvas-box" id="native-canvas-3">
          <div style="width: 100%; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #0f172a; border-radius: 4px; padding: 6px; color: #fff;">
              <div style="text-align: center; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px;">
                <div style="font-size: 0.56rem; font-weight: 700; color: #f87171;">WITHOUT ANTI-GLARE</div>
                <div style="font-size: 0.5rem; color: #cbd5e1; margin-top: 4px;">Distracting headlight halos, starbursts & eye strain</div>
              </div>
              <div style="text-align: center; border: 1.5px solid #34d399; border-radius: 4px; padding: 4px;">
                <div style="font-size: 0.56rem; font-weight: 700; color: #34d399;">WITH PREMIUM AR</div>
                <div style="font-size: 0.5rem; color: #cbd5e1; margin-top: 4px;">99.6% light transmittance, razor sharp night clarity</div>
              </div>
            </div>
          </div>
        </div>
        <div class="diagram-caption">AR Eliminates Distracting Headlight Glare & Halos for Night Driving</div>
      </div>
    `;
  }

  renderCheatSheet() {
    const cs = this.data.opticianCheatSheet;
    const troubleshootingRows = cs.troubleshooting.map(cat => {
      const rows = cat.items.map(it => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 4px 6px; font-weight: 700; color: #b91c1c; font-size: 0.65rem; width: 33%;">${it.complaint}</td>
          <td style="padding: 4px 6px; color: #334155; font-size: 0.64rem; width: 33%;">${it.cause}</td>
          <td style="padding: 4px 6px; color: #047857; font-weight: 600; font-size: 0.64rem; width: 34%;">${it.fix}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom: 8px;">
          <div style="background: #1e3a8a; color: #fff; padding: 3px 8px; font-size: 0.68rem; font-weight: 800; border-radius: 4px 4px 0 0;">
            ${cat.category}
          </div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-top: none;">
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }).join('');

    return `
      <article class="price-sheet cheatsheet-page" id="pl-sheet-cheatsheet">
        <header class="sheet-header">
          <div class="header-logo-group">
            <h1 class="brand-h1">Optician <em>Essential Cheat Sheet</em></h1>
            <span class="header-subtext">Chairside Troubleshooting & Measurements</span>
          </div>
          <div class="header-page-tag">PRACTICAL GUIDE</div>
        </header>
        <div style="flex: 1;">
          ${troubleshootingRows}
        </div>
        <footer class="sheet-footer">
          <span class="footer-brand">Pal Optical • Lexington, KY</span>
          <span>Everyday Chairside & Counter Guide</span>
          <span>${this.data.meta.effectiveDate}</span>
        </footer>
      </article>
    `;
  }

  renderDirectorySheet() {
    const dir = this.data.directory;
    const renderCard = (title, items) => {
      const itemsHTML = items.map(it => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; margin-bottom: 3px; font-size: 0.64rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="color: #1e3a8a;">${it.name}</strong>
            <span style="font-weight: 700; color: #0284c7;">${it.phone || ''}</span>
          </div>
          ${it.doctor ? `<div style="color: #475569;">${it.doctor}</div>` : ''}
          ${it.addr ? `<div style="color: #64748b;">${it.addr}</div>` : ''}
          ${it.acct ? `<div style="color: #b45309; font-weight: 800;">OUR ACCT #: ${it.acct}</div>` : ''}
        </div>
      `).join('');

      return `
        <div class="category-card theme-blue" style="margin-bottom: 6px;">
          <div class="cat-header"><span>${title}</span></div>
          <div style="padding: 4px;">${itemsHTML}</div>
        </div>
      `;
    };

    return `
      <article class="price-sheet directory-page" id="pl-sheet-directory">
        <header class="sheet-header">
          <div class="header-logo-group">
            <h1 class="brand-h1">Eye Care, Surgeons, Labs <em>& Plans Directory</em></h1>
            <span class="header-subtext">Local ODs, Labs & Insurance Verification</span>
          </div>
          <div class="header-page-tag">DIRECTORY</div>
        </header>
        <div class="sheet-grid">
          <div class="sheet-column">
            ${renderCard('EYE SURGEONS & OPHTHALMOLOGY', dir.surgeons)}
            ${renderCard('OPTICAL LABS & ORDERING ACCOUNTS', dir.labs)}
          </div>
          <div class="sheet-column">
            ${renderCard('DOCTORS & EYEWEAR CENTERS', dir.doctors)}
            ${renderCard('VISION PLANS & INSURANCE', dir.plans)}
          </div>
        </div>
        <footer class="sheet-footer">
          <span class="footer-brand">Pal Optical • Lexington, KY</span>
          <span>Doctor & Lab Reference Directory</span>
          <span>${this.data.meta.effectiveDate}</span>
        </footer>
      </article>
    `;
  }

  updateViewVisibility() {
    const sheets = {
      'page1': this.container.querySelector('#pl-sheet-1'),
      'page2': this.container.querySelector('#pl-sheet-2'),
      'page3': this.container.querySelector('#pl-sheet-3'),
      'cheatsheet': this.container.querySelector('#pl-sheet-cheatsheet'),
      'directory': this.container.querySelector('#pl-sheet-directory')
    };

    this.container.querySelectorAll('.pl-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === this.currentView);
    });

    if (this.currentView === 'all') {
      Object.values(sheets).forEach(el => { if (el) el.style.display = 'flex'; });
    } else {
      Object.keys(sheets).forEach(k => {
        if (sheets[k]) sheets[k].style.display = (k === this.currentView) ? 'flex' : 'none';
      });
    }
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    const btn = this.container.querySelector('#pl-edit-toggle');
    if (btn) {
      btn.classList.toggle('pl-btn-active', this.isEditing);
      btn.querySelector('span').textContent = this.isEditing ? 'Editing Active' : 'Edit Mode';
    }

    this.container.querySelectorAll('.editable-cell').forEach(cell => {
      cell.setAttribute('contenteditable', this.isEditing ? 'true' : 'false');
    });

    this.container.querySelectorAll('.add-row-wrapper').forEach(w => {
      w.style.display = this.isEditing ? 'block' : 'none';
    });

    this.container.querySelectorAll('.edit-row-actions').forEach(a => {
      a.style.display = this.isEditing ? 'table-cell' : 'none';
    });

    if (this.isEditing) {
      this.showToast('Edit Mode Enabled. Click any name or price to edit. Click "+ Add Item" to add new rows.');
    }
  }

  bindEvents() {
    // Tabs
    const tabsContainer = this.container.querySelector('#pl-tabs');
    if (tabsContainer) {
      tabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.pl-tab-btn');
        if (!btn) return;
        this.currentView = btn.dataset.view;
        this.updateViewVisibility();
      });
    }

    // Edit Mode Toggle
    const editBtn = this.container.querySelector('#pl-edit-toggle');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.toggleEditing());
    }

    // Search
    const searchInput = this.container.querySelector('#pl-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.applySearch();
      });
    }

    // Quote Toggle
    const quoteBtn = this.container.querySelector('#pl-quote-toggle');
    const calcDock = this.container.querySelector('#pl-calc-dock');
    if (quoteBtn && calcDock) {
      quoteBtn.addEventListener('click', () => {
        const isHidden = calcDock.style.display === 'none';
        calcDock.style.display = isHidden ? 'flex' : 'none';
      });
    }

    const calcClose = this.container.querySelector('#pl-calc-close');
    if (calcClose && calcDock) {
      calcClose.addEventListener('click', () => { calcDock.style.display = 'none'; });
    }

    const calcClear = this.container.querySelector('#pl-calc-clear');
    if (calcClear) {
      calcClear.addEventListener('click', () => {
        this.quoteItems = [];
        this.saveQuoteCart();
      });
    }

    const calcCopy = this.container.querySelector('#pl-calc-copy');
    if (calcCopy) {
      calcCopy.addEventListener('click', () => this.copyQuote());
    }

    // Reset button
    const resetBtn = this.container.querySelector('#pl-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all prices, items and diagrams to shop defaults?')) {
          localStorage.removeItem(STORAGE_KEY);
          this.data = JSON.parse(JSON.stringify(INITIAL_PRICE_LIST_DATA));
          this.render();
          this.bindEvents();
          this.showToast('Reset to shop defaults.');
        }
      });
    }

    // Print button
    const printBtn = this.container.querySelector('#pl-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }

    // Sheets interaction: price click, add item, delete item
    const sheetsContainer = this.container.querySelector('#pl-sheets-container');
    if (sheetsContainer) {
      sheetsContainer.addEventListener('click', (e) => {
        // Delete button
        const delBtn = e.target.closest('.btn-delete-row');
        if (delBtn) {
          const row = delBtn.closest('tr');
          if (row) {
            row.remove();
            this.showToast('Item deleted.');
          }
          return;
        }

        // Add Item button
        const addBtn = e.target.closest('.btn-add-item');
        if (addBtn) {
          const secCard = addBtn.closest('.category-card');
          const secId = addBtn.dataset.secId;
          const pageNum = addBtn.dataset.page;
          if (secCard) {
            const tbody = secCard.querySelector('tbody');
            if (tbody) {
              const newId = 'custom-' + Date.now();
              const tr = document.createElement('tr');
              tr.setAttribute('data-item-id', newId);
              tr.setAttribute('data-sec-id', secId);
              tr.setAttribute('data-page', pageNum);
              tr.innerHTML = `
                <td class="item-name-cell">
                  <span class="editable-cell" contenteditable="true" data-field="name" spellcheck="false">NEW LENS OR SERVICE</span>
                </td>
                <td class="item-price-cell price-clickable" title="Click to add to Quote Calculator">
                  <span class="editable-cell" contenteditable="true" data-field="price" spellcheck="false">$100.00</span>
                </td>
                <td class="edit-row-actions" style="display: table-cell;">
                  <button class="btn-delete-row" title="Delete item" data-item-id="${newId}">&times;</button>
                </td>
              `;
              tbody.appendChild(tr);
              this.showToast('New item added. Click to edit.');
              const nameEl = tr.querySelector('[data-field="name"]');
              if (nameEl) nameEl.focus();
            }
          }
          return;
        }

        // Price click when NOT in edit mode
        if (!this.isEditing) {
          const priceCell = e.target.closest('.item-price-cell');
          if (priceCell) {
            const row = priceCell.closest('tr');
            if (row) {
              const nameEl = row.querySelector('[data-field="name"]');
              const priceEl = row.querySelector('[data-field="price"]');
              if (nameEl && priceEl) {
                const name = nameEl.textContent.trim();
                const num = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
                if (!isNaN(num) && num > 0) {
                  this.addToQuote(name, num);
                }
              }
            }
          }
        }
      });

      // Double-click cell to immediately edit
      sheetsContainer.addEventListener('dblclick', (e) => {
        const cell = e.target.closest('.editable-cell');
        if (cell) {
          if (!this.isEditing) this.toggleEditing();
          cell.focus();
        }
      });

      // Save on blur
      sheetsContainer.addEventListener('blur', (e) => {
        const cell = e.target.closest('.editable-cell');
        if (cell) {
          const field = cell.dataset.field;
          if (field === 'price') {
            const raw = cell.textContent.replace(/[^0-9.]/g, '');
            const val = parseFloat(raw);
            if (!isNaN(val)) {
              cell.textContent = `$${val.toFixed(2)}`;
            }
          }
          this.showToast('Updated item');
        }
      }, true);
    }
  }

  addToQuote(name, price) {
    this.quoteItems.push({ id: 'q-' + Date.now(), name, price });
    this.saveQuoteCart();
    const dock = this.container.querySelector('#pl-calc-dock');
    if (dock) dock.style.display = 'flex';
    this.showToast(`Added ${name} ($${price.toFixed(2)}) to quote.`);
  }

  updateCalculatorUI() {
    const badge = this.container.querySelector('#pl-quote-badge');
    const totalEl = this.container.querySelector('#pl-calc-total');
    const listEl = this.container.querySelector('#pl-calc-list');

    if (badge) badge.textContent = this.quoteItems.length;
    const total = this.quoteItems.reduce((acc, curr) => acc + curr.price, 0);
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    if (!listEl) return;
    if (this.quoteItems.length === 0) {
      listEl.innerHTML = '<div style="color: #94a3b8; font-size: 0.68rem; text-align: center; padding: 12px 0;">Click any price on the sheets to add it to this live quote.</div>';
      return;
    }

    listEl.innerHTML = this.quoteItems.map((item, idx) => `
      <div class="calc-item">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 190px;" title="${item.name}">
          ${item.name}
        </span>
        <div style="display: flex; align-items: center;">
          <span style="font-weight: 700; color: #10b981; font-family: 'JetBrains Mono', monospace;">
            $${item.price.toFixed(2)}
          </span>
          <button data-remove-idx="${idx}" title="Remove item">&times;</button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('[data-remove-idx]').forEach(b => {
      b.addEventListener('click', () => {
        const i = parseInt(b.dataset.removeIdx);
        this.quoteItems.splice(i, 1);
        this.saveQuoteCart();
      });
    });
  }

  copyQuote() {
    if (this.quoteItems.length === 0) return;
    const total = this.quoteItems.reduce((sum, item) => sum + item.price, 0);
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

  applySearch() {
    const rows = this.container.querySelectorAll('.price-table tr');
    if (!this.searchQuery) {
      rows.forEach(r => {
        r.style.display = '';
        const nameEl = r.querySelector('[data-field="name"]');
        if (nameEl) nameEl.innerHTML = nameEl.textContent;
      });
      return;
    }

    rows.forEach(r => {
      const nameEl = r.querySelector('[data-field="name"]');
      if (!nameEl) return;
      const text = nameEl.textContent;
      if (text.toLowerCase().includes(this.searchQuery)) {
        r.style.display = '';
        const reg = new RegExp(`(${this.searchQuery})`, 'gi');
        nameEl.innerHTML = text.replace(reg, '<span style="background: #fde047; color: #000; padding: 0 2px; border-radius: 2px;">$1</span>');
      } else {
        r.style.display = 'none';
      }
    });
  }

  print() {
    window.print();
  }

  reset() {
    if (confirm('Reset price list to shop defaults?')) {
      localStorage.removeItem(STORAGE_KEY);
      this.data = JSON.parse(JSON.stringify(INITIAL_PRICE_LIST_DATA));
      this.render();
      this.bindEvents();
    }
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
