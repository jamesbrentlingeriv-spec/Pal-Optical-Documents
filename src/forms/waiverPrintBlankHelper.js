/* Pal Optical Forms Web App - Helper for 2-Up Blank Waiver Half-Sheet Printing */

export function renderCutLine() {
  return `
    <div class="waiver-cut-line" aria-label="Cut line">
      <div class="cut-line-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="6" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
          <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
          <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
        </svg>
        <span>CUT HERE</span>
      </div>
    </div>
  `;
}

export function renderWaiverBrandHeader(titleEn, titleEs) {
  return `
    <div class="wb-header">
      <div class="wb-brand-block">
        <div class="wb-brand-title">PAL OPTICAL</div>
        <div class="wb-brand-sub">1555 E. New Circle Rd, Lexington, KY 40505 &bull; (859) 253-3031</div>
      </div>
      <div class="wb-doc-title-block">
        <div class="wb-doc-title">${titleEn}</div>
        ${titleEs ? `<div class="wb-doc-subtitle">${titleEs}</div>` : ''}
      </div>
    </div>
  `;
}

export function render2UpBlankSheet(renderHalfSheetFn) {
  const halfSheetHtml = renderHalfSheetFn();
  return `
    <div class="waiver-blank-2up-sheet" id="waiver-blank-2up-print">
      <div class="waiver-half-page top-half">
        ${halfSheetHtml}
      </div>
      ${renderCutLine()}
      <div class="waiver-half-page bottom-half">
        ${halfSheetHtml}
      </div>
    </div>
  `;
}
