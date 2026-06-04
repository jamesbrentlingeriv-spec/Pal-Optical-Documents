/* Pal Optical Forms Web App - Informed Consent for Single Vision Lenses Waiver */
import { SignaturePad } from '../components/SignaturePad.js';

export class SingleVisionConsentForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.state = state;
    this.onStateChange = onStateChange;
    this.sigPad = null;
    
    this.render();
    this.bindEvents();
    this.initSignature();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="form-card" id="single-vision-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Informed Consent for Single Vision Lenses</h2>
          <p style="font-style: italic; color: var(--text-secondary); margin-top: 4px;">
            Consentimiento Informado para Lentes de Visión Sencilla
          </p>
        </div>
        
        <form id="single-vision-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Information / Información
            </div>
            
            <div class="form-grid">
              <div class="form-group col-8">
                <label for="sv-patient-name">Patient Name / Nombre del Paciente</label>
                <input type="text" class="form-control" id="sv-patient-name" placeholder="Full Name" value="${this.state.patientName || ''}">
              </div>
              <div class="form-group col-4">
                <label for="sv-date">Date / Fecha</label>
                <input type="text" class="form-control" id="sv-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Selection -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
              Lens Selection / Selección de Lentes
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px;">
              <p style="margin-bottom: 16px; font-weight: 500;">
                I have elected to purchase Single Vision lenses instead of the recommended Bifocal, Trifocal, or Progressive (No-Line) lenses. I am choosing the following specific function:
              </p>
              <p style="margin-bottom: 16px; font-style: italic; color: var(--text-secondary); margin-top: -8px; border-bottom: 1px dashed var(--border-color); padding-bottom: 12px;">
                He elegido comprar lentes de Visión Sencilla (Monofocales) en lugar de los lentes Bifocales, Trifocales o Progresivos (sin línea) que me fueron recomendados. Elijo la siguiente función específica:
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 8px;">
                <label class="checkbox-label" style="align-items: flex-start;">
                  <input type="checkbox" id="sv-opt-distance" ${this.state.distanceOnly ? 'checked' : ''} style="margin-top: 4px;">
                  <div>
                    <strong>Distance Only / Solo para Distancia (Lejos):</strong>
                    <div>I understand that these glasses are for seeing far away (driving, TV, cinema). I will not be able to read or see clearly up close while wearing them.</div>
                    <div style="font-style: italic; color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px;">
                      (Entiendo que estos anteojos son para ver de lejos [conducir, televisión, cine]. No podré leer ni ver claramente de cerca mientras los use.)
                    </div>
                  </div>
                </label>
                
                <label class="checkbox-label" style="align-items: flex-start; border-top: 1px dashed var(--border-color); padding-top: 12px;">
                  <input type="checkbox" id="sv-opt-near" ${this.state.nearOnly ? 'checked' : ''} style="margin-top: 4px;">
                  <div>
                    <strong>Reading/Near Only / Solo para Lectura (Cerca):</strong>
                    <div>I understand that these glasses are for near tasks only (reading, phone, computer). I will not be able to see clearly at a distance and should not drive while wearing them.</div>
                    <div style="font-style: italic; color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px;">
                      (Entiendo que estos anteojos son solo para tareas de visión cercana [leer, teléfono, computadora]. No podré ver claramente a distancia y no debo conducir mientras los use.)
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Section 3: Remake Policy -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Policy Acknowledgment / Aceptación de la Política
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px;">
              <p style="margin-bottom: 12px; font-weight: 500;">
                <strong>Remake Policy Acknowledgement:</strong> By declining the recommended multifocal lenses, I understand that I am waiving my right to a lens restyle at no cost. If I later decide I require bifocals or progressive lenses, I will be responsible for the full cost of the new lenses, and no refund or credit will be issued for the single vision lenses originally ordered.
              </p>
              
              <p style="font-style: italic; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 12px;">
                <strong>Aceptación de la Política de Cambios:</strong> Al rechazar los lentes multifocales recomendados, entiendo que renuncio a mi derecho a un cambio de estilo de lente sin costo. Si más adelante decido que necesito lentes bifocales o progresivos, seré responsable del costo total de los nuevos lentes. No se emitirán reembolsos ni crédito por los lentes de visión sencilla ordenados originalmente.
              </p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-12" id="sv-sig-target">
                <!-- Patient signature -->
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#single-vision-form');
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
    
    // Ensure checking one option unchecks the other (behave like radios but style like checkboxes)
    const distOpt = form.querySelector('#sv-opt-distance');
    const nearOpt = form.querySelector('#sv-opt-near');
    
    distOpt.addEventListener('change', () => {
      if (distOpt.checked) nearOpt.checked = false;
      this.updateState();
    });
    nearOpt.addEventListener('change', () => {
      if (nearOpt.checked) distOpt.checked = false;
      this.updateState();
    });
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#sv-sig-target');
    this.sigPad = new SignaturePad(sigTarget, 'sv-sig', 'Patient Signature / Firma del Paciente');
    
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
  
  updateState() {
    const form = this.container.querySelector('#single-vision-form');
    this.state = {
      ...this.state,
      patientName: form.querySelector('#sv-patient-name').value,
      date: form.querySelector('#sv-date').value,
      distanceOnly: form.querySelector('#sv-opt-distance').checked,
      nearOnly: form.querySelector('#sv-opt-near').checked
    };
    this.onStateChange(this.state);
  }
  
  reset() {
    this.state = {};
    this.render();
    this.bindEvents();
    this.initSignature();
    this.onStateChange(this.state);
  }
  
  destroy() {
    if (this.sigPad) this.sigPad.clear();
  }
}
