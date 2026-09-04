/* Pal Optical Forms Web App - Lab Order / Write-Up Form (5.5" x 8.5" Statement) */
import writeUpFieldsData from './write_up_fields.json';

export class WriteUpForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.state = {
      printMode: 'preprinted', // 'preprinted' (overlay only) or 'full' (with background)
      date: new Date().toLocaleDateString('en-US'),
      ...state
    };
    this.onStateChange = onStateChange;
    this.fields = writeUpFieldsData.fields || [];
    this.pageWidth = writeUpFieldsData.pageWidth || 396; // 5.5 inches in points
    this.pageHeight = writeUpFieldsData.pageHeight || 612; // 8.5 inches in points
    this.scale = 1.0;
    this.resizeObserver = null;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.setupResizeObserver();
  }

  render() {
    const isPreprinted = this.state.printMode !== 'full';

    this.container.innerHTML = `
      <div class="writeup-outer-wrapper print:m-0 print:p-0">
        <!-- Control Bar for Printer Feed Mode -->
        <div class="writeup-toolbar no-print flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold uppercase tracking-wider text-neutral-500">Printer Feed Mode:</span>
            <div class="inline-flex rounded-lg border border-neutral-300 p-0.5 bg-neutral-100 text-xs font-medium">
              <button type="button" id="btn-mode-preprinted" class="px-3 py-1.5 rounded-md transition-all ${isPreprinted ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-neutral-600 hover:text-black'}">
                📄 Pre-Printed Form (Text Only)
              </button>
              <button type="button" id="btn-mode-full" class="px-3 py-1.5 rounded-md transition-all ${!isPreprinted ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-neutral-600 hover:text-black'}">
                🖨️ Blank Paper (Full Form)
              </button>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <a href="/write up - fillable.pdf" download="write up - fillable.pdf" class="px-2.5 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md border border-neutral-200 flex items-center gap-1.5 transition-colors" title="Download standard fillable PDF">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Fillable PDF
            </a>
            <a href="/write up - print overlay only.pdf" download="write up - print overlay only.pdf" class="px-2.5 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md border border-blue-200 flex items-center gap-1.5 transition-colors" title="Download PDF with no background for feeding forms into printer">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Pre-Printed PDF
            </a>
          </div>
        </div>

        <!-- 5.5" x 8.5" Statement Card (396 pt x 612 pt ratio) -->
        <div class="writeup-card-container ${isPreprinted ? 'print-preprinted' : 'print-full'}" id="writeup-sheet">
          <div class="writeup-inner-page" style="position: relative; width: 100%; aspect-ratio: 396 / 612; background-color: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.12); border: 1px solid #e5e5e5; overflow: hidden;">
            
            <!-- Template Background Image (Screen & Full Print) -->
            <img 
              src="/write_up_background.jpg" 
              alt="Write-Up Form Background" 
              class="writeup-bg-img"
              style="position: absolute; left: 4.09%; top: 1.96%; width: 97.45%; height: 98.06%; display: block; pointer-events: none; -webkit-user-select: none; user-select: none;"
            />

            <!-- Interactive Inputs Overlay -->
            <div id="writeup-inputs-overlay" style="position: absolute; inset: 0; pointer-events: none;">
              ${this.renderInputsHTML()}
            </div>
          </div>
        </div>
      </div>
    `;

    this.updateScale();
  }

  renderInputsHTML() {
    let html = '';

    this.fields.forEach((field) => {
      const name = field.name;
      const val = this.state[name] !== undefined ? this.state[name] : '';

      // PDF coordinates are from bottom-left; web CSS is from top-left:
      const leftPct = (field.x / this.pageWidth) * 100;
      const topPct = ((this.pageHeight - field.y - field.height) / this.pageHeight) * 100;
      const widthPct = (field.width / this.pageWidth) * 100;
      const heightPct = (field.height / this.pageHeight) * 100;

      const printVars = `
        --print-left: ${field.x}pt;
        --print-top: ${this.pageHeight - field.y - field.height}pt;
        --print-width: ${field.width}pt;
        --print-height: ${field.height}pt;
      `;

      if (field.type === 'checkbox') {
        const isChecked = val === true || val === 'true' ? 'checked' : '';
        html += `
          <input 
            type="checkbox" 
            name="${name}" 
            class="writeup-checkbox" 
            title="${field.label || name}"
            style="position: absolute; left: ${leftPct}%; top: ${topPct}%; width: ${widthPct}%; height: ${heightPct}%; pointer-events: auto; cursor: pointer; ${printVars}" 
            ${isChecked}
          />
        `;
      } else {
        const align = field.alignment || 'left';
        const isBold = field.fontBold ? 'font-bold' : '';
        html += `
          <input 
            type="text" 
            name="${name}" 
            class="writeup-text-input ${isBold}" 
            placeholder=""
            value="${this.escapeHtml(val)}" 
            title="${field.label || name}"
            style="position: absolute; left: ${leftPct}%; top: ${topPct}%; width: ${widthPct}%; height: ${heightPct}%; text-align: ${align}; pointer-events: auto; ${printVars}" 
            autocomplete="off"
          />
        `;
      }
    });

    return html;
  }

  escapeHtml(str) {
    if (typeof str !== 'string') return str || '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  updateScale() {
    const pageEl = this.container.querySelector('.writeup-inner-page');
    if (!pageEl) return;
    const clientWidth = pageEl.clientWidth || this.pageWidth;
    this.scale = clientWidth / this.pageWidth;

    const textInputs = this.container.querySelectorAll('.writeup-text-input');
    textInputs.forEach(input => {
      const field = this.fields.find(f => f.name === input.name);
      if (field) {
        const baseFontSize = field.fontSize || 10;
        input.style.fontSize = `${Math.max(7, baseFontSize * this.scale)}px`;
      }
    });
  }

  setupResizeObserver() {
    const pageEl = this.container.querySelector('.writeup-inner-page');
    if (pageEl && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.updateScale());
      this.resizeObserver.observe(pageEl);
    }
  }

  bindEvents() {
    // Mode toggling
    const btnPreprinted = this.container.querySelector('#btn-mode-preprinted');
    const btnFull = this.container.querySelector('#btn-mode-full');
    const sheet = this.container.querySelector('#writeup-sheet');

    if (btnPreprinted && btnFull) {
      btnPreprinted.addEventListener('click', () => {
        this.state.printMode = 'preprinted';
        this.onStateChange(this.state);
        btnPreprinted.className = 'px-3 py-1.5 rounded-md transition-all bg-white shadow-sm font-bold text-blue-600';
        btnFull.className = 'px-3 py-1.5 rounded-md transition-all text-neutral-600 hover:text-black';
        sheet.classList.remove('print-full');
        sheet.classList.add('print-preprinted');
      });

      btnFull.addEventListener('click', () => {
        this.state.printMode = 'full';
        this.onStateChange(this.state);
        btnFull.className = 'px-3 py-1.5 rounded-md transition-all bg-white shadow-sm font-bold text-blue-600';
        btnPreprinted.className = 'px-3 py-1.5 rounded-md transition-all text-neutral-600 hover:text-black';
        sheet.classList.remove('print-preprinted');
        sheet.classList.add('print-full');
      });
    }

    // Input handlers
    this.container.addEventListener('input', (e) => {
      if (e.target.classList.contains('writeup-text-input')) {
        this.state[e.target.name] = e.target.value;
        this.handleAutoCalc(e.target.name);
        this.onStateChange(this.state);
      }
    });

    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('writeup-checkbox')) {
        this.state[e.target.name] = e.target.checked;
        this.onStateChange(this.state);
      }
    });
  }

  handleAutoCalc(changedFieldName) {
    // If pricing fields change, auto calculate Total and Balance
    const priceFields = ['charge_frame', 'charge_lenses', 'charge_misc', 'charge_disc', 'charge_tax', 'charge_dep'];
    if (priceFields.includes(changedFieldName)) {
      const parseNum = (val) => {
        if (!val) return 0;
        const cleaned = String(val).replace(/[^0-9.-]/g, '');
        return parseFloat(cleaned) || 0;
      };

      const frame = parseNum(this.state.charge_frame);
      const lenses = parseNum(this.state.charge_lenses);
      const misc = parseNum(this.state.charge_misc);
      const disc = parseNum(this.state.charge_disc);
      const tax = parseNum(this.state.charge_tax);
      const dep = parseNum(this.state.charge_dep);

      if (frame || lenses || misc || tax || disc) {
        const total = frame + lenses + misc - disc + tax;
        const bal = total - dep;

        const totalInput = this.container.querySelector('input[name="charge_total"]');
        const balInput = this.container.querySelector('input[name="charge_bal"]');

        if (totalInput && (!this.state.charge_total || totalInput === document.activeElement || priceFields.includes(changedFieldName))) {
          const formattedTotal = `$${total.toFixed(2)}`;
          this.state.charge_total = formattedTotal;
          totalInput.value = formattedTotal;
        }

        if (balInput) {
          const formattedBal = `$${bal.toFixed(2)}`;
          this.state.charge_bal = formattedBal;
          balInput.value = formattedBal;
        }
      }
    }
  }

  reset() {
    this.state = {
      printMode: this.state.printMode || 'preprinted',
      date: new Date().toLocaleDateString('en-US')
    };
    this.onStateChange(this.state);
    this.render();
    this.bindEvents();
    this.setupResizeObserver();
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
