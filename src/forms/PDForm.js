/* Pal Optical Forms Web App - Pupillary Distance (PD) Record Interactive Sheet */
import { SignaturePad } from '../components/SignaturePad.js';

export class PDForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    
    // Set default date to today and signature to default optician signature
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      date: today,
      signature: '/default_signature.png',
      ...state
    };
    
    this.onStateChange = onStateChange;
    this.sigPad = null;
    
    this.render();
    this.bindEvents();
    this.initSignatures();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="pd-form-wrapper" id="pd-record-card">
        <form id="pd-record-form">
          <div class="pd-slip">
            <div class="pd-header-block">
              <h2>Pupillary Distance (PD) Record</h2>
              <p class="store-info">PAL OPTICAL | 1555 E. New Circle Rd | Lexington, KY 40505</p>
              <p class="store-phone">Phone: (859) 253-3031</p>
            </div>
            
            <div class="pd-section">
              <div class="pd-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Patient Details
              </div>
              
              <div class="pd-grid">
                <div class="pd-group col-8">
                  <label>Name</label>
                  <input type="text" class="pd-control" data-field="patientName" placeholder="Patient Name" value="${this.state.patientName || ''}">
                </div>
                <div class="pd-group col-4">
                  <label>Date</label>
                  <input type="text" class="pd-control" data-field="date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
                </div>
              </div>
            </div>
            
            <div class="pd-section">
              <div class="pd-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                PD Measurements (mm)
              </div>
              
              <div class="pd-grid">
                <div class="pd-group col-12">
                  <label>Binocular (Total)</label>
                  <div class="pd-input-with-unit">
                    <input type="text" class="pd-control" data-field="binocularPd" placeholder="e.g. 64" value="${this.state.binocularPd || ''}">
                    <span class="pd-unit">mm</span>
                  </div>
                </div>
              </div>
              
              <div class="pd-divider"><span>or / o</span></div>
              
              <div class="pd-grid">
                <div class="pd-group col-6">
                  <label>Monocular (Split) - Right Eye (OD)</label>
                  <div class="pd-input-with-unit">
                    <input type="text" class="pd-control" data-field="odPd" placeholder="e.g. 32" value="${this.state.odPd || ''}">
                    <span class="pd-unit">mm</span>
                  </div>
                </div>
                <div class="pd-group col-6">
                  <label>Monocular (Split) - Left Eye (OS)</label>
                  <div class="pd-input-with-unit">
                    <input type="text" class="pd-control" data-field="osPd" placeholder="e.g. 32" value="${this.state.osPd || ''}">
                    <span class="pd-unit">mm</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pd-grid pd-signature-row">
              <div class="pd-group col-8" id="pd-sig-target">
                <!-- Signature -->
              </div>
              <div class="pd-group col-4 pd-sig-meta">
                <p class="pd-sig-label">Authorized Signature</p>
                <p class="pd-sig-title">Licensed Optician / Eyecare Professional</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    this.container.addEventListener('input', (e) => {
      const field = e.target.getAttribute('data-field');
      if (field) {
        const val = e.target.value;
        this.state[field] = val;
        this.onStateChange(this.state);
      }
    });
  }
  
  initSignatures() {
    const sigTarget = this.container.querySelector('#pd-sig-target');
    
    this.sigPad = new SignaturePad(sigTarget, 'pd-sig', 'Optician Signature');
    
    // Set initial signature if present
    if (this.state.signature) {
      this.sigPad.setDataUrl(this.state.signature);
    }
    
    const canvas = sigTarget.querySelector('canvas');
    
    const handleSigChange = () => {
      const url = this.sigPad.getDataUrl();
      this.state.signature = url;
      this.onStateChange(this.state);
    };
    
    canvas.addEventListener('mouseup', handleSigChange);
    canvas.addEventListener('touchend', handleSigChange);
    canvas.addEventListener('signature-change', handleSigChange);
  }
  
  reset() {
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      date: today,
      signature: '/default_signature.png'
    };
    this.render();
    this.bindEvents();
    this.initSignatures();
    this.onStateChange(this.state);
  }
  
  destroy() {
    if (this.sigPad) this.sigPad.clear();
  }
}
