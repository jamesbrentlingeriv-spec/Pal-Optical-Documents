/* Pal Optical Forms Web App - Main App Controller */
import { Sidebar } from './components/Sidebar.js';
import { FormActions } from './components/FormActions.js';

// Forms
import { PatientInfoForm } from './forms/PatientInfoForm.js';
import { PriorAuthForm } from './forms/PriorAuthForm.js';
import { PriceQuoteForm } from './forms/PriceQuoteForm.js';
import { SafetyOrderForm } from './forms/SafetyOrderForm.js';
import { CMS1500Form } from './forms/CMS1500Form.js';
import { FeeSlipForm } from './forms/FeeSlipForm.js';
import { ItemizedReceiptForm } from './forms/ItemizedReceiptForm.js';
import { ItemizedStatementRequestForm } from './forms/ItemizedStatementRequestForm.js';
import { DrSideNewPatientForm } from './forms/DrSideNewPatientForm.js';
import { PDForm } from './forms/PDForm.js';
import { EyeglassJobNoteForm } from './forms/EyeglassJobNoteForm.js';
import { WriteUpForm } from './forms/WriteUpForm.js';
import { ContactLensOrderForm } from './forms/ContactLensOrderForm.js';

// Waivers
import { BilingualLensWaiverForm } from './forms/BilingualLensWaiverForm.js';
import { ChildNoPolyForm } from './forms/ChildNoPolyForm.js';
import { ExpiredRxForm } from './forms/ExpiredRxForm.js';
import { FrameNoChildForm } from './forms/FrameNoChildForm.js';
import { PatientsOwnFrameForm } from './forms/PatientsOwnFrameForm.js';
import { SemiRimlessWaiverForm } from './forms/SemiRimlessWaiverForm.js';
import { SingleVisionConsentForm } from './forms/SingleVisionConsentForm.js';
import { SchoolExcuseForm } from './forms/SchoolExcuseForm.js';
import { WellcareSpendablesForm } from './forms/WellcareSpendablesForm.js';
import { EmbeddedDocForm } from './forms/EmbeddedDocForm.js';

export const INSURANCE_DOCS = {
  'insurance-eyemed-anti-glare': {
    title: 'Eyemed Anti-Glare & Progressive',
    url: '/insurance%20info/Eyemed/eyemed%20anti%20glare%20and%20progressive.pdf',
    desc: 'Eyemed Lens Options & Anti-Reflective Formulary Guide',
    carrier: 'Eyemed'
  },
  'insurance-eyequest-exhibit-ii': {
    title: 'EyeQuest Exhibit II - Medically Indicated Optical Services',
    url: '/insurance%20info/Eyequest/EyeQuest%20Exhibit%20II%20-%20Medically%20Indicated%20Optical%20Services.pdf',
    desc: 'EyeQuest Medically Indicated Optical Services criteria reference',
    carrier: 'EyeQuest'
  },
  'insurance-spectera-formulary': {
    title: 'Spectera Progressive & AR Formulary',
    url: '/insurance%20info/Spectera/Spectera%20Progressive%20&%20AR%20Formulary.pdf',
    desc: 'Spectera Progressive and Anti-Reflective Formulary Chart',
    carrier: 'Spectera'
  },
  'insurance-versant-formulary': {
    title: 'Versant Health Progressive & AR Formulary',
    url: '/insurance%20info/Versant/Versant%20Health%20Progressive%20&%20AR%20Formulary.pdf',
    desc: 'Versant Health Progressive and Anti-Reflective Formulary Chart',
    carrier: 'Versant'
  },
  'insurance-vsp-advantage': {
    title: 'VSP Advantage Plan Lens Enhancement Chart',
    url: '/insurance%20info/VSP/VSP%20Advantage%20Plan%20Lens%20Enhancement%20Chart.pdf',
    desc: 'VSP Advantage Plan covered options & copay formulary',
    carrier: 'VSP'
  },
  'insurance-vsp-choice': {
    title: 'VSP Choice Plan Lens Enhancement Chart',
    url: '/insurance%20info/VSP/VSP%20Choice%20Plan%20Lens%20Enhancement%20Chart.pdf',
    desc: 'VSP Choice Plan covered options & copay formulary',
    carrier: 'VSP'
  },
  'insurance-vsp-signature': {
    title: 'VSP Signature Plan Lens Enhancement Chart',
    url: '/insurance%20info/VSP/VSP%20Signature%20Plan%20Lens%20Enhancement%20Chart.pdf',
    desc: 'VSP Signature Plan covered options & copay formulary',
    carrier: 'VSP'
  }
};

