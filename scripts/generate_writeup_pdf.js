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
// Scan image width = 1072 px = 385.92 pt. Left offset = 16.2 pt. Right margin = 396 - 385.92 - 16.2 = -6.12 pt (Paper left edge = scan px -45).
// Scan image height = 1667 px = 600.12 pt. Top offset = 0 pt. Paper top edge = scan px 0 (Y_pt = 612).
// X_pt = 16.2 + X_px * 0.36
// Y_pt = 612 - (Y_px * 0.36)

function pxToPtX(px) {
  return +(16.2 + px * 0.36).toFixed(2);
}

function pxToPtY(py) {
  return +(612 - (py * 0.36)).toFixed(2);
}

function pxWidthToPt(wPx) {
  return +(wPx * 0.36).toFixed(2);
}

// Field definition list with verified coordinates
export const fieldsConfig = [
  // Order / Invoice number at top right
  {
    name: 'order_number',
    label: 'Order / Invoice #',
    type: 'text',
    x: pxToPtX(815),
    y: pxToPtY(58),
    width: pxWidthToPt(935 - 815), // 43.2 pt
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
    x: pxToPtX(670),
    y: pxToPtY(112),
    width: pxWidthToPt(945 - 670), // 99.0 pt
    height: 16,
    fontSize: 10
  },
  // Patient Info
  {
    name: 'patient_name',
    label: 'Patient Name',
    type: 'text',
    x: pxToPtX(115),
    y: pxToPtY(162),
    width: pxWidthToPt(945 - 115), // 298.8 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_street',
    label: 'Street Address',
    type: 'text',
    x: pxToPtX(120),
    y: pxToPtY(216),
    width: pxWidthToPt(950 - 120), // 298.8 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_city',
    label: 'City',
    type: 'text',
    x: pxToPtX(80),
    y: pxToPtY(266),
    width: pxWidthToPt(495 - 80), // 149.4 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_state',
    label: 'State',
    type: 'text',
    x: pxToPtX(580),
    y: pxToPtY(266),
    width: pxWidthToPt(690 - 580), // 39.6 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_zip',
    label: 'Zip Code',
    type: 'text',
    x: pxToPtX(730),
    y: pxToPtY(266),
    width: pxWidthToPt(950 - 730), // 79.2 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'patient_phone',
    label: 'Phone Number',
    type: 'text',
    x: pxToPtX(120),
    y: pxToPtY(321),
    width: pxWidthToPt(950 - 120), // 298.8 pt
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
    width: pxWidthToPt(953 - 124), // 298.44 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'pd',
    label: 'P.D. (Pupillary Distance)',
    type: 'text',
    x: pxToPtX(77),
    y: pxToPtY(484),
    width: pxWidthToPt(305 - 77), // 82.08 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'seg_height',
    label: 'Seg Height',
    type: 'text',
    x: pxToPtX(468),
    y: pxToPtY(484),
    width: pxWidthToPt(630 - 468), // 58.32 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'blue_light',
    label: 'Blue Light Filter',
    type: 'text',
    x: pxToPtX(796),
    y: pxToPtY(484),
    width: pxWidthToPt(958 - 796), // 58.32 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'frame_color',
    label: 'Frame Color',
    type: 'text',
    x: pxToPtX(118),
    y: pxToPtY(537),
    width: pxWidthToPt(486 - 118), // 132.48 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'sc',
    label: 'S/C (Scratch Coat)',
    type: 'text',
    x: pxToPtX(542),
    y: pxToPtY(537),
    width: pxWidthToPt(680 - 542), // 49.68 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'ar',
    label: 'A/R (Anti-Reflective)',
    type: 'text',
    x: pxToPtX(738),
    y: pxToPtY(537),
    width: pxWidthToPt(953 - 738), // 77.4 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'time_promised',
    label: 'Time Promised',
    type: 'text',
    x: pxToPtX(239),
    y: pxToPtY(588),
    width: pxWidthToPt(680 - 239), // 158.76 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'uv',
    label: 'U/V Coating',
    type: 'text',
    x: pxToPtX(735),
    y: pxToPtY(588),
    width: pxWidthToPt(960 - 735), // 81.0 pt
    height: 16,
    fontSize: 10
  },
  // Paid By Checkboxes (inside the actual parenthesis (  ) brackets)
  {
    name: 'paid_cash',
    label: 'Paid Cash',
    type: 'checkbox',
    x: pxToPtX(150),
    y: pxToPtY(640),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'paid_check',
    label: 'Paid Check',
    type: 'checkbox',
    x: pxToPtX(285),
    y: pxToPtY(640),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'paid_credit_card',
    label: 'Paid Credit Card',
    type: 'checkbox',
    x: pxToPtX(445),
    y: pxToPtY(640),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  // Left Column Pricing Amounts
  {
    name: 'charge_frame',
    label: 'Frame Price',
    type: 'text',
    x: pxToPtX(120),
    y: pxToPtY(739),
    width: pxWidthToPt(640 - 120), // 187.2 pt
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
    width: pxWidthToPt(636 - 116), // 187.2 pt
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
    width: pxWidthToPt(639 - 102), // 193.32 pt
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
    width: pxWidthToPt(628 - 90), // 193.68 pt
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
    width: pxWidthToPt(647 - 85), // 202.32 pt
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_total',
    label: 'Total',
    type: 'text',
    x: pxToPtX(101),
    y: pxToPtY(1110),
    width: pxWidthToPt(664 - 101), // 202.68 pt
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
    y: pxToPtY(1178),
    width: pxWidthToPt(638 - 76), // 202.32 pt
    height: 16,
    fontSize: 10,
    alignment: 'right'
  },
  {
    name: 'charge_bal',
    label: 'Balance Due',
    type: 'text',
    x: pxToPtX(76),
    y: pxToPtY(1254),
    width: pxWidthToPt(638 - 76), // 202.32 pt
    height: 16,
    fontSize: 10,
    alignment: 'right',
    fontBold: true
  },
  // Right Column Lens Features & Materials Checkboxes (inside actual parenthesis (  ))
  {
    name: 'lens_plastic',
    label: 'Plastic',
    type: 'checkbox',
    x: pxToPtX(760),
    y: pxToPtY(698),
    width: pxWidthToPt(26), // 9.36 pt
    height: pxWidthToPt(23)  // 8.28 pt
  },
  {
    name: 'lens_poly',
    label: 'Polycarbonate',
    type: 'checkbox',
    x: pxToPtX(890),
    y: pxToPtY(698),
    width: pxWidthToPt(26), // 9.36 pt
    height: pxWidthToPt(23)  // 8.28 pt
  },
  {
    name: 'hi_index',
    label: 'Hi-Index Spec',
    type: 'text',
    x: pxToPtX(830),
    y: pxToPtY(784),
    width: pxWidthToPt(975 - 830), // 52.2 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'lens_trivex',
    label: 'Trivex',
    type: 'checkbox',
    x: pxToPtX(770),
    y: pxToPtY(854),
    width: pxWidthToPt(26), // 9.36 pt
    height: pxWidthToPt(24)  // 8.64 pt
  },
  {
    name: 'lens_glass',
    label: 'Glass',
    type: 'checkbox',
    x: pxToPtX(895),
    y: pxToPtY(854),
    width: pxWidthToPt(26), // 9.36 pt
    height: pxWidthToPt(24)  // 8.64 pt
  },
  {
    name: 'lens_sv',
    label: 'Single Vision (SV)',
    type: 'checkbox',
    x: pxToPtX(724),
    y: pxToPtY(962),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'lens_ft28',
    label: 'Flat Top 28 (FT-28)',
    type: 'checkbox',
    x: pxToPtX(810),
    y: pxToPtY(962),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'lens_ft35',
    label: 'Flat Top 35 (FT-35)',
    type: 'checkbox',
    x: pxToPtX(910),
    y: pxToPtY(962),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'lens_7x28',
    label: '7x28 Trifocal',
    type: 'checkbox',
    x: pxToPtX(740),
    y: pxToPtY(1034),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'lens_7x35',
    label: '7x35 Trifocal',
    type: 'checkbox',
    x: pxToPtX(825),
    y: pxToPtY(1034),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'lens_rd22',
    label: 'Round 22 (RD22)',
    type: 'checkbox',
    x: pxToPtX(930),
    y: pxToPtY(1034),
    width: pxWidthToPt(24), // 8.64 pt
    height: pxWidthToPt(22)  // 7.92 pt
  },
  {
    name: 'progressive',
    label: 'Progressive Lens Brand/Type',
    type: 'text',
    x: pxToPtX(769),
    y: pxToPtY(1108),
    width: pxWidthToPt(1005 - 769), // 84.96 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'lens_other',
    label: 'Other Lens Specs',
    type: 'text',
    x: pxToPtX(757),
    y: pxToPtY(1176),
    width: pxWidthToPt(1005 - 757), // 89.28 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'insurance',
    label: 'Insurance Details',
    type: 'text',
    x: pxToPtX(724),
    y: pxToPtY(1254),
    width: pxWidthToPt(991 - 724), // 96.12 pt
    height: 16,
    fontSize: 10
  },
  // Rx Table Grid:
  // Row R (OD): Y=1346 to 1408
  {
    name: 'rx_r_sph',
    label: 'OD Sphere',
    type: 'text',
    x: pxToPtX(75),
    y: pxToPtY(1408),
    width: pxWidthToPt(252 - 75), // 63.72 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_cyl',
    label: 'OD Cylinder',
    type: 'text',
    x: pxToPtX(252),
    y: pxToPtY(1408),
    width: pxWidthToPt(408 - 252), // 56.16 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_axis',
    label: 'OD Axis',
    type: 'text',
    x: pxToPtX(408),
    y: pxToPtY(1408),
    width: pxWidthToPt(552 - 408), // 51.84 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_add',
    label: 'OD Add',
    type: 'text',
    x: pxToPtX(552),
    y: pxToPtY(1408),
    width: pxWidthToPt(722 - 552), // 61.20 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_r_prism',
    label: 'OD Prism',
    type: 'text',
    x: pxToPtX(722),
    y: pxToPtY(1408),
    width: pxWidthToPt(1000 - 722), // 100.08 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  // Row L (OS): Y=1408 to 1470
  {
    name: 'rx_l_sph',
    label: 'OS Sphere',
    type: 'text',
    x: pxToPtX(75),
    y: pxToPtY(1470),
    width: pxWidthToPt(252 - 75), // 63.72 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_cyl',
    label: 'OS Cylinder',
    type: 'text',
    x: pxToPtX(252),
    y: pxToPtY(1470),
    width: pxWidthToPt(408 - 252), // 56.16 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_axis',
    label: 'OS Axis',
    type: 'text',
    x: pxToPtX(408),
    y: pxToPtY(1470),
    width: pxWidthToPt(552 - 408), // 51.84 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_add',
    label: 'OS Add',
    type: 'text',
    x: pxToPtX(552),
    y: pxToPtY(1470),
    width: pxWidthToPt(722 - 552), // 61.20 pt
    height: 20,
    fontSize: 11,
    alignment: 'center'
  },
  {
    name: 'rx_l_prism',
    label: 'OS Prism',
    type: 'text',
    x: pxToPtX(722),
    y: pxToPtY(1470),
    width: pxWidthToPt(1000 - 722), // 100.08 pt
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
    width: pxWidthToPt(965 - 188), // 279.72 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'notif',
    label: 'Notification Status',
    type: 'text',
    x: pxToPtX(97),
    y: pxToPtY(1629),
    width: pxWidthToPt(551 - 97), // 163.44 pt
    height: 16,
    fontSize: 10
  },
  {
    name: 'disp',
    label: 'Dispensed By',
    type: 'text',
    x: pxToPtX(643),
    y: pxToPtY(1629),
    width: pxWidthToPt(957 - 643), // 113.04 pt
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
  
  // Ensure public directory exists
  const publicDir = path.join(baseDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

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

  // 5. Also copy generated PDFs to public/ for web app downloads
  fs.copyFileSync(path.join(baseDir, 'write up - fillable.pdf'), path.join(publicDir, 'write up - fillable.pdf'));
  fs.copyFileSync(path.join(baseDir, 'write up - fillable (blank order num).pdf'), path.join(publicDir, 'write up - fillable (blank order num).pdf'));
  fs.copyFileSync(path.join(baseDir, 'write up - print overlay only.pdf'), path.join(publicDir, 'write up - print overlay only.pdf'));
  fs.copyFileSync(path.join(baseDir, 'write up.pdf'), path.join(publicDir, 'write up.pdf'));
  console.log(`Copied PDFs to public directory.`);

  // 6. Ensure write_up_background.jpg is in public/
  fs.copyFileSync(path.join(baseDir, 'scanned_writeup_clean.jpg'), path.join(publicDir, 'write_up_background.jpg'));
  console.log(`Updated public/write_up_background.jpg.`);

  // 7. Export write_up_fields.json for the web app
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
