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
    this.sigPadTop = null;
    this.sigPadBottom = null;
    
    this.render();
    this.bindEvents();
    this.initSignatures();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="pd-form-wrapper" id="pd-record-card">
        <form id="pd-record-form">
          <!-- Top Copy of the Record -->
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
              <div class="pd-group col-8" id="pd-sig-top-target">
                <!-- Signature Top -->
              </div>
              <div class="pd-group col-4 pd-sig-meta">
                <p class="pd-sig-label">Authorized Signature</p>
                <p class="pd-sig-title">Licensed Optician / Eyecare Professional</p>
              </div>
            </div>
          </div>
          
          <!-- Cut Line representing separating line -->
          <div class="pd-cut-line">
            <span>✂️ Cut Here / Cortar Aquí</span>
          </div>
          
          <!-- Bottom Copy of the Record (Identical Layout) -->
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
              <div class="pd-group col-8" id="pd-sig-bottom-target">
                <!-- Signature Bottom -->
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
        
        // Synchronize value to all inputs referencing the same field
        const inputs = this.container.querySelectorAll(`input[data-field="${field}"]`);
        inputs.forEach(input => {
          if (input !== e.target) {
            input.value = val;
          }
        });
        
        this.onStateChange(this.state);
      }
    });
  }
  
  initSignatures() {
    const topTarget = this.container.querySelector('#pd-sig-top-target');
    const bottomTarget = this.container.querySelector('#pd-sig-bottom-target');
    
    this.sigPadTop = new SignaturePad(topTarget, 'pd-sig-top', 'Optician Signature');
    this.sigPadBottom = new SignaturePad(bottomTarget, 'pd-sig-bottom', 'Optician Signature');
    
    // Set initial signature if present
    if (this.state.signature) {
      this.sigPadTop.setDataUrl(this.state.signature);
      this.sigPadBottom.setDataUrl(this.state.signature);
    }
    
    // Setup bi-directional drawing synchronization
    const canvasTop = topTarget.querySelector('canvas');
    const canvasBottom = bottomTarget.querySelector('canvas');
    
    let isSyncing = false;
    
    const syncTopToBottom = () => {
      if (isSyncing) return;
      isSyncing = true;
      try {
        const url = this.sigPadTop.getDataUrl();
        this.state.signature = url;
        this.sigPadBottom.setDataUrl(url);
        this.onStateChange(this.state);
      } finally {
        isSyncing = false;
      }
    };
    
    const syncBottomToTop = () => {
      if (isSyncing) return;
      isSyncing = true;
      try {
        const url = this.sigPadBottom.getDataUrl();
        this.state.signature = url;
        this.sigPadTop.setDataUrl(url);
        this.onStateChange(this.state);
      } finally {
        isSyncing = false;
      }
    };
    
    canvasTop.addEventListener('mouseup', syncTopToBottom);
    canvasTop.addEventListener('touchend', syncTopToBottom);
    canvasTop.addEventListener('signature-change', syncTopToBottom);
    
    canvasBottom.addEventListener('mouseup', syncBottomToTop);
    canvasBottom.addEventListener('touchend', syncBottomToTop);
    canvasBottom.addEventListener('signature-change', syncBottomToTop);
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
    if (this.sigPadTop) this.sigPadTop.clear();
    if (this.sigPadBottom) this.sigPadBottom.clear();
  }
}
