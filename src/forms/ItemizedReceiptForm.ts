/* Pal Optical Forms Web App - Pal Optical Itemized Receipt ("Statement of Charges and Payments") */

export interface ItemizedReceiptItem {
  id: string;
  dateOfService: string;
  ordNumber: string;
  sku: string;
  qty: string;
  description: string;
  cpt: string;
  diagnosis: string;
  amount: number | string;
  patientBalance: string;
}

export interface ItemizedReceiptPayment {
  id: string;
  date: string;
  description: string;
  amount: number | string;
}

export interface ItemizedReceiptDiscount {
  id: string;
  label: string;
  amount: number | string;
}

export interface ItemizedReceiptState {
  // Practice info
  practiceName: string;
  practiceAddress1: string;
  practiceAddress2: string;
  practiceCityStateZip: string;
  practicePhone: string;

  // Header meta
  feeSlipNumber: string;
  datePrinted: string;
  provider: string;
  officePhone: string;
  npiNumber: string;
  patientId: string;
  patientName: string;
  chartNumber: string;
  homePhone: string;
  nextAppt: string;

  // Recipient / "To:"
  recipientName: string;
  recipientAddress1: string;
  recipientCityStateZip: string;

  // Transactions
  items: ItemizedReceiptItem[];
  salesTax: number | string;
  insuranceDiscount?: number | string;
  insuranceDiscounts?: ItemizedReceiptDiscount[];
  otherOpenItems: number | string;

  // Payments
  payments: ItemizedReceiptPayment[];

  // Bottom Remittance
  amountEnclosed: string;
  checkNumber: string;

  // Calculated fields (stored for convenience)
  totalCurrentCharges?: number;
  totalPayments?: number;
  balanceDue?: number;
  totalChargesAll?: number;
  totalDiscounts?: number;
}

export class ItemizedReceiptForm {
  container: HTMLElement;
  state: ItemizedReceiptState;
  onStateChange?: (state: ItemizedReceiptState) => void;

  constructor(
    container: HTMLElement,
    state: Partial<ItemizedReceiptState> = {},
    onStateChange?: (state: ItemizedReceiptState) => void
  ) {
    this.container = container;
    this.onStateChange = onStateChange;

    const today = new Date().toLocaleDateString('en-US');

    // Default state based on uploaded Pal Optical PDF format
    const defaultState: ItemizedReceiptState = {
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
      insuranceDiscount: '0.00',
      insuranceDiscounts: [
        {
          id: 'ins-1',
          label: 'Insurance Discount',
          amount: '0.00'
        }
      ],
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
      payments: state.payments && state.payments.length > 0 ? state.payments : defaultState.payments,
      insuranceDiscounts: state.insuranceDiscounts && state.insuranceDiscounts.length > 0
        ? state.insuranceDiscounts
        : (state.insuranceDiscount && parseFloat(String(state.insuranceDiscount).replace(/[()$,]/g, '')) > 0
            ? [{ id: 'ins-1', label: 'Insurance Discount', amount: state.insuranceDiscount }]
            : defaultState.insuranceDiscounts)
    };

    this.render();
    this.bindEvents();
    this.calculateTotals(false);
  }

