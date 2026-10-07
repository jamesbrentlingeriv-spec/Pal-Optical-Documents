/* Pal Optical Forms Web App - Refusal of Impact-Resistant Lenses (Bilingual Waiver) */
import { SignaturePad } from '../components/SignaturePad.js';
import { render2UpBlankSheet, renderWaiverBrandHeader } from './waiverPrintBlankHelper.js';

export class BilingualLensWaiverForm {
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

  renderBlankHalfSheet() {
    return `
      ${renderWaiverBrandHeader(
        'Refusal of Impact-Resistant Lenses Waiver',
        'Exención de Responsabilidad por Rechazo de Lentes Resistentes a Impactos',
        'OPTICAL RECORD COPY &bull; (COPIA DEL EXPEDIENTE)'
      )}
      
      <div class="wb-demographics-block">
        <div class="wb-demographics-row">
          <div class="wb-field" style="flex: 5;">
            <span class="wb-field-label">Patient Name / Nombre del Paciente:</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 3;">
            <span class="wb-field-label">Date of Birth / Fecha Nacimiento:</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 2.5;">
            <span class="wb-field-label">Order / Rx #: / Nº Orden:</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
      </div>
      
      <div class="wb-warning-box">
        <div class="wb-warning-box-title">
          CLINICAL WARNING (Advertencia Clínica &mdash; Balance Lens / Ojo Monocular)
        </div>
        <p style="margin: 0 0 2px 0;">
          <strong>Impact-resistant lenses (polycarbonate or Trivex) are strongly recommended for patients requiring a balance lens or who depend primarily on one functional eye. Protecting your functional eye from trauma is critical to preserving your sight.</strong>
        </p>
        <p class="wb-es-text" style="margin: 0; padding-top: 2px;">
          (Se recomienda enfáticamente el uso de lentes resistentes a impactos [policarbonato o Trivex] para pacientes con lente de equilibrio o que dependen de un solo ojo funcional. Proteger su visión restante contra traumatismos es crítico.)
        </p>
      </div>
      
      <div class="wb-disclosure-box">
        <div style="margin-bottom: 3px;">
          <strong>1. Informed Refusal (Rechazo Informado):</strong> The safety advantages of polycarbonate/Trivex lenses have been fully explained to me. Despite this clinical advice, I decline impact-resistant lenses for my eyewear order.
          <p class="wb-es-text" style="margin: 1px 0 0 0; padding-top: 1px;">
            (Se me explicaron detalladamente las ventajas de seguridad del policarbonato/Trivex. A pesar de esta recomendación clínica, rechazo voluntariamente el uso de lentes resistentes a impactos en mi orden.)
          </p>
        </div>
        <div style="margin-bottom: 3px; border-top: 1px solid #e2e8f0; padding-top: 2px;">
          <strong>2. Assumption of Risk (Asunción de Riesgo):</strong> I understand alternative materials (CR-39 standard plastic, high-index, or glass) may fracture or shatter upon impact, carrying higher risk of severe ocular trauma or blindness.
          <p class="wb-es-text" style="margin: 1px 0 0 0; padding-top: 1px;">
            (Entiendo que otros materiales [plástico CR-39 estándar, alto índice o vidrio] pueden astillarse o romperse ante un impacto, aumentando el riesgo de trauma ocular severo o ceguera.)
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 2px;">
          <strong>3. Liability Release (Exención de Responsabilidad):</strong> I assume all responsibility for any injury or vision loss resulting from my choice and release this clinic, its optometrists/ophthalmologists, and optical staff from liability.
          <p class="wb-es-text" style="margin: 1px 0 0 0; padding-top: 1px;">
            (Asumo total responsabilidad por cualquier lesión o pérdida de visión resultante de mi decisión y eximo a la clínica, médicos y personal óptico de toda responsabilidad legal.)
          </p>
        </div>
      </div>
      
      <div class="wb-signatures-row" style="margin-top: 2px;">
        <div class="wb-sig-block" style="flex: 1;">
          <div class="wb-sig-line"></div>
          <div class="wb-sig-label">Patient / Legal Guardian Signature / Firma del Paciente / Tutor</div>
        </div>
        <div class="wb-sig-block" style="flex: 1;">
          <div class="wb-sig-line"></div>
          <div class="wb-sig-label">Witness / Optician Signature / Firma del Testigo / Óptico</div>
        </div>
      </div>
      <div class="wb-signatures-row" style="margin-top: 3px;">
        <div class="wb-sig-block" style="flex: 1;">
          <div class="wb-sig-line"></div>
          <div class="wb-sig-label">Printed Name &amp; Relationship if Minor / Nombre y Parentesco</div>
        </div>
        <div class="wb-sig-block" style="flex: 1;">
          <div class="wb-sig-line"></div>
          <div class="wb-sig-label">Date Signed / Fecha (MM / DD / YYYY)</div>
        </div>
      </div>
    `;
  }