class App {
  constructor() {
    this.activeFormId = 'patient-info';
    this.activeMode = 'fill'; // 'fill' or 'print-blank'
    this.formData = {}; // Stores state for each formId
    
    this.sidebar = null;
    this.formActions = null;
    this.currentFormInstance = null;

    this.initAuth();
  }

  initAuth() {
    // Check if already authenticated this session or local storage
    const isAuthed = sessionStorage.getItem('pal-auth') === 'true' || localStorage.getItem('pal-auth') === 'true';
    if (isAuthed) {
      const overlay = document.getElementById('login-overlay');
      if (overlay) overlay.style.display = 'none';
      document.documentElement.classList.add('is-authenticated');
      this.showApp();
      return;
    }

    const overlay = document.getElementById('login-overlay');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const errorEl = document.getElementById('login-error');
    const loginForm = document.getElementById('login-form');

    const tryLogin = () => {
      const username = usernameInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim().replace(/\s+/g, '').toLowerCase();

      if (username === 'pal' && password === 'pal') {
        sessionStorage.setItem('pal-auth', 'true');
        localStorage.setItem('pal-auth', 'true');
        if (overlay) overlay.style.display = 'none';
        document.documentElement.classList.add('is-authenticated');
        this.showApp();
      } else {
        errorEl.textContent = 'Invalid username or password. Please try again.';
        errorEl.style.animation = 'none';
        void errorEl.offsetWidth; // trigger reflow
        errorEl.style.animation = 'loginShake 0.4s ease';
        passwordInput.value = '';
        passwordInput.focus();
      }
    };

    loginBtn.addEventListener('click', tryLogin);

    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        tryLogin();
      }
    });

    usernameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        passwordInput.focus();
      }
    });

    // Focus username on load
    usernameInput.focus();
  }

  showApp() {
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.style.display = 'none';
    document.documentElement.classList.add('is-authenticated');
    const appContainer = document.getElementById('app');
    if (appContainer) appContainer.style.display = 'flex';
    
    this.loadState();
    this.initDOM();
    this.renderActiveForm();
  }
  
  initDOM() {
    const sidebarTarget = document.getElementById('sidebar-target');
    const actionsTarget = document.getElementById('form-actions-target');
    
    // Instantiate Sidebar
    this.sidebar = new Sidebar(sidebarTarget, this.activeFormId, (formId) => {
      this.selectForm(formId);
    });
    
    // Instantiate Header Actions
    const initialTitle = this.getFormTitle(this.activeFormId);
    this.formActions = new FormActions(
      actionsTarget, 
      initialTitle,
      (mode) => this.toggleMode(mode),
      () => this.resetForm(),
      () => this.printForm()
    );
    
    // Wire overlay tap to close sidebar drawer
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebarTarget.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
    }

    // Live update document title as user types into any form input
    const renderTarget = document.getElementById('form-render-target');
    if (renderTarget) {
      renderTarget.addEventListener('input', () => this.updateDocumentTitle());
      renderTarget.addEventListener('change', () => this.updateDocumentTitle());
    }

    // Guarantee document title is up to date right before browser printing (e.g. Ctrl+P)
    window.addEventListener('beforeprint', () => this.updateDocumentTitle());
  }
  
  selectForm(formId) {
    this.activeFormId = formId;
    if (this.sidebar && typeof this.sidebar.setActiveForm === 'function') {
      this.sidebar.setActiveForm(formId);
    }
    this.renderActiveForm();
    this.updateHeader();
  }

  getFormTitle(formId) {
    if (INSURANCE_DOCS[formId]) {
      return INSURANCE_DOCS[formId].title;
    }
    switch (formId) {
      case 'patient-info': return 'Patient Information Sheet';
      case 'dr-side-patient': return 'Dr. Side New Patient Form';
      case 'prior-auth': return 'Medicaid / Avesis Prior Auth';
      case 'price-quote': return 'Eyewear Price Quote';
      case 'safety-order': return 'Eagle Safety Order Form';
      case 'pd-record': return 'Pupillary Distance (PD) Record';
      case 'writeup': return 'Lab Write-Up Slip (5.5" x 8.5")';
      case 'contact-lens-order': return 'Contact Lens Orders';
      case 'contact-lens-pickup': return 'CL Waiting to Pick Up';
      case 'eyeglass-job-note': return 'Eyeglass Job Note';
      case 'cms1500': return 'CMS-1500 Claim Worksheet';
      case 'fee-slip': return 'Office Fee Slip / Superbill';
      case 'itemized-receipt': return 'Pal Optical Itemized Receipt';
      case 'itemized-statement-request': return 'Itemized Statement Request (Tracy)';
      case 'bilingual-lens-waiver': return 'Polycarbonate Balance Lens';
      case 'child-no-poly': return 'Refusal of Polycarbonate';
      case 'expired-rx': return 'Expired Rx Consent';
      case 'frame-no-child': return 'Frame Selection w/o Child';
      case 'patients-own-frame': return "Patient's Own Frame";
      case 'semi-rimless': return 'Semi-Rimless in Plastic';
      case 'single-vision': return 'Single Vision Consent';
      case 'school-excuse-james': return 'School Excuse (James)';
      case 'school-excuse-carribyan': return 'School Excuse (Carribyan)';
      case 'wellcare-spendables': return 'Wellcare Spendable Card Auth';
      case 'staff-schedule': return 'Staff Schedule (Doc Side & Pal Front)';
      case 'notes-to-dr': return 'Important Notes to Doctor (Dr. Robbins)';
      case 'price-list': return 'Pal Optical Lens & Service Price List (Oct 2026)';
      case 'optician-cheat-sheet': return 'Optician Essential Chairside Guide';
      case 'eyecare-directory': return 'Eye Care, Surgeons & Labs Directory';
      default: return 'Pal Optical Form';
    }
  }
  
  toggleMode(mode) {
    this.activeMode = mode;
    const renderTarget = document.getElementById('form-render-target');
    
    if (mode === 'print-blank') {
      renderTarget.classList.add('print-blank-active');
      renderTarget.classList.add('print-mode');
      document.body.classList.add('print-blank-active');
      document.body.classList.add('mode-print-blank');
    } else {
      renderTarget.classList.remove('print-blank-active');
      renderTarget.classList.remove('print-mode');
      document.body.classList.remove('print-blank-active');
      document.body.classList.remove('mode-print-blank');
    }
    
    // We re-render the canvas layout or signature pad states if required,
    // but CSS handles hiding signature drawings and formatting inputs.
  }
  
  renderActiveForm() {
    const renderTarget = document.getElementById('form-render-target');
    
    // Clean up event listeners on previous form to prevent leaks
    if (this.currentFormInstance && typeof this.currentFormInstance.destroy === 'function') {
      this.currentFormInstance.destroy();
    }
    
    renderTarget.innerHTML = ''; // Clear target
    
    // Clear any previous active form classes from body
    const classesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('active-form-'));
    classesToRemove.forEach(c => document.body.classList.remove(c));
    
    // Add current active form class to body
    document.body.classList.add(`active-form-${this.activeFormId}`);
    
    // Fetch saved state for this form
    const formState = this.formData[this.activeFormId] || {};
    
    // Instantiation dispatcher
    const callback = (newState) => this.saveFormState(this.activeFormId, newState);
    
    // If active form is an insurance PDF document
    if (INSURANCE_DOCS[this.activeFormId]) {
      const doc = INSURANCE_DOCS[this.activeFormId];
      this.currentFormInstance = new EmbeddedDocForm(renderTarget, doc.url, doc.title);
      this.toggleMode('fill');
      this.updateDocumentTitle();
      return;
    }

    switch (this.activeFormId) {
      case 'patient-info':
        this.currentFormInstance = new PatientInfoForm(renderTarget, formState, callback);
        break;
      case 'dr-side-patient':
        this.currentFormInstance = new DrSideNewPatientForm(renderTarget, formState, callback);
        break;
      case 'prior-auth':
        this.currentFormInstance = new PriorAuthForm(renderTarget, formState, callback);
        break;
      case 'price-quote':
        this.currentFormInstance = new PriceQuoteForm(renderTarget, formState, callback);
        break;
      case 'safety-order':
        this.currentFormInstance = new SafetyOrderForm(renderTarget, formState, callback);
        break;
      case 'contact-lens-order':
        name = 'Contact Lens Orders';
        break;
      case 'contact-lens-pickup':
        name = 'CL Waiting to Pick Up';
        break;
      case 'pd-record':
        this.currentFormInstance = new PDForm(renderTarget, formState, callback);
        break;
      case 'writeup':
        this.currentFormInstance = new WriteUpForm(renderTarget, formState, callback);
        break;
      case 'eyeglass-job-note':
        this.currentFormInstance = new EyeglassJobNoteForm(renderTarget, formState, callback);
        break;
      case 'cms1500':
        this.currentFormInstance = new CMS1500Form(renderTarget, formState, callback);
        break;
      case 'fee-slip':
        this.currentFormInstance = new FeeSlipForm(renderTarget, formState, callback);
        break;
      case 'itemized-receipt':
        this.currentFormInstance = new ItemizedReceiptForm(renderTarget, formState, callback);
        break;
      case 'itemized-statement-request':
        this.currentFormInstance = new ItemizedStatementRequestForm(renderTarget, formState, callback);
        break;
      case 'bilingual-lens-waiver':
        this.currentFormInstance = new BilingualLensWaiverForm(renderTarget, formState, callback);
        break;
      case 'child-no-poly':
        this.currentFormInstance = new ChildNoPolyForm(renderTarget, formState, callback);
        break;
      case 'expired-rx':
        this.currentFormInstance = new ExpiredRxForm(renderTarget, formState, callback);
        break;
      case 'frame-no-child':
        this.currentFormInstance = new FrameNoChildForm(renderTarget, formState, callback);
        break;
      case 'patients-own-frame':
        this.currentFormInstance = new PatientsOwnFrameForm(renderTarget, formState, callback);
        break;
      case 'semi-rimless':
        this.currentFormInstance = new SemiRimlessWaiverForm(renderTarget, formState, callback);
        break;
      case 'single-vision':
        this.currentFormInstance = new SingleVisionConsentForm(renderTarget, formState, callback);
        break;
      case 'school-excuse-james':
        this.currentFormInstance = new SchoolExcuseForm(renderTarget, formState, callback, 'james');
        break;
      case 'school-excuse-carribyan':
        this.currentFormInstance = new SchoolExcuseForm(renderTarget, formState, callback, 'carribyan');
        break;
      case 'wellcare-spendables':
        this.currentFormInstance = new WellcareSpendablesForm(renderTarget, formState, callback);
        break;
      case 'staff-schedule':
        this.currentFormInstance = new EmbeddedDocForm(renderTarget, '/staff%20schedule.html', 'Staff Schedule');
        break;
      case 'notes-to-dr':
        this.currentFormInstance = new EmbeddedDocForm(renderTarget, '/Note%20to%20Dr.html', 'Important Notes to Doctor');
        break;
      case 'price-list':
        this.currentFormInstance = new EmbeddedDocForm(renderTarget, '/Pal%20Optical%20Lens%20Price%20List.html', 'Pal Optical Lens Price List');
        break;
      case 'optician-cheat-sheet':
        this.currentFormInstance = new EmbeddedDocForm(renderTarget, '/Pal%20Optical%20Lens%20Price%20List.html?view=cheatsheet', 'Optician Essential Chairside Guide');
        break;
      case 'eyecare-directory':
        this.currentFormInstance = new EmbeddedDocForm(renderTarget, '/Pal%20Optical%20Lens%20Price%20List.html?view=directory', 'Eye Care & Labs Directory');
        break;
      default:
        renderTarget.innerHTML = '<div class="form-card">Select a form from the menu.</div>';
    }
    
    // Restore mode visual classes on target
    this.toggleMode(this.activeMode);
    this.updateDocumentTitle();
  }
  
  updateHeader() {
    const title = this.getFormTitle(this.activeFormId);
    this.formActions.updateTitle(title);
    
    if (INSURANCE_DOCS[this.activeFormId]) {
      const doc = INSURANCE_DOCS[this.activeFormId];
      this.formActions.updateDescription(`${doc.desc} • ${doc.carrier}`);
      this.formActions.setControlsVisibility(false, true);
      this.formActions.setOpenTabUrl(doc.url);
      this.updateDocumentTitle();
      return;
    }

    if (this.activeFormId === 'staff-schedule') {
      this.formActions.updateDescription('Interactive 4-week staff schedule & single-page printout');
      this.formActions.setControlsVisibility(false, true);
      this.formActions.setOpenTabUrl('/staff%20schedule.html');
    } else if (this.activeFormId === 'notes-to-dr') {
      this.formActions.updateDescription('Patient communication notes for Dr. Robbins');
      this.formActions.setControlsVisibility(false, true);
      this.formActions.setOpenTabUrl('/Note%20to%20Dr.html');
    } else if (this.activeFormId === 'price-list') {
      this.formActions.updateDescription('Master price list for lenses, coatings, lab charges & dispensary surcharges (Oct 2026)');
      this.formActions.setControlsVisibility(false, true);
      this.formActions.setOpenTabUrl('/Pal%20Optical%20Lens%20Price%20List.html');
    } else if (this.activeFormId === 'optician-cheat-sheet') {
      this.formActions.updateDescription('Chairside troubleshooting guide, frame styling, nose pad angles & transposition');
      this.formActions.setControlsVisibility(false, true);
      this.formActions.setOpenTabUrl('/Pal%20Optical%20Lens%20Price%20List.html?view=cheatsheet');
    } else if (this.activeFormId === 'eyecare-directory') {
      this.formActions.updateDescription('Lexington eye surgeons, ODs, optical labs, account numbers & vision plans directory');
      this.formActions.setControlsVisibility(false, true);
      this.formActions.setOpenTabUrl('/Pal%20Optical%20Lens%20Price%20List.html?view=directory');
    } else if (this.activeFormId === 'itemized-statement-request') {
      this.formActions.updateDescription('Routing request for file clerk Tracy with mandatory attachments disclaimer');
      this.formActions.setControlsVisibility(true, true);
      this.formActions.setOpenTabUrl('/Itemized%20Statement%20Request.html');
    } else if (this.activeFormId === 'contact-lens-order') {
      this.formActions.updateDescription('Daily contact lens order sheet • Accumulate orders throughout the day & print at end of day');
      this.formActions.setControlsVisibility(true, true);
      this.formActions.setOpenTabUrl(null);
    } else if (this.activeFormId === 'contact-lens-pickup') {
      this.formActions.updateDescription('Waiting to be Picked Up tracking sheet (50 rows) • Contact arrivals, drawer locations & call logs');
      this.formActions.setControlsVisibility(true, true);
      this.formActions.setOpenTabUrl(null);
    } else if (this.activeFormId === 'bilingual-lens-waiver') {
      this.formActions.updateDescription('Polycarbonate balance lens refusal & assumption of risk waiver (bilingual)');
      this.formActions.setControlsVisibility(true, true);
      this.formActions.setOpenTabUrl(null);
    } else {
      this.formActions.updateDescription('Choose fill option or print directly');
      this.formActions.setControlsVisibility(true, true);
      this.formActions.setOpenTabUrl(null);
    }
    this.updateDocumentTitle();
  }
  
  saveFormState(formId, state) {
    this.formData[formId] = state;
    this.saveState();
    this.updateDocumentTitle();
  }
  
  resetForm() {
    if (this.currentFormInstance && typeof this.currentFormInstance.reset === 'function') {
      this.currentFormInstance.reset();
    }
    this.updateDocumentTitle();
  }
  
  printForm() {
    this.updateDocumentTitle();
    if (this.currentFormInstance && typeof this.currentFormInstance.print === 'function') {
      this.currentFormInstance.print();
    } else {
      window.print();
    }
  }

  getCurrentPatientName() {
    // 1. Check if the current form instance provides its own name getter
    if (this.currentFormInstance && typeof this.currentFormInstance.getPatientName === 'function') {
      const customName = this.currentFormInstance.getPatientName();
      if (customName && customName.trim()) {
        return this.sanitizeFileName(customName);
      }
    }

    const formId = this.activeFormId;
    if (INSURANCE_DOCS[formId]) {
      return this.sanitizeFileName(INSURANCE_DOCS[formId].title);
    }
    const state = this.formData[formId] || (this.currentFormInstance?.state) || {};
    let name = '';

    // 2. Try form-specific logic based on formId
    switch (formId) {
      case 'patient-info':
        name = state.name;
        break;
      case 'dr-side-patient':
        if (state.firstName || state.lastName) {
          name = `${state.firstName || ''} ${state.lastName || ''}`.trim();
        }
        break;
      case 'prior-auth':
        name = state.memberName;
        break;
      case 'price-quote':
        name = state.custName;
        break;
      case 'safety-order':
        name = state.Text_4;
        break;
      case 'contact-lens-order':
        this.currentFormInstance = new ContactLensOrderForm(renderTarget, formState, callback, { initialTab: 'pad' });
        break;
      case 'contact-lens-pickup':
        this.currentFormInstance = new ContactLensOrderForm(renderTarget, formState, callback, { initialTab: 'pickup' });
        break;
      case 'pd-record':
      case 'eyeglass-job-note':
      case 'itemized-receipt':
      case 'itemized-statement-request':
      case 'bilingual-lens-waiver':
      case 'child-no-poly':
      case 'expired-rx':
      case 'patients-own-frame':
      case 'semi-rimless':
      case 'single-vision':
      case 'school-excuse-james':
      case 'school-excuse-carribyan':
      case 'wellcare-spendables':
        name = state.patientName;
        break;
      case 'frame-no-child':
        name = state.childName || state.customerName;
        break;
      case 'writeup':
        name = state.patient_name;
        break;
      case 'cms1500':
        name = state['40'];
        break;
      case 'fee-slip':
        name = state.patientName || state.Text_1;
        break;
      case 'notes-to-dr': {
        try {
          const frame = document.getElementById('embedded-doc-frame');
          const frameDoc = frame?.contentDocument || frame?.contentWindow?.document;
          const input = frameDoc?.getElementById('patientName');
          if (input && input.value) name = input.value;
        } catch (e) {}
        break;
      }
      case 'staff-schedule': {
        try {
          const frame = document.getElementById('embedded-doc-frame');
          const frameDoc = frame?.contentDocument || frame?.contentWindow?.document;
          const picker = frameDoc?.getElementById('monthSelect');
          if (picker && picker.value) name = `Staff Schedule - ${picker.value}`;
        } catch (e) {}
        break;
      }
    }

    // 3. Fallback to active DOM elements inside form-render-target
    const renderTarget = document.getElementById('form-render-target');
    if (renderTarget) {
      // First, check currently focused input element inside the form viewport
      const activeEl = document.activeElement;
      if (activeEl && activeEl.tagName === 'INPUT' && renderTarget.contains(activeEl)) {
        const id = (activeEl.id || '').toLowerCase();
        const inputName = (activeEl.name || '').toLowerCase();
        const dataField = (activeEl.getAttribute('data-field') || '').toLowerCase();
        const placeholder = (activeEl.placeholder || '').toLowerCase();
        
        if (
          id.includes('name') || 
          inputName.includes('name') || 
          dataField.includes('name') || 
          placeholder.includes('name') ||
          activeEl.id === 'pa-member-name' ||
          activeEl.name === 'Text_4' ||
          activeEl.name === '40'
        ) {
          if (activeEl.value && activeEl.value.trim()) {
            name = activeEl.value.trim();
          }
        }
      }

      // If still empty, check known input selectors
      if (!name) {
        const knownSelectors = [
          '#pa-member-name',
          '#p-name',
          'input[data-field="patientName"]',
          '#excuse-patient-name',
          '#wc-patient-name',
          '#q-cust-name',
          '#bl-patient-name',
          '#poly-patient-name',
          '#rx-patient-name',
          '#fnc-child-name',
          '#fnc-customer-name',
          '#pof-patient-name',
          '#sr-patient-name',
          '#sv-patient-name',
          '#fs-patient-name',
          'input[name="patient_name"]',
          'input[name="40"]',
          'input[name="Text_4"]',
          'input[name="Text_1"]'
        ];

        for (const sel of knownSelectors) {
          const el = renderTarget.querySelector(sel);
          if (el && el.value && el.value.trim()) {
            name = el.value.trim();
            break;
          }
        }
      }

      // Check Dr Side New Patient inputs
      if (!name) {
        const fn = renderTarget.querySelector('#ds-first-name')?.value?.trim();
        const ln = renderTarget.querySelector('#ds-last-name')?.value?.trim();
        if (fn || ln) {
          name = `${fn || ''} ${ln || ''}`.trim();
        }
      }

      // Broad fallback for any text input with name in attributes
      if (!name) {
        const genericInput = renderTarget.querySelector('input[type="text"][id*="name" i], input[type="text"][name*="name" i], input[type="text"][data-field*="name" i]');
        if (genericInput && genericInput.value && genericInput.value.trim()) {
          name = genericInput.value.trim();
        }
      }
    }

    return this.sanitizeFileName(name);
  }

  sanitizeFileName(str) {
    if (!str || typeof str !== 'string') return '';
    // Strip characters that are illegal in Windows / file systems: \ / : * ? " < > | and control characters
    return str.trim().replace(/[\/\\:*?"<>|\x00-\x1F]/g, '').replace(/\s+/g, ' ');
  }

  updateDocumentTitle() {
    const patientName = this.getCurrentPatientName();
    if (patientName) {
      document.title = patientName;
    } else {
      const formTitle = this.getFormTitle(this.activeFormId) || 'Pal Optical Form';
      document.title = this.sanitizeFileName(formTitle.replace(/[\/]/g, '-'));
    }
  }
  
  // State Storage Helpers
  loadState() {
    try {
      const serialized = localStorage.getItem('pal-optical-form-data');
      if (serialized) {
        this.formData = JSON.parse(serialized);
      }
    } catch (e) {
      console.error('Error loading local state:', e);
      this.formData = {};
    }
  }
  
  saveState() {
    try {
      localStorage.setItem('pal-optical-form-data', JSON.stringify(this.formData));
    } catch (e) {
      console.error('Error saving local state:', e);
    }
  }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
