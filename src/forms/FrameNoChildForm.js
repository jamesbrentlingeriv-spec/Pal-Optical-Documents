/* Pal Optical Forms Web App - Frame Selection Without Child Present Waiver */
import { SignaturePad } from '../components/SignaturePad.js';

export class FrameNoChildForm {
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
      <div class="form-card" id="frame-no-child-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Frame Selection w/o Child Present Waiver</h2>
          <p style="font-style: italic; color: var(--text-secondary); margin-top: 4px;">
            Renuncia de Responsabilidad: Selección de Armazón sin el Niño Presente
          </p>
        </div>
        
        <form id="frame-no-child-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Information / Información
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="fnc-customer-name">Parent/Customer Name / Nombre del Cliente</label>
                <input type="text" class="form-control" id="fnc-customer-name" placeholder="Full Name" value="${this.state.customerName || ''}">
              </div>
              <div class="form-group col-3">
                <label for="fnc-child-name">Child Name / Nombre del Niño</label>
                <input type="text" class="form-control" id="fnc-child-name" placeholder="Child Name" value="${this.state.childName || ''}">
              </div>
              <div class="form-group col-3">
                <label for="fnc-date">Date / Fecha</label>
                <input type="text" class="form-control" id="fnc-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Policy Details -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Policy Agreement / Aceptación de la Política
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px;">
              <p style="margin-bottom: 12px; font-weight: 500;">
                At Pal Optical, we highly recommend that children try on frames to ensure the best possible comfort and vision correction. By choosing a frame without your child present, you accept full responsibility for the final fit and style.
              </p>
              <p style="margin-bottom: 16px; font-style: italic; color: var(--text-secondary); border-bottom: 1px dashed var(--border-color); padding-bottom: 12px;">
                En Pal Optical, recomendamos encarecidamente que los niños se prueben los armazones para garantizar la mayor comodidad y corrección visual posible. Al elegir un armazón sin que el niño esté presente, usted acepta la total responsabilidad por el ajuste final y el estilo.
              </p>
              
              <p style="margin-bottom: 12px; font-weight: 600;">
                Policy Agreement: I understand that if the selected frame does not fit or is not preferred by the child, Pal Optical cannot offer a free exchange or lens remake. Any changes to the frame or lenses after fabrication will be at the customer's full expense.
              </p>
              <p style="font-style: italic; color: var(--text-secondary);">
                Aceptación de la Política: Entiendo que si el armazón seleccionado no ajusta bien o no es del agrado del niño, Pal Optical no puede ofrecer cambios gratuitos ni volver a fabricar los lentes sin costo. Cualquier cambio en el armazón o en los lentes después de su fabricación correrá por cuenta y cargo total del cliente.
              </p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-12" id="fnc-sig-target">
                <!-- Customer signature -->
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#frame-no-child-form');
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#fnc-sig-target');
    this.sigPad = new SignaturePad(sigTarget, 'fnc-sig', 'Customer Signature / Firma del Cliente');
    
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
    const form = this.container.querySelector('#frame-no-child-form');
    this.state = {
      ...this.state,
      customerName: form.querySelector('#fnc-customer-name').value,
      childName: form.querySelector('#fnc-child-name').value,
      date: form.querySelector('#fnc-date').value
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