  render() {
    this.container.innerHTML = `
      <div class="waiver-interactive-view">
        <div class="form-card" id="bilingual-lens-card">
          <!-- Form Header -->
          <div class="form-header-block">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
              <div>
                <h2>Refusal of Impact-Resistant Lenses Waiver</h2>
                <p style="font-style: italic; color: var(--text-secondary); margin-top: 4px;">
                  Exención de Responsabilidad por Rechazo de Lentes Resistentes a Impactos
                </p>
              </div>
              <div class="record-copy-badge" style="background: var(--bg-primary, #f1f5f9); border: 1px solid var(--border-color, #cbd5e1); border-radius: 6px; padding: 4px 10px; text-align: right;">
                <div style="font-weight: 800; font-size: 0.75rem; letter-spacing: 0.5px; color: var(--text-primary, #334155);">OPTICAL RECORD COPY</div>
                <div style="font-style: italic; font-size: 0.7rem; color: var(--text-secondary, #64748b);">COPIA DEL EXPEDIENTE</div>
              </div>
            </div>
          </div>
          
          <form id="bilingual-lens-form">
            <!-- Section 1: Demographics -->
            <div class="form-section">
              <div class="form-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Information / Información
              </div>
              
              <div class="form-grid">
                <div class="form-group col-5">
                  <label for="bl-patient-name">Patient Name / Nombre del Paciente</label>
                  <input type="text" class="form-control" id="bl-patient-name" placeholder="Full Name" value="${this.state.patientName || ''}">
                </div>
                <div class="form-group col-3">
                  <label for="bl-patient-dob">Date of Birth / Fecha Nacimiento</label>
                  <input type="text" class="form-control" id="bl-patient-dob" placeholder="MM/DD/YYYY" value="${this.state.patientDob || ''}">
                </div>
                <div class="form-group col-2">
                  <label for="bl-order-num">Order / Rx # / Nº Orden</label>
                  <input type="text" class="form-control" id="bl-order-num" placeholder="Order #" value="${this.state.orderNum || ''}">
                </div>
                <div class="form-group col-2">
                  <label for="bl-date">Date / Fecha</label>
                  <input type="text" class="form-control" id="bl-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
                </div>
              </div>
            </div>
            
            <!-- Section 2: Clinical Warning -->
            <div class="form-section">
              <div class="form-section-title" style="color: #b91c1c;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Clinical Warning / Advertencia Clínica &mdash; Balance Lens / Ojo Monocular
              </div>
              
              <div style="background-color: #fff1f2; border: 1.5px solid #fecdd3; border-left: 4px solid #e11d48; border-radius: 8px; padding: 12px 16px; font-size: 0.88rem; line-height: 1.55; color: #9f1239; margin-bottom: 8px;">
                <p style="margin-bottom: 6px; font-weight: 600;">
                  Impact-resistant lenses (polycarbonate or Trivex) are strongly recommended for patients requiring a balance lens or who depend primarily on one functional eye. Protecting your functional eye from trauma is critical to preserving your sight.
                </p>
                <p style="margin: 0; font-style: italic; border-top: 1px dashed #fca5a5; padding-top: 6px; color: #be123c;">
                  Se recomienda enfáticamente el uso de lentes resistentes a impactos (policarbonato o Trivex) para pacientes con lente de equilibrio o que dependen de un solo ojo funcional. Proteger su visión restante contra traumatismos es crítico.
                </p>
              </div>
            </div>
            
            <!-- Section 3: Acknowledgment & Terms -->
            <div class="form-section">
              <div class="form-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Acknowledgment &amp; Terms / Reconocimiento y Términos
              </div>
              
              <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px 18px; font-size: 0.86rem; line-height: 1.55; color: var(--text-primary); margin-bottom: 12px;">
                <!-- 1. Informed Refusal -->
                <div style="margin-bottom: 12px;">
                  <p style="margin-bottom: 3px; font-weight: 600;">
                    1. Informed Refusal (Rechazo Informado):
                  </p>
                  <p style="margin-bottom: 4px;">
                    The safety advantages of polycarbonate/Trivex lenses have been fully explained to me. Despite this clinical advice, I decline impact-resistant lenses for my eyewear order.
                  </p>
                  <p style="font-style: italic; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 4px; margin: 0;">
                    Se me explicaron detalladamente las ventajas de seguridad del policarbonato/Trivex. A pesar de esta recomendación clínica, rechazo voluntariamente el uso de lentes resistentes a impactos en mi orden.
                  </p>
                </div>
                
                <!-- 2. Assumption of Risk -->
                <div style="margin-bottom: 12px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                  <p style="margin-bottom: 3px; font-weight: 600;">
                    2. Assumption of Risk (Asunción de Riesgo):
                  </p>
                  <p style="margin-bottom: 4px;">
                    I understand alternative materials (CR-39 standard plastic, high-index, or glass) may fracture or shatter upon impact, carrying higher risk of severe ocular trauma or blindness.
                  </p>
                  <p style="font-style: italic; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 4px; margin: 0;">
                    Entiendo que otros materiales (plástico CR-39 estándar, alto índice o vidrio) pueden astillarse o romperse ante un impacto, aumentando el riesgo de trauma ocular severo o ceguera.
                  </p>
                </div>
                
                <!-- 3. Liability Release -->
                <div style="border-top: 1px solid var(--border-color); padding-top: 10px;">
                  <p style="margin-bottom: 3px; font-weight: 600;">
                    3. Liability Release (Exención de Responsabilidad):
                  </p>
                  <p style="margin-bottom: 4px;">
                    I assume all responsibility for any injury or vision loss resulting from my choice and release this clinic, its optometrists/ophthalmologists, and optical staff from liability.
                  </p>
                  <p style="font-style: italic; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 4px; margin: 0;">
                    Asumo total responsabilidad por cualquier lesión o pérdida de visión resultante de mi decisión y eximo a la clínica, médicos y personal óptico de toda responsabilidad legal.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Section 4: Signatures -->
            <div class="form-section">
              <div class="form-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Signatures &amp; Date / Firmas y Fecha
              </div>
              
              <div class="form-grid">
                <div class="form-group col-6" id="bl-patient-sig-target">
                  <!-- Patient / Legal Guardian signature -->
                </div>
                <div class="form-group col-6" id="bl-optician-sig-target">
                  <!-- Witness / Optician signature -->
                </div>
                <div class="form-group col-6">
                  <label for="bl-printed-name">Printed Name &amp; Relationship if Minor / Nombre y Parentesco</label>
                  <input type="text" class="form-control" id="bl-printed-name" placeholder="Full name & relationship" value="${this.state.printedName || ''}">
                </div>
                <div class="form-group col-6">
                  <label for="bl-date-signed">Date Signed / Fecha</label>
                  <input type="text" class="form-control" id="bl-date-signed" placeholder="MM/DD/YYYY" value="${this.state.dateSigned || ''}">
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      ${render2UpBlankSheet(
        () => this.renderBlankHalfSheet(),
        'CUT HERE TO SEPARATE COPIES &bull; CORTE AQUÍ PARA SEPARAR COPIAS'
      )}
    `;
  }

