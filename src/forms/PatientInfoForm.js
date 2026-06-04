/* Pal Optical Forms Web App - Patient Information Sheet Form */
import { SignaturePad } from '../components/SignaturePad.js';

export class PatientInfoForm {
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
      <div class="form-card" id="patient-info-form-card">
        <!-- Form Header -->
        <div class="form-header-block">
          <h2>Patient Information Sheet</h2>
          <p>Pal Optical • 1555 E New Circle Rd, Lexington, KY 40509</p>
        </div>
        
        <form id="patient-info-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              1. Patient Demographics
            </div>
            
            <div class="form-grid">
              <div class="form-group col-12">
                <label for="p-name">Patient's Full Name</label>
                <input type="text" class="form-control" id="p-name" placeholder="Last, First Middle" value="${this.state.name || ''}">
              </div>
              
              <div class="form-group col-6">
                <label for="p-address">Street Address</label>
                <input type="text" class="form-control" id="p-address" placeholder="123 Main St" value="${this.state.address || ''}">
              </div>
              <div class="form-group col-3">
                <label for="p-city">City</label>
                <input type="text" class="form-control" id="p-city" placeholder="Lexington" value="${this.state.city || ''}">
              </div>
              <div class="form-group col-1.5">
                <label for="p-state">State</label>
                <input type="text" class="form-control" id="p-state" placeholder="KY" value="${this.state.state || ''}">
              </div>
              <div class="form-group col-1.5">
                <label for="p-zip">Zip Code</label>
                <input type="text" class="form-control" id="p-zip" placeholder="40509" value="${this.state.zip || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="p-ssn">Social Security Number</label>
                <input type="text" class="form-control" id="p-ssn" placeholder="XXX-XX-XXXX" value="${this.state.ssn || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-dob">Date of Birth</label>
                <input type="text" class="form-control" id="p-dob" placeholder="MM/DD/YYYY" value="${this.state.dob || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-gender">Gender</label>
                <input type="text" class="form-control" id="p-gender" placeholder="Male / Female / Other" value="${this.state.gender || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="p-phone">Phone Number</label>
                <input type="tel" class="form-control" id="p-phone" placeholder="(859) 555-0199" value="${this.state.phone || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-email">Email Address</label>
                <input type="email" class="form-control" id="p-email" placeholder="patient@example.com" value="${this.state.email || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-language">Preferred Language</label>
                <input type="text" class="form-control" id="p-language" placeholder="English" value="${this.state.language || ''}">
              </div>
              
              <div class="form-group col-6">
                <label>Race</label>
                <div class="checkbox-grid">
                  <label class="radio-label">
                    <input type="radio" name="p-race" value="White" ${this.state.race === 'White' ? 'checked' : ''}> White
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-race" value="Black" ${this.state.race === 'Black' ? 'checked' : ''}> Black
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-race" value="Hispanic" ${this.state.race === 'Hispanic' ? 'checked' : ''}> Hispanic
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-race" value="Asian" ${this.state.race === 'Asian' ? 'checked' : ''}> Asian
                  </label>
                </div>
              </div>
              
              <div class="form-group col-6">
                <label>Ethnicity</label>
                <div class="checkbox-grid">
                  <label class="radio-label">
                    <input type="radio" name="p-ethnicity" value="Hispanic" ${this.state.ethnicity === 'Hispanic' ? 'checked' : ''}> Hispanic
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-ethnicity" value="Pacific Islander" ${this.state.ethnicity === 'Pacific Islander' ? 'checked' : ''}> Pacific Islander
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-ethnicity" value="American Indian" ${this.state.ethnicity === 'American Indian' ? 'checked' : ''}> American Indian
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-ethnicity" value="Non-Hispanic" ${this.state.ethnicity === 'Non-Hispanic' ? 'checked' : ''}> Non-Hispanic
                  </label>
                </div>
              </div>
              
              <div class="form-group col-6">
                <label>Preferred Method of Communication</label>
                <div class="checkbox-grid">
                  <label class="radio-label">
                    <input type="radio" name="p-comm" value="Phone" ${this.state.comm === 'Phone' ? 'checked' : ''}> Phone
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-comm" value="Email" ${this.state.comm === 'Email' ? 'checked' : ''}> Email
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-comm" value="Mail" ${this.state.comm === 'Mail' ? 'checked' : ''}> Mail
                  </label>
                </div>
              </div>
              
