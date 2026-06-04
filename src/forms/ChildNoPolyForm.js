/* Pal Optical Forms Web App - Refusal of Polycarbonate Waiver */
import { SignaturePad } from '../components/SignaturePad.js';

export class ChildNoPolyForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.state = state;
    this.onStateChange = onStateChange;
    this.sigPadGuardian = null;
    this.sigPadWitness = null;
    
    this.render();
    this.bindEvents();
    this.initSignatures();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="form-card" id="child-no-poly-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Duty to Warn & Informed Refusal of Polycarbonate Lenses</h2>
          <p style="font-style: italic; color: var(--text-secondary); margin-top: 4px;">
            Deber de Advertencia y Rechazo Informado de Lentes de Policarbonato
          </p>
        </div>
        
        <form id="child-no-poly-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Information / Información
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="poly-patient-name">Patient Name / Nombre del Paciente</label>
                <input type="text" class="form-control" id="poly-patient-name" placeholder="Last, First" value="${this.state.patientName || ''}">
              </div>
              <div class="form-group col-3">
                <label for="poly-patient-dob">Date of Birth / Fecha de Nacimiento</label>
                <input type="text" class="form-control" id="poly-patient-dob" placeholder="MM/DD/YYYY" value="${this.state.patientDob || ''}">
              </div>
              <div class="form-group col-3">
                <label for="poly-date">Date / Fecha</label>
                <input type="text" class="form-control" id="poly-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
              
              <div class="form-group col-12">
                <label for="poly-guardian-name">Parent/Guardian Name / Nombre del Padre/Tutor</label>
                <input type="text" class="form-control" id="poly-guardian-name" placeholder="Full Name" value="${this.state.guardianName || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Disclosure Statement -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Professional Statement & Release / Declaración Profesional y Descargo
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px;">
              <p style="margin-bottom: 12px;">
                <strong>Professional Recommendation:</strong> This office recommends, in accordance with national safety standards, that all patients under the age of 18 be fitted with polycarbonate or Trivex lenses. These materials are impact-resistant and provide the highest level of eye protection. Standard plastic (CR-39) and glass lenses are not impact-resistant and may shatter into sharp shards upon impact, causing serious injury or blindness.
              </p>
              <p style="margin-bottom: 16px; font-style: italic; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 12px;">
                <strong>Recomendación Profesional:</strong> Esta oficina recomienda, de acuerdo con las normas de seguridad nacionales, que todos los pacientes menores de 18 años usen lentes de policarbonato o Trivex. Estos materiales son resistentes a los impactos y brindan el nivel más alto de protección ocular. Los lentes de plástico estándar (CR-39) y de vidrio no son resistentes a los impactos y pueden romperse en fragmentos afilados, causando lesiones oculares graves o ceguera.
              </p>
              
              <p style="margin-bottom: 12px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                <strong>Waiver and Release:</strong> I acknowledge that I have been informed of the recommendation to purchase impact-resistant lenses for the minor named above. Despite this warning, I have chosen to decline these lenses. I assume full responsibility for this decision and hold this practice harmless for any injuries that may occur as a result of using non-impact-resistant lenses.
              </p>
              <p style="font-style: italic; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 12px;">
                <strong>Renuncia y Exención de Responsabilidad:</strong> Reconozco que se me ha informado de la recomendación de comprar lentes resistentes a impactos para el menor mencionado anteriormente. A pesar de esta advertencia, he decidido rechazar estos lentes. Asumo toda la responsabilidad por esta decisión y eximo a esta oficina de responsabilidad por cualquier lesión que pueda ocurrir como resultado del uso de lentes no resistentes a impactos.
              </p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6" id="poly-guardian-sig-target">
                <!-- Guardian signature -->
              </div>
              <div class="form-group col-6" id="poly-witness-sig-target">
                <!-- Witness signature -->
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#child-no-poly-form');
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  initSignatures() {
    const guardianTarget = this.container.querySelector('#poly-guardian-sig-target');
    const witnessTarget = this.container.querySelector('#poly-witness-sig-target');
    
    this.sigPadGuardian = new SignaturePad(guardianTarget, 'poly-guardian', 'Parent/Guardian Signature / Firma del Padre/Tutor');
    this.sigPadWitness = new SignaturePad(witnessTarget, 'poly-witness', 'Witness Signature / Firma del Testigo');
    
    if (this.state.guardianSignature) {
      this.sigPadGuardian.setDataUrl(this.state.guardianSignature);
    }
    if (this.state.witnessSignature) {
      this.sigPadWitness.setDataUrl(this.state.witnessSignature);
    }
    
    const canv1 = guardianTarget.querySelector('canvas');
    const canv2 = witnessTarget.querySelector('canvas');
    
    canv1.addEventListener('mouseup', () => this.saveSignatures());
    canv1.addEventListener('touchend', () => this.saveSignatures());
    canv1.addEventListener('signature-change', () => this.saveSignatures());
    
    canv2.addEventListener('mouseup', () => this.saveSignatures());
    canv2.addEventListener('touchend', () => this.saveSignatures());
    canv2.addEventListener('signature-change', () => this.saveSignatures());
  }
  
  saveSignatures() {
    this.state.guardianSignature = this.sigPadGuardian.getDataUrl();
    this.state.witnessSignature = this.sigPadWitness.getDataUrl();
    this.onStateChange(this.state);
  }
  
  updateState() {
    const form = this.container.querySelector('#child-no-poly-form');
    this.state = {
      ...this.state,
      patientName: form.querySelector('#poly-patient-name').value,
      patientDob: form.querySelector('#poly-patient-dob').value,
      date: form.querySelector('#poly-date').value,
      guardianName: form.querySelector('#poly-guardian-name').value
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
    if (this.sigPadGuardian) this.sigPadGuardian.clear();
    if (this.sigPadWitness) this.sigPadWitness.clear();
  }
}