  bindEvents() {
    const form = this.container.querySelector('#bilingual-lens-form');
    if (!form) return;
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }

  initSignatures() {
    const patientTarget = this.container.querySelector('#bl-patient-sig-target');
    const opticianTarget = this.container.querySelector('#bl-optician-sig-target');
    if (!patientTarget || !opticianTarget) return;

    this.sigPadPatient = new SignaturePad(
      patientTarget,
      'bl-patient',
      'Patient / Legal Guardian Signature / Firma del Paciente / Tutor'
    );
    this.sigPadOptician = new SignaturePad(
      opticianTarget,
      'bl-optician',
      'Witness / Optician Signature / Firma del Testigo / Óptico'
    );

    // Update label text in SignaturePad component
    const pLabel = patientTarget.querySelector('label');
    if (pLabel) pLabel.textContent = 'Patient / Legal Guardian Signature / Firma del Paciente / Tutor';

    const oLabel = opticianTarget.querySelector('label');
    if (oLabel) oLabel.textContent = 'Witness / Optician Signature / Firma del Testigo / Óptico';

    if (this.state.patientSignature) {
      this.sigPadPatient.setDataUrl(this.state.patientSignature);
    }
    if (this.state.opticianSignature) {
      this.sigPadOptician.setDataUrl(this.state.opticianSignature);
    }

    const canv1 = patientTarget.querySelector('canvas');
    const canv2 = opticianTarget.querySelector('canvas');

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
    if (this.sigPadOptician) this.state.opticianSignature = this.sigPadOptician.getDataUrl();
    this.onStateChange(this.state);
  }

  updateState() {
    const form = this.container.querySelector('#bilingual-lens-form');
    if (!form) return;
    this.state = {
      ...this.state,
      patientName: form.querySelector('#bl-patient-name')?.value || '',
      patientDob: form.querySelector('#bl-patient-dob')?.value || '',
      orderNum: form.querySelector('#bl-order-num')?.value || '',
      date: form.querySelector('#bl-date')?.value || '',
      printedName: form.querySelector('#bl-printed-name')?.value || '',
      dateSigned: form.querySelector('#bl-date-signed')?.value || ''
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