  escapeHtml(str: string | number | undefined | null): string {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formatAmountDisplay(amount: number | string, forceParentheses = false): string {
    const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[()$,]/g, '').trim()) || 0;
    if (forceParentheses || num < 0) {
      return `(${Math.abs(num).toFixed(2)})`;
    }
    return num.toFixed(2);
  }

  render(): void {
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
            <button type="button" class="btn btn-secondary btn-sm" id="ir-btn-add-discount">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              + Add Insurance Discount
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
              <button type="button" class="ir-add-line-btn ir-add-discount-btn" id="ir-btn-add-discount-table">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                + Add Insurance Discount
              </button>
            </div>
          </div>

          <!-- CHARGES SUB-TOTAL & SALES TAX BLOCK -->
          <div class="ir-financials-block">
            <div id="ir-ins-discounts-container" class="ir-discounts-container">
              ${this.renderInsuranceDiscountRows()}
            </div>
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

  renderItemRows(): string {
    return this.state.items
      .map((item, idx) => {
        const desc = String(item.description || '').toLowerCase();
        const isDiscount = desc.includes('discount') ||
          desc.includes('ins') ||
          desc.includes('allowance') ||
          desc.includes('adjustment') ||
          desc.includes('write-off') ||
          (typeof item.amount === 'number' && item.amount < 0) ||
          String(item.amount).includes('-') ||
          String(item.amount).includes('(');

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

  renderPaymentRows(): string {
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

  renderInsuranceDiscountRows(): string {
    const discounts = this.state.insuranceDiscounts && this.state.insuranceDiscounts.length > 0
      ? this.state.insuranceDiscounts
      : [{ id: 'ins-1', label: 'Insurance Discount', amount: this.state.insuranceDiscount || '0.00' }];

    return discounts
      .map((disc, idx) => {
        const amt = parseFloat(String(disc.amount || '').replace(/[()$,]/g, '')) || 0;
        const isZero = amt === 0;
        const displayVal = amt > 0 ? `(${amt.toFixed(2)})` : '';

        return `
          <div class="ir-financial-row ir-fin-ins-discount ${isZero ? 'ir-zero-hidden' : ''}" data-discount-id="${disc.id}" data-index="${idx}">
            <input type="text" class="ir-fin-label-input" data-discount-field="label" value="${this.escapeHtml(disc.label || 'Insurance Discount')}" title="Click to edit label">
            <span class="ir-fin-val-wrap">
              <input type="text" class="ir-input ir-input-fin text-right" data-discount-field="amount" placeholder="(0.00)" value="${this.escapeHtml(displayVal)}">
            </span>
            <button type="button" class="ir-row-delete-btn print:hidden" data-action="delete-ins-discount" data-index="${idx}" title="Remove Discount">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        `;
      })
      .join('');
  }

  bindEvents(): void {
    // Toolbar buttons
    const btnSample = this.container.querySelector('#ir-btn-sample');
    if (btnSample) {
      btnSample.addEventListener('click', () => this.autofillSample());
    }

    const btnAddItem = this.container.querySelector('#ir-btn-add-item');
    if (btnAddItem) {
      btnAddItem.addEventListener('click', () => this.addItemRow());
    }

    const btnAddDiscount = this.container.querySelector('#ir-btn-add-discount');
    if (btnAddDiscount) {
      btnAddDiscount.addEventListener('click', () => this.addInsuranceDiscount(true));
    }

    const btnAddPayment = this.container.querySelector('#ir-btn-add-payment');
    if (btnAddPayment) {
      btnAddPayment.addEventListener('click', () => this.addPaymentRow(true));
    }

    const btnAddLineTable = this.container.querySelector('#ir-btn-add-line-table');
    if (btnAddLineTable) {
      btnAddLineTable.addEventListener('click', () => this.addItemRow(true));
    }

    const btnAddDiscountTable = this.container.querySelector('#ir-btn-add-discount-table');
    if (btnAddDiscountTable) {
      btnAddDiscountTable.addEventListener('click', () => this.addInsuranceDiscount(true));
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
    this.container.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLInputElement;
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
    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;

      const field = target.getAttribute('data-field') as keyof ItemizedReceiptState | null;
      if (field && field in this.state) {
        // Direct state field
        (this.state as any)[field] = target.value;

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

      // Check for insurance discount fields
      const discField = target.getAttribute('data-discount-field') as keyof ItemizedReceiptDiscount | null;
      if (discField) {
        const row = target.closest('[data-discount-id]');
        const idx = row ? parseInt(row.getAttribute('data-index') || '-1', 10) : -1;
        if (idx >= 0 && this.state.insuranceDiscounts && this.state.insuranceDiscounts[idx]) {
          (this.state.insuranceDiscounts[idx] as any)[discField] = target.value;
          this.state.insuranceDiscount = this.state.insuranceDiscounts[0]?.amount || '0.00';
          this.calculateTotals(true);
        }
        return;
      }

      // Check for item fields
      const itemField = target.getAttribute('data-item-field') as keyof ItemizedReceiptItem | null;
      if (itemField) {
        const row = target.closest('tr');
        const idx = row ? parseInt(row.getAttribute('data-index') || '-1', 10) : -1;
        if (idx >= 0 && this.state.items[idx]) {
          (this.state.items[idx] as any)[itemField] = target.value;
          this.calculateTotals(true);
        }
        return;
      }

      // Check for payment fields
      const pmtField = target.getAttribute('data-pmt-field') as keyof ItemizedReceiptPayment | null;
      if (pmtField) {
        const row = target.closest('.ir-payment-row');
        const idx = row ? parseInt(row.getAttribute('data-index') || '-1', 10) : -1;
        if (idx >= 0 && this.state.payments[idx]) {
          (this.state.payments[idx] as any)[pmtField] = target.value;
          this.calculateTotals(true);
        }
      }
    });

    // Format amounts on blur
    this.container.addEventListener('focusout', (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;

      if (target.hasAttribute('data-discount-field') && target.getAttribute('data-discount-field') === 'amount') {
        const raw = target.value.replace(/[()$,]/g, '').trim();
        const num = parseFloat(raw);
        if (!isNaN(num) && num > 0) {
          target.value = `(${num.toFixed(2)})`;
        } else if (raw === '' || num === 0) {
          target.value = '';
        }
        this.calculateTotals(true);
      } else if (target.hasAttribute('data-item-field') && target.getAttribute('data-item-field') === 'amount') {
        const row = target.closest('tr');
        const descInput = row ? row.querySelector('input[data-item-field="description"]') as HTMLInputElement : null;
        const desc = descInput ? descInput.value.toLowerCase() : '';
        const isDiscount = desc.includes('discount') || desc.includes('ins') || desc.includes('allowance') || desc.includes('write-off');
        const raw = target.value.replace(/[()$,]/g, '').trim();
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          target.value = isDiscount || target.value.includes('-') || target.value.includes('(')
            ? `(${Math.abs(num).toFixed(2)})`
            : num.toFixed(2);
        }
        this.calculateTotals(true);
      } else if (target.hasAttribute('data-pmt-field') && target.getAttribute('data-pmt-field') === 'amount') {
        const raw = target.value.replace(/[()$,]/g, '').trim();
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          target.value = `(${Math.abs(num).toFixed(2)})`;
        }
        this.calculateTotals(true);
      } else if (target.getAttribute('data-field') === 'salesTax') {
        const raw = target.value.replace(/[()$,]/g, '').trim();
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          target.value = num.toFixed(2);
        }
        this.calculateTotals(true);
      }
    });

    // Click actions (delete rows)
    this.container.addEventListener('click', (e: Event) => {
      const target = (e.target as HTMLElement).closest('button');
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
      } else if (action === 'delete-ins-discount') {
        const idx = parseInt(target.getAttribute('data-index') || '-1', 10);
        if (idx >= 0 && this.state.insuranceDiscounts) {
          if (this.state.insuranceDiscounts.length <= 1) {
            this.state.insuranceDiscounts[0].amount = '0.00';
            this.refreshInsuranceDiscounts();
          } else {
            this.state.insuranceDiscounts.splice(idx, 1);
            this.refreshInsuranceDiscounts();
          }
          this.calculateTotals(true);
        }
      }
    });
  }

  refreshItemsTable(): void {
    const tbody = this.container.querySelector('#ir-items-body');
    if (tbody) {
      tbody.innerHTML = this.renderItemRows();
    }
  }

  refreshPaymentsList(): void {
    const pmtBody = this.container.querySelector('#ir-payments-body');
    if (pmtBody) {
      pmtBody.innerHTML = this.renderPaymentRows();
    }
  }

  addItemRow(focus = true): void {
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
          const descInput = lastRow.querySelector('input[data-item-field="description"]') as HTMLInputElement;
          if (descInput) descInput.focus();
        }
      }, 50);
    }
  }

  addPaymentRow(focus = true): void {
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
          const descInput = lastRow.querySelector('input[data-pmt-field="description"]') as HTMLInputElement;
          if (descInput) descInput.focus();
        }
      }, 50);
    }
  }

  refreshInsuranceDiscounts(): void {
    const container = this.container.querySelector('#ir-ins-discounts-container');
    if (container) {
      container.innerHTML = this.renderInsuranceDiscountRows();
    }
  }

  addInsuranceDiscount(focus = true): void {
    if (!this.state.insuranceDiscounts) {
      this.state.insuranceDiscounts = [];
    }

    const existingZero = this.state.insuranceDiscounts.find((d) => {
      const amt = parseFloat(String(d.amount || '').replace(/[()$,]/g, '')) || 0;
      return amt === 0;
    });

    let targetId: string;
    if (existingZero) {
      targetId = existingZero.id;
    } else {
      targetId = 'ins-' + Date.now();
      this.state.insuranceDiscounts.push({
        id: targetId,
        label: 'Insurance Discount',
        amount: ''
      });
      this.refreshInsuranceDiscounts();
    }

    this.calculateTotals(true);

    if (focus) {
      setTimeout(() => {
        const row = this.container.querySelector(`[data-discount-id="${targetId}"]`);
        if (row) {
          row.classList.remove('ir-zero-hidden');
          const amtInput = row.querySelector('input[data-discount-field="amount"]') as HTMLInputElement;
          if (amtInput) {
            amtInput.focus();
            amtInput.select();
          }
        }
      }, 50);
    }
  }

  calculateTotals(triggerSave = true): void {
    let grossCharges = 0;
    let itemDiscounts = 0;

    // Calculate sum of line items
    this.state.items.forEach((item) => {
      const desc = String(item.description || '').toLowerCase();
      const raw = String(item.amount || '').replace(/[()$,]/g, '').trim();
      const val = parseFloat(raw) || 0;

      // Identify discount items in the table
      if (
        desc.includes('discount') ||
        desc.includes('ins') ||
        desc.includes('allowance') ||
        desc.includes('adjustment') ||
        desc.includes('write-off') ||
        String(item.amount).includes('-') ||
        String(item.amount).includes('(')
      ) {
        itemDiscounts += Math.abs(val);
      } else {
        grossCharges += val;
      }
    });

    // Sum all insurance discounts off the total
    let totalInsDiscounts = 0;
    if (this.state.insuranceDiscounts && this.state.insuranceDiscounts.length > 0) {
      this.state.insuranceDiscounts.forEach((disc) => {
        const raw = String(disc.amount || '').replace(/[()$,]/g, '').trim();
        totalInsDiscounts += Math.abs(parseFloat(raw) || 0);
      });
    } else if (this.state.insuranceDiscount) {
      const raw = String(this.state.insuranceDiscount).replace(/[()$,]/g, '').trim();
      totalInsDiscounts += Math.abs(parseFloat(raw) || 0);
    }

    const allDiscounts = itemDiscounts + totalInsDiscounts;
    const taxVal = parseFloat(String(this.state.salesTax || '').replace(/[()$,]/g, '').trim()) || 0;
    const totalCurrentCharges = Math.max(0, grossCharges - allDiscounts + taxVal);

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
    this.state.totalDiscounts = allDiscounts;

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
    if (dispSumTotalCharges) dispSumTotalCharges.textContent = grossCharges.toFixed(2);

    const dispSumDiscounts = this.container.querySelector('#ir-disp-sum-discounts');
    if (dispSumDiscounts) {
      dispSumDiscounts.textContent = allDiscounts > 0 ? `(${allDiscounts.toFixed(2)})` : '(0.00)';
    }

    const couponTotalDue = this.container.querySelector('#ir-coupon-total-due');
    if (couponTotalDue) couponTotalDue.textContent = finalBalance.toFixed(2);

    // Update print-visibility of insurance discount rows
    if (this.state.insuranceDiscounts) {
      this.state.insuranceDiscounts.forEach((disc) => {
        const amt = parseFloat(String(disc.amount || '').replace(/[()$,]/g, '')) || 0;
        const row = this.container.querySelector(`[data-discount-id="${disc.id}"]`);
        if (row) {
          if (amt === 0) {
            row.classList.add('ir-zero-hidden');
          } else {
            row.classList.remove('ir-zero-hidden');
          }
        }
      });
    }

    if (triggerSave && typeof this.onStateChange === 'function') {
      this.onStateChange(this.state);
    }
  }

  autofillSample(): void {
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
      insuranceDiscount: '0.00',
      insuranceDiscounts: [
        {
          id: 'ins-1',
          label: 'Insurance Discount',
          amount: '0.00'
        }
      ],
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

  reset(): void {
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
      insuranceDiscount: '0.00',
      insuranceDiscounts: [
        {
          id: 'ins-1',
          label: 'Insurance Discount',
          amount: '0.00'
        }
      ],
      otherOpenItems: '0.00',

      payments: [],

      amountEnclosed: '',
      checkNumber: ''
    };

    this.render();
    this.bindEvents();
    this.calculateTotals(true);
  }

  destroy(): void {
    // Cleanup if necessary
  }
}
