/* Pal Optical Forms Web App - Pal Optical Itemized Receipt ("Statement of Charges and Payments") */

export class ItemizedReceiptForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    this.onStateChange = onStateChange;

    const today = new Date().toLocaleDateString('en-US');

    // Default state based on uploaded Pal Optical PDF format
    const defaultState = {
      practiceName: 'Pal Optical',
      practiceAddress1: '1555 E. New Circle Road',
      practiceAddress2: 'Suite 146',
      practiceCityStateZip: 'Lexington, KY 405091044',
      practicePhone: '859-266-3003',

      feeSlipNumber: '56205',
      datePrinted: today,
      provider: 'Pal Optical',
      officePhone: '859-266-3003',
      npiNumber: '1609930791',
      patientId: '36817',
      patientName: 'SHAUN GATEWOOD',
      chartNumber: '',
      homePhone: '(859) 618-0211',
      nextAppt: '',

      recipientName: 'SHAUN GATEWOOD',
      recipientAddress1: '166 GARNETTE DR',
      recipientCityStateZip: 'NICHOLASVILLE, KY 40356',

      items: [
        {
          id: 'item-1',
          dateOfService: '03/19/2012',
          ordNumber: '0',
          sku: '',
          qty: '1',
          description: 'PHAT FARM FRAME',
          cpt: '',
          diagnosis: '',
          amount: '26.00',
          patientBalance: ''
        },
        {
          id: 'item-2',
          dateOfService: '03/16/2012',
          ordNumber: '0',
          sku: '',
          qty: '1',
          description: 'SV POLYCARBONATE LENSES',
          cpt: '',
          diagnosis: '',
          amount: '85.00',
          patientBalance: ''
        },
        {
          id: 'item-3',
          dateOfService: '03/16/2012',
          ordNumber: '',
          sku: '',
          qty: '',
          description: '20% Discount',
          cpt: '',
          diagnosis: '',
          amount: '-17.00',
          patientBalance: ''
        },
        {
          id: 'item-4',
          dateOfService: '03/19/2012',
          ordNumber: '0',
          sku: '',
          qty: '1',
          description: 'OVER POWER',
          cpt: '',
          diagnosis: '',
          amount: '11.87',
          patientBalance: ''
        }
      ],

      salesTax: '4.08',
      otherOpenItems: '0.00',

      payments: [
        {
          id: 'pmt-1',
          date: '03/16/2012',
          description: 'Payment Applied by Cash at Pal Optical',
          amount: '109.95'
        }
      ],

      amountEnclosed: '',
      checkNumber: ''
    };

    // Merge supplied state with defaults
    this.state = {
      ...defaultState,
      ...state,
      items: state.items && state.items.length > 0 ? state.items : defaultState.items,
      payments: state.payments && state.payments.length > 0 ? state.payments : defaultState.payments
    };

    this.render();
    this.bindEvents();
    this.calculateTotals(false);
  }

  escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formatAmountDisplay(amount, forceParentheses = false) {
    const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[()$,]/g, '').trim()) || 0;
    if (forceParentheses || num < 0) {
      return `(${Math.abs(num).toFixed(2)})`;
    }
    return num.toFixed(2);
  }

  render() {
    this.container.innerHTML = `
      <div class="itemized-receipt-wrapper">
        <!-- Interactive Controls Bar (Hidden during Print) -->
        <div class="itemized-receipt-toolbar print:hidden">
          <div class="toolbar-left">
            <span class="toolbar-badge">Pal Optical Receipt Generator</span>
            <span class="toolbar-hint">Edit values directly in the document below. Auto-calculates totals and matches the exact print layout.</span>
          </div>
          <div class="toolbar-actions">
            <button type="button" class="btn btn-secondary btn-sm" id="ir-btn-sample">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Autofill Sample (Shaun Gatewood)
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="ir-btn-add-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              + Add Line
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="ir-btn-add-payment">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              + Add Payment
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="ir-btn-clear">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Clear
            </button>
          </div>
        </div>

        <!-- Exact Document Replica Sheet -->
        <div class="itemized-receipt-container" id="itemized-receipt-sheet">
          
          <!-- TOP HEADER SECTION -->
          <div class="ir-header-grid">
            <!-- Pal Optical Info (Top Left) -->
            <div class="ir-practice-block">
              <div class="ir-practice-name">${this.escapeHtml(this.state.practiceName)}</div>
              <div class="ir-practice-line">${this.escapeHtml(this.state.practiceAddress1)}</div>
              <div class="ir-practice-line">${this.escapeHtml(this.state.practiceAddress2)}</div>
              <div class="ir-practice-line">${this.escapeHtml(this.state.practiceCityStateZip)}</div>
              <div class="ir-practice-line">${this.escapeHtml(this.state.practicePhone)}</div>
            </div>

            <!-- Title & Metadata (Top Right) -->
            <div class="ir-title-meta-block">
              <h1 class="ir-document-title">Statement of Charges and Payments</h1>

              <div class="ir-meta-table">
                <div class="ir-meta-row">
                  <span class="ir-meta-label">Fee Slip Number:</span>
                  <input type="text" class="ir-input ir-input-meta" data-field="feeSlipNumber" value="${this.escapeHtml(this.state.feeSlipNumber)}">
                </div>
                <div class="ir-meta-row">
                  <span class="ir-meta-label">Date Printed:</span>
                  <input type="text" class="ir-input ir-input-meta" data-field="datePrinted" value="${this.escapeHtml(this.state.datePrinted)}">
                </div>
                <div class="ir-meta-row">
                  <span class="ir-meta-label">Provider:</span>
                  <input type="text" class="ir-input ir-input-meta uppercase" data-field="provider" value="${this.escapeHtml(this.state.provider)}">
                </div>
                <div class="ir-meta-row">
                  <span class="ir-meta-label">Office Phone:</span>
                  <input type="text" class="ir-input ir-input-meta" data-field="officePhone" value="${this.escapeHtml(this.state.officePhone)}">
                </div>
                <div class="ir-meta-row ir-meta-spacer">
                  <span class="ir-meta-label">NPI Number:</span>
                  <input type="text" class="ir-input ir-input-meta" data-field="npiNumber" value="${this.escapeHtml(this.state.npiNumber)}">
                </div>
                <div class="ir-meta-row ir-meta-spacer">
                  <span class="ir-meta-label">Patient:</span>
                  <div class="ir-meta-patient-split">
                    <input type="text" class="ir-input ir-input-patient-id" data-field="patientId" placeholder="36817" value="${this.escapeHtml(this.state.patientId)}">
                    <input type="text" class="ir-input ir-input-patient-name uppercase" data-field="patientName" placeholder="Patient Name" value="${this.escapeHtml(this.state.patientName)}">
                  </div>
                </div>
                <div class="ir-meta-row">
                  <span class="ir-meta-label">Chart #:</span>
                  <input type="text" class="ir-input ir-input-meta" data-field="chartNumber" value="${this.escapeHtml(this.state.chartNumber)}">
                </div>
                <div class="ir-meta-row">
                  <span class="ir-meta-label">Home Phone:</span>
                  <input type="text" class="ir-input ir-input-meta" data-field="homePhone" value="${this.escapeHtml(this.state.homePhone)}">
                </div>
                <div class="ir-meta-row">
                  <span class="ir-meta-label">Next Appt:</span>
                  <input type="text" class="ir-input ir-input-meta" data-field="nextAppt" value="${this.escapeHtml(this.state.nextAppt)}">
                </div>
              </div>
            </div>
          </div>

          <!-- RECIPIENT ("To:") SECTION -->
          <div class="ir-recipient-section">
            <div class="ir-recipient-label">To:</div>
            <div class="ir-recipient-content">
              <input type="text" class="ir-input ir-input-recipient uppercase" data-field="recipientName" placeholder="NAME" value="${this.escapeHtml(this.state.recipientName)}">
              <input type="text" class="ir-input ir-input-recipient uppercase" data-field="recipientAddress1" placeholder="STREET ADDRESS" value="${this.escapeHtml(this.state.recipientAddress1)}">
              <input type="text" class="ir-input ir-input-recipient uppercase" data-field="recipientCityStateZip" placeholder="CITY, STATE ZIP" value="${this.escapeHtml(this.state.recipientCityStateZip)}">
            </div>
          </div>

          <!-- TRANSACTIONS / CHARGES TABLE -->
          <div class="ir-table-container">
            <table class="ir-table" id="ir-items-table">
              <thead>
                <tr class="ir-table-header-row">
                  <th class="col-dos">Date of<br>Service</th>
                  <th class="col-ord">Ord #</th>
                  <th class="col-sku">SKU #</th>
                  <th class="col-qty">Qty</th>
                  <th class="col-desc">Description</th>
                  <th class="col-cpt">CPT</th>
                  <th class="col-diag">Diagnosis</th>
                  <th class="col-amt">Amount</th>
                  <th class="col-patbal">Patient<br>Balance</th>
                  <th class="col-action print:hidden"></th>
                </tr>
              </thead>
              <tbody id="ir-items-body">
                ${this.renderItemRows()}
              </tbody>
            </table>
            <!-- Action to add line items directly on the table -->
            <div class="ir-table-actions print:hidden">
              <button type="button" class="ir-add-line-btn" id="ir-btn-add-line-table">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                + Add Line
              </button>
            </div>
          </div>

          <!-- CHARGES SUB-TOTAL & SALES TAX BLOCK -->
          <div class="ir-financials-block">
            <div class="ir-financial-row">
              <span class="ir-fin-label">Sales Tax</span>
              <span class="ir-fin-val-wrap">
                <input type="text" class="ir-input ir-input-fin text-right" id="ir-input-tax" data-field="salesTax" value="${this.escapeHtml(this.state.salesTax)}">
              </span>
            </div>
            <div class="ir-financial-row ir-fin-total-charges">
              <span class="ir-fin-label">Total Current Charges</span>
              <span class="ir-fin-val-wrap ir-line-above">
                <span class="ir-calculated-val" id="ir-disp-total-charges">0.00</span>
              </span>
            </div>
          </div>

          <!-- PAYMENTS SECTION -->
          <div class="ir-payments-block">
            <div class="ir-payments-list" id="ir-payments-body">
              ${this.renderPaymentRows()}
            </div>
            <div class="ir-table-actions print:hidden" style="margin-top: 4px;">
              <button type="button" class="ir-add-line-btn" id="ir-btn-add-pmt-table">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                + Add Payment Line
              </button>
            </div>
            <div class="ir-financial-row ir-fin-total-payments">
              <span class="ir-fin-label">Total Payments</span>
              <span class="ir-fin-val-wrap ir-line-above">
                <span class="ir-calculated-val" id="ir-disp-total-payments">(0.00)</span>
              </span>
            </div>
          </div>

          <!-- BALANCES SECTION -->
          <div class="ir-balances-block">
            <div class="ir-financial-row">
              <span class="ir-fin-label">Balance Due</span>
              <span class="ir-fin-val-wrap">
                <span class="ir-calculated-val" id="ir-disp-balance-due">0.00</span>
              </span>
            </div>
            <div class="ir-financial-row">
              <span class="ir-fin-label">Other Open Items</span>
              <span class="ir-fin-val-wrap">
                <input type="text" class="ir-input ir-input-fin text-right" id="ir-input-open-items" data-field="otherOpenItems" value="${this.escapeHtml(this.state.otherOpenItems)}">
              </span>
            </div>
            <div class="ir-financial-row ir-fin-final-banner">
              <span class="ir-fin-label" id="ir-status-banner-text">NO PAYMENT NECESSARY</span>
              <span class="ir-fin-val-wrap ir-double-underline">
                <span class="ir-calculated-val" id="ir-disp-final-balance">0.00</span>
              </span>
            </div>
          </div>

          <!-- SUMMARY FOOTNOTE BLOCK -->
          <div class="ir-summary-notes">
            <div class="ir-summary-line">
              <span class="ir-sum-label">Total Charges (Pat. Total + Ins. Total)=</span>
              <span class="ir-sum-val" id="ir-disp-sum-total-charges">0.00</span>
            </div>
            <div class="ir-summary-line">
              <span class="ir-sum-label">Total of Discounts & Packages</span>
              <span class="ir-sum-val" id="ir-disp-sum-discounts">(0.00)</span>
            </div>
          </div>

          <!-- REMITTANCE NOTICE PROMPT -->
          <div class="ir-remittance-notice">
            If due, please detach and remit within 14 days. Thanks for choosing Pal Optical.
          </div>

          <!-- DETACHABLE REMITTANCE COUPON BOX (3x3 Table) -->
          <div class="ir-coupon-box">
            <table class="ir-coupon-table">
              <tbody>
                <tr>
                  <td class="coupon-cell">
                    <span class="coupon-label">Total Due</span>
                    <span class="coupon-value text-right" id="ir-coupon-total-due">0.00</span>
                  </td>
                  <td class="coupon-cell">
                    <span class="coupon-label">Patient #</span>
                    <span class="coupon-value" id="ir-coupon-patient-id">${this.escapeHtml(this.state.patientId)}</span>
                  </td>
                  <td class="coupon-cell">
                    <span class="coupon-label">Statement Date</span>
                    <span class="coupon-value" id="ir-coupon-date">${this.escapeHtml(this.state.datePrinted)}</span>
                  </td>
                </tr>
                <tr>
                  <td class="coupon-cell">
                    <span class="coupon-label">Amount Enclosed</span>
                    <input type="text" class="ir-coupon-input" data-field="amountEnclosed" value="${this.escapeHtml(this.state.amountEnclosed)}">
                  </td>
                  <td class="coupon-cell">
                    <span class="coupon-label">Check #</span>
                    <input type="text" class="ir-coupon-input" data-field="checkNumber" value="${this.escapeHtml(this.state.checkNumber)}">
                  </td>
                  <td class="coupon-cell">
                    <span class="coupon-label">Patient</span>
                    <span class="coupon-value uppercase" id="ir-coupon-patient-name">${this.escapeHtml(this.state.patientName)}</span>
                  </td>
                </tr>
                <tr>
                  <td class="coupon-cell coupon-cell-empty"></td>
                  <td class="coupon-cell">
                    <span class="coupon-label">Chart #</span>
                    <span class="coupon-value" id="ir-coupon-chart">${this.escapeHtml(this.state.chartNumber)}</span>
                  </td>
                  <td class="coupon-cell coupon-cell-empty"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- BOTTOM TWO-COLUMN ADDRESSES (Window Envelope Standard) -->
          <div class="ir-envelope-addresses">
            <div class="ir-env-left">
              <div class="ir-env-line bold">Pal Optical</div>
              <div class="ir-env-line">1555 E. New Circle Rd</div>
              <div class="ir-env-line">Suite 146</div>
              <div class="ir-env-line">Lexington, KY 40509-1043</div>
            </div>
            <div class="ir-env-right">
              <div class="ir-env-line uppercase bold" id="ir-env-pat-name">${this.escapeHtml(this.state.recipientName || this.state.patientName)}</div>
              <div class="ir-env-line uppercase" id="ir-env-pat-addr1">${this.escapeHtml(this.state.recipientAddress1)}</div>
              <div class="ir-env-line uppercase" id="ir-env-pat-addr2">${this.escapeHtml(this.state.recipientCityStateZip)}</div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  renderItemRows() {
    return this.state.items
      .map((item, idx) => {
        const isDiscount = String(item.description).toLowerCase().includes('discount') ||
          (typeof item.amount === 'number' && item.amount < 0) ||
          String(item.amount).includes('-');

        const rawAmount = String(item.amount).replace(/[()$,]/g, '').trim();
        const amtDisplay = isDiscount && rawAmount ? `(${Math.abs(parseFloat(rawAmount) || 0).toFixed(2)})` : rawAmount;

        return `
          <tr class="ir-table-row" data-id="${item.id}" data-index="${idx}">
            <td class="col-dos"><input type="text" class="ir-table-input ir-item-field" data-item-field="dateOfService" value="${this.escapeHtml(item.dateOfService)}"></td>
            <td class="col-ord"><input type="text" class="ir-table-input ir-item-field text-center" data-item-field="ordNumber" value="${this.escapeHtml(item.ordNumber)}"></td>
            <td class="col-sku"><input type="text" class="ir-table-input ir-item-field text-center" data-item-field="sku" value="${this.escapeHtml(item.sku)}"></td>
            <td class="col-qty"><input type="text" class="ir-table-input ir-item-field text-center" data-item-field="qty" value="${this.escapeHtml(item.qty)}"></td>
            <td class="col-desc"><input type="text" class="ir-table-input ir-item-field uppercase" data-item-field="description" value="${this.escapeHtml(item.description)}"></td>
            <td class="col-cpt"><input type="text" class="ir-table-input ir-item-field text-center" data-item-field="cpt" value="${this.escapeHtml(item.cpt)}"></td>
            <td class="col-diag"><input type="text" class="ir-table-input ir-item-field text-center" data-item-field="diagnosis" value="${this.escapeHtml(item.diagnosis)}"></td>
            <td class="col-amt"><input type="text" class="ir-table-input ir-item-field text-right" data-item-field="amount" value="${this.escapeHtml(amtDisplay)}"></td>
            <td class="col-patbal"><input type="text" class="ir-table-input ir-item-field text-right" data-item-field="patientBalance" value="${this.escapeHtml(item.patientBalance)}"></td>
            <td class="col-action print:hidden">
              <button type="button" class="ir-row-delete-btn" title="Remove Row" data-action="delete-item" data-index="${idx}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  renderPaymentRows() {
    return this.state.payments
      .map((pmt, idx) => {
        const rawAmount = String(pmt.amount).replace(/[()$,]/g, '').trim();
        const amtNum = parseFloat(rawAmount) || 0;
        const amtDisplay = `(${amtNum.toFixed(2)})`;

        return `
          <div class="ir-payment-row" data-id="${pmt.id}" data-index="${idx}">
            <div class="ir-pmt-date">
              <input type="text" class="ir-input ir-pmt-field" data-pmt-field="date" value="${this.escapeHtml(pmt.date)}">
            </div>
            <div class="ir-pmt-desc">
              <input type="text" class="ir-input ir-pmt-field" data-pmt-field="description" value="${this.escapeHtml(pmt.description)}">
            </div>
            <div class="ir-pmt-amt">
              <input type="text" class="ir-input ir-pmt-field text-right" data-pmt-field="amount" value="${this.escapeHtml(amtDisplay)}">
            </div>
            <div class="ir-pmt-action print:hidden">
              <button type="button" class="ir-row-delete-btn" title="Remove Payment" data-action="delete-payment" data-index="${idx}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  bindEvents() {
    // Toolbar buttons
    const btnSample = this.container.querySelector('#ir-btn-sample');
    if (btnSample) {
      btnSample.addEventListener('click', () => this.autofillSample());
    }

    const btnAddItem = this.container.querySelector('#ir-btn-add-item');
    if (btnAddItem) {
      btnAddItem.addEventListener('click', () => this.addItemRow(true));
    }

    const btnAddPayment = this.container.querySelector('#ir-btn-add-payment');
    if (btnAddPayment) {
      btnAddPayment.addEventListener('click', () => this.addPaymentRow(true));
    }

    const btnAddLineTable = this.container.querySelector('#ir-btn-add-line-table');
    if (btnAddLineTable) {
      btnAddLineTable.addEventListener('click', () => this.addItemRow(true));
    }

    const btnAddPmtTable = this.container.querySelector('#ir-btn-add-pmt-table');
    if (btnAddPmtTable) {
      btnAddPmtTable.addEventListener('click', () => this.addPaymentRow(true));
    }

    const btnClear = this.container.querySelector('#ir-btn-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => this.reset());
    }

    // Keyboard support: Pressing Enter on row inputs to add next line
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const target = e.target;
        if (!target) return;
        if (target.hasAttribute('data-item-field')) {
          const row = target.closest('tr');
          const isLastRow = row && !row.nextElementSibling;
          if (isLastRow) {
            e.preventDefault();
            this.addItemRow(true);
          }
        }
      }
    });

    // Direct input bindings (delegated)
    this.container.addEventListener('input', (e) => {
      const target = e.target;
      if (!target) return;

      const field = target.getAttribute('data-field');
      if (field && field in this.state) {
        // Direct state field
        this.state[field] = target.value;

        // Synchronize twin fields (e.g., patient name / ID to remittance and envelope)
        if (field === 'patientName') {
          const couponPat = this.container.querySelector('#ir-coupon-patient-name');
          if (couponPat) couponPat.textContent = target.value;
          const envPat = this.container.querySelector('#ir-env-pat-name');
          if (envPat && !this.state.recipientName) envPat.textContent = target.value;
        } else if (field === 'patientId') {
          const couponPatId = this.container.querySelector('#ir-coupon-patient-id');
          if (couponPatId) couponPatId.textContent = target.value;
        } else if (field === 'datePrinted') {
          const couponDate = this.container.querySelector('#ir-coupon-date');
          if (couponDate) couponDate.textContent = target.value;
        } else if (field === 'chartNumber') {
          const couponChart = this.container.querySelector('#ir-coupon-chart');
          if (couponChart) couponChart.textContent = target.value;
        } else if (field === 'recipientName') {
          const envPat = this.container.querySelector('#ir-env-pat-name');
          if (envPat) envPat.textContent = target.value || this.state.patientName;
        } else if (field === 'recipientAddress1') {
          const envAddr1 = this.container.querySelector('#ir-env-pat-addr1');
          if (envAddr1) envAddr1.textContent = target.value;
        } else if (field === 'recipientCityStateZip') {
          const envAddr2 = this.container.querySelector('#ir-env-pat-addr2');
          if (envAddr2) envAddr2.textContent = target.value;
        }

        this.calculateTotals(true);
        return;
      }

      // Check for item fields
      const itemField = target.getAttribute('data-item-field');
      if (itemField) {
        const row = target.closest('tr');
        const idx = row ? parseInt(row.getAttribute('data-index') || '-1', 10) : -1;
        if (idx >= 0 && this.state.items[idx]) {
          this.state.items[idx][itemField] = target.value;
          this.calculateTotals(true);
        }
        return;
      }

      // Check for payment fields
      const pmtField = target.getAttribute('data-pmt-field');
      if (pmtField) {
        const row = target.closest('.ir-payment-row');
        const idx = row ? parseInt(row.getAttribute('data-index') || '-1', 10) : -1;
        if (idx >= 0 && this.state.payments[idx]) {
          this.state.payments[idx][pmtField] = target.value;
          this.calculateTotals(true);
        }
      }
    });

    // Click actions (delete rows)
    this.container.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const action = target.getAttribute('data-action');
      if (action === 'delete-item') {
        const idx = parseInt(target.getAttribute('data-index') || '-1', 10);
        if (idx >= 0 && this.state.items.length > 1) {
          this.state.items.splice(idx, 1);
          this.refreshItemsTable();
          this.calculateTotals(true);
        }
      } else if (action === 'delete-payment') {
        const idx = parseInt(target.getAttribute('data-index') || '-1', 10);
        if (idx >= 0) {
          this.state.payments.splice(idx, 1);
          this.refreshPaymentsList();
          this.calculateTotals(true);
        }
      }
    });
  }

  refreshItemsTable() {
    const tbody = this.container.querySelector('#ir-items-body');
    if (tbody) {
      tbody.innerHTML = this.renderItemRows();
    }
  }

  refreshPaymentsList() {
    const pmtBody = this.container.querySelector('#ir-payments-body');
    if (pmtBody) {
      pmtBody.innerHTML = this.renderPaymentRows();
    }
  }

  addItemRow(focus = true) {
    const today = new Date().toLocaleDateString('en-US');
    const newId = 'item-' + Date.now();
    this.state.items.push({
      id: newId,
      dateOfService: today,
      ordNumber: '0',
      sku: '',
      qty: '1',
      description: '',
      cpt: '',
      diagnosis: '',
      amount: '0.00',
      patientBalance: ''
    });
    this.refreshItemsTable();
    this.calculateTotals(true);

    if (focus) {
      setTimeout(() => {
        const lastRow = this.container.querySelector(`tr[data-id="${newId}"]`);
        if (lastRow) {
          const descInput = lastRow.querySelector('input[data-item-field="description"]');
          if (descInput) descInput.focus();
        }
      }, 50);
    }
  }

  addPaymentRow(focus = true) {
    const today = new Date().toLocaleDateString('en-US');
    const newId = 'pmt-' + Date.now();
    this.state.payments.push({
      id: newId,
      date: today,
      description: 'Payment Applied by Card at Pal Optical',
      amount: '0.00'
    });
    this.refreshPaymentsList();
    this.calculateTotals(true);

    if (focus) {
      setTimeout(() => {
        const lastRow = this.container.querySelector(`.ir-payment-row[data-id="${newId}"]`);
        if (lastRow) {
          const descInput = lastRow.querySelector('input[data-pmt-field="description"]');
          if (descInput) descInput.focus();
        }
      }, 50);
    }
  }

  calculateTotals(triggerSave = true) {
    let grossCharges = 0;
    let discounts = 0;

    // Calculate sum of line items
    this.state.items.forEach((item) => {
      const desc = String(item.description || '').toLowerCase();
      const raw = String(item.amount || '').replace(/[()$,]/g, '').trim();
      const val = parseFloat(raw) || 0;

      // Identify discount items
      if (desc.includes('discount') || String(item.amount).includes('-') || String(item.amount).includes('(')) {
        discounts += Math.abs(val);
      } else {
        grossCharges += val;
      }
    });

    const taxVal = parseFloat(String(this.state.salesTax || '').replace(/[()$,]/g, '').trim()) || 0;
    const totalCurrentCharges = grossCharges - discounts + taxVal;

    // Calculate payments
    let totalPayments = 0;
    this.state.payments.forEach((pmt) => {
      const raw = String(pmt.amount || '').replace(/[()$,]/g, '').trim();
      totalPayments += Math.abs(parseFloat(raw) || 0);
    });

    const otherOpen = parseFloat(String(this.state.otherOpenItems || '').replace(/[()$,]/g, '').trim()) || 0;
    const balanceDue = Math.max(0, totalCurrentCharges - totalPayments);
    const finalBalance = balanceDue + otherOpen;

    // Store in state
    this.state.totalCurrentCharges = totalCurrentCharges;
    this.state.totalPayments = totalPayments;
    this.state.balanceDue = balanceDue;
    this.state.totalChargesAll = grossCharges + taxVal;
    this.state.totalDiscounts = discounts;

    // Update DOM displays
    const dispTotalCharges = this.container.querySelector('#ir-disp-total-charges');
    if (dispTotalCharges) dispTotalCharges.textContent = totalCurrentCharges.toFixed(2);

    const dispTotalPayments = this.container.querySelector('#ir-disp-total-payments');
    if (dispTotalPayments) dispTotalPayments.textContent = `(${totalPayments.toFixed(2)})`;

    const dispBalanceDue = this.container.querySelector('#ir-disp-balance-due');
    if (dispBalanceDue) dispBalanceDue.textContent = balanceDue.toFixed(2);

    const dispFinalBalance = this.container.querySelector('#ir-disp-final-balance');
    if (dispFinalBalance) dispFinalBalance.textContent = finalBalance.toFixed(2);

    const statusBanner = this.container.querySelector('#ir-status-banner-text');
    if (statusBanner) {
      if (finalBalance <= 0) {
        statusBanner.textContent = 'NO PAYMENT NECESSARY';
      } else {
        statusBanner.textContent = 'TOTAL BALANCE DUE';
      }
    }

    const dispSumTotalCharges = this.container.querySelector('#ir-disp-sum-total-charges');
    if (dispSumTotalCharges) dispSumTotalCharges.textContent = totalCurrentCharges.toFixed(2);

    const dispSumDiscounts = this.container.querySelector('#ir-disp-sum-discounts');
    if (dispSumDiscounts) dispSumDiscounts.textContent = `(${discounts.toFixed(2)})`;

    const couponTotalDue = this.container.querySelector('#ir-coupon-total-due');
    if (couponTotalDue) couponTotalDue.textContent = finalBalance.toFixed(2);

    if (triggerSave && typeof this.onStateChange === 'function') {
      this.onStateChange(this.state);
    }
  }

  autofillSample() {
    this.state = {
      practiceName: 'Pal Optical',
      practiceAddress1: '1555 E. New Circle Road',
      practiceAddress2: 'Suite 146',
      practiceCityStateZip: 'Lexington, KY 405091044',
      practicePhone: '859-266-3003',

      feeSlipNumber: '56205',
      datePrinted: '9/22/2026',
      provider: 'Pal Optical',
      officePhone: '859-266-3003',
      npiNumber: '1609930791',
      patientId: '36817',
      patientName: 'SHAUN GATEWOOD',
      chartNumber: '',
      homePhone: '(859) 618-0211',
      nextAppt: '',

      recipientName: 'SHAUN GATEWOOD',
      recipientAddress1: '166 GARNETTE DR',
      recipientCityStateZip: 'NICHOLASVILLE, KY 40356',

      items: [
        {
          id: 'item-1',
          dateOfService: '03/19/2012',
          ordNumber: '0',
          sku: '',
          qty: '1',
          description: 'PHAT FARM FRAME',
          cpt: '',
          diagnosis: '',
          amount: '26.00',
          patientBalance: ''
        },
        {
          id: 'item-2',
          dateOfService: '03/16/2012',
          ordNumber: '0',
          sku: '',
          qty: '1',
          description: 'SV POLYCARBONATE LENSES',
          cpt: '',
          diagnosis: '',
          amount: '85.00',
          patientBalance: ''
        },
        {
          id: 'item-3',
          dateOfService: '03/16/2012',
          ordNumber: '',
          sku: '',
          qty: '',
          description: '20% Discount',
          cpt: '',
          diagnosis: '',
          amount: '-17.00',
          patientBalance: ''
        },
        {
          id: 'item-4',
          dateOfService: '03/19/2012',
          ordNumber: '0',
          sku: '',
          qty: '1',
          description: 'OVER POWER',
          cpt: '',
          diagnosis: '',
          amount: '11.87',
          patientBalance: ''
        }
      ],

      salesTax: '4.08',
      otherOpenItems: '0.00',

      payments: [
        {
          id: 'pmt-1',
          date: '03/16/2012',
          description: 'Payment Applied by Cash at Pal Optical',
          amount: '109.95'
        }
      ],

      amountEnclosed: '',
      checkNumber: ''
    };

    this.render();
    this.bindEvents();
    this.calculateTotals(true);
  }

  reset() {
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      practiceName: 'Pal Optical',
      practiceAddress1: '1555 E. New Circle Road',
      practiceAddress2: 'Suite 146',
      practiceCityStateZip: 'Lexington, KY 405091044',
      practicePhone: '859-266-3003',

      feeSlipNumber: '',
      datePrinted: today,
      provider: 'Pal Optical',
      officePhone: '859-266-3003',
      npiNumber: '1609930791',
      patientId: '',
      patientName: '',
      chartNumber: '',
      homePhone: '',
      nextAppt: '',

      recipientName: '',
      recipientAddress1: '',
      recipientCityStateZip: '',

      items: [
        {
          id: 'item-1',
          dateOfService: today,
          ordNumber: '0',
          sku: '',
          qty: '1',
          description: '',
          cpt: '',
          diagnosis: '',
          amount: '0.00',
          patientBalance: ''
        }
      ],

      salesTax: '0.00',
      otherOpenItems: '0.00',

      payments: [],

      amountEnclosed: '',
      checkNumber: ''
    };

    this.render();
    this.bindEvents();
    this.calculateTotals(true);
  }

  destroy() {
    // Cleanup if necessary
  }
}
