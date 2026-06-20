/* Pal Optical Forms Web App - School/Work Excuse Form */

export class SchoolExcuseForm {
  constructor(container, state = {}, onStateChange, doctor = 'james') {
    this.container = container;
    this.doctor = doctor;
    
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      date: today,
      timeIn: '',
      timeOut: '',
      patientName: '',
      serviceExam: true,
      serviceRepair: false,
      serviceDispense: false,
      serviceFollowup: false,
      ...state
    };
    
    this.onStateChange = onStateChange;
    this.signatureFile = doctor === 'james' ? '/jamessig.jpg' : '/CARRIBYAN SIG.jpg';
    this.doctorName = doctor === 'james' ? 'James Brentlinger, O.D.' : 'Carribyan';
    
    this.render();
    this.bindEvents();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="form-card" id="school-excuse-card">
        <!-- Form Header (Interactive Screen Version) -->
        <div class="form-header-block print:hidden">
          <h2>PAL OPTICAL</h2>
          <p>School / Work Excuse Verification</p>
        </div>
        
        <form id="school-excuse-form">
          <!-- Fillable Inputs (Interactive Section - Hidden in Print) -->
          <div class="form-section print:hidden" style="margin-bottom: 20px;">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Excuse Details
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="excuse-patient-name">Patient Name</label>
                <input type="text" class="form-control" id="excuse-patient-name" placeholder="Patient Name" value="${this.state.patientName || ''}">
              </div>
              <div class="form-group col-6">
                <label for="excuse-date">Date</label>
                <input type="text" class="form-control" id="excuse-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
              <div class="form-group col-6">
                <label for="excuse-time-in">Time In</label>
                <input type="text" class="form-control" id="excuse-time-in" placeholder="e.g. 10:00 AM" value="${this.state.timeIn || ''}">
              </div>
              <div class="form-group col-6">
                <label for="excuse-time-out">Time Out</label>
                <input type="text" class="form-control" id="excuse-time-out" placeholder="e.g. 11:30 AM" value="${this.state.timeOut || ''}">
              </div>
            </div>
            
            <div class="form-group col-12" style="margin-top: 15px;">
              <label style="font-weight: 700; margin-bottom: 5px; display: block;">Services Provided:</label>
              <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                <label class="checkbox-label">
                  <input type="checkbox" id="service-exam" ${this.state.serviceExam ? 'checked' : ''}> Comprehensive Eye Examination
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" id="service-repair" ${this.state.serviceRepair ? 'checked' : ''}> Eyeglass Repair / Adjustment
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" id="service-dispense" ${this.state.serviceDispense ? 'checked' : ''}> Dispensing of Eyewear
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" id="service-followup" ${this.state.serviceFollowup ? 'checked' : ''}> Follow-up Consultation
                </label>
              </div>
            </div>
          </div>
          
          <!-- Excuse Slip Replica (Visible on screen and prints) -->
          <div class="excuse-slip-print" style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 40px; background-color: #fff; font-family: 'Arial', sans-serif; font-size: 1.15rem; line-height: 1.8; color: #000;">
            <div style="text-align: center; margin-bottom: 25px; line-height: 1.2;">
              <div style="font-size: 1.8rem; font-weight: 800; letter-spacing: 0.5px;">PAL OPTICAL</div>
              <div style="font-size: 1.1rem; font-weight: 700; margin-top: 4px; color: #475569;">1555 E NEW CIRCLE RD SUITE 146</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: #475569;">LEXINGTON, KY 40509</div>
            </div>
            
            <div style="text-align: center; margin-bottom: 35px;">
              <span style="font-size: 1.25rem; font-weight: 800; border-bottom: 2px solid #000; padding-bottom: 2px; text-transform: uppercase;">VERIFICATION OF APPOINTMENT</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; font-weight: 700; gap: 20px; flex-wrap: wrap;">
              <div>Patient Name: <span style="font-weight: 800; border-bottom: 1px solid #000; padding: 0 10px; min-width: 250px; display: inline-block;" id="preview-patient-name">${this.state.patientName || '____________________________'}</span></div>
              <div>Date: <span style="border-bottom: 1px solid #000; padding: 0 10px; min-width: 120px; display: inline-block; text-align: center;" id="preview-date">${this.state.date || '____/____/_______'}</span></div>
            </div>
            
            <p style="margin-bottom: 25px;">
              Please excuse the patient named above from work/school. They were present in our office on this date for the following service:
            </p>
            
