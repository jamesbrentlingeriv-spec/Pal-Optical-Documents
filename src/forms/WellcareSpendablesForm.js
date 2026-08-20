/* Pal Optical Forms Web App - Wellcare Spendable Card Authorization & Charge Form */

export class WellcareSpendablesForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;

    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      date: today,
      patientName: '',
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvv: '',
      // Insurance
      hasPrimaryInsurance: false,
      insuranceName: '',
      insuranceAllowance: '',
      isSelfPay: false,
      // Diagnosis
      diagMyopia: false,
      diagHyperopia: false,
      diagAstigmatism: false,
      diagPresbyopia: false,
      // Lens Type
      lensSingleVision: false,
      lensBifocal: false,
      lensTrifocal: false,
      lensProgressive: false,
      // Lens Material
      matCR39: false,
      matPolycarbonate: false,
      matHighIndex: false,
      matTrivex: false,
      // Frame
      frameSelected: false,
      // Coatings
      coatingAR: false,
      coatingScratch: false,
      coatingTransitions: false,
      coatingTint: false,
      coatingPolarized: false,
      coatingUV: false,
      // Financial
      totalFrameLens: '',
      insuranceCoverage: '',
      balanceCharged: '',
      ...state
    };

    this.onStateChange = onStateChange;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="form-card" id="wellcare-spendables-card">
        <!-- Form Header (Interactive Screen Version) -->
        <div class="form-header-block print:hidden">
          <h2>PAL OPTICAL</h2>
          <p>Wellcare Spendable Card Authorization &amp; Charge Form</p>
        </div>

        <form id="wellcare-spendables-form">
          <!-- ── INTERACTIVE FILL SECTION (hidden at print) ── -->
          <div class="form-section print:hidden" style="margin-bottom: 24px;">

            <!-- Patient Information -->
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Patient &amp; Card Information
            </div>
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="wc-patient-name">Patient Full Name</label>
                <input type="text" class="form-control" id="wc-patient-name" placeholder="Patient Full Name" value="${this.state.patientName || ''}">
              </div>
              <div class="form-group col-6">
                <label for="wc-date">Date</label>
                <input type="text" class="form-control" id="wc-date" placeholder="MM/DD/YYYY" value="${this.state.date || ''}">
              </div>
              <div class="form-group col-12">
                <label for="wc-card-number">Card Number</label>
                <input type="text" class="form-control" id="wc-card-number" placeholder="Spendable Card Number" value="${this.state.cardNumber || ''}">
              </div>
              <div class="form-group col-4">
                <label for="wc-exp-month">Exp. Month (MM)</label>
                <input type="text" class="form-control" id="wc-exp-month" placeholder="MM" maxlength="2" value="${this.state.expMonth || ''}">
              </div>
              <div class="form-group col-4">
                <label for="wc-exp-year">Exp. Year (YY)</label>
                <input type="text" class="form-control" id="wc-exp-year" placeholder="YY" maxlength="2" value="${this.state.expYear || ''}">
              </div>
              <div class="form-group col-4">
                <label for="wc-cvv">CVV</label>
                <input type="text" class="form-control" id="wc-cvv" placeholder="CVV" maxlength="4" value="${this.state.cvv || ''}">
              </div>
            </div>

            <!-- Insurance Summary -->
            <div class="form-section-title" style="margin-top: 18px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Insurance Summary
            </div>
            <div class="form-grid">
              <div class="form-group col-12" style="display:flex; gap:20px; flex-wrap:wrap; align-items:center;">
                <label class="checkbox-label">
                  <input type="checkbox" id="wc-has-primary-ins" ${this.state.hasPrimaryInsurance ? 'checked' : ''}> Primary Insurance Applied
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" id="wc-self-pay" ${this.state.isSelfPay ? 'checked' : ''}> No Primary Insurance / Self-Pay
                </label>
              </div>
              <div class="form-group col-6">
                <label for="wc-ins-name">Insurance Name</label>
                <input type="text" class="form-control" id="wc-ins-name" placeholder="Insurance Name" value="${this.state.insuranceName || ''}">
              </div>
              <div class="form-group col-6">
                <label for="wc-ins-allowance">Insurance Allowance / Covered Amount</label>
                <input type="text" class="form-control" id="wc-ins-allowance" placeholder="$0.00" value="${this.state.insuranceAllowance || ''}">
              </div>
            </div>

            <!-- Diagnosis -->
            <div class="form-section-title" style="margin-top: 18px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Diagnosis &amp; Order Options
            </div>
            <div class="form-group col-12">
              <label style="font-weight:700; margin-bottom:6px; display:block;">1. Primary Refractive Diagnosis (ICD-10)</label>
              <div style="display:flex; flex-wrap:wrap; gap:12px;">
                <label class="checkbox-label"><input type="checkbox" id="wc-diag-myopia" ${this.state.diagMyopia ? 'checked' : ''}> <strong>H52.13</strong> – Myopia</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-diag-hyperopia" ${this.state.diagHyperopia ? 'checked' : ''}> <strong>H52.03</strong> – Hyperopia</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-diag-astig" ${this.state.diagAstigmatism ? 'checked' : ''}> <strong>H52.223</strong> – Astigmatism</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-diag-presbyopia" ${this.state.diagPresbyopia ? 'checked' : ''}> <strong>H52.4</strong> – Presbyopia</label>
              </div>
            </div>
            <div class="form-group col-12" style="margin-top:12px;">
              <label style="font-weight:700; margin-bottom:6px; display:block;">2. Lens Type</label>
              <div style="display:flex; flex-wrap:wrap; gap:12px;">
                <label class="checkbox-label"><input type="checkbox" id="wc-lens-sv" ${this.state.lensSingleVision ? 'checked' : ''}> <strong>V2100–V2199</strong> – Single Vision</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-lens-bi" ${this.state.lensBifocal ? 'checked' : ''}> <strong>V2200–V2299</strong> – Bifocal / FT-28</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-lens-tri" ${this.state.lensTrifocal ? 'checked' : ''}> <strong>V2300–V2399</strong> – Trifocal</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-lens-prog" ${this.state.lensProgressive ? 'checked' : ''}> <strong>V2781</strong> – Progressive / No-Line</label>
              </div>
            </div>
            <div class="form-group col-12" style="margin-top:12px;">
              <label style="font-weight:700; margin-bottom:6px; display:block;">3. Lens Material</label>
              <div style="display:flex; flex-wrap:wrap; gap:12px;">
                <label class="checkbox-label"><input type="checkbox" id="wc-mat-cr39" ${this.state.matCR39 ? 'checked' : ''}> <strong>V2799</strong> – CR-39 Plastic</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-mat-poly" ${this.state.matPolycarbonate ? 'checked' : ''}> <strong>V2784</strong> – Polycarbonate</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-mat-hi" ${this.state.matHighIndex ? 'checked' : ''}> <strong>V2788</strong> – High-Index 1.67/1.74</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-mat-trivex" ${this.state.matTrivex ? 'checked' : ''}> <strong>V2784</strong> – Trivex</label>
              </div>
            </div>
            <div class="form-group col-12" style="margin-top:12px;">
              <label style="font-weight:700; margin-bottom:6px; display:block;">4. Frame</label>
              <div style="display:flex; flex-wrap:wrap; gap:12px;">
                <label class="checkbox-label"><input type="checkbox" id="wc-frame" ${this.state.frameSelected ? 'checked' : ''}> <strong>V2020</strong> – Eyeglass Frame Selection</label>
              </div>
            </div>
            <div class="form-group col-12" style="margin-top:12px;">
              <label style="font-weight:700; margin-bottom:6px; display:block;">5. Lens Coatings &amp; Extras</label>
              <div style="display:flex; flex-wrap:wrap; gap:12px;">
                <label class="checkbox-label"><input type="checkbox" id="wc-coat-ar" ${this.state.coatingAR ? 'checked' : ''}> <strong>V2750</strong> – Anti-Reflective (AR)</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-coat-scratch" ${this.state.coatingScratch ? 'checked' : ''}> <strong>V2760</strong> – Scratch-Resistant</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-coat-trans" ${this.state.coatingTransitions ? 'checked' : ''}> <strong>V2744</strong> – Transitions / Photochromic</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-coat-tint" ${this.state.coatingTint ? 'checked' : ''}> <strong>V2745</strong> – Solid / Gradient Tint</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-coat-polar" ${this.state.coatingPolarized ? 'checked' : ''}> <strong>V2755</strong> – Polarized</label>
                <label class="checkbox-label"><input type="checkbox" id="wc-coat-uv" ${this.state.coatingUV ? 'checked' : ''}> <strong>V2755</strong> – UV Protection</label>
              </div>
            </div>

            <!-- Financial Breakdown -->
            <div class="form-section-title" style="margin-top: 18px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Financial Breakdown
            </div>
            <div class="form-grid">
              <div class="form-group col-4">
                <label for="wc-total-frame-lens">Total Frame &amp; Lens Charge</label>
                <input type="text" class="form-control" id="wc-total-frame-lens" placeholder="$0.00" value="${this.state.totalFrameLens || ''}">
              </div>
              <div class="form-group col-4">
                <label for="wc-ins-coverage">Less Insurance Coverage / Discounts</label>
                <input type="text" class="form-control" id="wc-ins-coverage" placeholder="$0.00" value="${this.state.insuranceCoverage || ''}">
              </div>
              <div class="form-group col-4">
                <label for="wc-balance-charged">Balance Charged to Spendable Card</label>
                <input type="text" class="form-control" id="wc-balance-charged" placeholder="$0.00" value="${this.state.balanceCharged || ''}">
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════════════════════════════════
               PRINT REPLICA — always visible, updates live from inputs above
               ══════════════════════════════════════════════════════════════════ -->
          <div class="excuse-slip-print" style="border:1px solid #cbd5e1; border-radius:8px; padding:40px; background:#fff; font-family:'Arial',sans-serif; font-size:1rem; line-height:1.6; color:#000;">

            <!-- Header -->
            <div style="text-align:center; margin-bottom:20px; line-height:1.25;">
              <div style="font-size:1.6rem; font-weight:800; letter-spacing:0.5px;">PAL OPTICAL</div>
              <div style="font-size:0.95rem; font-weight:700; color:#475569; margin-top:3px;">1555 E New Circle Rd Suite 146 · Lexington, KY 40509</div>
            </div>
            <div style="text-align:center; margin-bottom:28px;">
              <span style="font-size:1.1rem; font-weight:800; border-bottom:2px solid #000; padding-bottom:2px; text-transform:uppercase; letter-spacing:0.5px;">Wellcare Spendable Card Authorization &amp; Charge Form</span>
            </div>

            <!-- Patient / Card Info -->
            <div style="font-weight:700; font-size:1rem; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">Patient &amp; Card Information</div>
            <div style="display:flex; gap:30px; flex-wrap:wrap; margin-bottom:10px;">
              <div>Patient Full Name: <span id="preview-patient-name" style="font-weight:800; border-bottom:1px solid #000; padding:0 8px; min-width:220px; display:inline-block;">${this.state.patientName || '____________________________'}</span></div>
              <div>Date: <span id="preview-date" style="border-bottom:1px solid #000; padding:0 8px; min-width:100px; display:inline-block; text-align:center;">${this.state.date || '__________'}</span></div>
            </div>
            <div style="margin-bottom:6px;">Card Number: <span id="preview-card-number" style="border-bottom:1px solid #000; padding:0 8px; min-width:260px; display:inline-block;">${this.state.cardNumber || '____________________________________'}</span></div>
            <div style="display:flex; gap:30px; flex-wrap:wrap; margin-bottom:16px;">
              <div>Expiration Date (MM/YY): <span id="preview-exp" style="border-bottom:1px solid #000; padding:0 8px; min-width:70px; display:inline-block; text-align:center;">${(this.state.expMonth || '____') + ' / ' + (this.state.expYear || '____')}</span></div>
              <div>CVV: <span id="preview-cvv" style="border-bottom:1px solid #000; padding:0 8px; min-width:60px; display:inline-block; text-align:center;">${this.state.cvv || '____'}</span></div>
            </div>

            <!-- Insurance Summary -->
            <div style="font-weight:700; font-size:1rem; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">Insurance Summary</div>
            <div style="margin-bottom:6px; display:flex; align-items:center; gap:10px;">
              <span id="check-primary-ins" style="display:inline-block; width:18px; height:18px; border:1.5px solid #000; text-align:center; line-height:16px; font-weight:800; font-size:1rem;">${this.state.hasPrimaryInsurance ? '✓' : ''}</span>
              <span><strong>Primary Insurance Applied</strong> (Insurance Name: <span id="preview-ins-name" style="border-bottom:1px solid #000; padding:0 8px; min-width:140px; display:inline-block;">${this.state.insuranceName || '__________________________'}</span>)</span>
            </div>
            <div style="margin-left:28px; margin-bottom:6px;">
              Insurance Allowance / Covered Amount: <span id="preview-ins-allowance" style="border-bottom:1px solid #000; padding:0 8px; min-width:100px; display:inline-block;">${this.state.insuranceAllowance ? '$' + this.state.insuranceAllowance : '$_________________'}</span>
            </div>
            <div style="margin-bottom:16px; display:flex; align-items:center; gap:10px;">
              <span id="check-self-pay" style="display:inline-block; width:18px; height:18px; border:1.5px solid #000; text-align:center; line-height:16px; font-weight:800; font-size:1rem;">${this.state.isSelfPay ? '✓' : ''}</span>
              <span><strong>No Primary Insurance / Self-Pay</strong></span>
            </div>

            <!-- Diagnosis & Order -->
            <div style="font-weight:700; font-size:1rem; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">Diagnosis &amp; Itemized Order Options</div>
            <div style="font-style:italic; margin-bottom:8px; font-size:0.9rem;">Select all applicable items:</div>

            <!-- 1. Diagnosis -->
            <div style="font-weight:700; margin-bottom:6px;">1. Primary Refractive Diagnosis (ICD-10)</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin-bottom:12px; padding-left:8px;">
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-myopia" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.diagMyopia ? '✓' : ''}</span><span><strong>H52.13</strong> – Myopia (Nearsightedness)</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-hyperopia" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.diagHyperopia ? '✓' : ''}</span><span><strong>H52.03</strong> – Hyperopia (Farsightedness)</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-astig" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.diagAstigmatism ? '✓' : ''}</span><span><strong>H52.223</strong> – Regular Astigmatism</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-presbyopia" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.diagPresbyopia ? '✓' : ''}</span><span><strong>H52.4</strong> – Presbyopia</span></div>
            </div>

            <!-- 2. Lens Type -->
            <div style="font-weight:700; margin-bottom:6px;">2. Lens Type</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin-bottom:12px; padding-left:8px;">
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-sv" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.lensSingleVision ? '✓' : ''}</span><span><strong>V2100–V2199</strong> – Single Vision <em>(H52.13 / H52.03)</em></span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-bi" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.lensBifocal ? '✓' : ''}</span><span><strong>V2200–V2299</strong> – Bifocal / FT-28 <em>(H52.4)</em></span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-tri" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.lensTrifocal ? '✓' : ''}</span><span><strong>V2300–V2399</strong> – Trifocal <em>(H52.4)</em></span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-prog" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.lensProgressive ? '✓' : ''}</span><span><strong>V2781</strong> – Progressive / No-Line <em>(H52.4)</em></span></div>
            </div>

            <!-- 3. Lens Material -->
            <div style="font-weight:700; margin-bottom:6px;">3. Lens Material</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin-bottom:12px; padding-left:8px;">
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-cr39" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.matCR39 ? '✓' : ''}</span><span><strong>V2799</strong> – Standard CR-39 Plastic</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-poly" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.matPolycarbonate ? '✓' : ''}</span><span><strong>V2784</strong> – Polycarbonate (Impact Resistant)</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-hi" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.matHighIndex ? '✓' : ''}</span><span><strong>V2788</strong> – High-Index 1.67 / 1.74</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-trivex" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.matTrivex ? '✓' : ''}</span><span><strong>V2784</strong> – Trivex</span></div>
            </div>

            <!-- 4. Frame -->
            <div style="font-weight:700; margin-bottom:6px;">4. Frame</div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-left:8px;">
              <span id="check-frame" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.frameSelected ? '✓' : ''}</span>
              <span><strong>V2020</strong> – Frame / Eyeglass Frame Selection</span>
            </div>

            <!-- 5. Coatings -->
            <div style="font-weight:700; margin-bottom:6px;">5. Lens Coatings &amp; Extras</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin-bottom:20px; padding-left:8px;">
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-ar" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.coatingAR ? '✓' : ''}</span><span><strong>V2750</strong> – Anti-Reflective (AR) Coating</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-scratch" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.coatingScratch ? '✓' : ''}</span><span><strong>V2760</strong> – Scratch-Resistant Coating</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-trans" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.coatingTransitions ? '✓' : ''}</span><span><strong>V2744</strong> – Transitions / Photochromic</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-tint" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.coatingTint ? '✓' : ''}</span><span><strong>V2745</strong> – Solid / Gradient Tint</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-polar" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.coatingPolarized ? '✓' : ''}</span><span><strong>V2755</strong> – Polarized</span></div>
              <div style="display:flex; align-items:center; gap:8px;"><span id="check-uv" style="display:inline-block; width:16px; height:16px; border:1.5px solid #000; text-align:center; line-height:14px; font-weight:800;">${this.state.coatingUV ? '✓' : ''}</span><span><strong>V2755</strong> – UV Protection</span></div>
            </div>

            <!-- Financial Breakdown Table -->
            <div style="font-weight:700; font-size:1rem; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">Financial Breakdown</div>
            <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:0.95rem;">
              <thead>
                <tr style="background:#f1f5f9;">
                  <th style="border:1px solid #cbd5e1; padding:8px 12px; text-align:left; font-weight:700;">Item Description</th>
                  <th style="border:1px solid #cbd5e1; padding:8px 12px; text-align:right; font-weight:700; width:180px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border:1px solid #cbd5e1; padding:8px 12px; font-weight:700;">Total Frame &amp; Lens Charge</td>
                  <td style="border:1px solid #cbd5e1; padding:8px 12px; text-align:right;" id="preview-total-frame-lens">${this.state.totalFrameLens ? '$' + this.state.totalFrameLens : '$_________________'}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #cbd5e1; padding:8px 12px; font-weight:700;">Less Insurance Coverage / Discounts</td>
                  <td style="border:1px solid #cbd5e1; padding:8px 12px; text-align:right;" id="preview-ins-coverage">${this.state.insuranceCoverage ? '- $' + this.state.insuranceCoverage : '- $_________________'}</td>
                </tr>
                <tr style="background:#f8fafc;">
                  <td style="border:1px solid #cbd5e1; padding:8px 12px; font-weight:800;">Total Remaining Balance Charged to Spendable Card</td>
                  <td style="border:1px solid #cbd5e1; padding:8px 12px; text-align:right; font-weight:800;" id="preview-balance-charged">${this.state.balanceCharged ? '$' + this.state.balanceCharged : '$_________________'}</td>
                </tr>
              </tbody>
            </table>

            <!-- Authorization & Signature -->
            <div style="font-weight:700; font-size:1rem; margin-bottom:8px; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">Authorization &amp; Signature</div>
            <p style="margin-bottom:20px; font-size:0.95rem; line-height:1.7;">
              I authorize Pal Optical to charge the Wellcare Spendable Card listed above for the total balance indicated. I understand that any remaining balance not covered by insurance or the Spendable Card is my financial responsibility.
            </p>
            <div style="display:flex; gap:40px; flex-wrap:wrap; margin-top:30px;">
              <div style="flex:1; min-width:250px;">
                <div style="border-top:1.5px solid #000; margin-top:50px; padding-top:5px; font-size:0.9rem; font-weight:700; text-align:center;">Patient Signature</div>
              </div>
              <div style="flex:0 0 160px;">
                <div style="border-top:1.5px solid #000; margin-top:50px; padding-top:5px; font-size:0.9rem; font-weight:700; text-align:center;">Date</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }

  bindEvents() {
    const form = this.container.querySelector('#wellcare-spendables-form');
    if (!form) return;
    form.addEventListener('input', () => this.updateState());
    form.addEventListener('change', () => this.updateState());
  }

  updateState() {
    const form = this.container.querySelector('#wellcare-spendables-form');
    if (!form) return;

    const g = (id) => form.querySelector(`#${id}`);

    const patientName = g('wc-patient-name').value;
    const date = g('wc-date').value;
    const cardNumber = g('wc-card-number').value;
    const expMonth = g('wc-exp-month').value;
    const expYear = g('wc-exp-year').value;
    const cvv = g('wc-cvv').value;
    const hasPrimaryInsurance = g('wc-has-primary-ins').checked;
    const isSelfPay = g('wc-self-pay').checked;
    const insuranceName = g('wc-ins-name').value;
    const insuranceAllowance = g('wc-ins-allowance').value;

    const diagMyopia = g('wc-diag-myopia').checked;
    const diagHyperopia = g('wc-diag-hyperopia').checked;
    const diagAstigmatism = g('wc-diag-astig').checked;
    const diagPresbyopia = g('wc-diag-presbyopia').checked;

    const lensSingleVision = g('wc-lens-sv').checked;
    const lensBifocal = g('wc-lens-bi').checked;
    const lensTrifocal = g('wc-lens-tri').checked;
    const lensProgressive = g('wc-lens-prog').checked;

    const matCR39 = g('wc-mat-cr39').checked;
    const matPolycarbonate = g('wc-mat-poly').checked;
    const matHighIndex = g('wc-mat-hi').checked;
    const matTrivex = g('wc-mat-trivex').checked;

    const frameSelected = g('wc-frame').checked;

    const coatingAR = g('wc-coat-ar').checked;
    const coatingScratch = g('wc-coat-scratch').checked;
    const coatingTransitions = g('wc-coat-trans').checked;
    const coatingTint = g('wc-coat-tint').checked;
    const coatingPolarized = g('wc-coat-polar').checked;
    const coatingUV = g('wc-coat-uv').checked;

    const totalFrameLens = g('wc-total-frame-lens').value;
    const insuranceCoverage = g('wc-ins-coverage').value;
    const balanceCharged = g('wc-balance-charged').value;

    this.state = {
      ...this.state,
      patientName, date, cardNumber, expMonth, expYear, cvv,
      hasPrimaryInsurance, isSelfPay, insuranceName, insuranceAllowance,
      diagMyopia, diagHyperopia, diagAstigmatism, diagPresbyopia,
      lensSingleVision, lensBifocal, lensTrifocal, lensProgressive,
      matCR39, matPolycarbonate, matHighIndex, matTrivex,
      frameSelected,
      coatingAR, coatingScratch, coatingTransitions, coatingTint, coatingPolarized, coatingUV,
      totalFrameLens, insuranceCoverage, balanceCharged
    };

    // Live update preview elements
    const p = (id) => this.container.querySelector(`#${id}`);

    p('preview-patient-name').textContent = patientName || '____________________________';
    p('preview-date').textContent = date || '__________';
    p('preview-card-number').textContent = cardNumber || '____________________________________';
    p('preview-exp').textContent = (expMonth || '____') + ' / ' + (expYear || '____');
    p('preview-cvv').textContent = cvv || '____';

    p('check-primary-ins').textContent = hasPrimaryInsurance ? '✓' : '';
    p('check-self-pay').textContent = isSelfPay ? '✓' : '';
    p('preview-ins-name').textContent = insuranceName || '__________________________';
    p('preview-ins-allowance').textContent = insuranceAllowance ? '$' + insuranceAllowance : '$_________________';

    p('check-myopia').textContent = diagMyopia ? '✓' : '';
    p('check-hyperopia').textContent = diagHyperopia ? '✓' : '';
    p('check-astig').textContent = diagAstigmatism ? '✓' : '';
    p('check-presbyopia').textContent = diagPresbyopia ? '✓' : '';

    p('check-sv').textContent = lensSingleVision ? '✓' : '';
    p('check-bi').textContent = lensBifocal ? '✓' : '';
    p('check-tri').textContent = lensTrifocal ? '✓' : '';
    p('check-prog').textContent = lensProgressive ? '✓' : '';

    p('check-cr39').textContent = matCR39 ? '✓' : '';
    p('check-poly').textContent = matPolycarbonate ? '✓' : '';
    p('check-hi').textContent = matHighIndex ? '✓' : '';
    p('check-trivex').textContent = matTrivex ? '✓' : '';

    p('check-frame').textContent = frameSelected ? '✓' : '';

    p('check-ar').textContent = coatingAR ? '✓' : '';
    p('check-scratch').textContent = coatingScratch ? '✓' : '';
    p('check-trans').textContent = coatingTransitions ? '✓' : '';
    p('check-tint').textContent = coatingTint ? '✓' : '';
    p('check-polar').textContent = coatingPolarized ? '✓' : '';
    p('check-uv').textContent = coatingUV ? '✓' : '';

    p('preview-total-frame-lens').textContent = totalFrameLens ? '$' + totalFrameLens : '$_________________';
    p('preview-ins-coverage').textContent = insuranceCoverage ? '- $' + insuranceCoverage : '- $_________________';
    p('preview-balance-charged').textContent = balanceCharged ? '$' + balanceCharged : '$_________________';

    this.onStateChange(this.state);
  }

  reset() {
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      date: today,
      patientName: '', cardNumber: '', expMonth: '', expYear: '', cvv: '',
      hasPrimaryInsurance: false, insuranceName: '', insuranceAllowance: '', isSelfPay: false,
      diagMyopia: false, diagHyperopia: false, diagAstigmatism: false, diagPresbyopia: false,
      lensSingleVision: false, lensBifocal: false, lensTrifocal: false, lensProgressive: false,
      matCR39: false, matPolycarbonate: false, matHighIndex: false, matTrivex: false,
      frameSelected: false,
      coatingAR: false, coatingScratch: false, coatingTransitions: false,
      coatingTint: false, coatingPolarized: false, coatingUV: false,
      totalFrameLens: '', insuranceCoverage: '', balanceCharged: ''
    };
    this.render();
    this.bindEvents();
    this.onStateChange(this.state);
  }
}
