import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  DollarSign, 
  Shield, 
  Activity, 
  Sun, 
  Moon, 
  Printer, 
  RotateCcw
} from 'lucide-react';
import { FormWrapper } from './components/FormWrapper';
import { ReactFeeSlipForm } from './forms/ReactFeeSlipForm';

// Legacy Forms
import { PatientInfoForm } from './forms/PatientInfoForm.js';
import { DrSideNewPatientForm } from './forms/DrSideNewPatientForm.js';
import { PriorAuthForm } from './forms/PriorAuthForm.js';
import { PriceQuoteForm } from './forms/PriceQuoteForm.js';
import { SafetyOrderForm } from './forms/SafetyOrderForm.js';
import { CMS1500Form } from './forms/CMS1500Form.js';
import { ChildNoPolyForm } from './forms/ChildNoPolyForm.js';
import { ExpiredRxForm } from './forms/ExpiredRxForm.js';
import { FrameNoChildForm } from './forms/FrameNoChildForm.js';
import { PatientsOwnFrameForm } from './forms/PatientsOwnFrameForm.js';
import { SemiRimlessWaiverForm } from './forms/SemiRimlessWaiverForm.js';
import { SingleVisionConsentForm } from './forms/SingleVisionConsentForm.js';

// Legacy Form Class Registry
const FORM_CLASSES: Record<string, any> = {
  'patient-info': PatientInfoForm,
  'dr-side-patient': DrSideNewPatientForm,
  'prior-auth': PriorAuthForm,
  'price-quote': PriceQuoteForm,
  'safety-order': SafetyOrderForm,
  'cms1500': CMS1500Form,
  'child-no-poly': ChildNoPolyForm,
  'expired-rx': ExpiredRxForm,
  'frame-no-child': FrameNoChildForm,
  'patients-own-frame': PatientsOwnFrameForm,
  'semi-rimless': SemiRimlessWaiverForm,
  'single-vision': SingleVisionConsentForm,
};

