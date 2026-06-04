/* Pal Optical Forms Web App - Semi-Rimless Plastic Waiver */
import { SignaturePad } from '../components/SignaturePad.js';

export class SemiRimlessWaiverForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.state = state;
    this.onStateChange = onStateChange;
    this.sigPadPatient = null;
    this.sigPadOptician = null;
    
    this.render();
    this.bindEvents();
    this.initSignatures();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="form-card" id="semi-rimless-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Semi-Rimless in Plastic Waiver</h2>
          <p style="font-style: italic; color: var(--text-secondary); margin-top: 4px;">
            Monturas al Aire de Plástico Renuncia
          </p>
        </div>
        
        <form id="semi-rimless-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Information / Información
            </div>
            
            <div class="form-grid">
              <div class="form-group col-8">
                <label for="sr-patient-name">Patient Name / Nombre del Paciente</label>
                <input type="text" class="form-control" id="sr-patient-name" placeholder="Full Name" value="${this.state.patientName || ''}">
              </div>
              <div class="form-group col-4">
                <label for="sr-date">Date / Fecha</label>
                <input type="text" class="form-control" id="sr-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Disclosure Text -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Acknowledgment & Waiver / Reconocimiento y Renuncia
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px;">
              <p style="margin-bottom: 12px; font-weight: 500;">
                I HAVE BEEN CAUTIONED THAT MY TYPE OF FRAME SHOULD HAVE POLYCARBONATE LENSES DUE TO IT BEING SEMI-RIMLESS. AS I AM FORGOING POLYCARBONATE FOR PLASTIC LENSES I WILL NOT HOLD PAL OPTICAL RESPONSIBLE FOR ANY CHIPPING OR BREAKING THE LENS MIGHT DUE IF DROPPED OR OTHERWISE DAMAGED BY MYSELF. I AM ALSO FORGOING ANY REMAKES OR FRAME RESTYLES UNLESS OTHERWISE DICTATED BY MY INSURANCE.
              </p>
              
              <p style="font-style: italic; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 12px;">
                ME HAN ADVERTIDO QUE MI TIPO DE MONTURA DEBE TENER LENTES DE POLICARBONATO DEBIDO A QUE ES MONTURAS AL AIRE. NO RESPONSABILIZARÉ A PAL OPTICAL POR CUALQUIER DESGASTADO O ROTURA DE LAS LENTES QUE PUEDAN DEBERSE SI SE CAEN O DAÑAN DE ALGUNA MANERA. ADEMÁS, RENUNCIO A CUALQUIER REHABILITACIÓN O REDISEÑO DE LA MONTURA, A MENOS QUE MI SEGURO INDIQUE LO CONTRARIO.
              </p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6" id="sr-patient-sig-target">
                <!-- Patient signature -->
              </div>
              <div class="form-group col-6" id="sr-optician-sig-target">
                <!-- Optician signature -->
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#semi-rimless-form');
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  initSignatures() {
    const patientTarget = this.container.querySelector('#sr-patient-sig-target');
    const opticianTarget = this.container.querySelector('#sr-optician-sig-target');
    
    this.sigPadPatient = new SignaturePad(patientTarget, 'sr-patient', 'Patient Signature / Firma del Paciente');
    this.sigPadOptician = new SignaturePad(opticianTarget, 'sr-optician', 'Optician Signature / Firma de Ópticos');
    
    if (this.state.patientSignature) {
      this.sigPadPatient.setDataUrl(this.state.patientSignature);
    }
    if (this.state.opticianSignature) {
      this.sigPadOptician.setDataUrl(this.state.opticianSignature);
    }
    
    const canv1 = patientTarget.querySelector('canvas');
    const canv2 = opticianTarget.querySelector('canvas');
    
    canv1.addEventListener('mouseup', () => this.saveSignatures());
    canv1.addEventListener('touchend', () => this.saveSignatures());
    canv1.addEventListener('signature-change', () => this.saveSignatures());
    
    canv2.addEventListener('mouseup', () => this.saveSignatures());
    canv2.addEventListener('touchend', () => this.saveSignatures());
    canv2.addEventListener('signature-change', () => this.saveSignatures());
  }
  
  saveSignatures() {
    this.state.patientSignature = this.sigPadPatient.getDataUrl();
    this.state.opticianSignature = this.sigPadOptician.getDataUrl();
    this.onStateChange(this.state);
  }
  
  updateState() {
    const form = this.container.querySelector('#semi-rimless-form');
    this.state = {
      ...this.state,
      patientName: form.querySelector('#sr-patient-name').value,
      date: form.querySelector('#sr-date').value
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
    if (this.sigPadOptician) this.sigPadOptician.clear();
  }
}
