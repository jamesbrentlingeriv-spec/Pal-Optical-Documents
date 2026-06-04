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
import { DrSideNewPatientForm } from './forms/DrSideNewPatientForm.js';

// Waivers
import { ChildNoPolyForm } from './forms/ChildNoPolyForm.js';
import { ExpiredRxForm } from './forms/ExpiredRxForm.js';
import { FrameNoChildForm } from './forms/FrameNoChildForm.js';
import { PatientsOwnFrameForm } from './forms/PatientsOwnFrameForm.js';
import { SemiRimlessWaiverForm } from './forms/SemiRimlessWaiverForm.js';
import { SingleVisionConsentForm } from './forms/SingleVisionConsentForm.js';

class App {
  constructor() {
    this.activeFormId = 'patient-info';
    this.activeMode = 'fill'; // 'fill' or 'print-blank'
    this.formData = {}; // Stores state for each formId
    
    this.sidebar = null;
    this.formActions = null;
    this.currentFormInstance = null;
    
    this.loadState();
    this.initDOM();
    this.renderActiveForm();
  }
  
  initDOM() {
    const sidebarTarget = document.getElementById('sidebar-target');
    const actionsTarget = document.getElementById('form-actions-target');
    
    // Instantiate Sidebar
    this.sidebar = new Sidebar(sidebarTarget, this.activeFormId, (formId) => {
      this.activeFormId = formId;
      this.renderActiveForm();
      this.updateHeader();
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
  }
  
  getFormTitle(formId) {
    switch (formId) {
      case 'patient-info': return 'Patient Information Sheet';
      case 'dr-side-patient': return 'Dr. Side New Patient Form';
      case 'prior-auth': return 'Medicaid / Avesis Prior Auth';
      case 'price-quote': return 'Eyewear Price Quote';
      case 'safety-order': return 'Eagle Safety Order Form';
      case 'cms1500': return 'CMS-1500 Claim Worksheet';
      case 'fee-slip': return 'Office Fee Slip / Superbill';
      case 'child-no-poly': return 'Refusal of Polycarbonate';
      case 'expired-rx': return 'Expired Rx Consent';
      case 'frame-no-child': return 'Frame Selection w/o Child';
      case 'patients-own-frame': return "Notice: Patient's Own Frame";
      case 'semi-rimless': return 'Semi-Rimless in Plastic';
      case 'single-vision': return 'Single Vision Consent';
      default: return 'Pal Optical Form';
    }
  }
  
  toggleMode(mode) {
    this.activeMode = mode;
    const renderTarget = document.getElementById('form-render-target');
    
    if (mode === 'print-blank') {
      renderTarget.classList.add('print-blank-active');
      renderTarget.classList.add('print-mode');
    } else {
      renderTarget.classList.remove('print-blank-active');
      renderTarget.classList.remove('print-mode');
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
      case 'cms1500':
        this.currentFormInstance = new CMS1500Form(renderTarget, formState, callback);
        break;
      case 'fee-slip':
        this.currentFormInstance = new FeeSlipForm(renderTarget, formState, callback);
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
      default:
        renderTarget.innerHTML = '<div class="form-card">Select a form from the menu.</div>';
    }
    
    // Restore mode visual classes on target
    this.toggleMode(this.activeMode);
  }
  
  updateHeader() {
    const title = this.getFormTitle(this.activeFormId);
    this.formActions.updateTitle(title);
    
    this.formActions.updateDescription('Choose fill option or print directly');
    this.formActions.setControlsVisibility(true, true);
  }
  
  saveFormState(formId, state) {
    this.formData[formId] = state;
    this.saveState();
  }
  
  resetForm() {
    if (this.currentFormInstance && typeof this.currentFormInstance.reset === 'function') {
      this.currentFormInstance.reset();
    }
  }
  
  printForm() {
    // If we want to print blank, we make sure the viewport classes are active,
    // then trigger browser print. Print stylesheet handles layout adjustments.
    window.print();
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
