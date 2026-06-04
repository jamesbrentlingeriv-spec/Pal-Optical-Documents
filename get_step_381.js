const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function extractFields() {
  const pdfBytes = fs.readFileSync('cms1500-form.pdf');
  const doc = await PDFDocument.load(pdfBytes);
  const form = doc.getForm();
  const fields = form.getFields();
  const pages = doc.getPages();
  const page0 = pages[0];
  const { width: pageWidth, height: pageHeight } = page0.getSize();
  
  const extractedFields = [];

  fields.forEach(field => {
    const name = field.getName();
    // Get class name
    const type = field.constructor.name;
    const widgets = field.acroField.getWidgets();
    
    widgets.forEach((widget, idx) => {
      const rect = widget.Rect().asRectangle();
      
      // Convert bottom-left coordinates to top-left coordinates
      const x = rect.x;
      const y = pageHeight - (rect.y + rect.height);
      const width = rect.width;
      const height = rect.height;
      
      extractedFields.push({
        name: idx === 0 ? name : `${name}_${idx}`,
        originalName: name,
        type: type,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
        width: parseFloat(width.toFixed(2)),
        height: parseFloat(height.toFixed(2))
      });
    });
  });

  fs.writeFileSync('src/forms/cms1500_fields.json', JSON.stringify({
    pageWidth: parseFloat(pageWidth.toFixed(2)),
    pageHeight: parseFloat(pageHeight.toFixed(2)),
    fields: extractedFields
  }, null, 2));

  console.log(`Successfully extracted ${extractedFields.length} fields!`);
}

extractFields().catch(console.error);
