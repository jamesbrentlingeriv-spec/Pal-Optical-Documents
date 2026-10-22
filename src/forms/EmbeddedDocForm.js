/* Pal Optical Forms Web App - Embedded HTML Document Viewer */

export class EmbeddedDocForm {
  constructor(container, docUrl, docTitle) {
    this.container = container;
    this.docUrl = docUrl;
    this.docTitle = docTitle;
    this.iframe = null;

    this.render();
  }

  render() {
    let resolvedUrl = this.docUrl;
    if (window.location.protocol === 'file:' && resolvedUrl.startsWith('/')) {
      resolvedUrl = '.' + resolvedUrl;
    }
    this.container.innerHTML = `
      <div class="embedded-doc-container">
        <iframe 
          src="${resolvedUrl}" 
          class="embedded-doc-iframe" 
          title="${this.docTitle}"
          id="embedded-doc-frame"
          allow="clipboard-write"
        ></iframe>
      </div>
    `;

    this.iframe = this.container.querySelector('#embedded-doc-frame');
    if (this.iframe) {
      this.iframe.addEventListener('load', () => {
        try {
          const doc = this.iframe.contentDocument || this.iframe.contentWindow?.document;
          if (doc) {
            const onInput = () => {
              if (window.app && typeof window.app.updateDocumentTitle === 'function') {
                window.app.updateDocumentTitle();
              }
            };
            doc.addEventListener('input', onInput);
            doc.addEventListener('change', onInput);
            // Also trigger initial title sync once loaded
            if (window.app && typeof window.app.updateDocumentTitle === 'function') {
              window.app.updateDocumentTitle();
            }
          }
        } catch (e) {
          // Cross-origin fallback
        }
      });
    }
  }

  getPatientName() {
    try {
      if (this.iframe) {
        const doc = this.iframe.contentDocument || this.iframe.contentWindow?.document;
        if (doc) {
          const nameEl = doc.querySelector('#patientName, #p-name, input[name="patientName"], input[data-field="patientName"]');
          if (nameEl && nameEl.value && nameEl.value.trim()) {
            return nameEl.value.trim();
          }
          const monthEl = doc.querySelector('#monthSelect');
          if (monthEl && monthEl.value && monthEl.value.trim()) {
            return `Staff Schedule - ${monthEl.value.trim()}`;
          }
        }
      }
    } catch (e) {}
    return '';
  }

  print() {
    if (this.iframe && this.iframe.contentWindow) {
      try {
        const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        const patientName = this.getPatientName();
        if (doc && patientName) {
          doc.title = patientName;
          document.title = patientName;
        }
        this.iframe.contentWindow.focus();
        this.iframe.contentWindow.print();
        return;
      } catch (e) {
        console.warn('Iframe print access failed, falling back to window.print():', e);
      }
    }
    window.print();
  }

  reset() {
    if (this.iframe && this.iframe.contentWindow) {
      try {
        if (typeof this.iframe.contentWindow.confirmClear === 'function') {
          this.iframe.contentWindow.confirmClear();
          return;
        }
        if (typeof this.iframe.contentWindow.clearStaffOnly === 'function') {
          this.iframe.contentWindow.clearStaffOnly();
          return;
        }
        this.iframe.contentWindow.location.reload();
      } catch (e) {
        this.iframe.src = this.docUrl;
      }
    }
  }

  destroy() {
    this.iframe = null;
  }
}