            <!-- Checkbox replica grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px 30px; margin-bottom: 30px; padding-left: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span id="check-exam" style="display: inline-block; width: 20px; height: 20px; border: 1.5px solid #000; text-align: center; line-height: 18px; font-weight: 800; font-size: 1.1rem;">${this.state.serviceExam ? '✓' : ''}</span>
                <span>Comprehensive Eye Examination</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span id="check-repair" style="display: inline-block; width: 20px; height: 20px; border: 1.5px solid #000; text-align: center; line-height: 18px; font-weight: 800; font-size: 1.1rem;">${this.state.serviceRepair ? '✓' : ''}</span>
                <span>Eyeglass Repair / Adjustment</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span id="check-dispense" style="display: inline-block; width: 20px; height: 20px; border: 1.5px solid #000; text-align: center; line-height: 18px; font-weight: 800; font-size: 1.1rem;">${this.state.serviceDispense ? '✓' : ''}</span>
                <span>Dispensing of Eyewear</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span id="check-followup" style="display: inline-block; width: 20px; height: 20px; border: 1.5px solid #000; text-align: center; line-height: 18px; font-weight: 800; font-size: 1.1rem;">${this.state.serviceFollowup ? '✓' : ''}</span>
                <span>Follow-up Consultation</span>
              </div>
            </div>
            
            <div style="display: flex; gap: 40px; margin-bottom: 40px; font-weight: 700; flex-wrap: wrap;">
              <div>Time In: <span style="border-bottom: 1px solid #000; padding: 0 10px; min-width: 90px; display: inline-block; text-align: center;" id="preview-time-in">${this.state.timeIn || '____:____'}</span> <span style="font-size: 0.85rem; font-weight: 500; color: #475569;">AM/PM</span></div>
              <div>Time Out: <span style="border-bottom: 1px solid #000; padding: 0 10px; min-width: 90px; display: inline-block; text-align: center;" id="preview-time-out">${this.state.timeOut || '____:____'}</span> <span style="font-size: 0.85rem; font-weight: 500; color: #475569;">AM/PM</span></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; gap: 20px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 250px;">
                <div style="position: relative; height: 70px; display: flex; align-items: center; justify-content: center;">
                  <img src="${this.signatureFile}" alt="${this.doctorName} Signature" style="max-height: 70px; object-fit: contain;">
                </div>
                <div style="border-top: 1.5px solid #000; text-align: center; font-size: 0.95rem; font-weight: 700; padding-top: 5px;">
                  Authorized Signature: ${this.doctorName}
                </div>
              </div>
              <div style="width: 150px; height: 80px; border: 1.5px dashed #94a3b8; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; text-align: center; padding: 5px;">
                Office Stamp
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#school-excuse-form');
    if (!form) return;
    
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }
  
  updateState() {
    const form = this.container.querySelector('#school-excuse-form');
    if (!form) return;
    
    const patientName = form.querySelector('#excuse-patient-name').value;
    const date = form.querySelector('#excuse-date').value;
    const timeIn = form.querySelector('#excuse-time-in').value;
    const timeOut = form.querySelector('#excuse-time-out').value;
    
    const serviceExam = form.querySelector('#service-exam').checked;
    const serviceRepair = form.querySelector('#service-repair').checked;
    const serviceDispense = form.querySelector('#service-dispense').checked;
    const serviceFollowup = form.querySelector('#service-followup').checked;
    
    this.state = {
      ...this.state,
      patientName,
      date,
      timeIn,
      timeOut,
      serviceExam,
      serviceRepair,
      serviceDispense,
      serviceFollowup
    };
    
    // Live update preview elements
    this.container.querySelector('#preview-date').textContent = date || '____/____/_______';
    this.container.querySelector('#preview-patient-name').textContent = patientName || '____________________________';
    this.container.querySelector('#preview-time-in').textContent = timeIn || '____:____';
    this.container.querySelector('#preview-time-out').textContent = timeOut || '____:____';
    
    this.container.querySelector('#check-exam').textContent = serviceExam ? '✓' : '';
    this.container.querySelector('#check-repair').textContent = serviceRepair ? '✓' : '';
    this.container.querySelector('#check-dispense').textContent = serviceDispense ? '✓' : '';
    this.container.querySelector('#check-followup').textContent = serviceFollowup ? '✓' : '';
    
    this.onStateChange(this.state);
  }
  
  reset() {
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      date: today,
      timeIn: '',
      timeOut: '',
      patientName: '',
      serviceExam: true,
      serviceRepair: false,
      serviceDispense: false,
      serviceFollowup: false
    };
    this.render();
    this.bindEvents();
    this.onStateChange(this.state);
  }
}
