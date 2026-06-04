/* Pal Optical Forms Web App - Avesis Medicaid Statement of Necessity */
import { SignaturePad } from '../components/SignaturePad.js';

export class PriorAuthForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.state = {
      signature: '/default_signature.png',
      ...state
    };
    this.onStateChange = onStateChange;
    this.sigPad = null;
    
    this.render();
    this.bindEvents();
    this.initSignature();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="form-card" id="prior-auth-form-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Kentucky Medicaid / Avesis</h2>
          <p>Statement of Clinical Necessity for Replacement Eyewear</p>
        </div>
        
        <form id="prior-auth-form">
          <!-- Section 1: Member Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              1. Member Information
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="pa-member-name">Member Name</label>
                <input type="text" class="form-control" id="pa-member-name" placeholder="Last, First Middle" value="${this.state.memberName || ''}">
              </div>
              <div class="form-group col-3">
                <label for="pa-member-dob">Date of Birth</label>
                <input type="text" class="form-control" id="pa-member-dob" placeholder="MM/DD/YYYY" value="${this.state.memberDob || ''}">
              </div>
              <div class="form-group col-3">
                <label for="pa-member-id">Member ID # (Medicaid)</label>
                <input type="text" class="form-control" id="pa-member-id" placeholder="ID # (9 digits)" value="${this.state.memberId || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="pa-dos">Date of Service</label>
                <input type="text" class="form-control" id="pa-dos" placeholder="MM/DD/YYYY" value="${this.state.dos || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Clinical Justification -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              2. Clinical Justification (Check all that apply)
            </div>
            
            <div class="form-group col-12" style="margin-bottom: 16px;">
              <label class="checkbox-label" style="font-weight: 600;">
                <input type="checkbox" id="pa-refractive" ${this.state.refractive ? 'checked' : ''}>
                Significant Refractive Change:
              </label>
              <div style="padding-left: 28px; font-size: 0.875rem; color: var(--text-secondary);">
                Patient has experienced a change in vision of ±0.50D or greater in sphere/cylinder or a change in axis of >15º.
              </div>
            </div>
            
            <div class="form-group col-12" style="margin-bottom: 16px;">
              <label class="checkbox-label" style="font-weight: 600;">
                <input type="checkbox" id="pa-functional" ${this.state.functional ? 'checked' : ''}>
                Functional Impairment:
              </label>
              <div style="padding-left: 28px; font-size: 0.875rem; color: var(--text-secondary);">
                Current eyewear is non-functional and unrepairable due to:
                <div style="display: flex; gap: 20px; margin-top: 6px;">
                  <label class="checkbox-label">
                    <input type="checkbox" id="pa-func-breakage" ${this.state.funcBreakage ? 'checked' : ''}> Breakage
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" id="pa-func-scratches" ${this.state.funcScratches ? 'checked' : ''}> Severe Scratches
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" id="pa-func-lost" ${this.state.funcLost ? 'checked' : ''}> Lost
                  </label>
                </div>
              </div>
            </div>
            
            <div class="form-group col-12" style="margin-bottom: 16px;">
              <label class="checkbox-label" style="font-weight: 600;">
                <input type="checkbox" id="pa-pathological" ${this.state.pathological ? 'checked' : ''}>
                Pathological Change:
              </label>
              <div style="padding-left: 28px; font-size: 0.875rem; color: var(--text-secondary);">
                Change in vision is due to a medical condition:
                <div style="display: flex; gap: 20px; margin-top: 6px;">
                  <label class="checkbox-label">
                    <input type="checkbox" id="pa-path-cataracts" ${this.state.pathCataracts ? 'checked' : ''}> Cataracts
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" id="pa-path-diabetes" ${this.state.pathDiabetes ? 'checked' : ''}> Diabetes
                  </label>
                </div>
              </div>
            </div>
            
            <div class="form-group col-12">
              <label for="pa-other-desc" class="checkbox-label" style="font-weight: 600;">
                <input type="checkbox" id="pa-other" ${this.state.other ? 'checked' : ''}>
                Other Justification:
              </label>
              <div style="padding-left: 28px; margin-top: 6px;">
                <input type="text" class="form-control" id="pa-other-desc" placeholder="Describe clinical justification..." value="${this.state.otherDesc || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 3: Professional Statements -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              3. Statements & Acknowledgment
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 16px; font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 20px;">
              <p style="margin-bottom: 12px;"><strong>Provider Statement:</strong> I certify that the replacement of this member’s eyewear is medically necessary to restore the patient's visual acuity to the highest functional level and to ensure safety in daily living activities (e.g., driving, ambulation, employment).</p>
              <p><strong>Member Acknowledgment:</strong> I certify that I have not received a pair of eyeglasses through Medicaid within the current benefit period, or my current glasses are lost/broken/unusable.</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-8" id="pa-sig-target">
                <!-- Signature pad -->
              </div>
              
              <div class="form-group col-4">
                <label for="pa-sig-date">Date Signed</label>
                <input type="text" class="form-control" id="pa-sig-date" placeholder="MM/DD/YYYY" value="${this.state.sigDate || ''}" style="margin-top: 30px;">
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#prior-auth-form');
    
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#pa-sig-target');
    this.sigPad = new SignaturePad(sigTarget, 'prior-auth', 'Sign here with finger or mouse');
    
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
    const form = this.container.querySelector('#prior-auth-form');
    
    this.state = {
      ...this.state,
      memberName: form.querySelector('#pa-member-name').value,
      memberDob: form.querySelector('#pa-member-dob').value,
      memberId: form.querySelector('#pa-member-id').value,
      dos: form.querySelector('#pa-dos').value,
      
      refractive: form.querySelector('#pa-refractive').checked,
      functional: form.querySelector('#pa-functional').checked,
      funcBreakage: form.querySelector('#pa-func-breakage').checked,
      funcScratches: form.querySelector('#pa-func-scratches').checked,
      funcLost: form.querySelector('#pa-func-lost').checked,
      pathological: form.querySelector('#pa-pathological').checked,
      pathCataracts: form.querySelector('#pa-path-cataracts').checked,
      pathDiabetes: form.querySelector('#pa-path-diabetes').checked,
      other: form.querySelector('#pa-other').checked,
      otherDesc: form.querySelector('#pa-other-desc').value,
      
      sigDate: form.querySelector('#pa-sig-date').value
    };
    
    this.onStateChange(this.state);
  }
  
  reset() {
    this.state = {
      signature: '/default_signature.png'
    };
    this.render();
    this.bindEvents();
    this.initSignature();
    this.onStateChange(this.state);
  }
}
