/* Pal Optical Forms Web App - Eagle Safety Eyewear Order Form Interactive Sheet */
import { SignaturePad } from '../components/SignaturePad.js';

export class SafetyOrderForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.state = state;
    this.onStateChange = onStateChange;
    this.fields = [];
    this.pageWidth = 612;
    this.pageHeight = 792;
    this.scale = 1.0;
    this.resizeObserver = null;
    
    this.init();
  }
  
  async init() {
    this.container.innerHTML = `
      <div class="safety-loading" style="padding: 40px; font-weight: bold; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
        <svg style="width: 28px; height: 28px; margin: 0 auto 12px; display: block; stroke: var(--primary); animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading interactive Safety Order Form...
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    
    try {
      // 1. Fetch the fields mapping
      const res = await fetch('/src/forms/safety_fields.json');
      const data = await res.json();
      this.fields = data.fields;
      this.pageWidth = data.pageWidth;
      this.pageHeight = data.pageHeight;
      
      // 2. Load and render PDF page 1 using PDF.js
      const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
      if (!pdfjsLib) {
        throw new Error('PDF.js library is not loaded.');
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      
      const loadingTask = pdfjsLib.getDocument('/safety_order_form.pdf');
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      // Clear loading screen
      this.container.innerHTML = '';
      
      // Create main form viewport structure
      const mainWrapper = document.createElement('div');
      mainWrapper.className = 'safety-interactive-container print:shadow-none print:my-0 print:border-none';
      mainWrapper.style.cssText = 'position: relative; width: 100%; max-width: 100%; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #d4d4d4; background-color: #fff; box-sizing: border-box;';
      
      const canvas = document.createElement('canvas');
      canvas.id = 'safety-canvas';
      canvas.style.cssText = 'display: block; width: 100%; height: auto;';
      mainWrapper.appendChild(canvas);
      
      const overlay = document.createElement('div');
      overlay.id = 'safety-inputs-overlay';
      overlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;';
      mainWrapper.appendChild(overlay);
      
      this.container.appendChild(mainWrapper);
      
      // Render PDF page to canvas
      const viewport = page.getViewport({ scale: 2.0 });
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      
      // Render inputs overlay
      this.renderInputs();
      this.bindEvents();
      
      // Setup ResizeObserver to dynamically update overlays on resize/render
      this.resizeObserver = new ResizeObserver(() => this.updateScale());
      this.resizeObserver.observe(canvas);
      
    } catch (err) {
      console.error('Error loading interactive safety form:', err);
      this.container.innerHTML = `
        <div style="padding: 20px; color: var(--danger); font-weight: bold; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
          Failed to load interactive Safety Eyewear form. Please check that /safety_order_form.pdf and /src/forms/safety_fields.json are present.
        </div>
      `;
    }
  }
  
  renderInputs() {
    const overlay = this.container.querySelector('#safety-inputs-overlay');
    if (!overlay) return;
    
    const canvas = this.container.querySelector('#safety-canvas');
    if (!canvas) return;
    
    // Scale is clientWidth / original width, falling back to parent container or base page size
    const clientWidth = canvas.clientWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : 0) || this.pageWidth;
    this.scale = clientWidth / this.pageWidth;
    
    let html = '';
    this.fields.forEach(field => {
      if (field.type === 'PDFButton') return;
      
      const name = field.name;
      const val = this.state[name] || '';
      
      // Calculate scaled positions
      const left = field.x * this.scale;
      const top = field.y * this.scale;
      const width = field.width * this.scale;
      const height = field.height * this.scale;
      const fontSize = 16 * this.scale;
      
      // Setup custom print coordinate variables for exact millimeter positioning on printed Letter paper
      const pLeft = (field.x / 72).toFixed(4);
      const pTop = (field.y / 72).toFixed(4);
      const pWidth = (field.width / 72).toFixed(4);
      const pHeight = (field.height / 72).toFixed(4);
      const pFontSize = "16pt";
      
      const printVariables = `--print-left: ${pLeft}in; --print-top: ${pTop}in; --print-width: ${pWidth}in; --print-height: ${pHeight}in; --print-font-size: ${pFontSize};`;
      
      if (field.type === 'PDFCheckBox') {
        const isChecked = val === true ? 'checked' : '';
        html += `
          <input 
            type="checkbox" 
            name="${name}" 
            class="safety-checkbox" 
            style="position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px; pointer-events: auto; ${printVariables}" 
            ${isChecked}
          />
        `;
      } else {
        html += `
          <input 
            type="text" 
            name="${name}" 
            class="safety-text-input" 
            value="${val}" 
            style="position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px; font-size: ${fontSize}px; pointer-events: auto; ${printVariables}" 
            autocomplete="off"
          />
        `;
      }
    });
    
    overlay.innerHTML = html;
  }
  
  updateScale() {
    const canvas = this.container.querySelector('#safety-canvas');
    if (!canvas) return;
    
    const clientWidth = canvas.clientWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : 0) || this.pageWidth;
    this.scale = clientWidth / this.pageWidth;
    
    // Reposition all overlays
    const inputs = this.container.querySelectorAll('.safety-checkbox, .safety-text-input');
    inputs.forEach(input => {
      const name = input.name;
      const field = this.fields.find(f => f.name === name);
      if (field) {
        input.style.left = `${field.x * this.scale}px`;
        input.style.top = `${field.y * this.scale}px`;
        input.style.width = `${field.width * this.scale}px`;
        input.style.height = `${field.height * this.scale}px`;
        
        if (input.classList.contains('safety-text-input')) {
          input.style.fontSize = `${16 * this.scale}px`;
        }
      }
    });
  }
  
  bindEvents() {
    this.container.addEventListener('input', (e) => {
      if (e.target.classList.contains('safety-text-input')) {
        this.state[e.target.name] = e.target.value;
        this.onStateChange(this.state);
      }
    });
    
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('safety-checkbox')) {
        this.state[e.target.name] = e.target.checked;
        this.onStateChange(this.state);
      }
    });
  }
  
  // Stubs for app.js signature pad APIs
  initSignature() {}
  saveSignature() {}
  
  reset() {
    this.state = {};
    this.onStateChange(this.state);
    this.renderInputs();
  }
  
  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
