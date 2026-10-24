/* Pal Optical Forms Web App - Contact Lens Order Sheet (16-Row Landscape Pad)
 * Features:
 * - Bento Box modern UI for throughout-the-day order collection
 * - End-of-Day 1-click batch printing
 * - 100% exact replica of the physical form when printed (Landscape, exact columns & font)
 * - Blank Pad mode for printing completely blank sheets with all written text removed
 * - Multi-sheet support (16 rows per sheet) if a day exceeds 16 orders
 * - Auto-persistence across page reloads and form switches
 */

export class ContactLensOrderForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.onStateChange = onStateChange;

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Default to a 16-row sheet (exact physical template)
    const createEmptyRows = (startId = 1) =>
      Array.from({ length: 16 }, (_, i) => ({
        id: startId + i,
        name: '',
        dob: '',
        phone: '',
        boxes: '',
        instructions: '',
        timestamp: ''
      }));

    // Restore from localStorage backup or incoming state
    let savedOrders = null;
    try {
      const local = localStorage.getItem('pal-cl-daily-orders');
      if (local) savedOrders = JSON.parse(local);
    } catch (e) {
      console.warn('Could not read pal-cl-daily-orders from localStorage:', e);
    }

    const initialRows = (state.rows && state.rows.length)
      ? state.rows
      : (savedOrders?.rows && savedOrders.rows.length)
        ? savedOrders.rows
        : createEmptyRows(1);

    // Ensure at least 16 rows exist (pad if fewer)
    while (initialRows.length < 16) {
      initialRows.push({
        id: initialRows.length + 1,
        name: '',
        dob: '',
        phone: '',
        boxes: '',
        instructions: '',
        timestamp: ''
      });
    }

    this.state = {
      batchDate: state.batchDate || savedOrders?.batchDate || todayStr,
      rows: initialRows,
      activeRowIndex: 0,
      quickName: '',
      quickDob: '',
      quickPhone: '',
      quickBoxes: '',
      quickInstructions: '',
      quickEmail: '',
      previewMode: 'current', // 'current' or 'blank'
      filterMode: 'all', // 'all' or 'filled'
      ...state,
      rows: initialRows
    };

    // Auto-select first empty row
    const firstEmpty = this.state.rows.findIndex(r => !r.name.trim());
    if (firstEmpty !== -1) {
      this.state.activeRowIndex = firstEmpty;
    }

    this.styleTag = null;
    this.initLandscapeStyle();
    this.render();
    this.bindEvents();
  }

  initLandscapeStyle() {
    // Inject dynamic @page rule for 11" x 8.5" Landscape printing
    const existing = document.getElementById('contact-lens-page-style');
    if (existing) existing.remove();

    this.styleTag = document.createElement('style');
    this.styleTag.id = 'contact-lens-page-style';
    this.styleTag.textContent = `
      @page {
        size: letter landscape !important;
        margin: 0.35in !important;
      }
    `;
    document.head.appendChild(this.styleTag);
  }

  destroy() {
    // Clean up landscape style tag on form unmount
    if (this.styleTag) {
      this.styleTag.remove();
      this.styleTag = null;
    }
  }

  getPatientName() {
    const filled = this.state.rows.filter(r => r.name && r.name.trim());
    if (filled.length === 1) {
      return `Contact Lens Orders - ${filled[0].name.trim()}`;
    }
    if (filled.length > 1) {
      return `Contact Lens Orders (${filled.length} Orders) - ${this.state.batchDate}`;
    }
    return `Contact Lens Orders - Blank Sheet`;
  }

  notifyChange() {
    try {
      localStorage.setItem('pal-cl-daily-orders', JSON.stringify({
        batchDate: this.state.batchDate,
        rows: this.state.rows
      }));
    } catch (e) {
      console.warn('Could not persist orders to localStorage:', e);
    }

    if (typeof this.onStateChange === 'function') {
      this.onStateChange(this.state);
    }
  }

  reset() {
    if (confirm('Start a fresh order sheet? This will clear all entered orders for today. Make sure you have printed them first if needed!')) {
      const todayStr = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      this.state.batchDate = todayStr;
      this.state.rows = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        name: '',
        dob: '',
        phone: '',
        boxes: '',
        instructions: '',
        timestamp: ''
      }));
      this.state.activeRowIndex = 0;
      this.clearQuickInputs();
      this.state.previewMode = 'current';

      this.notifyChange();
      this.render();
      this.bindEvents();
    }
  }

  print() {
    window.print();
  }

  printBlank() {
    // Trigger print with blank enforcement (guarantees zero written text on printout)
    const prevMode = this.state.previewMode;
    this.state.previewMode = 'blank';
    document.body.classList.add('print-blank-active');
    this.updatePreviewAndPrintout();

    window.print();

    setTimeout(() => {
      this.state.previewMode = prevMode;
      if (window.app?.activeMode !== 'print-blank') {
        document.body.classList.remove('print-blank-active');
      }
      this.updatePreviewAndPrintout();
    }, 500);
  }

  formatPhone(value) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  formatDob(value) {
    if (!value) return '';
    const clean = value.replace(/[^\d\/]/g, '');
    if (!clean.includes('/') && clean.length >= 8) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
    }
    return clean;
  }

  loadJanetFrancisSample() {
    this.state.rows[0] = {
      id: 1,
      name: 'Janet Francis',
      dob: '01/16/1960',
      phone: '(859) 433-6701',
      boxes: '1 box each',
      instructions: 'VSP is used already, Self pay',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.state.activeRowIndex = 1;
    this.notifyChange();
    this.render();
    this.bindEvents();
  }

  // Divide rows into 16-row sheets
  getSheets() {
    const sheets = [];
    const totalRows = this.state.rows.length;
    const numSheets = Math.max(1, Math.ceil(totalRows / 16));

    for (let s = 0; s < numSheets; s++) {
      const start = s * 16;
      const end = start + 16;
      let sheetRows = this.state.rows.slice(start, end);
      // Ensure exactly 16 rows in every sheet
      while (sheetRows.length < 16) {
        sheetRows.push({
          id: start + sheetRows.length + 1,
          name: '',
          dob: '',
          phone: '',
          boxes: '',
          instructions: '',
          timestamp: ''
        });
      }
      sheets.push({
        sheetNumber: s + 1,
        totalSheets: numSheets,
        rows: sheetRows
      });
    }
    return sheets;
  }

  render() {
    const filledCount = this.state.rows.filter(r => r.name.trim() || r.phone.trim() || r.boxes.trim()).length;
    const isBlankPreview = this.state.previewMode === 'blank' || document.body.classList.contains('print-blank-active');
    const activeRowNum = this.state.activeRowIndex + 1;
    const sheets = this.getSheets();

    this.container.innerHTML = `
      <!-- Bento Box Screen Interface (Hidden when printing) -->
      <div class="bento-interactive-screen">
        <div class="bento-grid">
          
          <!-- Bento Card 1: Daily Hub & Actions (Span 12) -->
          <div class="bento-card bento-header-card">
            <div class="bento-header-left">
              <div class="bento-icon-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div class="bento-header-titles">
                <div class="bento-tag-row">
                  <span class="bento-badge">Landscape 16-Row Pad</span>
                  <span class="bento-badge bento-badge-outline">Daily Ledger</span>
                  <span class="bento-badge ${filledCount > 0 ? 'bento-badge-success' : 'bento-badge-subtle'}">
                    📦 ${filledCount} Order${filledCount === 1 ? '' : 's'} Logged Today
                  </span>
                </div>
                <h2>Contact Lens Orders</h2>
                <p>Record orders throughout the day, then click <strong>"Print End of Day"</strong> to produce the exact completed sheet. Or print a blank pad sheet at any time.</p>
              </div>
            </div>

            <div class="bento-actions-group">
              <!-- End of Day Print Action (Hero) -->
              <button type="button" class="bento-btn bento-btn-primary bento-btn-hero" id="clo-btn-print-filled" title="Print today's accumulated orders">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                <span>Print End of Day (${filledCount})</span>
              </button>

              <!-- Blank Sheet Print Action -->
              <button type="button" class="bento-btn bento-btn-secondary" id="clo-btn-print-blank" title="Print a 100% blank template sheet ready for handwriting (removes all text)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <span>Print Blank Pad</span>
              </button>

              <!-- Start New Day Button -->
              <button type="button" class="bento-btn bento-btn-subtle" id="clo-btn-clear-all" title="Archive / clear sheet for a new day">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                <span>Start New Day</span>
              </button>

              <!-- Load Demo Row Button -->
              <button type="button" class="bento-btn bento-btn-ghost" id="clo-btn-sample" title="Load sample row from photo (Janet Francis)">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <span>Sample Data</span>
              </button>
            </div>
          </div>

          <!-- Bento Card 2: Quick Order Entry Form (Span 8) -->
          <div class="bento-card bento-form-card">
            <div class="bento-card-header">
              <div class="bento-card-title-group">
                <h3>Add Patient Order</h3>
                <span class="bento-card-subtitle">Recording into Row #${activeRowNum} of ${this.state.rows.length}</span>
              </div>
              <div class="bento-row-picker">
                <label for="clo-row-select">Target Row:</label>
                <select id="clo-row-select" class="bento-select">
                  ${this.state.rows.map((r, i) => `
                    <option value="${i}" ${i === this.state.activeRowIndex ? 'selected' : ''}>
                      Row ${i + 1} ${r.name ? `(${r.name})` : '(Empty)'}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>

            <form id="clo-entry-form" onsubmit="return false;" class="bento-input-grid">
              
              <!-- Patient Name -->
              <div class="bento-field col-span-6">
                <label for="clo-input-name">Patient Full Name <span class="req">*</span></label>
                <div class="bento-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" id="clo-input-name" class="bento-input" placeholder="e.g. Janet Francis" value="${this.state.quickName}" autofocus>
                </div>
              </div>

              <!-- Date of Birth -->
              <div class="bento-field col-span-3">
                <label for="clo-input-dob">Date of Birth</label>
                <div class="bento-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <input type="text" id="clo-input-dob" class="bento-input" placeholder="MM/DD/YYYY" value="${this.state.quickDob}">
                </div>
              </div>

              <!-- Phone Number -->
              <div class="bento-field col-span-3">
                <label for="clo-input-phone">Phone Number</label>
                <div class="bento-input-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input type="text" id="clo-input-phone" class="bento-input" placeholder="(859) 433-6701" value="${this.state.quickPhone}">
                </div>
              </div>

              <!-- Number of Boxes -->
              <div class="bento-field col-span-5">
                <label for="clo-input-boxes">Number of Boxes</label>
                <input type="text" id="clo-input-boxes" class="bento-input" placeholder="e.g. 1 box each" value="${this.state.quickBoxes}">
                <div class="bento-chip-row">
                  <button type="button" class="bento-chip" data-preset="1 box each">1 box each</button>
                  <button type="button" class="bento-chip" data-preset="2 boxes each">2 boxes each</button>
                  <button type="button" class="bento-chip" data-preset="4 boxes each">4 boxes each</button>
                  <button type="button" class="bento-chip" data-preset="Annual Supply">Annual Supply</button>
                </div>
              </div>

              <!-- Insurance Used? / Special Instructions? -->
              <div class="bento-field col-span-7">
                <label for="clo-input-instructions">Insurance Used? / Special Instructions?</label>
                <input type="text" id="clo-input-instructions" class="bento-input" placeholder="e.g. VSP is used already, Self pay" value="${this.state.quickInstructions}">
                <div class="bento-chip-row">
                  <button type="button" class="bento-chip" data-preset-ins="Self pay">Self pay</button>
                  <button type="button" class="bento-chip" data-preset-ins="VSP is used already, Self pay">VSP used, Self pay</button>
                  <button type="button" class="bento-chip" data-preset-ins="VSP Insurance">VSP</button>
                  <button type="button" class="bento-chip" data-preset-ins="Eyemed">Eyemed</button>
                  <button type="button" class="bento-chip" data-preset-ins="Direct Mail to Patient">Direct Mail</button>
                  <button type="button" class="bento-chip" data-preset-ins="Hold for Pick-up">Hold Pick-up</button>
                  <button type="button" class="bento-chip" data-preset-ins="Paid in full">Paid in full</button>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="bento-btn-row col-span-12">
                <button type="button" class="bento-btn bento-btn-primary" id="clo-btn-save-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  <span>+ Add Order (Row #${activeRowNum})</span>
                </button>
                <button type="button" class="bento-btn bento-btn-secondary" id="clo-btn-clear-fields">
                  <span>Clear Inputs</span>
                </button>
                <span class="bento-keyboard-hint">💡 Hit <strong>Enter</strong> to instantly add & advance to next row</span>
              </div>

            </form>
          </div>

          <!-- Bento Card 3: Clinical Memo & Email Tool (Span 4) -->
          <div class="bento-card bento-advisory-card">
            <div class="bento-advisory-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span>Dr. Robbins Reminder</span>
            </div>
            
            <div class="bento-advisory-quote">
              "*GET PT EMAIL IF MAILING CONTACTS*"
              <span class="bento-advisory-author">(Per Dr. Robbins)</span>
            </div>

            <p class="bento-advisory-desc">
              If shipping contacts directly to a patient's home, collect their email address so tracking & delivery status are sent to them.
            </p>

            <div class="bento-mail-tool">
              <label for="clo-quick-email">Quick Email Inserter:</label>
              <div class="bento-mail-input-wrap">
                <input type="email" id="clo-quick-email" class="bento-input" placeholder="patient@email.com" value="${this.state.quickEmail}">
                <button type="button" class="bento-btn bento-btn-xs" id="clo-btn-attach-email" title="Append email to Special Instructions">
                  Attach
                </button>
              </div>
            </div>
          </div>

          <!-- Bento Card 4: Daily 16-Row Ledger (Span 12) -->
          <div class="bento-card bento-table-card">
            <div class="bento-card-header">
              <div class="bento-card-title-group">
                <h3>Today's Accumulated Orders</h3>
                <span class="bento-card-subtitle">Orders entered here remain saved all day. Click any row to edit inline or in the quick entry box above.</span>
              </div>
              <div class="bento-table-stats">
                <span class="bento-dot-indicator ${filledCount > 0 ? 'active' : ''}"></span>
                <span><strong>${filledCount}</strong> of ${this.state.rows.length} Rows Recorded</span>
              </div>
            </div>

            <div class="bento-table-wrapper">
              <table class="bento-ledger-table">
                <thead>
                  <tr>
                    <th style="width: 44px;">#</th>
                    <th style="width: 22%;">Name</th>
                    <th style="width: 15%;">Date of Birth</th>
                    <th style="width: 18%;">Phone Number</th>
                    <th style="width: 15%;">Number of Boxes</th>
                    <th style="width: 24%;">Insurance / Special Instructions</th>
                    <th style="width: 60px;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.state.rows.map((row, idx) => {
                    const isSelected = idx === this.state.activeRowIndex;
                    const hasData = Boolean(row.name || row.dob || row.phone || row.boxes || row.instructions);
                    return `
                      <tr class="bento-ledger-row ${isSelected ? 'row-selected' : ''} ${hasData ? 'row-has-data' : 'row-empty'}" data-row-index="${idx}">
                        <td class="cell-num">${row.id}</td>
                        <td class="cell-input-wrap">
                          <input type="text" class="bento-cell-input text-left" data-field="name" data-row="${idx}" placeholder="Empty..." value="${row.name}">
                        </td>
                        <td class="cell-input-wrap">
                          <input type="text" class="bento-cell-input text-center" data-field="dob" data-row="${idx}" placeholder="MM/DD/YYYY" value="${row.dob}">
                        </td>
                        <td class="cell-input-wrap">
                          <input type="text" class="bento-cell-input text-center" data-field="phone" data-row="${idx}" placeholder="(859) 000-0000" value="${row.phone}">
                        </td>
                        <td class="cell-input-wrap">
                          <input type="text" class="bento-cell-input text-center" data-field="boxes" data-row="${idx}" placeholder="1 box each" value="${row.boxes}">
                        </td>
                        <td class="cell-input-wrap">
                          <input type="text" class="bento-cell-input text-left" data-field="instructions" data-row="${idx}" placeholder="Insurance / Instructions..." value="${row.instructions}">
                        </td>
                        <td class="cell-actions">
                          <button type="button" class="bento-row-btn btn-edit-row" data-row="${idx}" title="Edit in Quick Entry Card">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          </button>
                          <button type="button" class="bento-row-btn btn-clear-row" data-row="${idx}" title="Clear this row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Add Row / Extra Sheet Footer -->
            <div class="bento-table-footer">
              <button type="button" class="bento-btn bento-btn-sm bento-btn-ghost" id="clo-btn-add-sheet" title="Add another sheet of 16 rows if you have a high volume day">
                + Add Another 16 Rows (Sheet ${sheets.length + 1})
              </button>
            </div>
          </div>

          <!-- Bento Card 5: Exact Live Print Replica Preview (Span 12) -->
          <div class="bento-card bento-preview-card">
            <div class="bento-card-header">
              <div class="bento-card-title-group">
                <h3>Live Print Replica (11" × 8.5" Landscape)</h3>
                <span class="bento-card-subtitle">Exact 1:1 reproduction of the physical pad sheet</span>
              </div>
              <div class="bento-preview-controls">
                <div class="bento-toggle-switch">
                  <button type="button" class="bento-toggle-btn ${this.state.previewMode === 'blank' ? 'active' : ''}" id="clo-preview-blank">
                    Blank Template
                  </button>
                  <button type="button" class="bento-toggle-btn ${this.state.previewMode === 'current' ? 'active' : ''}" id="clo-preview-current">
                    Current Orders (${filledCount})
                  </button>
                </div>
                <button type="button" class="bento-btn bento-btn-primary bento-btn-sm" id="clo-btn-print-preview">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  <span>Print Sheet Now</span>
                </button>
              </div>
            </div>

            <!-- Preview Container -->
            <div class="bento-preview-stage">
              <div class="clo-preview-wrapper ${isBlankPreview ? 'clo-force-blank' : ''}" id="clo-screen-preview">
                ${this.renderSheetsHTML(isBlankPreview)}
              </div>
            </div>
          </div>

        </div> <!-- /bento-grid -->
      </div> <!-- /bento-interactive-screen -->

      <!-- EXACT PHYSICAL PRINTOUT (Displayed exclusively in @media print) -->
      <div class="clo-printout-wrapper ${isBlankPreview ? 'clo-force-blank' : ''}" id="clo-actual-printout">
        ${this.renderSheetsHTML(isBlankPreview)}
      </div>
    `;
  }

  renderSheetsHTML(forceBlank = false) {
    const sheets = this.getSheets();
    return sheets.map((sheet, sIdx) => `
      <div class="clo-print-page ${sIdx > 0 ? 'clo-page-break' : ''}">
        <div class="clo-print-title">CONTACT LENS ORDERS</div>
        <table class="clo-print-table">
          <thead>
            <tr>
              <th class="col-name">NAME</th>
              <th class="col-dob">DATE OF BIRTH</th>
              <th class="col-phone">PHONE NUMBER</th>
              <th class="col-boxes">NUMBER OF BOXES</th>
              <th class="col-ins">INSURANCE USED?<br>SPECIAL INSTRUCTIONS?</th>
            </tr>
          </thead>
          <tbody>
            ${sheet.rows.map(row => {
              const nameVal = forceBlank ? '' : (row.name || '');
              const dobVal = forceBlank ? '' : (row.dob || '');
              const phoneVal = forceBlank ? '' : (row.phone || '');
              const boxesVal = forceBlank ? '' : (row.boxes || '');
              const insVal = forceBlank ? '' : (row.instructions || '');

              return `
                <tr>
                  <td class="col-name"><span class="clo-cell-value">${nameVal}</span></td>
                  <td class="col-dob"><span class="clo-cell-value">${dobVal}</span></td>
                  <td class="col-phone"><span class="clo-cell-value">${phoneVal}</span></td>
                  <td class="col-boxes"><span class="clo-cell-value">${boxesVal}</span></td>
                  <td class="col-ins"><span class="clo-cell-value">${insVal}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
  }

  updatePreviewAndPrintout() {
    const isBlank = this.state.previewMode === 'blank' || document.body.classList.contains('print-blank-active');
    const previewEl = document.getElementById('clo-screen-preview');
    const printoutEl = document.getElementById('clo-actual-printout');

    if (previewEl) {
      previewEl.className = `clo-preview-wrapper ${isBlank ? 'clo-force-blank' : ''}`;
      previewEl.innerHTML = this.renderSheetsHTML(isBlank);
    }
    if (printoutEl) {
      printoutEl.className = `clo-printout-wrapper ${isBlank ? 'clo-force-blank' : ''}`;
      printoutEl.innerHTML = this.renderSheetsHTML(isBlank);
    }
  }

  bindEvents() {
    // Top Hero Print Actions
    const btnPrintFilled = this.container.querySelector('#clo-btn-print-filled');
    if (btnPrintFilled) {
      btnPrintFilled.addEventListener('click', () => {
        this.state.previewMode = 'current';
        document.body.classList.remove('print-blank-active');
        this.updatePreviewAndPrintout();
        window.print();
      });
    }

    const btnPrintBlank = this.container.querySelector('#clo-btn-print-blank');
    if (btnPrintBlank) {
      btnPrintBlank.addEventListener('click', () => this.printBlank());
    }

    const btnClearAll = this.container.querySelector('#clo-btn-clear-all');
    if (btnClearAll) {
      btnClearAll.addEventListener('click', () => this.reset());
    }

    const btnSample = this.container.querySelector('#clo-btn-sample');
    if (btnSample) {
      btnSample.addEventListener('click', () => this.loadJanetFrancisSample());
    }

    // Row dropdown selector
    const rowSelect = this.container.querySelector('#clo-row-select');
    if (rowSelect) {
      rowSelect.addEventListener('change', (e) => {
        this.selectRow(parseInt(e.target.value, 10));
      });
    }

    // Input elements
    const inputName = this.container.querySelector('#clo-input-name');
    const inputDob = this.container.querySelector('#clo-input-dob');
    const inputPhone = this.container.querySelector('#clo-input-phone');
    const inputBoxes = this.container.querySelector('#clo-input-boxes');
    const inputIns = this.container.querySelector('#clo-input-instructions');

    if (inputPhone) {
      inputPhone.addEventListener('input', (e) => {
        const formatted = this.formatPhone(e.target.value);
        if (formatted !== e.target.value) {
          e.target.value = formatted;
        }
        this.state.quickPhone = e.target.value;
      });
    }

    if (inputDob) {
      inputDob.addEventListener('blur', (e) => {
        const formatted = this.formatDob(e.target.value);
        if (formatted !== e.target.value) {
          e.target.value = formatted;
        }
        this.state.quickDob = e.target.value;
      });
    }

    // Form submission on Enter key
    const entryForm = this.container.querySelector('#clo-entry-form');
    if (entryForm) {
      entryForm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.saveQuickEntryToActiveRow();
        }
      });
    }

    // Presets
    this.container.querySelectorAll('.bento-chip[data-preset]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const val = chip.getAttribute('data-preset');
        if (inputBoxes) {
          inputBoxes.value = val;
          this.state.quickBoxes = val;
          inputBoxes.focus();
        }
      });
    });

    this.container.querySelectorAll('.bento-chip[data-preset-ins]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const val = chip.getAttribute('data-preset-ins');
        if (inputIns) {
          if (inputIns.value.trim() && !inputIns.value.includes(val)) {
            inputIns.value = `${inputIns.value.trim()}, ${val}`;
          } else {
            inputIns.value = val;
          }
          this.state.quickInstructions = inputIns.value;
          inputIns.focus();
        }
      });
    });

    // Save Row Button
    const btnSaveRow = this.container.querySelector('#clo-btn-save-row');
    if (btnSaveRow) {
      btnSaveRow.addEventListener('click', () => this.saveQuickEntryToActiveRow());
    }

    // Clear Fields Button
    const btnClearFields = this.container.querySelector('#clo-btn-clear-fields');
    if (btnClearFields) {
      btnClearFields.addEventListener('click', () => this.clearQuickInputs());
    }

    // Dr. Robbins Email Tool
    const quickEmailInput = this.container.querySelector('#clo-quick-email');
    const btnAttachEmail = this.container.querySelector('#clo-btn-attach-email');
    if (btnAttachEmail && quickEmailInput && inputIns) {
      btnAttachEmail.addEventListener('click', () => {
        const email = quickEmailInput.value.trim();
        if (email) {
          const mailTag = `Mail Pt: ${email}`;
          if (!inputIns.value.includes(mailTag)) {
            inputIns.value = inputIns.value.trim() ? `${inputIns.value.trim()}, ${mailTag}` : mailTag;
            this.state.quickInstructions = inputIns.value;
          }
        }
      });
    }

    // Ledger Table Inline Editing
    const tableInputs = this.container.querySelectorAll('.bento-cell-input');
    tableInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const rowIdx = parseInt(e.target.getAttribute('data-row'), 10);
        const field = e.target.getAttribute('data-field');
        if (this.state.rows[rowIdx] && field) {
          this.state.rows[rowIdx][field] = e.target.value;
          this.updatePreviewAndPrintout();
          this.notifyChange();
        }
      });

      input.addEventListener('focus', (e) => {
        const rowIdx = parseInt(e.target.getAttribute('data-row'), 10);
        this.highlightRowInTable(rowIdx);
      });
    });

    // Ledger Actions
    this.container.querySelectorAll('.btn-edit-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rowIdx = parseInt(btn.getAttribute('data-row'), 10);
        this.selectRow(rowIdx);
      });
    });

    this.container.querySelectorAll('.btn-clear-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rowIdx = parseInt(btn.getAttribute('data-row'), 10);
        this.clearRow(rowIdx);
      });
    });

    // Add extra 16-row sheet button
    const btnAddSheet = this.container.querySelector('#clo-btn-add-sheet');
    if (btnAddSheet) {
      btnAddSheet.addEventListener('click', () => {
        const startId = this.state.rows.length + 1;
        const newRows = Array.from({ length: 16 }, (_, i) => ({
          id: startId + i,
          name: '',
          dob: '',
          phone: '',
          boxes: '',
          instructions: '',
          timestamp: ''
        }));
        this.state.rows = [...this.state.rows, ...newRows];
        this.notifyChange();
        this.render();
        this.bindEvents();
      });
    }

    // Preview Mode Controls
    const btnPrevBlank = this.container.querySelector('#clo-preview-blank');
    const btnPrevCurrent = this.container.querySelector('#clo-preview-current');
    const btnPrintPreview = this.container.querySelector('#clo-btn-print-preview');

    if (btnPrevBlank && btnPrevCurrent) {
      btnPrevBlank.addEventListener('click', () => {
        this.state.previewMode = 'blank';
        btnPrevBlank.classList.add('active');
        btnPrevCurrent.classList.remove('active');
        this.updatePreviewAndPrintout();
      });

      btnPrevCurrent.addEventListener('click', () => {
        this.state.previewMode = 'current';
        btnPrevCurrent.classList.add('active');
        btnPrevBlank.classList.remove('active');
        this.updatePreviewAndPrintout();
      });
    }

    if (btnPrintPreview) {
      btnPrintPreview.addEventListener('click', () => {
        window.print();
      });
    }
  }

  highlightRowInTable(rowIdx) {
    this.container.querySelectorAll('.bento-ledger-row').forEach((tr, i) => {
      if (i === rowIdx) tr.classList.add('row-selected');
      else tr.classList.remove('row-selected');
    });
  }

  selectRow(rowIdx) {
    if (rowIdx < 0 || rowIdx >= this.state.rows.length) return;
    this.state.activeRowIndex = rowIdx;
    const row = this.state.rows[rowIdx];

    this.state.quickName = row.name || '';
    this.state.quickDob = row.dob || '';
    this.state.quickPhone = row.phone || '';
    this.state.quickBoxes = row.boxes || '';
    this.state.quickInstructions = row.instructions || '';

    this.render();
    this.bindEvents();

    const nameInput = this.container.querySelector('#clo-input-name');
    if (nameInput) nameInput.focus();
  }

  saveQuickEntryToActiveRow() {
    const idx = this.state.activeRowIndex;
    const nameInput = this.container.querySelector('#clo-input-name');
    const dobInput = this.container.querySelector('#clo-input-dob');
    const phoneInput = this.container.querySelector('#clo-input-phone');
    const boxesInput = this.container.querySelector('#clo-input-boxes');
    const insInput = this.container.querySelector('#clo-input-instructions');

    const nameVal = nameInput ? nameInput.value.trim() : '';

    this.state.rows[idx] = {
      id: idx + 1,
      name: nameVal,
      dob: dobInput ? dobInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      boxes: boxesInput ? boxesInput.value.trim() : '',
      instructions: insInput ? insInput.value.trim() : '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto-advance to the next empty row
    let nextEmpty = this.state.rows.findIndex((r, i) => i > idx && !r.name.trim());
    if (nextEmpty === -1) {
      nextEmpty = this.state.rows.findIndex(r => !r.name.trim());
    }
    if (nextEmpty !== -1) {
      this.state.activeRowIndex = nextEmpty;
      this.clearQuickInputs();
    }

    this.notifyChange();
    this.render();
    this.bindEvents();

    // Re-focus name input for rapid sequential entry
    const newNameInput = this.container.querySelector('#clo-input-name');
    if (newNameInput) newNameInput.focus();
  }

  clearQuickInputs() {
    this.state.quickName = '';
    this.state.quickDob = '';
    this.state.quickPhone = '';
    this.state.quickBoxes = '';
    this.state.quickInstructions = '';
    this.state.quickEmail = '';

    const nameInput = this.container.querySelector('#clo-input-name');
    const dobInput = this.container.querySelector('#clo-input-dob');
    const phoneInput = this.container.querySelector('#clo-input-phone');
    const boxesInput = this.container.querySelector('#clo-input-boxes');
    const insInput = this.container.querySelector('#clo-input-instructions');

    if (nameInput) nameInput.value = '';
    if (dobInput) dobInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (boxesInput) boxesInput.value = '';
    if (insInput) insInput.value = '';
  }

  clearRow(rowIdx) {
    if (this.state.rows[rowIdx]) {
      this.state.rows[rowIdx] = {
        id: rowIdx + 1,
        name: '',
        dob: '',
        phone: '',
        boxes: '',
        instructions: '',
        timestamp: ''
      };
      if (this.state.activeRowIndex === rowIdx) {
        this.clearQuickInputs();
      }
      this.notifyChange();
      this.render();
      this.bindEvents();
    }
  }
}