interface MenuItem {
  id: string;
  label: string;
  icon: 'user' | 'file-text' | 'dollar-sign' | 'shield' | 'activity';
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export const App: React.FC = () => {
  const [activeFormId, setActiveFormId] = useState<string>('patient-info');
  const [activeMode, setActiveMode] = useState<string>('fill'); // 'fill' or 'print-blank'
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pal-optical-theme');
    return saved === 'dark';
  });

  // Master form state object loaded from localStorage
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    try {
      const serialized = localStorage.getItem('pal-optical-form-data');
      return serialized ? JSON.parse(serialized) : {};
    } catch (e) {
      console.error('Error loading local state:', e);
      return {};
    }
  });

  // Sync theme mode with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('pal-optical-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('pal-optical-theme', 'light');
    }
  }, [isDarkMode]);

  // Sync active form body classes for legacy compatibility
  useEffect(() => {
    // Clear active form classes
    const classesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('active-form-'));
    classesToRemove.forEach(c => document.body.classList.remove(c));
    
    // Add current active class
    document.body.classList.add(`active-form-${activeFormId}`);
  }, [activeFormId]);

  const menuCategories: MenuCategory[] = [
    {
      title: 'Patient Administration',
      items: [
        { id: 'patient-info', label: 'Patient Information Sheet', icon: 'user' },
        { id: 'dr-side-patient', label: 'Dr. Side New Patient Form', icon: 'user' }
      ]
    },
    {
      title: 'Orders & Calculations',
      items: [
        { id: 'prior-auth', label: 'Medicaid / Avesis Prior Auth', icon: 'file-text' },
        { id: 'price-quote', label: 'Eyewear Price Quote', icon: 'dollar-sign' },
        { id: 'safety-order', label: 'Eagle Safety Order Form', icon: 'shield' }
      ]
    },
    {
      title: 'Billing & Claims',
      items: [
        { id: 'cms1500', label: 'CMS-1500 Claim Worksheet', icon: 'activity' },
        { id: 'fee-slip', label: 'Office Fee Slip / Superbill', icon: 'file-text' }
      ]
    },
    {
      title: 'Waivers & Consents',
      items: [
        { id: 'child-no-poly', label: 'Refusal of Polycarbonate', icon: 'shield' },
        { id: 'expired-rx', label: 'Expired Rx Consent', icon: 'file-text' },
        { id: 'frame-no-child', label: 'Frame Selection w/o Child', icon: 'user' },
        { id: 'patients-own-frame', label: "Notice: Patient's Own Frame", icon: 'file-text' },
        { id: 'semi-rimless', label: 'Semi-Rimless in Plastic', icon: 'shield' },
        { id: 'single-vision', label: 'Single Vision Consent', icon: 'file-text' }
      ]
    }
  ];

  const getFormTitle = (formId: string): string => {
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
  };

  const renderIcon = (iconName: string) => {
    const size = 18;
    switch (iconName) {
      case 'user': return <User size={size} />;
      case 'file-text': return <FileText size={size} />;
      case 'dollar-sign': return <DollarSign size={size} />;
      case 'shield': return <Shield size={size} />;
      case 'activity': return <Activity size={size} />;
      default: return null;
    }
  };

  // State Change handler that updates localStorage
  const handleStateChange = (formId: string, newState: any) => {
    setFormData(prev => {
      const updated = { ...prev, [formId]: newState };
      try {
        localStorage.setItem('pal-optical-form-data', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving local state:', e);
      }
      return updated;
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all inputs on this form?')) {
      // Clear data for this form
      handleStateChange(activeFormId, {});
      // Increment reset trigger to notify components
      setResetTrigger(prev => prev + 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar flex flex-col h-screen select-none print:hidden">
        {/* Sidebar Header */}
        <div className="sidebar-header flex items-center gap-3">
          <svg className="w-8 h-8 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <div>
            <div className="logo-text text-base leading-none">PAL OPTICAL</div>
            <div className="logo-subtext text-[10px] uppercase leading-none mt-1">Office Forms</div>
          </div>
        </div>

        {/* Sidebar Navigation List */}
        <nav className="sidebar-menu flex-1 overflow-y-auto py-4">
          {menuCategories.map((cat, index) => (
            <div key={index}>
              <div className="menu-category">{cat.title}</div>
              {cat.items.map(item => {
                const isActive = item.id === activeFormId;
                return (
                  <a
                    key={item.id}
                    onClick={() => setActiveFormId(item.id)}
                    className={`menu-item flex items-center gap-3 ${isActive ? 'active' : ''}`}
                  >
                    {renderIcon(item.icon)}
                    <span className="text-[13px]">{item.label}</span>
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer - Theme Toggle */}
        <div className="sidebar-footer p-4 flex items-center justify-between border-t">
          <span className="text-xs font-bold uppercase tracking-wider">Theme Mode</span>
          <button 
            type="button" 
            onClick={() => setIsDarkMode(prev => !prev)}
            className="theme-toggle-btn w-10 h-10"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Display Panel */}
      <main className="main-panel flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)]">
        {/* Actions Toolbar Header */}
        <header className="actions-header flex justify-between items-center px-8 h-[70px] shrink-0 select-none print:hidden">
          <div className="header-title-container">
            <h1 className="text-lg leading-tight uppercase font-black tracking-tight">{getFormTitle(activeFormId)}</h1>
            <p className="text-[11px] leading-tight font-bold uppercase tracking-wider mt-0.5">
              Choose fill option or print directly
            </p>
          </div>
          
          <div className="actions-toolbar flex items-center gap-4">
            {/* Mode Switcher */}
            <div className="toggle-group flex border overflow-hidden">
              <div 
                onClick={() => setActiveMode('fill')}
                className={`toggle-option px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-r ${activeMode === 'fill' ? 'active' : ''}`}
              >
                Fill Digitally
              </div>
              <div 
                onClick={() => setActiveMode('print-blank')}
                className={`toggle-option px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer ${activeMode === 'print-blank' ? 'active' : ''}`}
              >
                Print Blank Form
              </div>
            </div>
            
            {/* Reset Button */}
            <button 
              type="button" 
              onClick={handleReset}
              className="btn btn-secondary px-4 py-2 text-xs font-black"
              title="Reset all fields to blank"
            >
              <RotateCcw size={14} />
              Reset Form
            </button>
            
            {/* Print Button */}
            <button 
              type="button" 
              onClick={handlePrint}
              className="btn btn-primary px-4 py-2 text-xs font-black"
            >
              <Printer size={14} />
              Print Form
            </button>
          </div>
        </header>

        {/* Form Rendering Viewport */}
        <section 
          id="form-render-target" 
          className={`form-viewport flex-1 overflow-y-auto p-8 bg-[var(--bg-primary)] ${activeMode === 'print-blank' ? 'print-blank-active print-mode' : ''}`}
        >
          {activeFormId === 'fee-slip' ? (
            <ReactFeeSlipForm 
              initialState={formData['fee-slip'] || {}} 
              onStateChange={(state) => handleStateChange('fee-slip', state)}
              resetTrigger={resetTrigger}
            />
          ) : (
            <FormWrapper 
              FormClass={FORM_CLASSES[activeFormId]} 
              initialState={formData[activeFormId] || {}} 
              onStateChange={(state) => handleStateChange(activeFormId, state)}
              resetTrigger={resetTrigger}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
