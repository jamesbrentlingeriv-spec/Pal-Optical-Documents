/* Pal Optical Forms Web App - Consent to Fill Expired Prescription Waiver */
import { SignaturePad } from '../components/SignaturePad.js';

export class ExpiredRxForm {
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
      <div class="form-card" id="expired-rx-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Consent to Fill Expired Prescription</h2>
          <p style="font-style: italic; color: var(--text-secondary); margin-top: 4px;">
            Consentimiento para Surtir una Receta Vencida
          </p>
        </div>
        
        <form id="expired-rx-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Information / Información
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="rx-patient-name">Patient Name / Nombre del Paciente</label>
                <input type="text" class="form-control" id="rx-patient-name" placeholder="Last, First" value="${this.state.patientName || ''}">
              </div>
              <div class="form-group col-3">
                <label for="rx-patient-dob">Date of Birth / Fecha de Nacimiento</label>
                <input type="text" class="form-control" id="rx-patient-dob" placeholder="MM/DD/YYYY" value="${this.state.patientDob || ''}">
              </div>
              <div class="form-group col-3">
                <label for="rx-date">Date / Fecha</label>
                <input type="text" class="form-control" id="rx-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Waiver Text -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Acknowledgment & Terms / Reconocimiento y Términos
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px;">
              <p style="margin-bottom: 12px; font-weight: 500;">
                At Pal Optical, we prioritize your eye health and visual comfort. We have advised you that your current prescription is over two years old and recommended a new eye exam. You have chosen to decline this advice and proceed with duplicating your old prescription. Please acknowledge the following terms regarding this request:
              </p>
              <p style="margin-bottom: 16px; font-style: italic; color: var(--text-secondary); border-bottom: 1px dashed var(--border-color); padding-bottom: 12px;">
                En Pal Optical, nuestra prioridad es su salud ocular y su comodidad visual. Le hemos informado que su receta actual tiene más de dos años de antigüedad y le hemos recomendado un nuevo examen de la vista. Usted ha decidido declinar esta recomendación y proceder a duplicar su receta anterior. Por favor, acepte los siguientes términos relacionados con esta solicitud:
              </p>
              
              <ul style="margin-left: 20px; margin-bottom: 16px;">
                <li style="margin-bottom: 8px;">
                  <strong>Visual Acuity:</strong> You accept full responsibility for the visual performance of these glasses. Pal Optical cannot guarantee that an old prescription will still provide clear vision.
                  <div style="font-style: italic; color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px;">
                    (Agudeza Visual: Usted acepta total responsabilidad por el resultado visual de estos anteojos. Pal Optical no puede garantizar que una receta antigua le siga proporcionando una visión clara.)
                  </div>
                </li>
                <li style="margin-bottom: 8px;">
                  <strong>Financial Responsibility:</strong> Because these lenses are being custom-made to your specific request against our recommendation, all sales are final. If you later obtain a new prescription, Pal Optical will not provide a refund or a free remake of these lenses.
                  <div style="font-style: italic; color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px;">
                    (Responsabilidad Financiera: Debido a que estos lentes se fabrican a medida según su solicitud específica y en contra de nuestra recomendación, la venta es definitiva. Si posteriormente obtiene una nueva receta, Pal Optical no ofrecerá reembolsos ni volverá a fabricar estos lentes sin costo alguno.)
                  </div>
                </li>
              </ul>
              
              <p style="font-weight: 600; border-top: 1px solid var(--border-color); padding-top: 16px;">
                I have read and understood the terms above. / He leído y comprendido los términos anteriores.
              </p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-12" id="rx-sig-target">
                <!-- Patient signature -->
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#expired-rx-form');
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#rx-sig-target');
    this.sigPad = new SignaturePad(sigTarget, 'expired-rx-sig', 'Patient Signature / Firma del Paciente');
    
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
    const form = this.container.querySelector('#expired-rx-form');
    this.state = {
      ...this.state,
      patientName: form.querySelector('#rx-patient-name').value,
      patientDob: form.querySelector('#rx-patient-dob').value,
      date: form.querySelector('#rx-date').value
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
