/* Pal Optical Forms Web App - Sidebar Component */

export class Sidebar {
  constructor(container, activeFormId, onSelectForm) {
    this.container = container;
    this.activeFormId = activeFormId;
    this.onSelectForm = onSelectForm;
    
    this.menuCategories = [
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
          { id: 'safety-order', label: 'Eagle Safety Order Form', icon: 'shield' },
          { id: 'pd-record', label: 'Pupillary Distance (PD) Record', icon: 'file-text' }
        ]
      },
      {
        title: 'Billing & Claims',
        items: [
          { id: 'cms1500', label: 'CMS-1500 Claim Worksheet', icon: 'activity' },
          { id: 'fee-slip', label: 'Office Fee Slip / Superbill', icon: 'file-text' },
          { id: 'wellcare-spendables', label: 'Wellcare Spendable Card Auth', icon: 'dollar-sign' }
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
      },
      {
        title: 'School & Work Excuses',
        items: [
          { id: 'school-excuse-james', label: 'School Excuse (James)', icon: 'file-text' },
          { id: 'school-excuse-carribyan', label: 'School Excuse (Carribyan)', icon: 'file-text' }
        ]
      }
    ];
    
    this.render();
    this.bindEvents();
  }
  
  render() {
    let menuHTML = '';
    
    this.menuCategories.forEach(cat => {
      menuHTML += `<div class="menu-category">${cat.title}</div>`;
      cat.items.forEach(item => {
        const isActive = item.id === this.activeFormId ? 'active' : '';
        const iconSVG = this.getIcon(item.icon);
        
        menuHTML += `
          <a class="menu-item ${isActive}" data-form-id="${item.id}">
            ${iconSVG}
            <span>${item.label}</span>
          </a>
        `;
      });
    });
    
    this.container.innerHTML = `
      <div class="sidebar-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <div>
          <div class="logo-text">PAL OPTICAL</div>
          <div class="logo-subtext">Office Forms</div>
        </div>
        <button type="button" class="sidebar-close-btn" id="sidebar-close" aria-label="Close menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Close
        </button>
      </div>
      
      <nav class="sidebar-menu">
        ${menuHTML}
      </nav>
      
      <div class="sidebar-footer">
        <span style="font-size: 0.75rem; color: #555; font-weight: 500;">Pal Optical &copy; Office Forms</span>
      </div>
    `;
  }
  
  bindEvents() {
    // Menu item clicks
    const items = this.container.querySelectorAll('.menu-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const formId = item.getAttribute('data-form-id');
        this.activeFormId = formId;
        
        // Update active class immediately in UI
        items.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        
        // Close mobile drawer after selecting a form
        this.closeMobileDrawer();
        
        // Trigger callback
        this.onSelectForm(formId);
      });
    });
    
    // Sidebar close button (mobile)
    const closeBtn = this.container.querySelector('#sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeMobileDrawer());
    }
  }
  
  closeMobileDrawer() {
    this.container.classList.remove('mobile-open');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
  }
  
  getIcon(iconName) {
    if (iconName === 'user') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    }
    if (iconName === 'file-text') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
    }
    if (iconName === 'dollar-sign') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
    }
    if (iconName === 'shield') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }
    if (iconName === 'activity') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
    }
    return '';
  }
}
