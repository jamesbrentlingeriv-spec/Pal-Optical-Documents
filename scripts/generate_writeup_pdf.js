import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, '..');

// Exact coordinate transformations:
// 1 pixel = 0.36 points (200 DPI scan -> 72 pt/in)
// Physical paper: 5.5" x 8.5" = 396 pt x 612 pt
// Left edge of paper is at scan pixel -45. X_pt = 16.2 + X_px * 0.36
// Top edge of paper is at scan pixel 0. Y_pt = 612 - (Y_px * 0.36)

function pxToPtX(px) {
  return +(16.2 + px * 0.36).toFixed(2);
}

function pxToPtY(py) {
  return +(612 - (py * 0.36)).toFixed(2);
}

// Field definition list
export const fieldsConfig = [
  // Order / Invoice number at top right (over 40080)
  {
    name: 'order_number',
    label: 'Order / Invoice #',
    type: 'text',
    x: pxToPtX(815),
    y: pxToPtY(58),
    width: +((930 - 815) * 0.36).toFixed(2),
    height: 18,
    fontSize: 12,
    alignment: 'right',
    fontBold: true
  },
  // Header: Date
  {
    name: 'date',
    label: 'Date',
    type: 'text',
    x: pxToPtX(671),
    y: pxToPtY(112),
    width: +((941 - 671) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  // Patient Info
  {
    name: 'patient_name',
    label: 'Patient Name',
    type: 'text',
    x: pxToPtX(114),
    y: pxToPtY(162),
    width: +((944 - 114) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_street',
    label: 'Street Address',
    type: 'text',
    x: pxToPtX(121),
    y: pxToPtY(216),
    width: +((952 - 121) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_city',
    label: 'City',
    type: 'text',
    x: pxToPtX(83),
    y: pxToPtY(266),
    width: +((496 - 83) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_state',
    label: 'State',
    type: 'text',
    x: pxToPtX(582),
    y: pxToPtY(266),
    width: +((691 - 582) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_zip',
    label: 'Zip Code',
    type: 'text',
    x: pxToPtX(729),
    y: pxToPtY(266),
    width: +((948 - 729) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_phone',
    label: 'Phone Number',
    type: 'text',
    x: pxToPtX(122),
    y: pxToPtY(321),
    width: +((951 - 122) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  // Frame Specs & Measurements
  {
    name: 'frame_model',
    label: 'Frame Model / Size',
    type: 'text',
    x: pxToPtX(124),
    y: pxToPtY(432),
    width: +((953 - 124) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'pd',
    label: 'P.D. (Pupillary Distance)',
    type: 'text',
    x: pxToPtX(77),
    y: pxToPtY(484),
    width: +((302 - 77) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'seg_height',
    label: 'Seg Height',
    type: 'text',
    x: pxToPtX(468),
    y: pxToPtY(484),
    width: +((630 - 468) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'blue_light',
    label: 'Blue Light Filter',
    type: 'text',
    x: pxToPtX(796),
    y: pxToPtY(484),
    width: +((958 - 796) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'frame_color',
    label: 'Frame Color',
    type: 'text',
    x: pxToPtX(118),
    y: pxToPtY(537),
    width: +((486 - 118) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'sc',
    label: 'S/C (Scratch Coat)',
    type: 'text',
    x: pxToPtX(542),
    y: pxToPtY(537),
    width: +((680 - 542) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'ar',
    label: 'A/R (Anti-Reflective)',
    type: 'text',
    x: pxToPtX(738),
    y: pxToPtY(537),
    width: +((953 - 738) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'time_promised',
    label: 'Time Promised',
    type: 'text',
    x: pxToPtX(239),
    y: pxToPtY(588),
    width: +((679 - 239) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'uv',
    label: 'U/V Coating',
    type: 'text',
    x: pxToPtX(735),
    y: pxToPtY(588),
    width: +((961 - 735) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  // Paid By Checkboxes:
  {
    name: 'paid_cash',
    label: 'Paid Cash',
    type: 'checkbox',
    x: 101.1,
    y: 379.2,
    width: 12,
    height: 12
  },
  {
    name: 'paid_check',
    label: 'Paid Check',
    type: 'checkbox',
    x: 141.6,
    y: 378.8,
    width: 12,
    height: 12
  },
  {
    name: 'paid_credit_card',
    label: 'Paid Credit Card',
    type: 'checkbox',
    x: 183.0,
    y: 378.5,
    width: 12,
    height: 12
  },
  // Left Column Pricing Amounts
  {
    name: 'charge_frame',
    label: 'Frame Price',
    type: 'text',
    x: pxToPtX(120),
    y: pxToPtY(739),
    width: +((640 - 120) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_lenses',
    label: 'Lenses Price',
    type: 'text',
    x: pxToPtX(116),
    y: pxToPtY(812),
    width: +((636 - 116) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_misc',
    label: 'Misc Price',
    type: 'text',
    x: pxToPtX(102),
    y: pxToPtY(892),
    width: +((639 - 102) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_disc',
    label: 'Discount',
    type: 'text',
    x: pxToPtX(90),
    y: pxToPtY(963),
    width: +((628 - 90) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_tax',
    label: 'Tax',
    type: 'text',
    x: pxToPtX(85),
    y: pxToPtY(1036),
    width: +((647 - 85) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_total',
    label: 'Total',
    type: 'text',
    x: pxToPtX(101),
    y: pxToPtY(1108),
    width: +((664 - 101) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right',
    fontBold: true
  },
  {
    name: 'charge_dep',
    label: 'Deposit',
    type: 'text',
    x: pxToPtX(76),
    y: pxToPtY(1176),
    width: +((638 - 76) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_bal',
    label: 'Balance Due',
    type: 'text',
    x: pxToPtX(76),
    y: pxToPtY(1253),
    width: +((638 - 76) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10,
    alignment: 'right',
    fontBold: true
  },
  // Right Column Lens Features & Materials
  {
    name: 'lens_plastic',
    label: 'Plastic',
    type: 'checkbox',
    x: 259.2,
    y: 358.3,
    width: 12,
    height: 12
  },
  {
    name: 'lens_poly',
    label: 'Polycarbonate',
    type: 'checkbox',
    x: 300.6,
    y: 358.3,
    width: 12,
    height: 12
  },
  {
    name: 'hi_index',
    label: 'Hi-Index Spec',
    type: 'text',
    x: pxToPtX(830),
    y: pxToPtY(784),
    width: +((974 - 830) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'lens_trivex',
    label: 'Trivex',
    type: 'checkbox',
    x: 259.2,
    y: 302.5,
    width: 12,
    height: 12
  },
  {
    name: 'lens_glass',
    label: 'Glass',
    type: 'checkbox',
    x: 306.0,
    y: 302.5,
    width: 12,
    height: 12
  },
  {
    name: 'lens_sv',
    label: 'Single Vision (SV)',
    type: 'checkbox',
    x: 255.6,
    y: 263.8,
    width: 12,
    height: 12
  },
  {
    name: 'lens_ft28',
    label: 'Flat Top 28 (FT-28)',
    type: 'checkbox',
    x: 272.5,
    y: 263.8,
    width: 12,
    height: 12
  },
  {
    name: 'lens_ft35',
    label: 'Flat Top 35 (FT-35)',
    type: 'checkbox',
    x: 304.9,
    y: 263.8,
    width: 12,
    height: 12
  },
  {
    name: 'lens_7x28',
    label: '7x28 Trifocal',
    type: 'checkbox',
    x: 255.6,
    y: 238.4,
    width: 12,
    height: 12
  },
  {
    name: 'lens_7x35',
    label: '7x35 Trifocal',
    type: 'checkbox',
    x: 279.7,
    y: 238.4,
    width: 12,
    height: 12
  },
  {
    name: 'lens_rd22',
    label: 'Round 22 (RD22)',
    type: 'checkbox',
    x: 308.5,
    y: 238.4,
    width: 12,
    height: 12
  },
  {
    name: 'progressive',
    label: 'Progressive Lens Brand/Type',
    type: 'text',
    x: pxToPtX(769),
    y: pxToPtY(1108),
    width: +((1005 - 769) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'lens_other',
    label: 'Other Lens Specs',
    type: 'text',
    x: pxToPtX(757),
    y: pxToPtY(1176),
    width: +((1005 - 757) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'insurance',
    label: 'Insurance Details',
    type: 'text',
    x: pxToPtX(724),
    y: pxToPtY(1253),
    width: +((991 - 724) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  // Rx Table Grid:
  // Row R (OD): Y=1346 to 1406
  {
    name: 'rx_r_sph',
    label: 'OD Sphere',
    type: 'text',
    x: 43.2,
    y: 106.0,
    width: 63.7,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_cyl',
    label: 'OD Cylinder',
    type: 'text',
    x: 107.3,
    y: 106.0,
    width: 55.8,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_axis',
    label: 'OD Axis',
    type: 'text',
    x: 163.4,
    y: 106.0,
    width: 51.5,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_add',
    label: 'OD Add',
    type: 'text',
    x: 215.3,
    y: 106.0,
    width: 60.8,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_prism',
    label: 'OD Prism',
    type: 'text',
    x: 276.5,
    y: 106.0,
    width: 99.7,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  // Row L (OS): Y=1408 to 1468
  {
    name: 'rx_l_sph',
    label: 'OS Sphere',
    type: 'text',
    x: 43.2,
    y: 84.0,
    width: 63.7,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_cyl',
    label: 'OS Cylinder',
    type: 'text',
    x: 107.3,
    y: 84.0,
    width: 55.8,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_axis',
    label: 'OS Axis',
    type: 'text',
    x: 163.4,
    y: 84.0,
    width: 51.5,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_add',
    label: 'OS Add',
    type: 'text',
    x: 215.3,
    y: 84.0,
    width: 60.8,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_prism',
    label: 'OS Prism',
    type: 'text',
    x: 276.5,
    y: 84.0,
    width: 99.7,
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  // Bottom Section
  {
    name: 'rx_doctor',
    label: 'Prescribing Doctor',
    type: 'text',
    x: pxToPtX(188),
    y: pxToPtY(1580),
    width: +((965 - 188) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'notif',
    label: 'Notification Status',
    type: 'text',
    x: pxToPtX(97),
    y: pxToPtY(1629),
    width: +((551 - 97) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  },
  {
    name: 'disp',
    label: 'Dispensed By',
    type: 'text',
    x: pxToPtX(643),
    y: pxToPtY(1629),
    width: +((957 - 643) * 0.36).toFixed(2),
    height: 16,
    fontSize: 10
  }
];

async function createWriteUpPDF(options = {}) {
  const { includeBackground = true, blankNumber = false, outputPath } = options;
  const pdfDoc = await PDFDocument.create();
  
  // Standard Statement / Half-Letter (5.5" x 8.5") in points: 396 x 612
  const pageWidth = 396;
  const pageHeight = 612;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  
  if (includeBackground) {
    const bgFileName = blankNumber ? 'scanned_writeup_blank_num.jpg' : 'scanned_writeup_clean.jpg';
    const bgPath = path.join(baseDir, bgFileName);
    const bgBytes = fs.readFileSync(bgPath);
    const bgImage = await pdfDoc.embedJpg(bgBytes);
    
    // Draw background image precisely scaled to 200 DPI (0.36 pt/px)
    page.drawImage(bgImage, {
      x: 16.2,
      y: 612 - (1667 * 0.36),
      width: 1072 * 0.36,
      height: 1667 * 0.36,
    });
  }
  
  const form = pdfDoc.getForm();
  
  for (const f of fieldsConfig) {
    if (f.type === 'checkbox') {
      const cb = form.createCheckBox(f.name);
      cb.addToPage(page, {
        x: f.x,
        y: f.y,
        width: f.width,
        height: f.height,
        textColor: rgb(0, 0, 0),
        backgroundColor: undefined,
        borderColor: undefined,
        borderWidth: 0
      });
    } else {
      const tf = form.createTextField(f.name);
      tf.addToPage(page, {
        x: f.x,
        y: f.y,
        width: f.width,
        height: f.height,
        textColor: rgb(0, 0, 0),
        backgroundColor: undefined,
        borderColor: undefined,
        borderWidth: 0
      });
      if (f.fontSize) {
        tf.setFontSize(f.fontSize);
      }
      if (f.alignment === 'right') {
        tf.setAlignment(2); // Right
      } else if (f.alignment === 'center') {
        tf.setAlignment(1); // Center
      }
    }
  }
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Generated: ${outputPath} (${pdfBytes.length} bytes)`);
}

async function main() {
  console.log('Generating Pal Optical Write-Up forms...');
  
  // 1. Full form fillable PDF (with clean background and interactive fields)
  await createWriteUpPDF({
    includeBackground: true,
    blankNumber: false,
    outputPath: path.join(baseDir, 'write up - fillable.pdf')
  });
  
  // 2. Blank number version (for typing custom order numbers on blank paper)
  await createWriteUpPDF({
    includeBackground: true,
    blankNumber: true,
    outputPath: path.join(baseDir, 'write up - fillable (blank order num).pdf')
  });

  // 3. Print Overlay Only version (for feeding physical pre-printed 5.5x8.5 forms into printer!)
  await createWriteUpPDF({
    includeBackground: false,
    outputPath: path.join(baseDir, 'write up - print overlay only.pdf')
  });

  // 4. Update the main 'write up.pdf'
  fs.copyFileSync(path.join(baseDir, 'write up - fillable.pdf'), path.join(baseDir, 'write up.pdf'));
  console.log(`Updated main write up.pdf with interactive fillable form.`);

  // 5. Export write_up_fields.json for the web app
  const jsonExport = {
    pageWidth: 396,
    pageHeight: 612,
    fields: fieldsConfig
  };
  const jsonPath = path.join(baseDir, 'src', 'forms', 'write_up_fields.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonExport, null, 2));
  console.log(`Saved ${jsonPath}`);
}

main().catch(console.error);
