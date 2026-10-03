/* Pal Optical Forms Web App - Informed Consent for Single Vision Lenses Waiver */
import { SignaturePad } from '../components/SignaturePad.js';
import { render2UpBlankSheet, renderWaiverBrandHeader } from './waiverPrintBlankHelper.js';

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

  renderBlankHalfSheet() {
    return `
      ${renderWaiverBrandHeader('Informed Consent for Single Vision Lenses', 'Consentimiento Informado para Lentes de Visión Sencilla')}
      
      <div class="wb-demographics-block">
        <div class="wb-demographics-row">
          <div class="wb-field" style="flex: 7;">
            <span class="wb-field-label">Patient Name / Nombre del Paciente:</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 3;">
            <span class="wb-field-label">Date / Fecha:</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
      </div>
      
      <div class="wb-disclosure-box">
        <p>I have elected to purchase Single Vision lenses instead of recommended Bifocal, Trifocal, or Progressive (No-Line) lenses. I am choosing the following specific function:</p>
        <p class="wb-es-text">He elegido comprar lentes de Visión Sencilla (Monofocales) en lugar de los lentes Bifocales, Trifocales o Progresivos recomendados. Elijo la función siguiente:</p>
        
        <div class="wb-checkbox-group">
          <div class="wb-checkbox-item">
            <span class="wb-box-square"></span>
            <div>
              <strong>Distance Only / Solo para Distancia (Lejos):</strong> For seeing far away (driving, TV). Cannot read or see clearly close up while wearing.
              <div style="font-style: italic; color: #4b5563; font-size: 6.5pt;">(Para ver de lejos [conducir, TV]. No podré leer ni ver claramente de cerca mientras los use.)</div>
            </div>
          </div>
          <div class="wb-checkbox-item">
            <span class="wb-box-square"></span>
            <div>
              <strong>Reading/Near Only / Solo para Lectura (Cerca):</strong> For near tasks only (reading, phone, computer). Cannot see at distance / do not drive.
              <div style="font-style: italic; color: #4b5563; font-size: 6.5pt;">(Solo para tareas cercanas [lectura, celular, PC]. No podré ver de lejos y no debo conducir con ellos.)</div>
            </div>
          </div>
        </div>
        
        <p style="margin-top: 5px; border-top: 1px solid #e2e8f0; padding-top: 4px;"><strong>Remake Policy Acknowledgement:</strong> By declining recommended multifocal lenses, I understand that I am waiving my right to a lens restyle at no cost. If I later decide I require bifocals or progressive lenses, I will be responsible for the full cost of new lenses, and no refund or credit will be issued for original single vision lenses.</p>
        <p class="wb-es-text"><strong>Aceptación de la Política de Cambios:</strong> Al rechazar multifocales recomendados, renuncio a cambio de estilo sin costo. Si luego decido que requiero bifocales o progresivos, seré responsable del costo total de los nuevos lentes; no habrá reembolso ni crédito por los monofocales ordenados.</p>
      </div>
      
      <div class="wb-signatures-row">
        <div class="wb-sig-block" style="flex: 3;">
          <div class="wb-sig-line"></div>
          <div class="wb-sig-label">Patient Signature / Firma del Paciente</div>
        </div>
        <div class="wb-sig-block" style="flex: 1;">
          <div class="wb-sig-line"></div>
          <div class="wb-sig-label">Date / Fecha</div>
        </div>
      </div>
    `;
  }
  
  render() {
    this.container.innerHTML = `
      <div class="waiver-interactive-view">
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
      </div>
      ${render2UpBlankSheet(() => this.renderBlankHalfSheet())}
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#single-vision-form');
    if (!form) return;
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
    
    // Ensure checking one option unchecks the other (behave like radios but style like checkboxes)
    const distOpt = form.querySelector('#sv-opt-distance');
    const nearOpt = form.querySelector('#sv-opt-near');
    
    if (distOpt && nearOpt) {
      distOpt.addEventListener('change', () => {
        if (distOpt.checked) nearOpt.checked = false;
        this.updateState();
      });
      nearOpt.addEventListener('change', () => {
        if (nearOpt.checked) distOpt.checked = false;
        this.updateState();
      });
    }
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#sv-sig-target');
    if (!sigTarget) return;
    this.sigPad = new SignaturePad(sigTarget, 'sv-sig', 'Patient Signature / Firma del Paciente');
    
    if (this.state.signature) {
      this.sigPad.setDataUrl(this.state.signature);
    }
    
    const canvas = sigTarget.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mouseup', () => this.saveSignature());
      canvas.addEventListener('touchend', () => this.saveSignature());
      canvas.addEventListener('signature-change', () => this.saveSignature());
    }
  }
  
  saveSignature() {
    if (this.sigPad) {
      this.state.signature = this.sigPad.getDataUrl();
      this.onStateChange(this.state);
    }
  }
  
  updateState() {
    const form = this.container.querySelector('#single-vision-form');
    if (!form) return;
    this.state = {
      ...this.state,
      patientName: form.querySelector('#sv-patient-name')?.value || '',
      date: form.querySelector('#sv-date')?.value || '',
      distanceOnly: form.querySelector('#sv-opt-distance')?.checked || false,
      nearOnly: form.querySelector('#sv-opt-near')?.checked || false
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