              <div class="form-group col-6">
                <label>Consent to Receive Reminder Calls for Next Exam?</label>
                <div class="checkbox-grid" style="margin-top: 10px;">
                  <label class="radio-label">
                    <input type="radio" name="p-reminder" value="Yes" ${this.state.reminder === 'Yes' ? 'checked' : ''}> Yes
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-reminder" value="No" ${this.state.reminder === 'No' ? 'checked' : ''}> No
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section 2: Primary Insurance -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              2. Primary Insurance Information
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="ins-name">Insurance Company Name</label>
                <input type="text" class="form-control" id="ins-name" placeholder="Avesis / Medicaid / EyeMed" value="${this.state.insName || ''}">
              </div>
              <div class="form-group col-6">
                <label for="ins-cardholder">Cardholder Full Name</label>
                <input type="text" class="form-control" id="ins-cardholder" placeholder="John H. Doe" value="${this.state.insCardholder || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="ins-id">Insurance ID Number</label>
                <input type="text" class="form-control" id="ins-id" placeholder="ID Number" value="${this.state.insId || ''}">
              </div>
              <div class="form-group col-4">
                <label for="ins-dob">Cardholder Date of Birth</label>
                <input type="text" class="form-control" id="ins-dob" placeholder="MM/DD/YYYY" value="${this.state.insDob || ''}">
              </div>
              <div class="form-group col-4">
                <label for="ins-relation">Relationship to Patient</label>
                <input type="text" class="form-control" id="ins-relation" placeholder="Self / Spouse / Child" value="${this.state.insRelation || ''}">
              </div>
              
              <div class="form-group col-12">
                <label for="ins-employer">Policyholder Employer / Sponsor</label>
                <input type="text" class="form-control" id="ins-employer" placeholder="Employer Name" value="${this.state.insEmployer || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 3: Cataract Surgery History -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              3. Cataract Surgery History
            </div>
            
            <div class="form-grid">
              <div class="form-group col-4">
                <label>Have you had Cataract Surgery?</label>
                <div class="checkbox-grid" style="margin-top: 10px;">
                  <label class="radio-label">
                    <input type="radio" name="cat-surgery" value="Yes" ${this.state.catSurgery === 'Yes' ? 'checked' : ''}> Yes
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="cat-surgery" value="No" ${this.state.catSurgery === 'No' ? 'checked' : ''}> No
                  </label>
                </div>
              </div>
              
              <div class="form-group col-4">
                <label for="cat-date-od">Date of Right Eye (OD)</label>
                <input type="text" class="form-control" id="cat-date-od" placeholder="MM/DD/YYYY" value="${this.state.catDateOd || ''}">
              </div>
              <div class="form-group col-4">
                <label for="cat-date-os">Date of Left Eye (OS)</label>
                <input type="text" class="form-control" id="cat-date-os" placeholder="MM/DD/YYYY" value="${this.state.catDateOs || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="cat-surgeon">Surgeon's Full Name</label>
                <input type="text" class="form-control" id="cat-surgeon" placeholder="Dr. John Smith" value="${this.state.catSurgeon || ''}">
              </div>
              <div class="form-group col-4">
                <label for="cat-city">Surgeon's City</label>
                <input type="text" class="form-control" id="cat-city" placeholder="Lexington" value="${this.state.catCity || ''}">
              </div>
              <div class="form-group col-4">
                <label for="cat-state">Surgeon's State</label>
                <input type="text" class="form-control" id="cat-state" placeholder="KY" value="${this.state.catState || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 4: Parent / Guardian Info (Under 18) -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              4. Parent / Guardian Information (If patient is under 18)
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="g-name">Guardian Name</label>
                <input type="text" class="form-control" id="g-name" placeholder="Full Name" value="${this.state.gName || ''}">
              </div>
              <div class="form-group col-6">
                <label for="g-address">Street Address</label>
                <input type="text" class="form-control" id="g-address" placeholder="If different from patient" value="${this.state.gAddress || ''}">
              </div>
              
              <div class="form-group col-3">
                <label for="g-city">City</label>
                <input type="text" class="form-control" id="g-city" placeholder="City" value="${this.state.gCity || ''}">
              </div>
              <div class="form-group col-3">
                <label for="g-state">State</label>
                <input type="text" class="form-control" id="g-state" placeholder="State" value="${this.state.gState || ''}">
              </div>
              <div class="form-group col-3">
                <label for="g-zip">Zip Code</label>
                <input type="text" class="form-control" id="g-zip" placeholder="Zip" value="${this.state.gZip || ''}">
              </div>
              <div class="form-group col-3">
                <label for="g-dob">Guardian Date of Birth</label>
                <input type="text" class="form-control" id="g-dob" placeholder="MM/DD/YYYY" value="${this.state.gDob || ''}">
              </div>
              
