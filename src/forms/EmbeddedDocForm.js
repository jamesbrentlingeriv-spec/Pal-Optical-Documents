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
    this.container.innerHTML = `
      <div class="embedded-doc-container">
        <iframe 
          src="${this.docUrl}" 
          class="embedded-doc-iframe" 
          title="${this.docTitle}"
          id="embedded-doc-frame"
          allow="clipboard-write"
        ></iframe>
      </div>
    `;

    this.iframe = this.container.querySelector('#embedded-doc-frame');
  }

  print() {
    if (this.iframe && this.iframe.contentWindow) {
      try {
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
