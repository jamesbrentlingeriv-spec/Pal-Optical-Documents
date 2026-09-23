/* Pal Optical Forms Web App - Itemized Statement Request Form (Routing to File Clerk Tracy) */

export class ItemizedStatementRequestForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;

    const today = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    this.state = {
      requestDate: today,
      requestedBy: 'James Brentlinger',
      urgency: 'Routine',

      // Patient Demographics
      patientName: '',
      patientDob: '',
      patientPhone: '',
      patientAddress: '',
      patientCityStateZip: '',
      patientEmail: '',
      patientFax: '',

      // Transaction & Service Info
      dateOfService: '',
      dosSameAsRequest: false,
      cardType: 'Visa',
      cardTypeOther: '',
      cardLast4: '',
      paymentAmount: '',
      orderNumber: '',
      purpose: 'FSA / HSA Reimbursement',

      // Delivery Method
      deliveryEmail: true,
      deliveryMail: false,
      deliveryFax: false,
      deliveryPickup: false,

      // Mandatory Attachments / Disclaimer Checks
      attachRx: true,
      attachWriteUp: true,
      attachReceipt: true,

      // Additional Notes
      specialInstructions: '',

      // Tracy's Processing Block
      clerkReceivedDate: '',
      clerkCompletedDate: '',
      clerkInitials: '',
      clerkStatus: 'Pending',
      clerkNotes: '',

      ...state
    };

    this.onStateChange = onStateChange;

    this.render();
    this.bindEvents();
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  render() {
    this.container.innerHTML = `
      <div class="form-card statement-request-card" id="statement-request-card">
        <form id="itemized-statement-request-form">
          <!-- Top Header -->
          <div class="statement-request-header">
            <div class="statement-request-brand">
              <div class="brand-title">PAL OPTICAL</div>
              <div class="brand-subtitle">1555 E. New Circle Rd, Suite 146 • Lexington, KY 40509 • (859) 266-3003</div>
            </div>
            <div class="statement-request-badge">
              <div class="badge-title">ITEMIZED STATEMENT REQUEST</div>
              <div class="badge-attn">ATTN: FILE CLERK TRACY</div>
            </div>
          </div>

          <div class="statement-request-divider"></div>

          <!-- Meta Routing Bar -->
          <div class="routing-meta-bar">
            <div class="meta-field">
              <span class="meta-label">DATE OF REQUEST:</span>
              <input type="text" class="meta-input" data-field="requestDate" placeholder="MM/DD/YYYY" value="${this.escapeHtml(this.state.requestDate || '')}">
            </div>
            <div class="meta-field">
              <span class="meta-label">REQUESTED BY:</span>
              <input type="text" class="meta-input" data-field="requestedBy" placeholder="Staff Name" value="${this.escapeHtml(this.state.requestedBy || '')}">
            </div>
            <div class="meta-field">
              <span class="meta-label">PRIORITY:</span>
              <select class="meta-select" data-field="urgency">
                <option value="Routine" ${this.state.urgency === 'Routine' ? 'selected' : ''}>Routine</option>
                <option value="Urgent" ${this.state.urgency === 'Urgent' ? 'selected' : ''}>Urgent</option>
                <option value="Same Day / Rush" ${this.state.urgency === 'Same Day / Rush' ? 'selected' : ''}>Same Day / Rush</option>
              </select>
            </div>
          </div>

          <!-- Section 1: Patient Information & Contact -->
          <div class="form-section-panel">
            <div class="panel-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>1. PATIENT DEMOGRAPHICS &amp; CONTACT INFORMATION</span>
            </div>
            <div class="form-grid">
              <div class="form-group col-12">
                <label>PATIENT FULL NAME <span class="req">*</span></label>
                <input type="text" class="form-control font-bold" style="font-size: 1.05rem;" data-field="patientName" placeholder="Last, First Middle / Suffix" value="${this.escapeHtml(this.state.patientName || '')}">
              </div>

              <div class="form-group col-3">
                <label>DATE OF BIRTH (DOB) <span class="req">*</span></label>
                <input type="text" class="form-control" data-field="patientDob" placeholder="MM/DD/YYYY" value="${this.escapeHtml(this.state.patientDob || '')}">
              </div>
              <div class="form-group col-4">
                <label>PATIENT PHONE NUMBER <span class="req">*</span></label>
                <input type="tel" class="form-control" data-field="patientPhone" placeholder="(859) 000-0000" value="${this.escapeHtml(this.state.patientPhone || '')}">
              </div>
              <div class="form-group col-5">
                <label>PATIENT EMAIL ADDRESS</label>
                <input type="email" class="form-control" data-field="patientEmail" placeholder="patient@example.com" value="${this.escapeHtml(this.state.patientEmail || '')}">
              </div>

              <div class="form-group col-8">
                <label>PATIENT MAILING ADDRESS (STREET)</label>
                <input type="text" class="form-control" data-field="patientAddress" placeholder="Street Address, Apt / Suite #" value="${this.escapeHtml(this.state.patientAddress || '')}">
              </div>
              <div class="form-group col-4">
                <label>CITY, STATE, ZIP</label>
                <input type="text" class="form-control" data-field="patientCityStateZip" placeholder="Lexington, KY 40509" value="${this.escapeHtml(this.state.patientCityStateZip || '')}">
              </div>

              <div class="form-group col-12">
                <label>PATIENT FAX NUMBER (IF APPLICABLE)</label>
                <input type="text" class="form-control" data-field="patientFax" placeholder="(859) 000-0000 (Optional)" value="${this.escapeHtml(this.state.patientFax || '')}">
              </div>
            </div>
          </div>

          <!-- Section 2: Service & Payment Details -->
          <div class="form-section-panel">
            <div class="panel-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>2. SERVICE &amp; PAYMENT DETAILS</span>
            </div>
            <div class="form-grid">
              <div class="form-group col-6">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <label>DATE OF SERVICE (DOS)</label>
                  <label class="sublabel-check print:hidden">
                    <input type="checkbox" id="dos-same-check" ${this.state.dosSameAsRequest ? 'checked' : ''}>
                    <span>Same as Request Date</span>
                  </label>
                </div>
                <input type="text" class="form-control" id="field-dos" data-field="dateOfService" placeholder="MM/DD/YYYY (if different from Request Date)" value="${this.escapeHtml(this.state.dateOfService || '')}">
                <span class="field-hint">Specify if different from the Date of Request</span>
              </div>

              <div class="form-group col-6">
                <label>AMOUNT OF PAYMENT <span class="req">*</span></label>
                <div class="currency-input-wrap">
                  <span class="currency-prefix">$</span>
                  <input type="text" class="form-control currency-input font-bold" data-field="paymentAmount" placeholder="0.00" value="${this.escapeHtml(this.state.paymentAmount || '')}">
                </div>
                <span class="field-hint">Total dollar amount charged / paid by patient</span>
              </div>

              <div class="form-group col-8">
                <label>TYPE OF CARD PAID WITH <span class="req">*</span></label>
                <div class="card-types-grid">
                  <label class="card-radio-label">
                    <input type="radio" name="req-card-type" value="Visa" ${this.state.cardType === 'Visa' ? 'checked' : ''}>
                    <span>Visa</span>
                  </label>
                  <label class="card-radio-label">
                    <input type="radio" name="req-card-type" value="MasterCard" ${this.state.cardType === 'MasterCard' ? 'checked' : ''}>
                    <span>MasterCard</span>
                  </label>
                  <label class="card-radio-label">
                    <input type="radio" name="req-card-type" value="Discover" ${this.state.cardType === 'Discover' ? 'checked' : ''}>
                    <span>Discover</span>
                  </label>
                  <label class="card-radio-label">
                    <input type="radio" name="req-card-type" value="Amex" ${this.state.cardType === 'Amex' ? 'checked' : ''}>
                    <span>Amex</span>
                  </label>
                  <label class="card-radio-label">
                    <input type="radio" name="req-card-type" value="FSA/HSA" ${this.state.cardType === 'FSA/HSA' ? 'checked' : ''}>
                    <span>FSA / HSA Card</span>
                  </label>
                  <label class="card-radio-label">
                    <input type="radio" name="req-card-type" value="CareCredit" ${this.state.cardType === 'CareCredit' ? 'checked' : ''}>
                    <span>CareCredit</span>
                  </label>
                  <label class="card-radio-label">
                    <input type="radio" name="req-card-type" value="Other" ${this.state.cardType === 'Other' ? 'checked' : ''}>
                    <span>Other / Debit:</span>
                  </label>
                  <input type="text" class="card-other-input" data-field="cardTypeOther" placeholder="Specify card type" value="${this.escapeHtml(this.state.cardTypeOther || '')}" style="${this.state.cardType === 'Other' ? '' : 'display:none;'}">
                </div>
              </div>

              <div class="form-group col-4">
                <label>CARD LAST 4 DIGITS</label>
                <input type="text" class="form-control" data-field="cardLast4" maxlength="4" placeholder="e.g. 1234" value="${this.escapeHtml(this.state.cardLast4 || '')}">
                <span class="field-hint">Helps match merchant terminal slip</span>
              </div>

              <div class="form-group col-6">
                <label>ORDER / TRAY / FEE SLIP # (IF KNOWN)</label>
                <input type="text" class="form-control" data-field="orderNumber" placeholder="e.g. 56205 or Lab Tray #" value="${this.escapeHtml(this.state.orderNumber || '')}">
              </div>

              <div class="form-group col-6">
                <label>PURPOSE / STATEMENT REASON</label>
                <input type="text" class="form-control" data-field="purpose" placeholder="e.g. FSA Reimbursement / Tax / Insurance Claim" value="${this.escapeHtml(this.state.purpose || '')}">
              </div>
            </div>
          </div>

          <!-- Section 3: Prominent Disclaimer & Required Attachments -->
          <div class="statement-request-disclaimer-box">
            <div class="disclaimer-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="disclaimer-icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div class="disclaimer-title-text">
                <strong>IMPORTANT DISCLAIMER / MANDATORY ATTACHMENTS FOR TRACY:</strong>
              </div>
            </div>
            
            <p class="disclaimer-text">
              <strong>PLEASE INCLUDE A COPY OF THE RX (PRESCRIPTION), JOB WRITE-UP SHEET, AND CREDIT CARD RECEIPT (IF POSSIBLE).</strong>
            </p>

            <div class="disclaimer-checklist">
              <label class="disclaimer-check-label">
                <input type="checkbox" data-field="attachRx" class="disclaimer-checkbox" ${this.state.attachRx ? 'checked' : ''}>
                <span>Copy of Rx (Prescription) Attached</span>
              </label>
              <label class="disclaimer-check-label">
                <input type="checkbox" data-field="attachWriteUp" class="disclaimer-checkbox" ${this.state.attachWriteUp ? 'checked' : ''}>
                <span>Job Write-Up Sheet Attached</span>
              </label>
              <label class="disclaimer-check-label">
                <input type="checkbox" data-field="attachReceipt" class="disclaimer-checkbox" ${this.state.attachReceipt ? 'checked' : ''}>
                <span>Credit Card Receipt Attached (if possible)</span>
              </label>
            </div>
          </div>

          <!-- Section 4: Delivery Method & Special Instructions -->
          <div class="form-section-panel">
            <div class="panel-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>3. HOW SHOULD TRACY DELIVER THE STATEMENT?</span>
            </div>
            <div class="delivery-options-bar">
              <label class="delivery-check-label">
                <input type="checkbox" data-field="deliveryEmail" ${this.state.deliveryEmail ? 'checked' : ''}>
                <span>Email to Patient</span>
              </label>
              <label class="delivery-check-label">
                <input type="checkbox" data-field="deliveryMail" ${this.state.deliveryMail ? 'checked' : ''}>
                <span>Mail to Address</span>
              </label>
              <label class="delivery-check-label">
                <input type="checkbox" data-field="deliveryFax" ${this.state.deliveryFax ? 'checked' : ''}>
                <span>Fax to Patient</span>
              </label>
              <label class="delivery-check-label">
                <input type="checkbox" data-field="deliveryPickup" ${this.state.deliveryPickup ? 'checked' : ''}>
                <span>Patient Will Pick Up</span>
              </label>
            </div>

            <div class="form-group col-12" style="margin-top: 10px;">
              <label>SPECIAL INSTRUCTIONS / NOTES FOR TRACY</label>
              <textarea class="form-control notes-textarea" data-field="specialInstructions" rows="2" placeholder="e.g. Patient needs CPT codes included for vision insurance, breakdown frame vs lenses, fax immediately for FSA deadline...">${this.escapeHtml(this.state.specialInstructions || '')}</textarea>
            </div>
          </div>

          <!-- Section 5: File Clerk Tracy's Office Processing -->
          <div class="clerk-processing-box">
            <div class="clerk-box-header">
              <div class="clerk-title">FILE CLERK PROCESSING (FOR TRACY USE ONLY)</div>
              <div class="clerk-status-wrap">
                <span class="clerk-status-label">STATUS:</span>
                <select class="clerk-select" data-field="clerkStatus">
                  <option value="Pending" ${this.state.clerkStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="In Progress" ${this.state.clerkStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Completed & Sent" ${this.state.clerkStatus === 'Completed & Sent' ? 'selected' : ''}>Completed &amp; Sent</option>
                  <option value="On Hold / Need Info" ${this.state.clerkStatus === 'On Hold / Need Info' ? 'selected' : ''}>On Hold / Need Info</option>
                </select>
              </div>
            </div>

            <div class="clerk-grid">
              <div class="clerk-field">
                <span class="clerk-label">DATE RECEIVED:</span>
                <input type="text" class="clerk-line-input" data-field="clerkReceivedDate" placeholder="MM/DD/YYYY" value="${this.escapeHtml(this.state.clerkReceivedDate || '')}">
              </div>
              <div class="clerk-field">
                <span class="clerk-label">DATE COMPLETED &amp; SENT:</span>
                <input type="text" class="clerk-line-input" data-field="clerkCompletedDate" placeholder="MM/DD/YYYY" value="${this.escapeHtml(this.state.clerkCompletedDate || '')}">
              </div>
              <div class="clerk-field">
                <span class="clerk-label">TRACY'S INITIALS:</span>
                <input type="text" class="clerk-line-input clerk-initials" data-field="clerkInitials" placeholder="TL" value="${this.escapeHtml(this.state.clerkInitials || '')}">
              </div>
              <div class="clerk-field clerk-notes-field">
                <span class="clerk-label">PROCESSING NOTES:</span>
                <input type="text" class="clerk-line-input" data-field="clerkNotes" placeholder="Statement emailed to patient / filed in chart" value="${this.escapeHtml(this.state.clerkNotes || '')}">
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }

  bindEvents() {
    const form = this.container.querySelector('#itemized-statement-request-form');
    if (!form) return;

    // Handle inputs
    form.addEventListener('input', (e) => {
      const field = e.target.getAttribute('data-field');
      if (field) {
        this.state[field] = e.target.value;
        this.onStateChange(this.state);
      }
    });

    // Handle change events (checkboxes, radio, select)
    form.addEventListener('change', (e) => {
      const field = e.target.getAttribute('data-field');
      if (field) {
        if (e.target.type === 'checkbox') {
          this.state[field] = e.target.checked;
        } else {
          this.state[field] = e.target.value;
        }
        this.onStateChange(this.state);
      }

      // Handle card radio group
      if (e.target.name === 'req-card-type') {
        this.state.cardType = e.target.value;
        const otherInput = this.container.querySelector('.card-other-input');
        if (otherInput) {
          otherInput.style.display = (this.state.cardType === 'Other') ? '' : 'none';
          if (this.state.cardType === 'Other') {
            otherInput.focus();
          }
        }
        this.onStateChange(this.state);
      }
    });

    // "Same as Request Date" checkbox quick-fill
    const dosSameCheck = this.container.querySelector('#dos-same-check');
    const dosField = this.container.querySelector('#field-dos');
    if (dosSameCheck && dosField) {
      dosSameCheck.addEventListener('change', (e) => {
        this.state.dosSameAsRequest = e.target.checked;
        if (e.target.checked) {
          this.state.dateOfService = this.state.requestDate || '';
          dosField.value = this.state.dateOfService;
        }
        this.onStateChange(this.state);
      });
    }
  }

  reset() {
    const today = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    this.state = {
      requestDate: today,
      requestedBy: 'James Brentlinger',
      urgency: 'Routine',
      patientName: '',
      patientDob: '',
      patientPhone: '',
      patientAddress: '',
      patientCityStateZip: '',
      patientEmail: '',
      patientFax: '',
      dateOfService: '',
      dosSameAsRequest: false,
      cardType: 'Visa',
      cardTypeOther: '',
      cardLast4: '',
      paymentAmount: '',
      orderNumber: '',
      purpose: 'FSA / HSA Reimbursement',
      deliveryEmail: true,
      deliveryMail: false,
      deliveryFax: false,
      deliveryPickup: false,
      attachRx: true,
      attachWriteUp: true,
      attachReceipt: true,
      specialInstructions: '',
      clerkReceivedDate: '',
      clerkCompletedDate: '',
      clerkInitials: '',
      clerkStatus: 'Pending',
      clerkNotes: ''
    };

    this.render();
    this.bindEvents();
    this.onStateChange(this.state);
  }

  destroy() {
    // No continuous listeners or canvas to clean up
  }
}
