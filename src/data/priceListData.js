/**
 * Pal Optical - Lens, Coating, Lab & Miscellaneous Master Price List Data
 * Current as of October 2026
 * Lexington, KY
 */

export const INITIAL_PRICE_LIST_DATA = {
  meta: {
    shopName: 'Pal Optical',
    title: 'Pal Optical Price List',
    subtitle: 'Plastic • Polycarbonate • Trivex • High-Index • Crown Glass • Transitions • Polarized • Ray-Ban • Coatings • Lab Fees',
    location: '1555 E New Circle Rd Ste. 146, Lexington, KY 40509',
    phone: '(859) 266-3003',
    docPhone: '(859) 269-6921',
    fax: '(859) 266-9504',
    email: 'paloptical18@gmail.com',
    effectiveDate: 'October 2026',
    version: '2026.1'
  },

  // PAGE 1: CLEAR LENSES & PROGRESSIVES
  page1: {
    sections: [
      {
        id: 'plastic-clear',
        title: '1. PLASTIC CLEAR (CR-39)',
        badge: 'INDEX 1.50',
        note: '',
        items: [
          { id: 'pc-1', name: 'PLANO', price: 35.00, highlighted: false },
          { id: 'pc-2', name: 'SINGLE VISION', price: 50.00, highlighted: false },
          { id: 'pc-3', name: 'EYEZEN (+0-+4)', price: 125.00, highlighted: false },
          { id: 'pc-4', name: 'LENTICULAR SINGLE VISION', price: 175.00, highlighted: false },
          { id: 'pc-5', name: 'FT-28 LINED BF', price: 140.00, highlighted: false },
          { id: 'pc-6', name: 'LENTICULAR FT-28 LINED BF', price: 235.00, highlighted: false },
          { id: 'pc-7', name: 'FT-35 LINED BF', price: 145.00, highlighted: false },
          { id: 'pc-8', name: 'FT-45 LINED BF', price: 150.00, highlighted: false },
          { id: 'pc-9', name: 'OCCUPATIONAL FT-28 LINED BF', price: 285.00, highlighted: false },
          { id: 'pc-10', name: 'ROUND SEG 22mm', price: 150.00, highlighted: false },
          { id: 'pc-11', name: 'BLENDED BIFOCAL', price: 145.00, highlighted: false },
          { id: 'pc-12', name: 'FT-7X28 LINED TF', price: 165.00, highlighted: false },
          { id: 'pc-13', name: 'LENTICULAR 7X28 LINED TF', price: 390.00, highlighted: false },
          { id: 'pc-14', name: 'FRANKLIN SEG', price: 500.00, highlighted: false },
          { id: 'pc-15', name: 'ESSILOR NATURAL', price: 295.00, highlighted: false },
          { id: 'pc-16', name: 'ESSILOR OVATION', price: 350.00, highlighted: false },
          { id: 'pc-17', name: 'VARILUX COMFORT DRX', price: 365.00, highlighted: false },
          { id: 'pc-18', name: 'VARILUX PHYSIO DRX', price: 390.00, highlighted: false },
          { id: 'pc-19', name: 'VARILUX X', price: 530.00, highlighted: false },
          { id: 'pc-20', name: 'SHAMIR AUTOGRAPH III', price: 465.00, highlighted: false },
          { id: 'pc-21', name: 'VSP UNITY V3', price: 325.00, highlighted: false },
          { id: 'pc-22', name: 'VSP UNITY ELITE', price: 425.00, highlighted: false },
          { id: 'pc-23', name: 'YOUNGER IMAGE', price: 255.00, highlighted: true, star: true },
          { id: 'pc-24', name: 'YOUNGER ADAGE', price: null, priceNote: 'POLY ONLY', highlighted: false }
        ]
      },
      {
        id: 'poly-clear',
        title: '2. POLYCARBONATE CLEAR',
        badge: 'INDEX 1.59 IMPACT',
        note: '',
        items: [
          { id: 'poly-1', name: 'SINGLE VISION', price: 115.00, highlighted: false },
          { id: 'poly-2', name: 'EYEZEN (+0-+4)', price: 180.00, highlighted: false },
          { id: 'poly-3', name: 'FT-28 LINED BF', price: 180.00, highlighted: false },
          { id: 'poly-4', name: 'FT-35 LINED BF', price: 240.00, highlighted: false },
          { id: 'poly-5', name: 'OCCUPATIONAL FT-28 LINED BF', price: 345.00, highlighted: false },
          { id: 'poly-6', name: 'FT-7X28 LINED TF', price: 205.00, highlighted: false },
          { id: 'poly-7', name: 'ESSILOR NATURAL', price: 335.00, highlighted: false },
          { id: 'poly-8', name: 'ESSILOR OVATION', price: 390.00, highlighted: false },
          { id: 'poly-9', name: 'VARILUX COMFORT DRX', price: 405.00, highlighted: false },
          { id: 'poly-10', name: 'VARILUX PHYSIO DRX', price: 430.00, highlighted: false },
          { id: 'poly-11', name: 'VARILUX X', price: 570.00, highlighted: false },
          { id: 'poly-12', name: 'SHAMIR AUTOGRAPH III', price: 505.00, highlighted: false },
          { id: 'poly-13', name: 'VSP UNITY V3', price: 365.00, highlighted: false },
          { id: 'poly-14', name: 'VSP UNITY ELITE', price: 410.00, highlighted: false },
          { id: 'poly-15', name: 'YOUNGER IMAGE', price: 295.00, highlighted: true, star: true },
          { id: 'poly-16', name: 'YOUNGER ADAGE', price: 295.00, highlighted: false }
        ]
      },
      {
        id: 'trivex-clear',
        title: '3. TRIVEX CLEAR',
        badge: 'INDEX 1.53 HD ABBE 45',
        note: '',
        items: [
          { id: 'tri-1', name: 'SINGLE VISION', price: 150.00, highlighted: false },
          { id: 'tri-2', name: 'EYEZEN (+0-+4)', price: 195.00, highlighted: false },
          { id: 'tri-3', name: 'FT-28 LINED BF', price: 205.00, highlighted: false },
          { id: 'tri-4', name: 'FT-7X28 LINED TF', price: 245.00, highlighted: false },
          { id: 'tri-5', name: 'YOUNGER IMAGE', price: 315.00, highlighted: true, star: true },
          { id: 'tri-6', name: 'ESSILOR OVATION', price: 315.00, highlighted: false },
          { id: 'tri-7', name: 'VARILUX COMFORT', price: 415.00, highlighted: false },
          { id: 'tri-8', name: 'VARILUX X', price: 630.00, highlighted: false }
        ]
      },
      {
        id: 'hi-index-clear',
        title: '4. HIGH-INDEX CLEAR',
        badge: '1.60 / 1.67 / 1.74',
        noticeBanner: "DON'T FORGET TO ADD ANTI-REFLECTIVE COATING TO THESE",
        items: [
          { id: 'hi-1', name: 'SINGLE VISION 1.67', price: 365.00, highlighted: false },
          { id: 'hi-2', name: 'SINGLE VISION 1.74', price: 400.00, highlighted: false },
          { id: 'hi-3', name: 'EYEZEN 1.67 (+0-+4)', price: 415.00, highlighted: false },
          { id: 'hi-4', name: 'FT-28 1.67 LINED BF', price: 420.00, highlighted: false },
          { id: 'hi-5', name: 'FT-35 1.67 LINED BF', price: 450.00, highlighted: false },
          { id: 'hi-6', name: 'RD-22 1.67', price: 550.00, highlighted: false },
          { id: 'hi-7', name: 'FRANKLIN SEG 1.67', price: 1050.00, highlighted: false },
          { id: 'hi-8', name: 'NATURAL DIGITAL 1.67', price: 500.00, highlighted: false },
          { id: 'hi-9', name: 'OVATION DIGITAL 1.67', price: 500.00, highlighted: false },
          { id: 'hi-10', name: 'VARILUX PHYSIO 1.67', price: 625.00, highlighted: false },
          { id: 'hi-11', name: 'VARILUX X 1.67', price: 825.00, highlighted: false },
          { id: 'hi-12', name: 'SHAMIR AUTOGRAPH III 1.67', price: 625.00, highlighted: false },
          { id: 'hi-13', name: 'VSP UNITY V3 1.67', price: 525.00, highlighted: false },
          { id: 'hi-14', name: 'VSP UNITY ELITE 1.67', price: 695.00, highlighted: false },
          { id: 'hi-15', name: 'YOUNGER IMAGE 1.67', price: 520.00, highlighted: true, star: true }
        ]
      },
      {
        id: 'glass-clear',
        title: '5. GLASS CLEAR (CROWN GLASS)',
        badge: 'INDEX 1.52 / HI-INDEX',
        warningBanner: 'GLASS JOBS ALL TAKE ROUGHLY 3-4 WEEKS',
        items: [
          { id: 'gl-1', name: 'SINGLE VISION', price: 175.00, highlighted: false },
          { id: 'gl-2', name: 'FT-28 LINED BF', price: 285.00, highlighted: false },
          { id: 'gl-3', name: 'FT-7X28 LINED TF', price: 345.00, highlighted: false },
          { id: 'gl-4', name: 'FREEFOCUS HD', price: 500.00, highlighted: false },
          { id: 'gl-5', name: 'X-RAY GLASS SINGLE VISION', price: 400.00, highlighted: false },
          { id: 'gl-6', name: 'X-RAY GLASS FT-28', price: 345.00, highlighted: false },
          { id: 'gl-7', name: 'X-RAY GLASS PROGRESSIVE', price: 575.00, highlighted: false }
        ]
      },
      {
        id: 'office-progressives',
        title: '6. OFFICE / COMPUTER PROGRESSIVES',
        badge: 'INTERMEDIATE & NEAR',
        items: [
          { id: 'off-1', name: 'FREEFOCUS PC13/20', price: 205.00, highlighted: false },
          { id: 'off-2', name: 'SHAMIR WORKSPACE', price: 245.00, highlighted: false },
          { id: 'off-3', name: 'ZEISS OFFICELENS (BOOK, DESK, ROOM)', price: 225.00, highlighted: false }
        ]
      },
      {
        id: 'stellest-section',
        title: 'STELLEST',
        badge: 'MYOPIA MANAGEMENT',
        warningBanner: 'IF CHILD UNDER 12 HAS A MINUS ABOVE -2.00D ASK DR. ROBBINS IF WE CAN USE THIS. NEEDS DR. APPROVAL.',
        items: [
          { id: 'st-1', name: 'STELLEST SINGLE VISION POLY W/ CRIZAL EASY A/R', price: 450.00, highlighted: true }
        ]
      }
    ],
    diagram: {
      id: 'diagram-p1',
      title: 'Clear Lens Cross-Section & Bevel Profile Guide',
      type: 'preset',
      presetName: 'thickness-bevel',
      customImageUrl: '',
      caption: 'Index of Refraction vs. Edge Thickness (CR-39 1.50 • Trivex 1.53 • Poly 1.59 • Hi-Index 1.67 / 1.74)'
    }
  },

  // PAGE 2: TRANSITIONS & PHOTOCHROMICS
  page2: {
    sections: [
      {
        id: 'transitions-plastic',
        title: '1. TRANSITIONS® PLASTIC (CR-39)',
        badge: 'SIGNATURE / GEN S / 8',
        note: '',
        items: [
          { id: 'tp-1', name: 'SINGLE VISION', price: 235.00, highlighted: false },
          { id: 'tp-2', name: 'FT-28 LINED BF', price: 250.00, highlighted: false },
          { id: 'tp-3', name: 'RD-22', price: 360.00, highlighted: false },
          { id: 'tp-4', name: 'FT-7X28 LINED TF', price: 275.00, highlighted: false },
          { id: 'tp-5', name: 'ESSILOR NATURAL DIGITAL', price: 415.00, highlighted: false },
          { id: 'tp-6', name: 'VARILUX COMFORT DRX', price: 475.00, highlighted: false },
          { id: 'tp-7', name: 'VARILUX PHYSIO DRX', price: 510.00, highlighted: false },
          { id: 'tp-8', name: 'VARILUX X', price: 640.00, highlighted: false },
          { id: 'tp-9', name: 'SHAMIR AUTOGRAPH III', price: 575.00, highlighted: false },
          { id: 'tp-10', name: 'VSP UNITY V3', price: 435.00, highlighted: false },
          { id: 'tp-11', name: 'VSP UNITY ELITE', price: 535.00, highlighted: false },
          { id: 'tp-12', name: 'YOUNGER IMAGE', price: 365.00, highlighted: true, star: true },
          { id: 'tp-13', name: 'OKNO BASIC', price: 385.00, highlighted: false },
          { id: 'tp-14', name: 'OKNO ENHANCED', price: 405.00, highlighted: false }
        ]
      },
      {
        id: 'transitions-poly',
        title: '2. TRANSITIONS® POLYCARBONATE',
        badge: 'IMPACT PHOTOCHROMIC',
        note: '',
        items: [
          { id: 'tpoly-1', name: 'SINGLE VISION', price: 275.00, highlighted: false },
          { id: 'tpoly-2', name: 'FT-28 LINED BF', price: 290.00, highlighted: false },
          { id: 'tpoly-3', name: 'RD-22', price: 395.00, highlighted: false },
          { id: 'tpoly-4', name: 'FT-7X28 LINED TF', price: 315.00, highlighted: false },
          { id: 'tpoly-5', name: 'ESSILOR NATURAL DIGITAL', price: 455.00, highlighted: false },
          { id: 'tpoly-6', name: 'VARILUX COMFORT DRX', price: 505.00, highlighted: false },
          { id: 'tpoly-7', name: 'VARILUX PHYSIO DRX', price: 550.00, highlighted: false },
          { id: 'tpoly-8', name: 'VARILUX X', price: 690.00, highlighted: false },
          { id: 'tpoly-9', name: 'SHAMIR AUTOGRAPH III', price: 615.00, highlighted: false },
          { id: 'tpoly-10', name: 'VSP UNITY V3', price: 475.00, highlighted: false },
          { id: 'tpoly-11', name: 'VSP UNITY ELITE', price: 575.00, highlighted: false },
          { id: 'tpoly-12', name: 'YOUNGER IMAGE', price: 405.00, highlighted: true, star: true },
          { id: 'tpoly-13', name: 'SINGLE VISION XTRA-ACTIVE POLARIZED', price: 375.00, highlighted: false },
          { id: 'tpoly-14', name: 'ESSILOR OVATION DIGITAL XTRA-ACTIVE POLARIZED', price: 575.00, highlighted: false },
          { id: 'tpoly-15', name: 'VARILUX COMFORT DRX XTRA-ACTIVE POLARIZED', price: 650.00, highlighted: false },
          { id: 'tpoly-16', name: 'YOUNGER IMAGE XTRA-ACTIVE POLARIZED', price: 525.00, highlighted: false },
          { id: 'tpoly-17', name: 'SINGLE VISION DRIVEWEAR', price: 360.00, highlighted: false },
          { id: 'tpoly-18', name: 'YOUNGER IMAGE DRIVEWEAR', price: 500.00, highlighted: false }
        ]
      },
      {
        id: 'transitions-trivex',
        title: '3. TRANSITIONS® TRIVEX',
        badge: 'HD RIMLESS PHOTOCHROMIC',
        note: '',
        items: [
          { id: 'ttri-1', name: 'SINGLE VISION', price: 275.00, highlighted: false },
          { id: 'ttri-2', name: 'FT-28 LINED BF', price: 300.00, highlighted: false },
          { id: 'ttri-3', name: 'FT-7X28 LINED TF', price: 350.00, highlighted: false },
          { id: 'ttri-4', name: 'YOUNGER IMAGE', price: 455.00, highlighted: true, star: true },
          { id: 'ttri-5', name: 'ESSILOR OVATION DIGITAL', price: 570.00, highlighted: false },
          { id: 'ttri-6', name: 'VARILUX COMFORT DRX', price: 650.00, highlighted: false },
          { id: 'ttri-7', name: 'VARILUX X', price: 790.00, highlighted: false },
          { id: 'ttri-8', name: 'FREEFOCUS HD', price: 405.00, highlighted: false },
          { id: 'ttri-9', name: 'VSP UNITY V3', price: 590.00, highlighted: false },
          { id: 'ttri-10', name: 'OKNO BASIC', price: 405.00, highlighted: false }
        ]
      },
      {
        id: 'transitions-hi-index',
        title: '4. TRANSITIONS® HIGH-INDEX',
        badge: '1.60 / 1.67 / 1.74 SLIM',
        note: '',
        items: [
          { id: 'thi-1', name: 'SINGLE VISION 1.67', price: 465.00, highlighted: false },
          { id: 'thi-2', name: 'SINGLE VISION 1.74', price: 650.00, highlighted: false },
          { id: 'thi-3', name: 'FT-28 1.67 (VISION DYNAMICS)', price: 470.00, highlighted: false },
          { id: 'thi-4', name: 'RD-22 1.67', price: 600.00, highlighted: false },
          { id: 'thi-5', name: 'ESSILOR NATURAL DIGITAL 1.67', price: 650.00, highlighted: false },
          { id: 'thi-6', name: 'VARILUX COMFORT DRX 1.67', price: 720.00, highlighted: false },
          { id: 'thi-7', name: 'VARILUX PHYSIO DRX 1.67', price: 750.00, highlighted: false },
          { id: 'thi-8', name: 'VARILUX X 1.67', price: 900.00, highlighted: false },
          { id: 'thi-9', name: 'SHAMIR AUTOGRAPH III 1.67', price: 720.00, highlighted: false },
          { id: 'thi-10', name: 'VSP UNITY V3 1.67', price: 650.00, highlighted: false },
          { id: 'thi-11', name: 'VSP UNITY ELITE', price: 800.00, highlighted: false }
        ]
      },
      {
        id: 'glass-pgx-pbx',
        title: '5. GLASS PGX / PBX',
        badge: 'PHOTOGRAY & PHOTOBROWN',
        note: '',
        items: [
          { id: 'gpgx-1', name: 'SINGLE VISION', price: 300.00, highlighted: false },
          { id: 'gpgx-2', name: 'FT-28 LINED BF', price: 410.00, highlighted: false },
          { id: 'gpgx-3', name: 'FREEFOCUS HD PROGRESSIVE', price: 590.00, highlighted: false }
        ]
      }
    ],
    diagram: {
      id: 'diagram-p2',
      title: 'Transitions® Color Palette & Activation Chart',
      type: 'preset',
      presetName: 'transitions-comparison',
      customImageUrl: '',
      caption: 'Gen S 8 Vivid Colors & Technology Comparison: Gen S, XTRActive, XTRActive Polarized, Drivewear'
    }
  },

  // PAGE 3: POLARIZED, COATINGS, RAY-BAN, LAB & MISC
  page3: {
    sections: [
      {
        id: 'polarized-plastic',
        title: '1. POLARIZED PLASTIC (CR-39)',
        badge: '99.9% GLARE BLOCK',
        items: [
          { id: 'polp-1', name: 'SINGLE VISION', price: 175.00, highlighted: false },
          { id: 'polp-2', name: 'KBCO SINGLE VISION', price: 250.00, highlighted: false },
          { id: 'polp-3', name: 'FT-28 LINED BF', price: 255.00, highlighted: false },
          { id: 'polp-4', name: 'KBCO FT-28 LINED BF', price: 300.00, highlighted: false },
          { id: 'polp-5', name: 'FT-7X28 LINED TF', price: 350.00, highlighted: false },
          { id: 'polp-6', name: 'ESSILOR NATURAL', price: 450.00, highlighted: false },
          { id: 'polp-7', name: 'IRX PRO (KBCO)', price: 475.00, highlighted: false },
          { id: 'polp-8', name: 'YOUNGER IMAGE', price: 400.00, highlighted: true, star: true }
        ]
      },
      {
        id: 'polarized-poly',
        title: '2. POLARIZED POLYCARBONATE',
        badge: 'IMPACT SUN PROTECTION',
        items: [
          { id: 'polpoly-1', name: 'SINGLE VISION', price: 220.00, highlighted: false },
          { id: 'polpoly-2', name: 'KBCO SINGLE VISION', price: 290.00, highlighted: false },
          { id: 'polpoly-3', name: 'FT-28 LINED BF', price: 255.00, highlighted: false },
          { id: 'polpoly-4', name: 'KBCO FT-28 LINED BF', price: 300.00, highlighted: false },
          { id: 'polpoly-5', name: 'ESSILOR NATURAL', price: 515.00, highlighted: false },
          { id: 'polpoly-6', name: 'VARILUX COMFORT DRX', price: 575.00, highlighted: false },
          { id: 'polpoly-7', name: 'IRX PRO (KBCO)', price: 535.00, highlighted: false },
          { id: 'polpoly-8', name: 'YOUNGER IMAGE', price: 495.00, highlighted: true, star: true }
        ]
      },
      {
        id: 'polarized-hi-index',
        title: '3. POLARIZED HIGH-INDEX',
        badge: '1.60 / 1.67 / TRIVEX POLAR',
        items: [
          { id: 'polhi-1', name: 'SINGLE VISION 1.67 POLARIZED', price: 465.00, highlighted: false },
          { id: 'polhi-2', name: 'ESSILOR OVATION 1.67 POLARIZED', price: 650.00, highlighted: false },
          { id: 'polhi-3', name: 'SHAMIR AUTOGRAPH III 1.67 POLARIZED', price: 720.00, highlighted: false }
        ]
      },
      {
        id: 'coatings-treatments',
        title: '4. COATINGS & TREATMENTS',
        badge: 'HARD COAT, AR & BLUE LIGHT',
        items: [
          { id: 'coat-1', name: 'TINT', price: 20.00, highlighted: false },
          { id: 'coat-2', name: 'SPECIALTY TINT (MIGRAINES, ETC)', price: 70.00, highlighted: false },
          { id: 'coat-3', name: 'SCRATCH COATING', price: 20.00, highlighted: false },
          { id: 'coat-4', name: 'U/V COATING', price: 20.00, highlighted: false },
          { id: 'coat-5', name: 'SEIKO/ HOUSE ANTI-REFLECTIVE COATING (1YR)', price: 85.00, highlighted: false },
          { id: 'coat-6', name: 'STRIP SEIKO/HOUSE ANTI-REFLECTIVE COATING', price: 25.00, highlighted: false },
          { id: 'coat-7', name: 'CRIZAL ROCK ANTI-REFLECTIVE COATING (2YR)', price: 215.00, highlighted: true },
          { id: 'coat-8', name: 'VSP UNITY ANTI-REFLECTIVE COATING (2YR)', price: 185.00, highlighted: false },
          { id: 'coat-9', name: 'MIRROR COATING (2YR)', price: 160.00, highlighted: false },
          { id: 'coat-10', name: 'BLUE LIGHT COATING', price: 40.00, highlighted: false }
        ]
      },
      {
        id: 'rayban-authentic',
        title: '5. Ray-Ban AUTHENTIC LENSES',
        badge: '(PRICE INCLUDES A/R)',
        items: [
          { id: 'rb-1', name: 'PLASTIC SINGLE VISION', price: 150.00, highlighted: false },
          { id: 'rb-2', name: 'PLASTIC SINGLE VISION W/ BLUE LIGHT', price: 180.00, highlighted: false },
          { id: 'rb-3', name: 'PLASTIC SINGLE VISION TRANSITIONS', price: 260.00, highlighted: false },
          { id: 'rb-4', name: 'POLYCARBONATE SINGLE VISION', price: 190.00, highlighted: false },
          { id: 'rb-5', name: 'POLYCARBONATE SINGLE VISION W/ BLUE LIGHT', price: 220.00, highlighted: false },
          { id: 'rb-6', name: 'POLYCARBONATE SINGLE VISION TRANSITIONS', price: 300.00, highlighted: false },
          { id: 'rb-7', name: '1.67 HIGH-INDEX SINGLE VISION', price: 375.00, highlighted: false },
          { id: 'rb-8', name: '1.67 HIGH-INDEX SINGLE VISION W/ BLUE LIGHT', price: 405.00, highlighted: false },
          { id: 'rb-9', name: '1.67 HIGH-INDEX SINGLE VISION TRANSITIONS', price: 485.00, highlighted: false },
          { id: 'rb-10', name: 'PLASTIC PROGRESSIVE', price: 340.00, highlighted: false },
          { id: 'rb-11', name: 'PLASTIC PROGRESSIVE W/ BLUE LIGHT', price: 370.00, highlighted: false },
          { id: 'rb-12', name: 'PLASTIC PROGRESSIVE TRANSITIONS', price: 450.00, highlighted: false },
          { id: 'rb-13', name: 'POLYCARBONATE PROGRESSIVE', price: 380.00, highlighted: false },
          { id: 'rb-14', name: 'POLYCARBONATE PROGRESSIVE W/ BLUE LIGHT', price: 410.00, highlighted: false },
          { id: 'rb-15', name: 'POLYCARBONATE PROGRESSIVE TRANSITIONS', price: 490.00, highlighted: false },
          { id: 'rb-16', name: '1.67 HIGH-INDEX PROGRESSIVE', price: 500.00, highlighted: false },
          { id: 'rb-17', name: '1.67 HIGH-INDEX PROGRESSIVE W/ BLUE LIGHT', price: 530.00, highlighted: false },
          { id: 'rb-18', name: '1.67 HIGH-INDEX PROGRESSIVE TRANSITIONS', price: 610.00, highlighted: false },
          { id: 'rb-19', name: 'POLYCARBONATE NON-POLARIZED TINT SINGLE VISION', price: 350.00, highlighted: false },
          { id: 'rb-20', name: 'POLYCARBONATE POLARIZED SINGLE VISION', price: 390.00, highlighted: false },
          { id: 'rb-21', name: 'POLYCARBONATE POLARIZED SINGLE VISION W/ BSAR', price: 440.00, highlighted: false },
          { id: 'rb-22', name: 'POLYCARBONATE POLARIZED GRADIENT SINGLE VISION W/ BSAR', price: 450.00, highlighted: false },
          { id: 'rb-23', name: 'POLYCARBONATE POLARIZED MIRROR SINGLE VISION W/ BSAR', price: 475.00, highlighted: false }
        ]
      },
      {
        id: 'lab-charges',
        title: '6. LAB CHARGES',
        badge: 'SURFACING & EDGING FEES',
        items: [
          { id: 'lab-1', name: 'SINGLE VISION SPH OVER 4.00D', price: 10.00, unit: '/EA', highlighted: false },
          { id: 'lab-2', name: 'SINGLE VISION SPH OVER 8.00D', price: 20.00, unit: '/EA', highlighted: false },
          { id: 'lab-3', name: 'BIFOCAL ADD OVER +3.00', price: 15.00, unit: '/EA', highlighted: false },
          { id: 'lab-4', name: 'BIFOCAL ADD OVER +4.00', price: 30.00, unit: '/EA', highlighted: false },
          { id: 'lab-5', name: 'CYLINDER OVER 4.00D', price: 20.00, unit: '/PR', highlighted: false },
          { id: 'lab-6', name: 'PRISM', price: 10.00, unit: '/EA', highlighted: false },
          { id: 'lab-7', name: 'EYESIZE OVER 58mm', price: 20.00, unit: '', highlighted: false },
          { id: 'lab-8', name: 'SEMI RIMLESS GROOVE', price: 20.00, unit: '', highlighted: false }
        ]
      },
      {
        id: 'misc-fees',
        title: '7. MISCELLANEOUS',
        badge: 'DISPENSARY SURCHARGES & FEES',
        items: [
          { id: 'misc-1', name: 'OAKLEY IN-LINE', price: 80.00, unit: '', highlighted: false },
          { id: 'misc-2', name: 'EDGE DOWN FRAMES NOT PURCHASED HERE', price: 35.00, unit: '', highlighted: false },
          { id: 'misc-3', name: 'SLAB OFF', price: 185.00, unit: '', highlighted: false },
          { id: 'misc-4', name: 'TAKE PD FOR NON PATIENT', price: 25.00, unit: '', highlighted: false },
          { id: 'misc-5', name: 'DRILL MOUNT', price: 40.00, unit: '', highlighted: false },
          { id: 'misc-6', name: 'PRESS-ON PRISM', price: 75.00, unit: '/EA', highlighted: false },
          { id: 'misc-7', name: 'ROLL/POLISH', price: 45.00, unit: '', highlighted: false },
          { id: 'misc-8', name: 'SIDE SHIELDS', price: 30.00, unit: '', highlighted: false }
        ]
      }
    ],
    diagram: {
      id: 'diagram-p3',
      title: 'Anti-Glare (AR) Driving Simulator & Ray-Ban Authentic Guide',
      type: 'preset',
      presetName: 'ar-night-driving',
      customImageUrl: '',
      caption: 'AR Eliminates Distracting Headlight Glare & Halos for Night Driving • 100% Ray-Ban Digital Surfacing'
    }
  },

  // BONUS CHAIRSIDE CHEAT SHEET & TROUBLESHOOTING GUIDE (PDF 2)
  opticianCheatSheet: {
    transposition: {
      rule1: '1. New Main Power (Sphere): Add the first two numbers together (+ and -).',
      rule2: '2. Flip Astigmatism Sign: Change (+) to (-) or (-) to (+). Keep number same.',
      rule3: '3. Turn Axis by 90°: If <= 90°, add 90. If > 90°, subtract 90.',
      example: {
        original: '-2.00 +1.50 x 045',
        step1: '-2.00 + (+1.50) = -0.50',
        step2: '+1.50 flips to -1.50',
        step3: '045 + 90 = 135',
        transposed: '-0.50 -1.50 x 135'
      }
    },
    nosePads: [
      { name: 'Front Angle (Tilted Inward ~20°)', desc: 'Tops sit closer together than bottoms to match nose slope.' },
      { name: 'Side Angle (Splay ~25°-30°)', desc: 'Front edges sit closer than rear edges as nose widens toward cheeks.' },
      { name: 'Upright Tilt (~10°-15°)', desc: 'Tops tilt forward slightly so pad rests flat without digging in.' },
      { name: 'Golden Rule', desc: 'Entire flat surface must touch skin—never just an edge or corner.' }
    ],
    faceShapes: [
      { shape: 'Round Face', advice: 'Angular, rectangular, or square frames with thin bridge to lengthen/slim.' },
      { shape: 'Square Face', advice: 'Round or curved oval frames with thin rims to soften boxy jawline.' },
      { shape: 'Heart-Shaped', advice: 'Bottom-heavy shapes, rimless glasses, or light pastel colors.' },
      { shape: 'Long / Oblong', advice: 'Tall lenses (deep top-to-bottom) or detailed temples to break up length.' }
    ],
    fittingHeights: [
      { type: 'No-Line Progressives (PALs)', instructions: 'Dot fitting cross in pupil center at eye-level. 14-18mm frame height below pupil. 8-12° pantoscopic tilt.' },
      { type: 'Lined Bifocals', instructions: 'Top line at lower eyelid (lower limbus). Drop 1mm if hiker/driver. Raise 1mm if desk reader.' },
      { type: 'Trifocals & Computer', instructions: 'Trifocal: upper line at pupil bottom. Office/Workspace: pupil center or +1mm above.' }
    ],
    benchHabits: [
      'Confirm Bench Flatness: No four-point wobble on flat desk.',
      'Check Temple Tension: Rest lightly without bowing out.',
      'Clean & Re-dot Progressives: Verify yellow pupil alignment before customer departs.'
    ],
    troubleshooting: [
      { category: 'A. Progressive & Multifocal Complaints', items: [
        { complaint: '"I have to tilt my chin way up to read my phone or book"', cause: 'Reading sweet spot sitting too low in frame.', fix: 'Squeeze nose pads closer, increase cheek tilt (8-12°), bring lenses closer.' },
        { complaint: '"I have to tuck my chin down to see street signs or TV"', cause: 'Reading portion sitting too high, invading distance zone.', fix: 'Spread nose pads wider to drop frame, reduce cheek tilt slightly.' },
        { complaint: '"My reading area feels like looking through a tiny straw"', cause: 'Glasses sit too far away, or frame sits too upright.', fix: 'Shorten vertex distance (push closer), increase cheek tilt 10-12°, verify PD.' },
        { complaint: '"I have to turn my whole head to read across a single line"', cause: 'Lenses too far from eyes, or pupillary distance was made too wide.', fix: 'Bring frame closer to widen viewing funnel. If channel off-center, remake.' },
        { complaint: '"The bifocal line gets in the way when I walk downstairs"', cause: 'Bifocal line is set too high for walking gait.', fix: 'Widen nose pads to drop frame 1-2mm, bend temple tips so frame sits lower.' }
      ]},
      { category: 'B. Distortion, Swim Effect & High Prescriptions', items: [
        { complaint: '"The room looks like a fishbowl / walls bend when I turn"', cause: 'Frame is completely flat across face or lenses too far.', fix: 'Add slight face wrap (panoramic curve) and reduce vertex distance.' },
        { complaint: '"The floor feels curved or like I am stepping into a hole"', cause: 'Astigmatism angle or tilt causing vertical spatial distortion.', fix: 'Double-check axis on lensometer. Tilt bottom of frame inward toward cheeks.' },
        { complaint: '"Everything seems slightly double or pulls my eyes"', cause: 'Optical centers do not line up with eyes (unwanted prism).', fix: 'Verify optical center height and PD against prescription; level frame temples.' },
        { complaint: '"Objects look smaller / larger than with old glasses"', cause: 'Big power shift or vertex distance changed.', fix: 'Adjust nose pads to match vertex distance of comfortable previous glasses.' }
      ]},
      { category: 'C. Frame Slipping, Sore Spots & Physical Fit', items: [
        { complaint: '"My glasses constantly slide down my nose"', cause: 'Bridge too wide, pads not gripping, or ear bend starts too far back.', fix: 'Re-bend temple tips right at ear-skull junction. Squeeze pads closer.' },
        { complaint: '"Pain or sore red marks behind my ears"', cause: 'Temple tips bend too early and press ear cartilage or mastoid bone.', fix: 'Move bend 2-3mm back to hug skull gently; flare very end outward.' },
        { complaint: '"Pinching or deep red indentations on nose"', cause: 'Pads too close or resting on sharp corner/edge.', fix: 'Spread pads slightly wider; rotate so full pad rests flush. Swap to silicone.' },
        { complaint: '"My eyelashes brush against the back of lenses"', cause: 'Glasses sit too close to eyes or lack forward cheek tilt.', fix: 'Lengthen pad arms to move lenses forward, or adjust acetate bridge gap.' },
        { complaint: '"The frame sits crooked—one eye higher than the other"', cause: 'Ears sit at different heights on the head.', fix: 'Golden Rule: Bend temple on the higher side UP (or lower side down).' },
        { complaint: '"Severe reflections, glare, or halos around headlights at night"', cause: 'Missing AR coating, dirty/smeared lenses, or flat tilt catching overhead light.', fix: 'Add anti-reflective (AR) coating. Increase cheek tilt slightly.' }
      ]}
    ]
  },

  // BONUS DIRECTORY (PDF 3)
  directory: {
    surgeons: [
      { name: 'Commonwealth Eye Surgery', doctor: 'Dr. Lance S. Ferguson, M.D.', spec: 'Cataract, LASIK, Cornea', addr: '2353 Alexandria Dr, Ste 260 • Lexington', phone: '(859) 224-2655', fax: '(859) 223-7147' },
      { name: 'Kentucky Eye Institute', doctor: 'Drs. Echegaray, Smith, Higgins', spec: 'Cataract, Glaucoma, Cornea', addr: '601 Perimeter Dr, Ste 200 • Lexington', phone: '(859) 278-9393', fax: '(859) 278-0923', ref: '(859) 618-6707' },
      { name: 'Bluegrass Eyecare Center', doctor: 'Drs. Ansari, Harbie, Bowers, Good', spec: 'Cataract Surgery, Glaucoma & Lasers', addr: '715 Shaker Drive • Lexington (Off Harrodsburg)', phone: '(859) 278-8443', fax: '(859) 278-6325' },
      { name: 'UK Advanced Eye Care', doctor: 'Academic Specialty Care', spec: 'Cornea, Retina, Trauma & Oculoplastics', addr: '110 Conn Terrace (Shriners Bldg) • Lexington', phone: '(859) 323-5867', fax: '(859) 257-6718' },
      { name: 'Huffman & Huffman, P.S.C.', doctor: 'Surgical Group', spec: 'Cataract Extractions, YAG Laser, Glaucoma & Eyelids', addr: '2704 Old Rosebud Rd, Ste 230 • Lexington', phone: '(859) 263-4631', fax: '(859) 263-5694' },
      { name: 'Retina Associates of KY', doctor: 'Retina Care Specialists', spec: 'Vitreoretinal Surgery, Diabetic Retinopathy & Macula', addr: '120 N Eagle Creek Dr, Ste 500 • Lexington', phone: '(859) 263-3900', fax: '(859) 263-3757' }
    ],
    doctors: [
      { name: 'Dr. Kevin Snipes & Associates (The Summit)', type: 'LensCrafters Summit', addr: '118 Marion Street, Ste 120 • Lexington', phone: '(859) 271-6194', fax: '(859) 271-4425' },
      { name: 'Dr. Kevin Snipes & Associates (Hamburg)', type: 'LensCrafters Hamburg', addr: '2160 Sir Barton Way, Ste 143 • Lexington', phone: '(859) 543-0857', fax: '(859) 543-0737' },
      { name: 'EyeMax (Nicholasville Rd)', doctor: 'Dr. Clay Mattson & Dr. Maggard', addr: '4051 Nicholasville Rd, Ste 140 • Lexington', phone: '(859) 272-1422', fax: '(859) 273-4582' },
      { name: 'EyeMax (North Park)', doctor: 'Dr. Clif Gregory & Dr. Shelby Henderson', addr: '500 W New Circle Rd • Lexington', phone: '(859) 225-4657', fax: '(859) 225-8366' },
      { name: 'Dr. Gregory Marshall, O.D. (Walmart Doctor)', doctor: 'Vision Care Providers of KY', addr: '2350 Grey Lag Way (Walmart #3894) • Lexington', phone: '(859) 263-2020', fax: '(859) 263-0837' },
      { name: 'Visionworks (Nicholasville Rd)', type: 'Full Exams & Retinal Screening', addr: '3695 Nicholasville Rd, Ste 150 (Fayette Mall area)', phone: '(859) 273-4443', fax: '(859) 273-5633' },
      { name: 'Visionworks (Hamburg Pavilion)', type: 'Comprehensive Exams & Rx', addr: '2312 Sir Barton Way, Ste 170 • Lexington', phone: '(859) 543-8383', fax: '(859) 264-9734' },
      { name: 'Eyeglass World (Larkin Rd)', type: 'Exams & Contacts', addr: '2558 Larkin Road, Ste 130 • Lexington', phone: '(859) 277-9532', fax: '(859) 277-9532' }
    ],
    labs: [
      { name: 'FAIT Optical Labs', acct: '3815A', phone: '(800) 747-9000', fax: '(888) 437-8415' },
      { name: 'Classic Optical Laboratories', acct: 'IE5033', phone: '(888) 522-2020', fax: '(888) 522-2022' },
      { name: 'Eagle Safety', acct: '', phone: '(877) 465-3887', fax: '(877) 213-2453' }
    ],
    plans: [
      { name: 'Humana Healthy Horizons', phone: '(800) 444-9137' },
      { name: 'Premiere / Premier Vision', phone: '(800) 738-1889' },
      { name: 'Avēsis Vision', phone: '(855) 214-6777' },
      { name: 'KY Medicaid', phone: '(800) 807-1232' },
      { name: 'WellCare of KY', phone: '(877) 389-9457' },
      { name: 'VSP Vision Care', phone: '(800) 877-7195' },
      { name: 'EyeMed Vision', phone: '(866) 800-5457' },
      { name: 'Versant Health', phone: '(877) 235-5317' },
      { name: 'EyeQuest Vision (DentaQuest / Medicaid)', providerPhone: '(844) 870-3978', memberPhone: '(855) 343-7405' }
    ]
  }
};
