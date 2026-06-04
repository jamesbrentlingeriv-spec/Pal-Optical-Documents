/* Pal Optical Forms Web App - Signature Pad Component */

export class SignaturePad {
  constructor(container, id, placeholderText = 'Sign here with finger or mouse') {
    this.container = container;
    this.id = id;
    this.placeholderText = placeholderText;
    
    this.isDrawing = false;
    this.hasSignature = false;
    this.strokes = [];
    this.currentStroke = [];
    
    this.initDOM();
    this.initCanvas();
    this.initEvents();
  }
  
  initDOM() {
    this.container.innerHTML = `
      <div class="signature-component" id="sig-comp-${this.id}">
        <label>Patient/Authorized Signature</label>
        <div class="signature-canvas-wrapper">
          <div class="signature-placeholder" id="sig-placeholder-${this.id}">${this.placeholderText}</div>
          <canvas id="sig-canvas-${this.id}"></canvas>
        </div>
        <div class="signature-controls">
          <button type="button" class="btn btn-secondary btn-sm" id="sig-clear-${this.id}">Clear</button>
          <button type="button" class="btn btn-secondary btn-sm" id="sig-undo-${this.id}">Undo</button>
        </div>
      </div>
    `;
    
    this.canvasWrapper = this.container.querySelector('.signature-canvas-wrapper');
    this.canvas = this.container.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.placeholder = this.container.querySelector('.signature-placeholder');
    
    this.clearBtn = this.container.querySelector(`#sig-clear-${this.id}`);
    this.undoBtn = this.container.querySelector(`#sig-undo-${this.id}`);
  }
  
  initCanvas() {
    // Setup drawing styles
    this.ctx.strokeStyle = '#0f172a'; // Deep slate ink
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Resize handler
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    // Save current drawings
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (this.hasSignature) {
      tempCtx.drawImage(this.canvas, 0, 0);
    }
    
    // Set actual canvas pixels to match bounding box CSS
    const rect = this.canvasWrapper.getBoundingClientRect();
    this.canvas.width = rect.width || 400;
    this.canvas.height = rect.height || 150;
    
    // Re-draw styles (resizing resets canvas context)
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Restore signature
    if (this.hasSignature) {
      this.ctx.drawImage(tempCanvas, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  initEvents() {
    // Mouse Events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e.clientX, e.clientY));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e.clientX, e.clientY));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    
    // Touch Events (mobile/finger drawing)
    this.canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.startDrawing(touch.clientX, touch.clientY);
      e.preventDefault();
    }, { passive: false });
    
    this.canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.draw(touch.clientX, touch.clientY);
      e.preventDefault();
    }, { passive: false });
    
    this.canvas.addEventListener('touchend', () => this.stopDrawing());
    
    // Control Buttons
    this.clearBtn.addEventListener('click', () => this.clear());
    this.undoBtn.addEventListener('click', () => this.undo());
  }
  
  getCoordinates(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  
  startDrawing(clientX, clientY) {
    this.isDrawing = true;
    const { x, y } = this.getCoordinates(clientX, clientY);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.currentStroke = [{ x, y }];
    
    // Hide placeholder text on draw
    this.placeholder.style.display = 'none';
  }
  
  draw(clientX, clientY) {
    if (!this.isDrawing) return;
    const { x, y } = this.getCoordinates(clientX, clientY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.currentStroke.push({ x, y });
  }
  
  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.strokes.push(this.currentStroke);
    this.currentStroke = [];
    this.hasSignature = true;
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.strokes = [];
    this.hasSignature = false;
    this.placeholder.style.display = 'block';
    
    // Trigger custom clear event
    const event = new CustomEvent('signature-change', { detail: { id: this.id, empty: true } });
    this.canvas.dispatchEvent(event);
  }
  
  undo() {
    if (this.strokes.length === 0) return;
    this.strokes.pop();
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.strokes.length === 0) {
      this.hasSignature = false;
      this.placeholder.style.display = 'block';
      
      const event = new CustomEvent('signature-change', { detail: { id: this.id, empty: true } });
      this.canvas.dispatchEvent(event);
      return;
    }
    
    // Redraw all strokes
    this.strokes.forEach(stroke => {
      this.ctx.beginPath();
      this.ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        this.ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      this.ctx.stroke();
    });
  }
  
  getDataUrl() {
    if (!this.hasSignature) return null;
    return this.canvas.toDataURL('image/png');
  }
  
  setDataUrl(dataUrl) {
    if (!dataUrl) {
      this.clear();
      return;
    }
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.hasSignature = true;
      this.placeholder.style.display = 'none';
    };
  }
  
  isEmpty() {
    return !this.hasSignature;
  }
}
