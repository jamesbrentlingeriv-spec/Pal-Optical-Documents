/* Pal Optical Forms Web App - Eyewear Price Quote Form */
import { SignaturePad } from '../components/SignaturePad.js';

export class PriceQuoteForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    
    // Set default empty numerical values in state if not present
    this.state = {
      odSphere: '', odCyl: '', odAxis: '', odAdd: '', odPd: '', odHeight: '',
      osSphere: '', osCyl: '', osAxis: '', osAdd: '', osPd: '', osHeight: '',
      framePrice: 0,
      lensPrice: 0,
      coatingsPrice: 0,
      discount: 0,
      ...state
    };
    
    this.onStateChange = onStateChange;
    this.sigPad = null;
    
    this.render();
    this.bindEvents();
    this.initSignature();
    this.calculateTotals();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="form-card" id="price-quote-form-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Eyewear Price Quote</h2>
          <p>Pal Optical • 1555 E New Circle Rd, Lexington, KY 40509 • (859) 266-3003</p>
        </div>
        
        <form id="price-quote-form">
          <!-- Customer & Date Info -->
          <div class="form-grid" style="margin-bottom: 24px;">
            <div class="form-group col-6">
              <label for="q-cust-name">Customer Name</label>
              <input type="text" class="form-control" id="q-cust-name" placeholder="John Doe" value="${this.state.custName || ''}">
            </div>
            <div class="form-group col-6">
              <label for="q-cust-phone">Phone Number</label>
              <input type="tel" class="form-control" id="q-cust-phone" placeholder="(859) 555-0100" value="${this.state.custPhone || ''}">
            </div>
            <div class="form-group col-6">
              <label for="q-date">Quote Date</label>
              <input type="text" class="form-control" id="q-date" placeholder="MM/DD/YYYY" value="${this.state.quoteDate || ''}">
            </div>
            <div class="form-group col-6">
              <label for="q-valid">Valid Until</label>
              <input type="text" class="form-control" id="q-valid" placeholder="MM/DD/YYYY" value="${this.state.validUntil || ''}">
            </div>
          </div>
          
          <!-- Section 1: Prescription Details -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
              1. Prescription Details
            </div>
            
            <table class="prescription-table">
              <thead>
                <tr>
                  <th>Eye</th>
                  <th>Sphere (SPH)</th>
                  <th>Cylinder (CYL)</th>
                  <th>Axis</th>
                  <th>Add</th>
                  <th>PD</th>
                  <th>Height</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="eye-row-header">OD (Right)</td>
                  <td><input type="text" class="form-control" id="q-od-sph" placeholder="Plano" value="${this.state.odSphere}"></td>
                  <td><input type="text" class="form-control" id="q-od-cyl" placeholder="DS" value="${this.state.odCyl}"></td>
                  <td><input type="text" class="form-control" id="q-od-axis" placeholder="-" value="${this.state.odAxis}"></td>
                  <td><input type="text" class="form-control" id="q-od-add" placeholder="-" value="${this.state.odAdd}"></td>
                  <td><input type="text" class="form-control" id="q-od-pd" placeholder="-" value="${this.state.odPd}"></td>
                  <td><input type="text" class="form-control" id="q-od-height" placeholder="-" value="${this.state.odHeight}"></td>
                </tr>
                <tr>
                  <td class="eye-row-header">OS (Left)</td>
                  <td><input type="text" class="form-control" id="q-os-sph" placeholder="Plano" value="${this.state.osSphere}"></td>
                  <td><input type="text" class="form-control" id="q-os-cyl" placeholder="DS" value="${this.state.osCyl}"></td>
                  <td><input type="text" class="form-control" id="q-os-axis" placeholder="-" value="${this.state.osAxis}"></td>
                  <td><input type="text" class="form-control" id="q-os-add" placeholder="-" value="${this.state.osAdd}"></td>
                  <td><input type="text" class="form-control" id="q-os-pd" placeholder="-" value="${this.state.osPd}"></td>
                  <td><input type="text" class="form-control" id="q-os-height" placeholder="-" value="${this.state.osHeight}"></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Section 2: Frame Selection -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 12H16c-.5 0-.9-.2-1.2-.5l-1.4-1.4c-.3-.3-.8-.5-1.2-.5H6c-.5 0-.9.2-1.2.5l-1.4 1.4c-.3.3-.8.5-1.2.5H1.5"/><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/></svg>
              2. Frame Selection
            </div>
            
            <div class="form-grid">
              <div class="form-group col-4">
                <label for="q-frame-brand">Brand / Collection</label>
                <input type="text" class="form-control" id="q-frame-brand" placeholder="Oakley / Ray-Ban" value="${this.state.frameBrand || ''}">
              </div>
              <div class="form-group col-3">
                <label for="q-frame-model">Model Number</label>
                <input type="text" class="form-control" id="q-frame-model" placeholder="OX8080" value="${this.state.frameModel || ''}">
              </div>
              <div class="form-group col-2">
                <label for="q-frame-color">Color</label>
                <input type="text" class="form-control" id="q-frame-color" placeholder="Satin Black" value="${this.state.frameColor || ''}">
              </div>
              <div class="form-group col-1.5">
                <label for="q-frame-size">Size</label>
                <input type="text" class="form-control" id="q-frame-size" placeholder="54-18" value="${this.state.frameSize || ''}">
              </div>
              <div class="form-group col-1.5">
                <label for="q-frame-price">Price ($)</label>
                <input type="number" step="0.01" min="0" class="form-control price-input" id="q-frame-price" value="${this.state.framePrice}">
              </div>
            </div>
          </div>
          
          <!-- Section 3: Lens & Enhancements -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              3. Lens Options & Enhancements
            </div>
            
            <div class="form-grid">
              <div class="form-group col-4">
                <label>Lens Type</label>
                <div class="checkbox-grid" style="grid-template-columns: 1fr;">
                  <label class="radio-label">
                    <input type="radio" name="q-lens-type" value="Single Vision" ${this.state.lensType === 'Single Vision' ? 'checked' : ''}> Single Vision
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="q-lens-type" value="Bifocal" ${this.state.lensType === 'Bifocal' ? 'checked' : ''}> Bifocal
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="q-lens-type" value="Progressive (No-Line)" ${this.state.lensType === 'Progressive (No-Line)' ? 'checked' : ''}> Progressive (No-Line)
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="q-lens-type" value="Office/Computer" ${this.state.lensType === 'Office/Computer' ? 'checked' : ''}> Office / Computer
                  </label>
                </div>
              </div>
              
              <div class="form-group col-4">
                <label>Material</label>
                <div class="checkbox-grid" style="grid-template-columns: 1fr;">
                  <label class="radio-label">
                    <input type="radio" name="q-lens-mat" value="Plastic (CR-39)" ${this.state.lensMaterial === 'Plastic (CR-39)' ? 'checked' : ''}> Plastic (CR-39)
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="q-lens-mat" value="Polycarbonate" ${this.state.lensMaterial === 'Polycarbonate' ? 'checked' : ''}> Polycarbonate
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="q-lens-mat" value="Trivex" ${this.state.lensMaterial === 'Trivex' ? 'checked' : ''}> Trivex
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="q-lens-mat" value="Hi-Index 1.67/1.74" ${this.state.lensMaterial === 'Hi-Index 1.67/1.74' ? 'checked' : ''}> Hi-Index 1.67/1.74
                  </label>
                </div>
              </div>
              
              <div class="form-group col-4">
                <label>Enhancements & Coatings</label>
                <div class="checkbox-grid" style="grid-template-columns: 1fr;">
                  <label class="checkbox-label">
                    <input type="checkbox" id="q-enh-ar" ${this.state.enhAr ? 'checked' : ''}> Anti-Reflective (Glare Free)
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" id="q-enh-photo" ${this.state.enhPhoto ? 'checked' : ''}> Photochromic (Transitions)
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" id="q-enh-blue" ${this.state.enhBlue ? 'checked' : ''}> Blue Light Filter
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" id="q-enh-polish" ${this.state.enhPolish ? 'checked' : ''}> Polish / UV Protection
                  </label>
                </div>
              </div>
              
              <div class="form-group col-6">
                <label for="q-lens-price">Lens Price ($)</label>
                <input type="number" step="0.01" min="0" class="form-control price-input" id="q-lens-price" value="${this.state.lensPrice}">
              </div>
              <div class="form-group col-6">
                <label for="q-coatings-price">Coatings & Options Price ($)</label>
                <input type="number" step="0.01" min="0" class="form-control price-input" id="q-coatings-price" value="${this.state.coatingsPrice}">
              </div>
            </div>
          </div>
          
          <!-- Section 4: Pricing Summary Sheet -->
          <div class="form-section" style="page-break-inside: avoid;">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              4. Eyewear Pricing Sheet
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <div class="total-summary-card">
                  <div class="total-summary-row">
                    <span>Frame Cost</span>
                    <span id="summary-frame">$0.00</span>
                  </div>
                  <div class="total-summary-row">
                    <span>Lens Cost</span>
                    <span id="summary-lenses">$0.00</span>
                  </div>
                  <div class="total-summary-row">
                    <span>Enhancements & Coatings</span>
                    <span id="summary-coatings">$0.00</span>
                  </div>
                  <div class="total-summary-row">
                    <span>Subtotal</span>
                    <span id="summary-subtotal">$0.00</span>
                  </div>
                  <div class="total-summary-row" style="color: var(--danger);">
                    <span>Insurance Coverage / Discounts</span>
                    <span id="summary-discount">$0.00</span>
                  </div>
                  <div class="total-summary-row">
                    <span>Estimated Patient Total</span>
                    <span id="summary-total" style="color: var(--primary);">$0.00</span>
                  </div>
                </div>
              </div>
              
              <div class="form-group col-6">
                <label for="q-discount">Insurance Co-Pay / Discount ($)</label>
                <input type="number" step="0.01" min="0" class="form-control price-input" id="q-discount" value="${this.state.discount}">
                
                <div style="margin-top: 20px;" id="q-sig-target">
                  <!-- Patient signature for approval -->
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#price-quote-form');
    
    form.addEventListener('input', (e) => {
      this.updateState();
      if (e.target.classList.contains('price-input')) {
        this.calculateTotals();
      }
    });
    
    form.addEventListener('change', () => {
      this.updateState();
      this.calculateTotals();
    });
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#q-sig-target');
    this.sigPad = new SignaturePad(sigTarget, 'price-quote', 'Acceptance Signature (Finger/Mouse)');
    
    if (this.state.signature) {
      this.sigPad.setDataUrl(this.state.signature);
    }
    
    const canvas = sigTarget.querySelector('canvas');
    canvas.addEventListener('mouseup', () => this.saveSignature());
    canvas.addEventListener('touchend', () => this.saveSignature());
    canvas.addEventListener('signature-change', () => this.saveSignature());
  }
  
  saveSignature() {
    this.state.signature = this.sigPad.getDataUrl();
    this.onStateChange(this.state);
  }
  
  calculateTotals() {
    const frame = parseFloat(this.state.framePrice) || 0;
    const lenses = parseFloat(this.state.lensPrice) || 0;
    const coatings = parseFloat(this.state.coatingsPrice) || 0;
    const discount = parseFloat(this.state.discount) || 0;
    
    const subtotal = frame + lenses + coatings;
    const total = Math.max(0, subtotal - discount);
    
    // Update labels in summary card
    this.container.querySelector('#summary-frame').textContent = `$${frame.toFixed(2)}`;
    this.container.querySelector('#summary-lenses').textContent = `$${lenses.toFixed(2)}`;
    this.container.querySelector('#summary-coatings').textContent = `$${coatings.toFixed(2)}`;
    this.container.querySelector('#summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    this.container.querySelector('#summary-discount').textContent = `-$${discount.toFixed(2)}`;
    this.container.querySelector('#summary-total').textContent = `$${total.toFixed(2)}`;
  }
  
  updateState() {
    const form = this.container.querySelector('#price-quote-form');
    
    const lensTypeRadio = form.querySelector('input[name="q-lens-type"]:checked');
    const lensMatRadio = form.querySelector('input[name="q-lens-mat"]:checked');
    
    this.state = {
      ...this.state,
      custName: form.querySelector('#q-cust-name').value,
      custPhone: form.querySelector('#q-cust-phone').value,
      quoteDate: form.querySelector('#q-date').value,
      validUntil: form.querySelector('#q-valid').value,
      
      odSphere: form.querySelector('#q-od-sph').value,
      odCyl: form.querySelector('#q-od-cyl').value,
      odAxis: form.querySelector('#q-od-axis').value,
      odAdd: form.querySelector('#q-od-add').value,
      odPd: form.querySelector('#q-od-pd').value,
      odHeight: form.querySelector('#q-od-height').value,
      
      osSphere: form.querySelector('#q-os-sph').value,
      osCyl: form.querySelector('#q-os-cyl').value,
      osAxis: form.querySelector('#q-os-axis').value,
      osAdd: form.querySelector('#q-os-add').value,
      osPd: form.querySelector('#q-os-pd').value,
      osHeight: form.querySelector('#q-os-height').value,
      
      frameBrand: form.querySelector('#q-frame-brand').value,
      frameModel: form.querySelector('#q-frame-model').value,
      frameColor: form.querySelector('#q-frame-color').value,
      frameSize: form.querySelector('#q-frame-size').value,
      framePrice: parseFloat(form.querySelector('#q-frame-price').value) || 0,
      
      lensType: lensTypeRadio ? lensTypeRadio.value : '',
      lensMaterial: lensMatRadio ? lensMatRadio.value : '',
      
      enhAr: form.querySelector('#q-enh-ar').checked,
      enhPhoto: form.querySelector('#q-enh-photo').checked,
      enhBlue: form.querySelector('#q-enh-blue').checked,
      enhPolish: form.querySelector('#q-enh-polish').checked,
      
      lensPrice: parseFloat(form.querySelector('#q-lens-price').value) || 0,
      coatingsPrice: parseFloat(form.querySelector('#q-coatings-price').value) || 0,
      discount: parseFloat(form.querySelector('#q-discount').value) || 0
    };
    
    this.onStateChange(this.state);
  }
  
  reset() {
    this.state = {
      odSphere: '', odCyl: '', odAxis: '', odAdd: '', odPd: '', odHeight: '',
      osSphere: '', osCyl: '', osAxis: '', osAdd: '', osPd: '', osHeight: '',
      framePrice: 0,
      lensPrice: 0,
      coatingsPrice: 0,
      discount: 0
    };
    this.render();
    this.bindEvents();
    this.initSignature();
    this.calculateTotals();
    this.onStateChange(this.state);
  }
}
