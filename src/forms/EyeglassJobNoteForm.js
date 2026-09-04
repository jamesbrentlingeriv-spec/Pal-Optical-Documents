/* Pal Optical Forms Web App - Eyeglass Job Note (Dispensary • Lab Routing) */
import { SignaturePad } from '../components/SignaturePad.js';

export class EyeglassJobNoteForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    
    // Set default date to today and default signature
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      patientName: '',
      date: today,
      optician: 'James Brentlinger',

      // Section 1: Reported Optical & Frame Issues
      issueBlurryDistance: false,
      issueBlurryClose: false,
      issueNightDriving: false,
      issueHeadaches: false,
      issueDoubleVision: false,
      issueSlidingNose: false,
      issueCrookedTilted: false,
      issueEyeStrain: false,
      issueHaloesGlare: false,
      issueReadingNarrow: false,
      issueFishbowl: false,
      issueScratchedPeeling: false,
      issueTempleTight: false,
      issueEyelashesTouching: false,
      issueOtherChecked: false,
      issueOtherDetails: '',

      // Section 2: Pre-Manufacture Concerns
      concernHighRxThickness: false,
      concernCorridorFitHeight: false,
      concernWrapBaseCurve: false,
      concernPofBreakage: false,
      concernBlankDecentration: false,
      concernVerticalImbalance: false,
      concernDrillSemiRimless: false,
      concernHighCylOblique: false,
      concernCustomBevel: false,
      concernEyewireGroove: false,
      concernCoatingCompatibility: false,
      concernDoctorRxRecheck: false,
      concernOtherChecked: false,
      concernOtherDetails: '',

      // Section 3: Optician Action / Resolution Plan
      actionAdjustFrame: false,
      actionDoctorRecheck: false,
      actionLabRemake: false,
      actionWarrantyReplace: false,
      status: '',
      signature: '/jamessig.png',
      ...state
    };

    this.onStateChange = onStateChange;
    this.sigPad = null;

    this.render();
    this.bindEvents();
    this.initSignatures();
  }

  render() {
    this.container.innerHTML = `
      <div class="job-note-card" id="eyeglass-job-note-card">
        <form id="eyeglass-job-note-form">
          <!-- Top Header -->
          <div class="job-note-header">
            <div class="job-note-title-wrap">
              <h1 class="job-note-main-title">EYEGLASS JOB NOTE</h1>
              <span class="job-note-subtitle">DISPENSARY &bull; LAB ROUTING</span>
            </div>
            <div class="job-note-header-divider"></div>
          </div>

          <!-- Top Meta Fields (JOB/TRAY removed) -->
          <div class="job-note-meta-grid">
            <div class="job-note-meta-row">
              <div class="job-note-field col-patient">
                <span class="job-note-field-label">PATIENT:</span>
                <input type="text" class="job-note-line-input" data-field="patientName" placeholder="Patient Full Name" value="${this.escapeHtml(this.state.patientName || '')}">
              </div>
              <div class="job-note-field col-date">
                <span class="job-note-field-label">DATE:</span>
                <input type="text" class="job-note-line-input" data-field="date" placeholder="MM/DD/YYYY" value="${this.escapeHtml(this.state.date || '')}">
              </div>
            </div>
            <div class="job-note-meta-row" style="margin-top: 10px;">
              <div class="job-note-field col-optician">
                <span class="job-note-field-label">OPTICIAN:</span>
                <input type="text" class="job-note-line-input" data-field="optician" placeholder="Optician Name / ID" value="${this.escapeHtml(this.state.optician || '')}">
              </div>
            </div>
          </div>

          <!-- Section 1: REPORTED OPTICAL & FRAME ISSUES -->
          <div class="job-note-section">
            <div class="job-note-section-banner">
              <span class="job-note-banner-bar"></span>
              <span class="job-note-banner-text">REPORTED OPTICAL &amp; FRAME ISSUES</span>
            </div>

            <div class="job-note-checkbox-grid">
              <!-- Left Column -->
              <div class="job-note-checkbox-col">
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueBlurryDistance" class="job-note-checkbox" ${this.state.issueBlurryDistance ? 'checked' : ''}>
                  <span>Blurry vision at distance</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueBlurryClose" class="job-note-checkbox" ${this.state.issueBlurryClose ? 'checked' : ''}>
                  <span>Blurry vision up close / reading</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueNightDriving" class="job-note-checkbox" ${this.state.issueNightDriving ? 'checked' : ''}>
                  <span>Difficulty with night driving</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueHeadaches" class="job-note-checkbox" ${this.state.issueHeadaches ? 'checked' : ''}>
                  <span>Frequent headaches</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueDoubleVision" class="job-note-checkbox" ${this.state.issueDoubleVision ? 'checked' : ''}>
                  <span>Double vision (Diplopia)</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueSlidingNose" class="job-note-checkbox" ${this.state.issueSlidingNose ? 'checked' : ''}>
                  <span>Glasses sliding down nose</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueCrookedTilted" class="job-note-checkbox" ${this.state.issueCrookedTilted ? 'checked' : ''}>
                  <span>Frame sits crooked / tilted</span>
                </label>
              </div>

              <!-- Right Column -->
              <div class="job-note-checkbox-col">
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueEyeStrain" class="job-note-checkbox" ${this.state.issueEyeStrain ? 'checked' : ''}>
                  <span>Eye strain / fatigue (computer)</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueHaloesGlare" class="job-note-checkbox" ${this.state.issueHaloesGlare ? 'checked' : ''}>
                  <span>Haloes / glare around lights</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueReadingNarrow" class="job-note-checkbox" ${this.state.issueReadingNarrow ? 'checked' : ''}>
                  <span>Reading area feels too narrow</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueFishbowl" class="job-note-checkbox" ${this.state.issueFishbowl ? 'checked' : ''}>
                  <span>"Fishbowl" / swimming effect</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueScratchedPeeling" class="job-note-checkbox" ${this.state.issueScratchedPeeling ? 'checked' : ''}>
                  <span>Lenses scratched / peeling</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueTempleTight" class="job-note-checkbox" ${this.state.issueTempleTight ? 'checked' : ''}>
                  <span>Temple arms too tight / hurt ears</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="issueEyelashesTouching" class="job-note-checkbox" ${this.state.issueEyelashesTouching ? 'checked' : ''}>
                  <span>Eyelashes touching lenses</span>
                </label>
              </div>
            </div>

            <!-- OTHER Write-in block -->
            <div class="job-note-other-block">
              <label class="job-note-check-label other-title-label">
                <input type="checkbox" data-field="issueOtherChecked" class="job-note-checkbox" ${this.state.issueOtherChecked ? 'checked' : ''}>
                <span class="font-bold">OTHER (Please specify details below):</span>
              </label>
              <div class="job-note-ruled-area">
                <textarea class="job-note-ruled-textarea" data-field="issueOtherDetails" rows="2" placeholder="Enter optical / frame issue notes here...">${this.escapeHtml(this.state.issueOtherDetails || '')}</textarea>
                <div class="job-note-ruled-lines">
                  <div class="rule-line"></div>
                  <div class="rule-line"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: PRE-MANUFACTURE CONCERNS -->
          <div class="job-note-section">
            <div class="job-note-section-banner">
              <span class="job-note-banner-bar"></span>
              <span class="job-note-banner-text">PRE-MANUFACTURE CONCERNS</span>
            </div>

            <div class="job-note-checkbox-grid">
              <!-- Left Column -->
              <div class="job-note-checkbox-col">
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernHighRxThickness" class="job-note-checkbox" ${this.state.concernHighRxThickness ? 'checked' : ''}>
                  <span>High Rx / Edge or center thickness concern</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernCorridorFitHeight" class="job-note-checkbox" ${this.state.concernCorridorFitHeight ? 'checked' : ''}>
                  <span>Progressive corridor / Fitting height tight (&lt; min)</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernWrapBaseCurve" class="job-note-checkbox" ${this.state.concernWrapBaseCurve ? 'checked' : ''}>
                  <span>Frame wrap / Base curve mismatch</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernPofBreakage" class="job-note-checkbox" ${this.state.concernPofBreakage ? 'checked' : ''}>
                  <span>Patient's Own Frame (POF) — brittle / breakage risk</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernBlankDecentration" class="job-note-checkbox" ${this.state.concernBlankDecentration ? 'checked' : ''}>
                  <span>Lens cutout / Blank size / Decentration concern</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernVerticalImbalance" class="job-note-checkbox" ${this.state.concernVerticalImbalance ? 'checked' : ''}>
                  <span>Anisometropia / Vertical imbalance / Slab-off</span>
                </label>
              </div>

              <!-- Right Column -->
              <div class="job-note-checkbox-col">
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernDrillSemiRimless" class="job-note-checkbox" ${this.state.concernDrillSemiRimless ? 'checked' : ''}>
                  <span>Rimless / Drill mount / Semi-rimless (Poly/Trivex req.)</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernHighCylOblique" class="job-note-checkbox" ${this.state.concernHighCylOblique ? 'checked' : ''}>
                  <span>High cylinder / Oblique axis distortion risk</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernCustomBevel" class="job-note-checkbox" ${this.state.concernCustomBevel ? 'checked' : ''}>
                  <span>Custom bevel required (Step / Shelf / Roll &amp; polish)</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernEyewireGroove" class="job-note-checkbox" ${this.state.concernEyewireGroove ? 'checked' : ''}>
                  <span>Thin / Fragile eyewire or shallow groove depth</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernCoatingCompatibility" class="job-note-checkbox" ${this.state.concernCoatingCompatibility ? 'checked' : ''}>
                  <span>Coating / Tint / Polarized axis compatibility</span>
                </label>
                <label class="job-note-check-label">
                  <input type="checkbox" data-field="concernDoctorRxRecheck" class="job-note-checkbox" ${this.state.concernDoctorRxRecheck ? 'checked' : ''}>
                  <span>Doctor Rx recheck recommended before edging</span>
                </label>
              </div>
            </div>

            <!-- OTHER Pre-Manufacture Notes -->
            <div class="job-note-other-block">
              <label class="job-note-check-label other-title-label">
                <input type="checkbox" data-field="concernOtherChecked" class="job-note-checkbox" ${this.state.concernOtherChecked ? 'checked' : ''}>
                <span class="font-bold">OTHER PRE-MANUFACTURE NOTES (Specify below):</span>
              </label>
              <div class="job-note-ruled-area">
                <textarea class="job-note-ruled-textarea" data-field="concernOtherDetails" rows="2" placeholder="Enter pre-manufacture lab notes here...">${this.escapeHtml(this.state.concernOtherDetails || '')}</textarea>
                <div class="job-note-ruled-lines">
                  <div class="rule-line"></div>
                  <div class="rule-line"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: OPTICIAN ACTION / RESOLUTION PLAN -->
          <div class="job-note-section optician-action-section">
            <div class="job-note-dotted-separator"></div>

            <div class="job-note-section-banner">
              <span class="job-note-banner-bar"></span>
              <span class="job-note-banner-text">OPTICIAN ACTION / RESOLUTION PLAN</span>
            </div>

            <div class="job-note-action-row">
              <label class="job-note-check-label">
                <input type="checkbox" data-field="actionAdjustFrame" class="job-note-checkbox" ${this.state.actionAdjustFrame ? 'checked' : ''}>
                <span>Adjust Frame Only</span>
              </label>
              <label class="job-note-check-label">
                <input type="checkbox" data-field="actionDoctorRecheck" class="job-note-checkbox" ${this.state.actionDoctorRecheck ? 'checked' : ''}>
                <span>Doctor Recheck</span>
              </label>
              <label class="job-note-check-label">
                <input type="checkbox" data-field="actionLabRemake" class="job-note-checkbox" ${this.state.actionLabRemake ? 'checked' : ''}>
                <span>Lab Remake (L / R)</span>
              </label>
              <label class="job-note-check-label">
                <input type="checkbox" data-field="actionWarrantyReplace" class="job-note-checkbox" ${this.state.actionWarrantyReplace ? 'checked' : ''}>
                <span>Warranty Replace</span>
              </label>
            </div>

            <!-- Footer Signatures & Status -->
            <div class="job-note-footer-divider"></div>
            <div class="job-note-footer-row">
              <div class="job-note-sig-block">
                <span class="job-note-sig-label">Optician Sig:</span>
                <div class="job-note-sig-col">
                  <div class="job-note-sig-target-wrapper" id="job-note-sig-target">
                    <!-- SignaturePad mounts here -->
                  </div>
                  <div class="job-note-sig-name">James Brentlinger ABOC, NCLEC</div>
                </div>
              </div>

              <div class="job-note-status-block">
                <span class="job-note-status-label">Status:</span>
                <input type="text" class="job-note-line-input status-input" data-field="status" placeholder="Pending / In Lab / Resolved" value="${this.escapeHtml(this.state.status || '')}">
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
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

  bindEvents() {
    const form = this.container.querySelector('#eyeglass-job-note-form');
    if (!form) return;

    form.addEventListener('input', (e) => {
      const field = e.target.getAttribute('data-field');
      if (field) {
        this.state[field] = e.target.value;
        this.onStateChange(this.state);
      }
    });

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
    });
  }

  initSignatures() {
    const sigTarget = this.container.querySelector('#job-note-sig-target');
    if (!sigTarget) return;

    this.sigPad = new SignaturePad(sigTarget, 'job-note-optician', 'Sign here');

    if (this.state.signature) {
      this.sigPad.setDataUrl(this.state.signature);
    }

    const canvas = sigTarget.querySelector('canvas');
    if (canvas) {
      const handleSigChange = () => {
        this.saveSignatures();
      };

      canvas.addEventListener('mouseup', handleSigChange);
      canvas.addEventListener('touchend', handleSigChange);
      canvas.addEventListener('signature-change', handleSigChange);
    }
  }

  saveSignatures() {
    if (this.sigPad) {
      this.state.signature = this.sigPad.getDataUrl();
      this.onStateChange(this.state);
    }
  }

  reset() {
    const today = new Date().toLocaleDateString('en-US');
    this.state = {
      patientName: '',
      date: today,
      optician: 'James Brentlinger',
      issueBlurryDistance: false,
      issueBlurryClose: false,
      issueNightDriving: false,
      issueHeadaches: false,
      issueDoubleVision: false,
      issueSlidingNose: false,
      issueCrookedTilted: false,
      issueEyeStrain: false,
      issueHaloesGlare: false,
      issueReadingNarrow: false,
      issueFishbowl: false,
      issueScratchedPeeling: false,
      issueTempleTight: false,
      issueEyelashesTouching: false,
      issueOtherChecked: false,
      issueOtherDetails: '',
      concernHighRxThickness: false,
      concernCorridorFitHeight: false,
      concernWrapBaseCurve: false,
      concernPofBreakage: false,
      concernBlankDecentration: false,
      concernVerticalImbalance: false,
      concernDrillSemiRimless: false,
      concernHighCylOblique: false,
      concernCustomBevel: false,
      concernEyewireGroove: false,
      concernCoatingCompatibility: false,
      concernDoctorRxRecheck: false,
      concernOtherChecked: false,
      concernOtherDetails: '',
      actionAdjustFrame: false,
      actionDoctorRecheck: false,
      actionLabRemake: false,
      actionWarrantyReplace: false,
      status: '',
      signature: '/jamessig.png'
    };

    this.render();
    this.bindEvents();
    this.initSignatures();
    this.onStateChange(this.state);
  }

  destroy() {
    if (this.sigPad) {
      this.sigPad.clear();
    }
  }
}