              <div class="form-group col-6">
                <label for="g-ssn">Guardian Social Security Number</label>
                <input type="text" class="form-control" id="g-ssn" placeholder="XXX-XX-XXXX" value="${this.state.gSsn || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 5: Authorization & Signatures -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              5. Authorization & Policy Statement
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 16px; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 20px;">
              <p style="margin-bottom: 8px;"><strong>1. INSURANCE ESTIMATE POLICY:</strong> PLEASE NOTE THE AMOUNT YOUR INSURANCE HAS QUOTED IS AN ESTIMATE. THIS IS NOT A GUARANTEE OF PAYMENT. INSURANCE COMPANIES WILL DETERMINE THE EXACT AMOUNT WHEN THE CLAIM IS PROCESSED. IF IT IS DIFFERENT FROM TODAY'S QUOTE, WE WILL SEND YOU A BILL OR REFUND THE DIFFERENCE.</p>
              <p><strong>2. RELEASE OF INFORMATION:</strong> I AUTHORIZE THE RELEASE OF ANY AND ALL INFORMATION TO ANY NECESSARY PARTIES FOR INSURANCE CLAIMS OR THE COLLECTION OF ANY FEES.</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-8" id="sig-pad-target">
                <!-- SignaturePad will render here -->
              </div>
              <div class="form-group col-4">
                <label for="p-sig-date">Date Signed</label>
                <input type="text" class="form-control" id="p-sig-date" placeholder="MM/DD/YYYY" value="${this.state.sigDate || ''}" style="margin-top: 30px;">
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#patient-info-form');
    
    // Listen to changes and update state
    form.addEventListener('input', () => {
      this.updateState();
    });
    
    form.addEventListener('change', () => {
      this.updateState();
    });
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#sig-pad-target');
    this.sigPad = new SignaturePad(sigTarget, 'patient-info', 'Sign here with finger or mouse');
    
    // Load signature if exists in state
    if (this.state.signature) {
      this.sigPad.setDataUrl(this.state.signature);
    }
    
    // Bind signature change listener
    const canvas = sigTarget.querySelector('canvas');
    canvas.addEventListener('mouseup', () => this.saveSignature());
    canvas.addEventListener('touchend', () => this.saveSignature());
    canvas.addEventListener('signature-change', () => this.saveSignature());
  }
  
  saveSignature() {
    const dataUrl = this.sigPad.getDataUrl();
    this.state.signature = dataUrl;
    this.onStateChange(this.state);
  }
  
  updateState() {
    const form = this.container.querySelector('#patient-info-form');
    
    const raceRadio = form.querySelector('input[name="p-race"]:checked');
    const ethnicityRadio = form.querySelector('input[name="p-ethnicity"]:checked');
    const commRadio = form.querySelector('input[name="p-comm"]:checked');
    const reminderRadio = form.querySelector('input[name="p-reminder"]:checked');
    const catSurgeryRadio = form.querySelector('input[name="cat-surgery"]:checked');
    
    this.state = {
      ...this.state,
      name: form.querySelector('#p-name').value,
      address: form.querySelector('#p-address').value,
      city: form.querySelector('#p-city').value,
      state: form.querySelector('#p-state').value,
      zip: form.querySelector('#p-zip').value,
      ssn: form.querySelector('#p-ssn').value,
      dob: form.querySelector('#p-dob').value,
      gender: form.querySelector('#p-gender').value,
      phone: form.querySelector('#p-phone').value,
      email: form.querySelector('#p-email').value,
      language: form.querySelector('#p-language').value,
      
      race: raceRadio ? raceRadio.value : '',
      ethnicity: ethnicityRadio ? ethnicityRadio.value : '',
      comm: commRadio ? commRadio.value : '',
      reminder: reminderRadio ? reminderRadio.value : '',
      
      insName: form.querySelector('#ins-name').value,
      insCardholder: form.querySelector('#ins-cardholder').value,
      insId: form.querySelector('#ins-id').value,
      insDob: form.querySelector('#ins-dob').value,
      insRelation: form.querySelector('#ins-relation').value,
      insEmployer: form.querySelector('#ins-employer').value,
      
      catSurgery: catSurgeryRadio ? catSurgeryRadio.value : '',
      catDateOd: form.querySelector('#cat-date-od').value,
      catDateOs: form.querySelector('#cat-date-os').value,
      catSurgeon: form.querySelector('#cat-surgeon').value,
      catCity: form.querySelector('#cat-city').value,
      catState: form.querySelector('#cat-state').value,
      
      gName: form.querySelector('#g-name').value,
      gAddress: form.querySelector('#g-address').value,
      gCity: form.querySelector('#g-city').value,
      gState: form.querySelector('#g-state').value,
      gZip: form.querySelector('#g-zip').value,
      gDob: form.querySelector('#g-dob').value,
      gSsn: form.querySelector('#g-ssn').value,
      
      sigDate: form.querySelector('#p-sig-date').value
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
}
