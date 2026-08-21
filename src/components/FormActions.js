/* Pal Optical Forms Web App - Form Actions Toolbar Component */

export class FormActions {
  constructor(container, formTitle, onToggleMode, onReset, onPrint) {
    this.container = container;
    this.formTitle = formTitle;
    this.onToggleMode = onToggleMode; // Callback for print vs fill mode
    this.onReset = onReset;
    this.onPrint = onPrint;
    
    this.mode = 'fill'; // 'fill' or 'print-blank'
    
    this.render();
    this.bindEvents();
  }
  
  updateTitle(newTitle) {
    this.formTitle = newTitle;
    const titleEl = this.container.querySelector('h1');
    if (titleEl) titleEl.textContent = newTitle;
  }

  updateDescription(newDesc) {
    const descEl = this.container.querySelector('p');
    if (descEl) descEl.textContent = newDesc;
  }

  setControlsVisibility(showModeToggle, showActionBtns) {
    const toggleGroup = this.container.querySelector('.toggle-group');
    const resetBtn = this.container.querySelector('#btn-reset');
    const printBtn = this.container.querySelector('#btn-print');
    
    if (toggleGroup) toggleGroup.style.display = showModeToggle ? '' : 'none';
    if (resetBtn) resetBtn.style.display = showActionBtns ? '' : 'none';
    if (printBtn) printBtn.style.display = showActionBtns ? '' : 'none';
  }
  
  render() {
    this.container.innerHTML = `
      <!-- Hamburger button (mobile only) -->
      <button type="button" class="mobile-menu-btn" id="mobile-hamburger" aria-label="Open menu" title="Open navigation menu">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div class="header-title-container">
        <h1>${this.formTitle}</h1>
        <p>Choose fill option or print directly</p>
      </div>
      
      <div class="actions-toolbar">
        <!-- Mode Switcher -->
        <div class="toggle-group" id="header-mode-toggle">
          <div class="toggle-option ${this.mode === 'fill' ? 'active' : ''}" id="mode-fill" title="Fill Digitally">
            <span class="toggle-text-full">Fill Digitally</span>
            <span class="toggle-text-short">Fill</span>
          </div>
          <div class="toggle-option ${this.mode === 'print-blank' ? 'active' : ''}" id="mode-blank" title="Print Blank Form">
            <span class="toggle-text-full">Print Blank</span>
            <span class="toggle-text-short">Blank</span>
          </div>
        </div>
        
        <!-- Reset Button -->
        <button type="button" class="btn btn-secondary" id="btn-reset" title="Reset all fields to blank">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M16 3h5v5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 21H3v-5"/>
          </svg>
          <span class="btn-text">Reset</span>
        </button>
        
        <!-- Print Button (Always prioritized) -->
        <button type="button" class="btn btn-primary" id="btn-print" title="Print Form">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          <span class="btn-text">Print</span>
        </button>
      </div>

      <!-- Mobile Floating Action Print Button (FAB) -->
      <button type="button" class="mobile-print-fab" id="fab-print" title="Print Form" aria-label="Print Form">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
        <span>Print Form</span>
      </button>
    `;
  }

  bindEvents() {
    const fillOpt = this.container.querySelector('#mode-fill');
    const blankOpt = this.container.querySelector('#mode-blank');
    const resetBtn = this.container.querySelector('#btn-reset');
    const printBtn = this.container.querySelector('#btn-print');
    const fabPrintBtn = this.container.querySelector('#fab-print');
    const hamburger = this.container.querySelector('#mobile-hamburger');
    
    // Hamburger: open sidebar drawer on mobile
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar-target');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('active');
      });
    }
    
    fillOpt.addEventListener('click', () => {
      if (this.mode === 'fill') return;
      this.mode = 'fill';
      fillOpt.classList.add('active');
      blankOpt.classList.remove('active');
      this.onToggleMode('fill');
    });
    
    blankOpt.addEventListener('click', () => {
      if (this.mode === 'print-blank') return;
      this.mode = 'print-blank';
      blankOpt.classList.add('active');
      fillOpt.classList.remove('active');
      this.onToggleMode('print-blank');
    });
    
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all inputs on this form?')) {
        this.onReset();
      }
    });
    
    printBtn.addEventListener('click', () => {
      this.onPrint();
    });

    if (fabPrintBtn) {
      fabPrintBtn.addEventListener('click', () => {
        this.onPrint();
      });
    }
  }
}
