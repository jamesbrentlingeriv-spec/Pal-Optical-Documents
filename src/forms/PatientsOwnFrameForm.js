/* Pal Optical Forms Web App - Notice Regarding Patient's Own Frame Waiver */
import { SignaturePad } from '../components/SignaturePad.js';

export class PatientsOwnFrameForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.state = state;
    this.onStateChange = onStateChange;
    this.sigPadPatient = null;
    this.sigPadProvider = null;
    
    this.render();
    this.bindEvents();
    this.initSignatures();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="form-card" id="patients-own-frame-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Notice Regarding Patient's Own Frame</h2>
          <p style="font-style: italic; color: var(--text-secondary); margin-top: 4px;">
            Aviso Sobre la Montura del Paciente
          </p>
        </div>
        
        <form id="patients-own-frame-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Information / Información
            </div>
            
            <div class="form-grid">
              <div class="form-group col-8">
                <label for="pof-patient-name">Patient Name / Nombre del Paciente</label>
                <input type="text" class="form-control" id="pof-patient-name" placeholder="Full Name" value="${this.state.patientName || ''}">
              </div>
              <div class="form-group col-4">
                <label for="pof-date">Date / Fecha</label>
                <input type="text" class="form-control" id="pof-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Conditions of Service -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Conditions of Service / Condiciones del Servicio
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px;">
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 16px;">
                  <strong style="display: block;">No Warranty:</strong>
                  <span>I acknowledge that my frame is not new and is not covered by a warranty.</span>
                  <div style="font-style: italic; color: var(--text-secondary); margin-top: 2px;">
                    (Sin Garantía: Reconozco que mi montura no es nueva y no está cubierta por garantía.)
                  </div>
                </li>
                <li style="margin-bottom: 16px; border-top: 1px dashed var(--border-color); padding-top: 12px;">
                  <strong style="display: block;">Release of Liability:</strong>
                  <span>I understand that neither the Provider nor PAL Optical is responsible for breakage, damage, or loss during shipping or laboratory processing.</span>
                  <div style="font-style: italic; color: var(--text-secondary); margin-top: 2px;">
                    (Exención de Responsabilidad: Entiendo que ni el Proveedor ni PAL Optical son responsables por roturas, daños o pérdidas durante el envío o el procesamiento en el laboratorio.)
                  </div>
                </li>
                <li style="margin-bottom: 16px; border-top: 1px dashed var(--border-color); padding-top: 12px;">
                  <strong style="display: block;">Financial Responsibility:</strong>
                  <span>In the event of breakage or loss, I agree to pay all replacement costs, shipping fees, and lens expenses.</span>
                  <div style="font-style: italic; color: var(--text-secondary); margin-top: 2px;">
                    (Responsabilidad Financiera: En caso de rotura o pérdida, acepto pagar todos los costos de reemplazo, envío y gastos de lentes.)
                  </div>
                </li>
              </ul>
              
              <p style="font-weight: 600; border-top: 1px solid var(--border-color); padding-top: 16px;">
                By signing below, I acknowledge that I have read and agreed to these terms.<br>
                <span style="font-style: italic; font-weight: 500; color: var(--text-secondary); font-size: 0.85rem;">
                  (Al firmar abajo, reconozco que he leído y aceptado estos términos.)
                </span>
              </p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6" id="pof-patient-sig-target">
                <!-- Patient signature -->
              </div>
              <div class="form-group col-6" id="pof-provider-sig-target">
                <!-- Provider signature -->
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#patients-own-frame-form');
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  initSignatures() {
    const patientTarget = this.container.querySelector('#pof-patient-sig-target');
    const providerTarget = this.container.querySelector('#pof-provider-sig-target');
    
    this.sigPadPatient = new SignaturePad(patientTarget, 'pof-patient', 'Patient Signature / Firma del Paciente');
    this.sigPadProvider = new SignaturePad(providerTarget, 'pof-provider', 'Provider Signature / Firma del Proveedor');
    
    if (this.state.patientSignature) {
      this.sigPadPatient.setDataUrl(this.state.patientSignature);
    }
    if (this.state.providerSignature) {
      this.sigPadProvider.setDataUrl(this.state.providerSignature);
    }
    
    const canv1 = patientTarget.querySelector('canvas');
    const canv2 = providerTarget.querySelector('canvas');
    
    canv1.addEventListener('mouseup', () => this.saveSignatures());
    canv1.addEventListener('touchend', () => this.saveSignatures());
    canv1.addEventListener('signature-change', () => this.saveSignatures());
    
    canv2.addEventListener('mouseup', () => this.saveSignatures());
    canv2.addEventListener('touchend', () => this.saveSignatures());
    canv2.addEventListener('signature-change', () => this.saveSignatures());
  }
  
  saveSignatures() {
    this.state.patientSignature = this.sigPadPatient.getDataUrl();
    this.state.providerSignature = this.sigPadProvider.getDataUrl();
    this.onStateChange(this.state);
  }
  
  updateState() {
    const form = this.container.querySelector('#patients-own-frame-form');
    this.state = {
      ...this.state,
      patientName: form.querySelector('#pof-patient-name').value,
      date: form.querySelector('#pof-date').value
    };
    this.onStateChange(this.state);
  }
  
  reset() {
    this.state = {};
    this.render();
    this.bindEvents();
    this.initSignatures();
    this.onStateChange(this.state);
  }
  
  destroy() {
    if (this.sigPadPatient) this.sigPadPatient.clear();
    if (this.sigPadProvider) this.sigPadProvider.clear();
  }
}
