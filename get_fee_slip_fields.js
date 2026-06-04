const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function extractFields() {
  const pdfBytes = fs.readFileSync('fee slip.pdf');
  const doc = await PDFDocument.load(pdfBytes);
  const form = doc.getForm();
  const fields = form.getFields();
  const pages = doc.getPages();
  const page0 = pages[0];
  const { width: pageWidth, height: pageHeight } = page0.getSize();
  
  console.log(`PDF Pages: ${pages.length}`);
  console.log(`Interactive Fields found: ${fields.length}`);
  
  const extractedFields = [];

  fields.forEach(field => {
    const name = field.getName();
    const type = field.constructor.name;
    const widgets = field.acroField.getWidgets();
    
    widgets.forEach((widget, idx) => {
      const rect = widget.Rect().asRectangle();
      
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

  console.log('Sample fields:', extractedFields.slice(0, 10));
  
  fs.writeFileSync('src/forms/fee_slip_fields.json', JSON.stringify({
    pageWidth: parseFloat(pageWidth.toFixed(2)),
    pageHeight: parseFloat(pageHeight.toFixed(2)),
    fields: extractedFields
  }, null, 2));
  
  console.log('Saved to src/forms/fee_slip_fields.json');
}

extractFields().catch(console.error);
