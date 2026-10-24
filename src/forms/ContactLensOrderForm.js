/* Pal Optical Forms Web App - Contact Lens Order Sheet (16-Row Landscape Pad)
 *
 * Designed to match the exact physical Contact Lens Order Pad:
 * - Direct on-sheet input fields in all 16 rows across all 5 columns
 * - Bento Box toolbar with quick presets, batch statistics, and Dr. Robbins memo
 * - Single-page Landscape 11" x 8.5" printout
 * - One-click "Print Blank Pad" (guarantees zero written text on the printout)
 * - Auto-persistence across browser reloads throughout the day
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

    // Helper to generate 16 empty rows
    const createEmptyRows = (startId = 1) =>
      Array.from({ length: 16 }, (_, i) => ({
        id: startId + i,
        name: '',
        dob: '',
        phone: '',
        boxes: '',
        instructions: ''
      }));

    // Safely retrieve any stored orders
    let savedOrders = null;
    try {
      if (typeof localStorage !== 'undefined') {
        const local = localStorage.getItem('pal-cl-daily-orders');
        if (local) savedOrders = JSON.parse(local);
      }
    } catch (e) {
      console.warn('Could not read pal-cl-daily-orders:', e);
    }

    // Determine row data with complete property guarantees
    let rawRows = (state && Array.isArray(state.rows) && state.rows.length)
      ? state.rows
      : (savedOrders && Array.isArray(savedOrders.rows) && savedOrders.rows.length)
        ? savedOrders.rows
        : createEmptyRows(1);

    // Normalize all rows to ensure every field is a string
    const safeRows = rawRows.map((r, i) => ({
      id: i + 1,
      name: String(r?.name || ''),
      dob: String(r?.dob || ''),
      phone: String(r?.phone || ''),
      boxes: String(r?.boxes || ''),
      instructions: String(r?.instructions || '')
    }));

    // Ensure at least 16 rows
    while (safeRows.length < 16) {
      safeRows.push({
        id: safeRows.length + 1,
        name: '',
        dob: '',
        phone: '',
        boxes: '',
        instructions: ''
      });
    }

    this.state = {
      batchDate: state?.batchDate || savedOrders?.batchDate || todayStr,
      rows: safeRows,
      quickName: '',
      quickDob: '',
      quickPhone: '',
      quickBoxes: '',
      quickInstructions: '',
      quickEmail: '',
      forceBlankPrint: false,
      ...state,
      rows: safeRows
    };

    this.styleTag = null;
    this.initLandscapeStyle();
    this.render();
    this.bindEvents();
  }

  initLandscapeStyle() {
    if (typeof document === 'undefined') return;
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
    if (this.styleTag) {
      this.styleTag.remove();
      this.styleTag = null;
    }
  }

  getPatientName() {
    const filled = this.state.rows.filter(r => (r?.name || '').trim().length > 0);
    if (filled.length === 1) {
      return `Contact Lens Orders - ${filled[0].name.trim()}`;
    }
    if (filled.length > 1) {
      return `Contact Lens Orders (${filled.length} Orders) - ${this.state.batchDate}`;
    }
    return 'Contact Lens Orders';
  }

  notifyChange() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pal-cl-daily-orders', JSON.stringify({
          batchDate: this.state.batchDate,
          rows: this.state.rows
        }));
      }
    } catch (e) {
      console.warn('Could not persist orders to localStorage:', e);
    }

    if (typeof this.onStateChange === 'function') {
      this.onStateChange(this.state);
    }
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

  loadSampleJanetFrancis() {
    this.state.rows[0] = {
      id: 1,
      name: 'Janet Francis',
      dob: '01/16/1960',
      phone: '(859) 433-6701',
      boxes: '1 box each',
      instructions: 'VSP is used already, Self pay'
    };
    this.notifyChange();
    this.render();
    this.bindEvents();
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
        instructions: ''
      }));
      this.state.quickName = '';
      this.state.quickDob = '';
      this.state.quickPhone = '';
      this.state.quickBoxes = '';
      this.state.quickInstructions = '';
      this.state.quickEmail = '';
      this.state.forceBlankPrint = false;

      this.notifyChange();
      this.render();
      this.bindEvents();
    }
  }

  print() {
    this.state.forceBlankPrint = false;
    document.body.classList.remove('print-blank-active');
    window.print();
  }

  printBlank() {
    // Force blank output and trigger print
    this.state.forceBlankPrint = true;
    document.body.classList.add('print-blank-active');
    
    // Update live inputs to blank for the print view
    const sheetEl = this.container.querySelector('#clo-interactive-sheet');
    if (sheetEl) sheetEl.classList.add('clo-force-blank');

    window.print();

    setTimeout(() => {
      this.state.forceBlankPrint = false;
      if (window.app?.activeMode !== 'print-blank') {
        document.body.classList.remove('print-blank-active');
      }
      if (sheetEl) sheetEl.classList.remove('clo-force-blank');
    }, 500);
  }

  render() {
    const filledCount = this.state.rows.filter(r =>
      (r?.name || '').trim().length > 0 ||
      (r?.phone || '').trim().length > 0 ||
      (r?.boxes || '').trim().length > 0
    ).length;

    const nextEmptyIndex = this.state.rows.findIndex(r => !(r?.name || '').trim());
    const nextRowNum = nextEmptyIndex !== -1 ? nextEmptyIndex + 1 : 16;

    this.container.innerHTML = `
      <div class="clo-main-container">
        
        <!-- BENTO BOX CONTROL DOCK (Screen only) -->
        <div class="bento-dock no-print">
          
          <!-- Bento Card 1: Batch Header & Print Actions -->
          <div class="bento-dock-card bento-hero-card">
            <div class="bento-hero-left">
              <div class="bento-lens-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <div class="bento-pill-row">
                  <span class="bento-pill bento-pill-dark">Landscape 16-Row Sheet</span>
                  <span class="bento-pill ${filledCount > 0 ? 'bento-pill-green' : 'bento-pill-gray'}">
                    📦 ${filledCount} of 16 Orders Filled
                  </span>
                  <span class="bento-pill bento-pill-outline">${this.state.batchDate}</span>
                </div>
                <h2 class="bento-title">Contact Lens Orders</h2>
                <p class="bento-subtitle">Type directly into the 16 rows on the sheet below throughout the day. Print at closing, or print blank sheets at any time.</p>
              </div>
            </div>

            <div class="bento-hero-actions">
              <button type="button" class="clo-btn clo-btn-primary" id="clo-btn-print-filled" title="Print this sheet with all entered patient orders">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                <span>Print Completed Sheet (${filledCount})</span>
              </button>

              <button type="button" class="clo-btn clo-btn-secondary" id="clo-btn-print-blank" title="Print a 100% blank template sheet ready for handwriting (removes all text)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <span>Print Blank Pad</span>
              </button>

              <button type="button" class="clo-btn clo-btn-subtle" id="clo-btn-clear-sheet" title="Reset all rows for tomorrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                <span>Start New Day</span>
              </button>

              <button type="button" class="clo-btn clo-btn-ghost" id="clo-btn-sample" title="Load sample from photo (Janet Francis)">
                <span>Demo (Janet Francis)</span>
              </button>
            </div>
          </div>

          <!-- Bento Grid: Fast Add + Doctor Memo -->
          <div class="bento-subgrid">
            
            <!-- Quick Entry Card -->
            <div class="bento-dock-card bento-quick-card">
              <div class="bento-card-header">
                <h3>Quick Add Patient Order</h3>
                <span class="bento-card-tag">Inserts into Row #${nextRowNum}</span>
              </div>
              <div class="bento-quick-inputs">
                <input type="text" id="quick-input-name" class="bento-input" placeholder="Patient Name (e.g. Janet Francis)">
                <input type="text" id="quick-input-dob" class="bento-input" placeholder="DOB (MM/DD/YYYY)" style="max-width: 140px;">
                <input type="text" id="quick-input-phone" class="bento-input" placeholder="Phone (859) 000-0000" style="max-width: 170px;">
                <input type="text" id="quick-input-boxes" class="bento-input" placeholder="Boxes (e.g. 1 box each)" style="max-width: 160px;">
                <input type="text" id="quick-input-instructions" class="bento-input" placeholder="Insurance / Special Instructions">
                <button type="button" class="clo-btn clo-btn-primary" id="btn-quick-add" style="white-space: nowrap;">
                  + Add to Row #${nextRowNum}
                </button>
              </div>
              
              <!-- Quick Chips -->
              <div class="bento-chip-row">
                <span class="chip-label">Boxes:</span>
                <button type="button" class="bento-chip" data-quick-box="1 box each">1 box each</button>
                <button type="button" class="bento-chip" data-quick-box="2 boxes each">2 boxes each</button>
                <button type="button" class="bento-chip" data-quick-box="4 boxes each">4 boxes each</button>
                <button type="button" class="bento-chip" data-quick-box="Annual Supply">Annual Supply</button>
                <span class="chip-label" style="margin-left: 10px;">Billing:</span>
                <button type="button" class="bento-chip" data-quick-ins="Self pay">Self pay</button>
                <button type="button" class="bento-chip" data-quick-ins="VSP is used already, Self pay">VSP used, Self pay</button>
                <button type="button" class="bento-chip" data-quick-ins="VSP Insurance">VSP</button>
                <button type="button" class="bento-chip" data-quick-ins="Eyemed">Eyemed</button>
                <button type="button" class="bento-chip" data-quick-ins="Direct Mail to Patient">Direct Mail</button>
              </div>
            </div>

            <!-- Dr. Robbins Sticky Note -->
            <div class="bento-dock-card bento-memo-card">
              <div class="bento-memo-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span>Dr. Robbins Note</span>
              </div>
              <div class="bento-memo-quote">
                "*GET PT EMAIL IF MAILING CONTACTS*"
              </div>
              <p class="bento-memo-sub">
                If patient requests contacts mailed directly to home, record their email for carrier delivery tracking.
              </p>
            </div>

          </div>
        </div>

        <!-- THE PHYSICAL SHEET CANVAS (On-screen editable + Exact Printout) -->
        <div class="clo-sheet-canvas-wrapper">
          <div class="clo-sheet-canvas" id="clo-interactive-sheet">
            
            <!-- Exact Title Matching Photo -->
            <h1 class="clo-title-header">CONTACT LENS ORDERS</h1>

            <!-- Exact 5-Column Table Matching Photo -->
            <table class="clo-table">
              <thead>
                <tr>
                  <th class="clo-th-name">NAME</th>
                  <th class="clo-th-dob">DATE OF BIRTH</th>
                  <th class="clo-th-phone">PHONE NUMBER</th>
                  <th class="clo-th-boxes">NUMBER OF BOXES</th>
                  <th class="clo-th-instructions">
                    INSURANCE USED?<br>SPECIAL INSTRUCTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                ${this.state.rows.map((row, idx) => `
                  <tr class="clo-table-row" data-row-idx="${idx}">
                    
                    <!-- 1. NAME (Left Aligned) -->
                    <td class="clo-td-name">
                      <input 
                        type="text" 
                        class="clo-input clo-input-name" 
                        data-row="${idx}" 
                        data-field="name" 
                        placeholder="${idx === 0 ? 'e.g. Janet Francis' : ''}" 
                        value="${this.escapeAttr(row.name)}"
                        autocomplete="off"
                        spellcheck="false"
                      >
                    </td>

                    <!-- 2. DATE OF BIRTH (Centered) -->
                    <td class="clo-td-dob">
                      <input 
                        type="text" 
                        class="clo-input clo-input-dob text-center" 
                        data-row="${idx}" 
                        data-field="dob" 
                        placeholder="${idx === 0 ? 'MM/DD/YYYY' : ''}" 
                        value="${this.escapeAttr(row.dob)}"
                        autocomplete="off"
                      >
                    </td>

                    <!-- 3. PHONE NUMBER (Centered) -->
                    <td class="clo-td-phone">
                      <input 
                        type="text" 
                        class="clo-input clo-input-phone text-center" 
                        data-row="${idx}" 
                        data-field="phone" 
                        placeholder="${idx === 0 ? '(859) 000-0000' : ''}" 
                        value="${this.escapeAttr(row.phone)}"
                        autocomplete="off"
                      >
                    </td>

                    <!-- 4. NUMBER OF BOXES (Centered) -->
                    <td class="clo-td-boxes">
                      <input 
                        type="text" 
                        class="clo-input clo-input-boxes text-center" 
                        data-row="${idx}" 
                        data-field="boxes" 
                        placeholder="${idx === 0 ? '1 box each' : ''}" 
                        value="${this.escapeAttr(row.boxes)}"
                        autocomplete="off"
                      >
                    </td>

                    <!-- 5. INSURANCE USED? / SPECIAL INSTRUCTIONS? (Left Aligned) -->
                    <td class="clo-td-instructions">
                      <input 
                        type="text" 
                        class="clo-input clo-input-instructions" 
                        data-row="${idx}" 
                        data-field="instructions" 
                        placeholder="${idx === 0 ? 'e.g. VSP is used already, Self pay' : ''}" 
                        value="${this.escapeAttr(row.instructions)}"
                        autocomplete="off"
                      >
                    </td>

                  </tr>
                `).join('')}
              </tbody>
            </table>

          </div> <!-- /clo-sheet-canvas -->
        </div> <!-- /clo-sheet-canvas-wrapper -->

      </div> <!-- /clo-main-container -->
    `;
  }

  escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  bindEvents() {
    // 1. Direct Table Cell Inputs
    const tableInputs = this.container.querySelectorAll('.clo-input');
    tableInputs.forEach(input => {
      // Live typing update
      input.addEventListener('input', (e) => {
        const rowIdx = parseInt(e.target.getAttribute('data-row'), 10);
        const field = e.target.getAttribute('data-field');
        if (this.state.rows[rowIdx] && field) {
          // Phone formatting on the fly
          if (field === 'phone') {
            const formatted = this.formatPhone(e.target.value);
            if (formatted !== e.target.value) {
              e.target.value = formatted;
            }
          }
          this.state.rows[rowIdx][field] = e.target.value;
          this.notifyChange();
        }
      });

      // DOB auto formatting on blur
      input.addEventListener('blur', (e) => {
        const rowIdx = parseInt(e.target.getAttribute('data-row'), 10);
        const field = e.target.getAttribute('data-field');
        if (field === 'dob') {
          const formatted = this.formatDob(e.target.value);
          if (formatted !== e.target.value) {
            e.target.value = formatted;
            this.state.rows[rowIdx][field] = formatted;
            this.notifyChange();
          }
        }
      });

      // Enter key navigates to next field or next row
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const rowIdx = parseInt(e.target.getAttribute('data-row'), 10);
          const field = e.target.getAttribute('data-field');
          
          if (field === 'instructions' && rowIdx < 15) {
            // Move to first field of next row
            const nextInput = this.container.querySelector(`.clo-input[data-row="${rowIdx + 1}"][data-field="name"]`);
            if (nextInput) nextInput.focus();
          } else {
            // Move to next cell in current row
            const fields = ['name', 'dob', 'phone', 'boxes', 'instructions'];
            const curPos = fields.indexOf(field);
            if (curPos !== -1 && curPos < fields.length - 1) {
              const nextField = fields[curPos + 1];
              const nextInput = this.container.querySelector(`.clo-input[data-row="${rowIdx}"][data-field="${nextField}"]`);
              if (nextInput) nextInput.focus();
            }
          }
        }
      });
    });

    // 2. Bento Quick Add Inputs
    const qName = this.container.querySelector('#quick-input-name');
    const qDob = this.container.querySelector('#quick-input-dob');
    const qPhone = this.container.querySelector('#quick-input-phone');
    const qBoxes = this.container.querySelector('#quick-input-boxes');
    const qIns = this.container.querySelector('#quick-input-instructions');
    const btnQuickAdd = this.container.querySelector('#btn-quick-add');

    if (qPhone) {
      qPhone.addEventListener('input', (e) => {
        const formatted = this.formatPhone(e.target.value);
        if (formatted !== e.target.value) e.target.value = formatted;
      });
    }

    if (qDob) {
      qDob.addEventListener('blur', (e) => {
        const formatted = this.formatDob(e.target.value);
        if (formatted !== e.target.value) e.target.value = formatted;
      });
    }

    const doQuickAdd = () => {
      const nameVal = qName ? qName.value.trim() : '';
      if (!nameVal) {
        if (qName) qName.focus();
        return;
      }

      // Find first empty row
      let targetIdx = this.state.rows.findIndex(r => !(r?.name || '').trim());
      if (targetIdx === -1) targetIdx = 0; // fallback to row 0 if all filled

      this.state.rows[targetIdx] = {
        id: targetIdx + 1,
        name: nameVal,
        dob: qDob ? qDob.value.trim() : '',
        phone: qPhone ? qPhone.value.trim() : '',
        boxes: qBoxes ? qBoxes.value.trim() : '',
        instructions: qIns ? qIns.value.trim() : ''
      };

      // Clear quick inputs
      if (qName) qName.value = '';
      if (qDob) qDob.value = '';
      if (qPhone) qPhone.value = '';
      if (qBoxes) qBoxes.value = '';
      if (qIns) qIns.value = '';

      this.notifyChange();
      this.render();
      this.bindEvents();

      // Focus table cell of next empty row or quick input
      const nextQName = this.container.querySelector('#quick-input-name');
      if (nextQName) nextQName.focus();
    };

    if (btnQuickAdd) {
      btnQuickAdd.addEventListener('click', doQuickAdd);
    }

    [qName, qDob, qPhone, qBoxes, qIns].forEach(el => {
      if (el) {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            doQuickAdd();
          }
        });
      }
    });

    // 3. Preset chips
    this.container.querySelectorAll('.bento-chip[data-quick-box]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-quick-box');
        if (qBoxes) {
          qBoxes.value = val;
          qBoxes.focus();
        }
      });
    });

    this.container.querySelectorAll('.bento-chip[data-quick-ins]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-quick-ins');
        if (qIns) {
          if (qIns.value.trim() && !qIns.value.includes(val)) {
            qIns.value = `${qIns.value.trim()}, ${val}`;
          } else {
            qIns.value = val;
          }
          qIns.focus();
        }
      });
    });

    // 4. Hero Action Buttons
    const btnPrintFilled = this.container.querySelector('#clo-btn-print-filled');
    if (btnPrintFilled) {
      btnPrintFilled.addEventListener('click', () => this.print());
    }

    const btnPrintBlank = this.container.querySelector('#clo-btn-print-blank');
    if (btnPrintBlank) {
      btnPrintBlank.addEventListener('click', () => this.printBlank());
    }

    const btnClearSheet = this.container.querySelector('#clo-btn-clear-sheet');
    if (btnClearSheet) {
      btnClearSheet.addEventListener('click', () => this.reset());
    }

    const btnSample = this.container.querySelector('#clo-btn-sample');
    if (btnSample) {
      btnSample.addEventListener('click', () => this.loadSampleJanetFrancis());
    }
  }
}
