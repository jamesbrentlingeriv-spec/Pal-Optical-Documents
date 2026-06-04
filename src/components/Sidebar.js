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
      </div>
      
      <nav class="sidebar-menu">
        ${menuHTML}
      </nav>
      
      <div class="sidebar-footer">
        <span style="font-size: 0.8rem; font-weight: 500;">Theme Mode</span>
        <button type="button" class="theme-toggle-btn" id="theme-toggle" title="Toggle Theme">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-sun-icon">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.72" x2="5.64" y2="18.3"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
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
        
        // Trigger callback
        this.onSelectForm(formId);
      });
    });
    
    // Theme toggle click
    const toggleBtn = this.container.querySelector('#theme-toggle');
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('pal-optical-theme', isDark ? 'dark' : 'light');
    });
    
    // Initialize theme based on preference
    const savedTheme = localStorage.getItem('pal-optical-theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
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
