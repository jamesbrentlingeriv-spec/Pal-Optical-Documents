/* Pal Optical Forms Web App - Notice Regarding Patient's Own Frame Waiver */
import { SignaturePad } from '../components/SignaturePad.js';
import { render2UpBlankSheet, renderWaiverBrandHeader } from './waiverPrintBlankHelper.js';

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

  renderBlankHalfSheet() {
    return `
      ${renderWaiverBrandHeader("Patient's Own Frame", 'Aviso Sobre la Montura del Paciente')}
      
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
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 4px;">
            <strong>No Warranty:</strong> I acknowledge that my frame is not new and is not covered by a warranty.
            <div style="font-style: italic; color: #4b5563; font-size: 6.5pt;">(Sin Garantía: Reconozco que mi montura no es nueva y no está cubierta por garantía.)</div>
          </li>
          <li style="margin-bottom: 4px; border-top: 1px dashed #cbd5e1; padding-top: 3px;">
            <strong>Release of Liability:</strong> I understand that neither the Provider nor PAL Optical is responsible for breakage, damage, or loss during shipping or laboratory processing.
            <div style="font-style: italic; color: #4b5563; font-size: 6.5pt;">(Exención de Responsabilidad: Entiendo que ni el Proveedor ni PAL Optical son responsables por roturas, daños o pérdidas durante el envío o procesamiento en el laboratorio.)</div>
          </li>
          <li style="margin-bottom: 4px; border-top: 1px dashed #cbd5e1; padding-top: 3px;">
            <strong>Financial Responsibility:</strong> In the event of breakage or loss, I agree to pay all replacement costs, shipping fees, and lens expenses.
            <div style="font-style: italic; color: #4b5563; font-size: 6.5pt;">(Responsabilidad Financiera: En caso de rotura o pérdida, acepto pagar todos los costos de reemplazo, envío y gastos de lentes.)</div>
          </li>
        </ul>
        
        <p style="font-weight: 700; border-top: 1px solid #e2e8f0; padding-top: 3px; margin-top: 3px;">
          By signing below, I acknowledge that I have read and agreed to these terms. / Al firmar abajo, reconozco que he leído y aceptado estos términos.
        </p>
      </div>
      
      <div class="wb-signatures-row">
        <div class="wb-sig-block">
          <div class="wb-sig-flex">
            <div class="wb-sig-item" style="flex: 3;">
              <div class="wb-sig-line"></div>
              <div class="wb-sig-label">Patient Signature / Firma del Paciente</div>
            </div>
            <div class="wb-sig-item" style="flex: 1;">
              <div class="wb-sig-line"></div>
              <div class="wb-sig-label">Date / Fecha</div>
            </div>
          </div>
        </div>
        <div class="wb-sig-block">
          <div class="wb-sig-flex">
            <div class="wb-sig-item" style="flex: 3;">
              <div class="wb-sig-line"></div>
              <div class="wb-sig-label">Provider Signature / Firma del Proveedor</div>
            </div>
            <div class="wb-sig-item" style="flex: 1;">
              <div class="wb-sig-line"></div>
              <div class="wb-sig-label">Date / Fecha</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  render() {
    this.container.innerHTML = `
      <div class="waiver-interactive-view">
        <div class="form-card" id="patients-own-frame-card">
          <!-- Form Header -->
          <div class="form-header-block">
            <h2>Patient's Own Frame</h2>
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
      </div>
      ${render2UpBlankSheet(() => this.renderBlankHalfSheet())}
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#patients-own-frame-form');
    if (!form) return;
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  initSignatures() {
    const patientTarget = this.container.querySelector('#pof-patient-sig-target');
    const providerTarget = this.container.querySelector('#pof-provider-sig-target');
    if (!patientTarget || !providerTarget) return;
    
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
    
    if (canv1) {
      canv1.addEventListener('mouseup', () => this.saveSignatures());
      canv1.addEventListener('touchend', () => this.saveSignatures());
      canv1.addEventListener('signature-change', () => this.saveSignatures());
    }
    
    if (canv2) {
      canv2.addEventListener('mouseup', () => this.saveSignatures());
      canv2.addEventListener('touchend', () => this.saveSignatures());
      canv2.addEventListener('signature-change', () => this.saveSignatures());
    }
  }
  
  saveSignatures() {
    if (this.sigPadPatient) this.state.patientSignature = this.sigPadPatient.getDataUrl();
    if (this.sigPadProvider) this.state.providerSignature = this.sigPadProvider.getDataUrl();
    this.onStateChange(this.state);
  }
  
  updateState() {
    const form = this.container.querySelector('#patients-own-frame-form');
    if (!form) return;
    this.state = {
      ...this.state,
      patientName: form.querySelector('#pof-patient-name')?.value || '',
      date: form.querySelector('#pof-date')?.value || ''
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
