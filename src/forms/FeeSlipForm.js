/* Pal Optical Forms Web App - Office Fee Slip / Superbill Form */

export class FeeSlipForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    
    // Set default empty states using reference app schema
    this.state = {
      patientName: '',
      dateOfService: new Date().toISOString().split('T')[0],
      procedures: {},
      procedureValues: {},
      diagnosis: {},
      clMaterials: {
        rt: '',
        lt: '',
        s1: '',
        s2: '',
        sphere: '',
        toric: ''
      },
      routineMedical: '',
      contactsOther: '',
      total: '',
      received: '',
      paymentType: '',
      insUsed: '',
      ...state
    };
    
    // Ensure nested objects are initialized if not present
    if (!this.state.procedures) this.state.procedures = {};
    if (!this.state.procedureValues) this.state.procedureValues = {};
    if (!this.state.diagnosis) this.state.diagnosis = {};
    if (!this.state.clMaterials) {
      this.state.clMaterials = { rt: '', lt: '', s1: '', s2: '', sphere: '', toric: '' };
    }
    
    this.onStateChange = onStateChange;
    
    this.render();
    this.bindEvents();
  }
  
  renderSectionTitle(title) {
    return `<h2 class="section-title">${title}</h2>`;
  }
  
  renderProcedure(label, code, name) {
    const isChecked = this.state.procedures[name] ? 'checked' : '';
    const codeSpan = code ? `<span class="code-text shrink-0 text-[8px]">${code}</span>` : '';
    const val = this.state.procedureValues[name] || '';
    
    return `
      <div class="flex items-center justify-between gap-1 py-0 px-0">
        <div class="flex items-center gap-1 flex-1 min-w-0">
          <input type="checkbox" class="checkbox-custom shrink-0 scale-75 proc-cb" data-name="${name}" ${isChecked}>
          <span class="label-text truncate text-[8px]">${label}</span>
        </div>
        ${codeSpan}
        <input type="text" class="w-12 border-b border-black text-right focus:outline-none proc-val" data-name="${name}" value="${val}">
      </div>
    `;
  }
  
  renderDiagnosis(label, name) {
    const isChecked = this.state.diagnosis[name] ? 'checked' : '';
    
    return `
      <div class="flex items-start gap-1 py-0">
        <input type="checkbox" class="checkbox-custom mt-0.5 shrink-0 scale-75 diag-cb" data-name="${name}" ${isChecked}>
        <span class="label-text text-[8px] leading-tight">${label}</span>
      </div>
    `;
  }
  
  render() {
    const isBothActive = this.state.contactsOther && this.state.contactsOther !== '0' && this.state.contactsOther !== '';
    
    this.container.innerHTML = `
      <div class="fee-slip-container print:shadow-none print:my-0 print:border-none print:w-full print:max-w-none">
        <form id="fee-slip-form" class="flex flex-col flex-1 h-full" onsubmit="return false;">
          
          <!-- Name & Date Header -->
          <div class="flex items-end gap-x-12 mb-4 border-b-2 border-black pb-1">
            <div class="flex-1 flex items-end gap-2 header-input">
              <span class="font-black text-sm tracking-tighter uppercase shrink-0">Patients Name:</span>
              <input type="text" id="fs-patient-name" class="flex-1 border-b border-black uppercase py-0 focus:outline-none text-[11pt]" value="${this.state.patientName || ''}">
            </div>
            <div class="flex items-end gap-2 header-input">
              <span class="font-black text-sm tracking-tighter uppercase shrink-0">Date:</span>
              <input type="date" id="fs-date" class="w-48 border-b border-black py-0 focus:outline-none text-[11pt]" value="${this.state.dateOfService || ''}">
            </div>
          </div>
          
          <!-- Main Content Grid -->
          <div class="flex-1 grid grid-cols-12 gap-x-1">
            
            <!-- COLUMN 1 -->
            <div class="col-span-4 flex flex-col gap-1 border-r-2 border-neutral-200 pr-2">
              <div>
                ${this.renderSectionTitle("Office Procedures")}
                ${this.renderSectionTitle("Routine Exams")}
                ${this.renderProcedure("Routine Vision W/Ref/NP", "90620", "v90620")}
                ${this.renderProcedure("Routine Vision W/Ref/EP", "90621", "v90621")}
                
                ${this.renderSectionTitle("Contact Lens Services")}
                <div class="grid grid-cols-1">
                  ${this.renderProcedure("Contact Lens Fit", "92320", "v92320")}
                  <div class="pl-4 flex flex-col">
                    ${this.renderProcedure("Low", "", "cl_low")}
                    ${this.renderProcedure("Med", "", "cl_med")}
                    ${this.renderProcedure("High", "", "cl_high")}
                  </div>
                  ${this.renderProcedure("Bridge CL For Disease", "92070", "v92070")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Vision/Medical Exams")}
                <div class="grid grid-cols-1">
                  ${this.renderProcedure("Eye Exam Int/NP", "92002", "v92002")}
                  ${this.renderProcedure("Eye Exam Int/EP", "92012", "v92012")}
                  ${this.renderProcedure("Eye Exam Xomp/NP", "92004", "v92004")}
                  ${this.renderProcedure("Eye Exam Comp/EP", "92014", "v92014")}
                  ${this.renderProcedure("Refraction", "92015", "v92015")}
                  ${this.renderProcedure("Glaucoma Screening", "92140", "v92140")}
                  ${this.renderProcedure("Probfocus/Strtfwd/NP", "99201", "v99201")}
                  ${this.renderProcedure("Expanded PF/Strtfwd/NP", "99202", "v99202")}
                  ${this.renderProcedure("Cmprhve/High Complex/NP", "99205", "v99205")}
                  ${this.renderProcedure("Probfocused/Strtfwd/EP", "99211", "v99211")}
                  ${this.renderProcedure("Expand PF/Strtfwd/EP", "99212", "v99212")}
                  ${this.renderProcedure("Detailed/Low Complex/EP", "99213", "v99213")}
                  ${this.renderProcedure("Cmphve/Med Complex/EP", "99214", "v99214")}
                  ${this.renderProcedure("Cmphve/High Complex/EP", "99215", "v99215")}
                  ${this.renderProcedure("Emergency After Hours", "99058", "v99058")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Co-Management")}
                <div class="grid grid-cols-1">
                  ${this.renderProcedure("Laser (IE YAG) Post-OP", "66821-55", "v66821")}
                  ${this.renderProcedure("Int-Cap Cat 5x W/IOL P-OP", "66822-55", "v66822")}
                  ${this.renderProcedure("Ext-Cap Cat 5x W/IOL P-OP", "66984-55", "v66984")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Vision Therapy")}
                <div class="grid grid-cols-1">
                  ${this.renderProcedure("Sensormotor Exam", "92060", "v92060")}
                  ${this.renderProcedure("Orthopic/Picoptic Training", "92065", "v92065")}
                  ${this.renderProcedure("Blepharitus, Unspecified", "", "v92066")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Therapeutics")}
                <div class="grid grid-cols-1">
                  ${this.renderProcedure("FB Removal, Conj, Support", "65205", "v65205")}
                  ${this.renderProcedure("FB Removal, Conj, Embed", "65210", "v65210")}
                  ${this.renderProcedure("FB Removal, Corneal, NO SLE", "65222", "v65220")}
                  ${this.renderProcedure("FB Removal, Corneal SLE", "65222", "v65222")}
                  ${this.renderProcedure("Epilation by Focepts Only", "67820", "v67820")}
                  ${this.renderProcedure("FB Removal, Eyelid Embed", "67936", "v67936")}
                  ${this.renderProcedure("Punctal Plug Insertion EX", "68761", "v68761")}
                  ${this.renderProcedure("Dilation of Punct W/Wc IRRI", "68901", "v68901")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Special Diagnostic Testing")}
                <div class="grid grid-cols-1">
                  ${this.renderProcedure("Corneal Topography", "92025", "v92025")}
                  ${this.renderProcedure("Gonioscopy", "92020", "v92020")}
                  ${this.renderProcedure("Visual Field, Limited", "92081", "v92081")}
                  ${this.renderProcedure("Visual Field, Inter", "92100", "v92100")}
                  ${this.renderProcedure("Visual Field, Extended", "92083", "v92083")}
                  ${this.renderProcedure("Pachymetry (Uni/Bi)", "76514", "v76514")}
                  ${this.renderProcedure("Fundus Photography", "95060", "v95060")}
                  ${this.renderProcedure("Scan Laser/OCT/Ant", "92135", "v92135")}
                  ${this.renderProcedure("Laser/OCT/OP Nerve", "92134", "v92134")}
                  ${this.renderProcedure("Laser/OCT/Retina", "92285", "v92285")}
                  ${this.renderProcedure("Ext Ophthm, Initial (Per Eye)", "92225", "v92225")}
                  ${this.renderProcedure("Ext Ophthm, Subs (Per Eye)", "92226", "v92226")}
                  ${this.renderProcedure("Convergence Infuff/Palsy", "92132", "v92132")}
                  ${this.renderProcedure("Schirmer Tear Test", "", "v92227")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Functional")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Convergence Excess", "func_conv_ex")}
                  ${this.renderDiagnosis("Amblyopia, Unsp.", "func_ambly")}
                  ${this.renderDiagnosis("Binocular Vis Disorder, Unsp.", "func_bino")}
                  ${this.renderDiagnosis("Color Vision Deficiencies", "func_color")}
                  ${this.renderDiagnosis("Esophoria", "func_esp")}
                  ${this.renderDiagnosis("Exophoria", "func_exop")}
                  ${this.renderDiagnosis("Diplopia", "func_diplo")}
                  ${this.renderDiagnosis("Esotropia, Unsp.", "func_esot")}
                  ${this.renderDiagnosis("Exotropia, Unsp.", "func_exot")}
                  ${this.renderDiagnosis("Hypertropia", "func_hyper")}
                  ${this.renderDiagnosis("Legal Blindness, USA", "func_legal")}
                </div>
              </div>
              
              <div class="mt-auto pt-4 border-t-2 border-black">
                <div class="text-[10pt] font-black italic leading-tight uppercase text-left">
                  DRS. KLECKER AND ROBBINS<br>
                  1555 E NEW CIRCLE STE 146<br>
                  LEXINGTON, KY 40509<br>
                  (859) 269-6921
                </div>
              </div>
            </div>
            
            <!-- COLUMN 2 -->
            <div class="col-span-4 flex flex-col gap-1 border-r-2 border-neutral-200 pr-2">
              <div>
                ${this.renderSectionTitle("Refractive Error")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Myopia", "ref_myopia")}
                  ${this.renderDiagnosis("Hyperopia", "ref_hyperopia")}
                  ${this.renderDiagnosis("Astigmatism", "ref_astig")}
                  ${this.renderDiagnosis("Presbyopia", "ref_presby")}
                  ${this.renderDiagnosis("Anisometropia", "ref_aniso")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Conjunctiva")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Conjunctivitus", "conj_conjunctivitus")}
                  ${this.renderDiagnosis("Acute Atropic", "conj_acute")}
                  ${this.renderDiagnosis("Chronic Allergic", "conj_allergic")}
                  ${this.renderDiagnosis("Chronic Unsp.", "conj_chronic")}
                  ${this.renderDiagnosis("Subconj Hemorrhage", "conj_hemorrhage")}
                  ${this.renderDiagnosis("Pinguecula", "conj_pinguecula")}
                  ${this.renderDiagnosis("Pterygium", "conj_pterygium")}
                  ${this.renderDiagnosis("Foreign Body, Conjunctival", "conj_foreign")}
                  ${this.renderDiagnosis("Laceration of Eye, Unsp.", "conj_laceration")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Cornea")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Abrasion, Scratch", "corn_abrasion")}
                  ${this.renderDiagnosis("Degeneration", "corn_degen")}
                  ${this.renderDiagnosis("Unsp. Deposit", "corn_deposit")}
                  ${this.renderDiagnosis("Dystrophy, Unsp.", "corn_dystrophy")}
                  ${this.renderDiagnosis("Edema, Unsp.", "corn_edema")}
                  ${this.renderDiagnosis("Edema, CL Related", "corn_edemacl")}
                  ${this.renderDiagnosis("Neo. Unsp.", "corn_neo")}
                  ${this.renderDiagnosis("Scar Unsp.", "corn_scar")}
                  ${this.renderDiagnosis("Ulcer, Central", "corn_ulcer")}
                  ${this.renderDiagnosis("Ulcer, Marginal", "corn_ulcerm")}
                  ${this.renderDiagnosis("Dry Eye Syndrome", "corn_dryeye")}
                  ${this.renderDiagnosis("Endo Corneal Dystrophy", "corn_endo")}
                  ${this.renderDiagnosis("Herpes Simplex", "corn_herpes")}
                  ${this.renderDiagnosis("Herpes Zoster", "corn_herpez")}
                  ${this.renderDiagnosis("Keratitus, Superficial", "corn_keratitus")}
                  ${this.renderDiagnosis("Keraoconus, Unsp.", "corn_keratoconus")}
                  ${this.renderDiagnosis("Poterior Corneal Pigment", "corn_postpig")}
                  ${this.renderDiagnosis("Recurrent Corneal Erosion", "corn_recur")}
                  ${this.renderDiagnosis("Sleritus/Episcieritus", "corn_sleritus")}
                  ${this.renderDiagnosis("Senile Corneal Changes(ARCUS)", "corn_senile")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Eyelid/Adnexa")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Black Eye", "eye_black")}
                  ${this.renderDiagnosis("Blepharochalasis(Pseudoptosis)", "eye_blepha")}
                  ${this.renderDiagnosis("Chalazion", "eye_chalazion")}
                  ${this.renderDiagnosis("Dermatitis, Contact/Allergic", "eye_dermatitis")}
                  ${this.renderDiagnosis("Dermatochaisis", "eye_dermatochaisis")}
                  ${this.renderDiagnosis("Entropion, Senile", "eye_entropion")}
                  ${this.renderDiagnosis("Edema of Eyelid", "eye_edema")}
                  ${this.renderDiagnosis("Hordecium, External", "eye_hordecium")}
                  ${this.renderDiagnosis("Inflammation of the Eyelid, Unsp.", "eye_inflame")}
                  ${this.renderDiagnosis("Lagophthalmo", "eye_lago")}
                  ${this.renderDiagnosis("Xanthelasma", "eye_xan")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Glaucoma")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Angle Closure Chronic", "glau_closure")}
                  ${this.renderDiagnosis("Ocular Hypertension", "glau_htn")}
                  ${this.renderDiagnosis("Open-Angle", "glau_open")}
                  ${this.renderDiagnosis("Glaucoma Primary", "glau_prime")}
                  ${this.renderDiagnosis("Glaucoma Suspect", "glau_suspect")}
                  ${this.renderDiagnosis("Glaucoma Unsp.", "glau_unsp")}
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Optic Nerve")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Drusen of Optic Disk", "optic_drusen")}
                  ${this.renderDiagnosis("Glaucoma Atrophy, O. Disk", "optic_glatrophy")}
                  ${this.renderDiagnosis("Optic Atrophy, Unsp.", "optic_atrophy")}
                  ${this.renderDiagnosis("Optic Neuropathy, Ischemic", "optic_neuro")}
                  ${this.renderDiagnosis("Optic Neuritis", "optic_neuritis")}
                  ${this.renderDiagnosis("Papilidema, Unsp.", "optic_papili")}
                  ${this.renderDiagnosis("Psuedopapillidema", "optic_pseudo")}
                  ${this.renderDiagnosis("Pseudotumor Cerebri", "optic_tumor")}
                </div>
              </div>
              <!-- Bottom border spacer to align column baselines -->
              <div class="mt-auto pt-4 border-t-2 border-black min-h-[50px]"></div>
            </div>
            
            <!-- COLUMN 3 -->
            <div class="col-span-4 flex flex-col gap-1">
              <div>
                ${this.renderSectionTitle("Retina")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("CRAO", "ret_crao")}
                  ${this.renderDiagnosis("CRVO", "ret_crvo")}
                  ${this.renderDiagnosis("BRAO", "ret_brao")}
                  ${this.renderDiagnosis("BRVO", "ret_brvo")}
                  ${this.renderDiagnosis("Diabetic Retinopathy", "ret_diab")}
                  
                  <div class="pl-2">
                    ${this.renderDiagnosis("Background", "ret_background")}
                    ${this.renderDiagnosis("Proliferative", "ret_prolife")}
                    ${this.renderDiagnosis("Non-Proliferative", "ret_nonprolife")}
                    
                    <div class="pl-3">
                      ${this.renderDiagnosis("NDS", "ret_nds")}
                      ${this.renderDiagnosis("Mild", "ret_mild")}
                      ${this.renderDiagnosis("Moderate", "ret_Mod")}
                      ${this.renderDiagnosis("Severe", "ret_sev")}
                    </div>
                  </div>
                  
                  ${this.renderDiagnosis("Drusen, Degenerative", "ret_dr")}
                  ${this.renderDiagnosis("Lattice, Degenerative", "ret_latt")}
                  ${this.renderDiagnosis("Macular", "ret_mac")}
                  
                  <div class="pl-4">
                    ${this.renderDiagnosis("Cyst, Hole, Psuedohole", "ret_cyst")}
                    ${this.renderDiagnosis("Degeneration, Exud.", "ret_dege")}
                    ${this.renderDiagnosis("Degeneration, Nonex", "ret_degnon")}
                    ${this.renderDiagnosis("Edema, Diabetic", "ret_ede")}
                    ${this.renderDiagnosis("CME", "ret_cmc")}
                    ${this.renderDiagnosis("Puckering", "ret_puck")}
                    ${this.renderDiagnosis("Scars, Other", "ret_scar")}
                  </div>
                  
                  ${this.renderDiagnosis("Retinal", "ret_ret")}
                  <div class="pl-4">
                    ${this.renderDiagnosis("Benign Neoplasm", "ret_ben")}
                    ${this.renderDiagnosis("Defect Unsp.", "ret_def")}
                    ${this.renderDiagnosis("Detach w/ Defect", "ret_det")}
                    ${this.renderDiagnosis("Edema", "ret_edem")}
                    ${this.renderDiagnosis("Hemorrhage", "ret_hem")}
                    ${this.renderDiagnosis("Ptaquanti", "ret_ptaq")}
                    ${this.renderDiagnosis("POHS", "ret_pohs")}
                    ${this.renderDiagnosis("Pigmentosa", "ret_pigm")}
                    ${this.renderDiagnosis("Tear w/o Defect", "ret_tear")}
                  </div>
                  
                  ${this.renderDiagnosis("Retinopathy", "ret_ret")}
                  <div class="pl-4">
                    ${this.renderDiagnosis("Central Sarous", "ret_cent")}
                    ${this.renderDiagnosis("Hypertensive", "ret_hyp")}
                    ${this.renderDiagnosis("Degeneration", "ret_degener")}
                    ${this.renderDiagnosis("Floaters", "ret_float")}
                    ${this.renderDiagnosis("Hemorrhage", "ret_rethem")}
                  </div>
                  
                  ${this.renderDiagnosis("Vitrous", "ret_vit")}
                </div>
              </div>
              
              <div class="mt-1">
                ${this.renderSectionTitle("Contact Materials")}
                
                <!-- Materials Inputs Grid RT/LT/S/S -->
                <div class="grid grid-cols-4 gap-x-1 mb-1">
                  <div class="flex items-end gap-1">
                    <span class="text-[7px] font-bold">RT</span>
                    <input type="text" id="fs-cl-rt" class="w-full border-b border-black focus:outline-none" value="${this.state.clMaterials.rt || ''}">
                  </div>
                  <div class="flex items-end gap-1">
                    <span class="text-[7px] font-bold">LT</span>
                    <input type="text" id="fs-cl-lt" class="w-full border-b border-black focus:outline-none" value="${this.state.clMaterials.lt || ''}">
                  </div>
                  <div class="flex items-end gap-1">
                    <span class="text-[7px] font-bold">S</span>
                    <input type="text" id="fs-cl-s1" class="w-full border-b border-black focus:outline-none" value="${this.state.clMaterials.s1 || ''}">
                  </div>
                  <div class="flex items-end gap-1">
                    <span class="text-[7px] font-bold">S</span>
                    <input type="text" id="fs-cl-s2" class="w-full border-b border-black focus:outline-none" value="${this.state.clMaterials.s2 || ''}">
                  </div>
                </div>
                
                <!-- Radio Sphere & Toric Options -->
                <div class="space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="label-text text-[8px]">Sphere</span>
                    <div class="flex gap-1">
                      <label class="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" name="fs-cl-sphere" value="V2510" class="radio-custom scale-75" ${this.state.clMaterials.sphere === 'V2510' ? 'checked' : ''}> V2510
                      </label>
                      <label class="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" name="fs-cl-sphere" value="V2520" class="radio-custom scale-75" ${this.state.clMaterials.sphere === 'V2520' ? 'checked' : ''}> V2520
                      </label>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="label-text text-[8px]">Toric</span>
                    <div class="flex gap-1">
                      <label class="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" name="fs-cl-toric" value="V2511" class="radio-custom scale-75" ${this.state.clMaterials.toric === 'V2511' ? 'checked' : ''}> V2511
                      </label>
                      <label class="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" name="fs-cl-toric" value="V2521" class="radio-custom scale-75" ${this.state.clMaterials.toric === 'V2521' ? 'checked' : ''}> V2521
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                ${this.renderSectionTitle("Iris")}
                <div class="grid grid-cols-1">
                  ${this.renderDiagnosis("Iridocyclitus/Uveitis", "irid_irid")}
                  <div class="pl-5">
                    ${this.renderDiagnosis("Acute/Subac", "iris_ac")}
                    ${this.renderDiagnosis("Ute Chronic", "iris_ute")}
                    ${this.renderDiagnosis("Primary", "iris_prim")}
                    ${this.renderDiagnosis("Recurrent", "iris_recur")}
                  </div>
                  ${this.renderDiagnosis("Scleritus, Unsp.", "iris_scl")}
                </div>
              </div>
              
              <!-- Ledger Summary Box -->
              <div class="mt-auto pt-4 flex flex-col gap-1 border-t-4 border-black summary-input">
                <div class="flex items-end justify-between gap-1">
                  <span class="font-black text-[11px] uppercase underline leading-tight shrink-0">ROUTINE / MEDICAL:</span>
                  <input type="text" id="fs-routine-medical" class="flex-1 min-w-0 border-b border-black focus:outline-none text-[11pt] font-black" value="${this.state.routineMedical || ''}">
                </div>
                <div class="flex items-end justify-between gap-1">
                  <span class="font-black text-[11px] uppercase underline leading-tight shrink-0">CONTACTS / OTHER :</span>
                  <input type="text" id="fs-contacts-other" class="flex-1 min-w-0 border-b border-black focus:outline-none text-[11pt] font-black" value="${this.state.contactsOther || ''}">
                </div>
                
                <div class="flex items-end justify-between gap-1 mt-2">
                  <span class="font-black text-[11px] uppercase leading-none shrink-0">TOTAL :</span>
                  <div class="flex items-end gap-1 flex-1 border-b border-black">
                    <span class="text-sm font-bold">$</span>
                    <input type="number" step="0.01" id="fs-total" class="flex-1 min-w-0 text-left focus:outline-none bg-transparent font-black text-[11pt]" value="${this.state.total || ''}">
                  </div>
                </div>
                
                <div class="flex items-end justify-between gap-1 mt-2">
                  <span class="font-black text-[11px] uppercase leading-none shrink-0">RECIEVED:</span>
                  <div class="flex items-end gap-1 flex-1 border-b border-black">
                    <span class="text-sm font-bold">$</span>
                    <input type="number" step="0.01" id="fs-received" class="flex-1 min-w-0 text-left focus:outline-none bg-transparent font-black text-[11pt]" value="${this.state.received || ''}">
                  </div>
                </div>
                
                <div class="flex items-end justify-between gap-1">
                  <span class="font-black text-[11px] uppercase leading-tight shrink-0">PAYMENT TYPE :</span>
                  <input type="text" id="fs-payment-type" class="flex-1 min-w-0 border-b border-black focus:outline-none placeholder:text-neutral-300 uppercase font-black text-[11pt]" placeholder="CASH/VISA" value="${this.state.paymentType || ''}">
                </div>
                <div class="flex items-end justify-between gap-1">
                  <span class="font-black text-[11px] uppercase leading-tight shrink-0">INS USED:</span>
                  <input type="text" id="fs-ins-used" class="flex-1 min-w-0 border-b border-black focus:outline-none uppercase font-black text-[11pt]" value="${this.state.insUsed || ''}">
                </div>
              </div>
              
            </div>
          </div>
          
          <!-- Bottom Row: Watermark only or empty spacer -->
          <div class="flex justify-between items-end gap-8 mt-4 relative min-h-[50px]">
            <!-- BOTH Watermark/Indicator -->
            ${isBothActive ? `
              <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-12 text-[32pt] font-black uppercase border-4 border-black px-12 py-2 bg-white">
                BOTH
              </div>
            ` : ''}
          </div>
          
        </form>
      </div>
      
      <!-- Footer details only visible in app viewport (hidden in print) -->
      <div class="max-w-[1000px] mx-auto px-8 py-4 opacity-50 flex justify-between items-center print:hidden w-full" style="font-family: 'Inter', sans-serif;">
        <div class="flex items-center gap-2 text-xs font-bold uppercase" style="color: var(--text-secondary);">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          Auto-saving enabled
        </div>
        <div class="text-[10px] uppercase font-mono" style="color: var(--text-light);">Form ID: DSLIP-2026-BWR-V1</div>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#fee-slip-form');
    if (!form) return;
    
    // Capture checkbox changes
    form.addEventListener('change', (e) => {
      const target = e.target;
      
      if (target.classList.contains('proc-cb')) {
        const name = target.getAttribute('data-name');
        this.state.procedures[name] = target.checked;
        this.updateState(false);
      }
      
      else if (target.classList.contains('diag-cb')) {
        const name = target.getAttribute('data-name');
        this.state.diagnosis[name] = target.checked;
        this.updateState(false);
      }
      
      else if (target.name === 'fs-cl-sphere') {
        this.state.clMaterials.sphere = target.value;
        this.updateState(false);
      }
      
      else if (target.name === 'fs-cl-toric') {
        this.state.clMaterials.toric = target.value;
        this.updateState(false);
      }
    });
    
    // Capture text input changes
    form.addEventListener('input', (e) => {
      const target = e.target;
      
      if (target.id === 'fs-patient-name') {
        this.state.patientName = target.value;
      }
      
      else if (target.id === 'fs-date') {
        this.state.dateOfService = target.value;
      }
      
      else if (target.classList.contains('proc-val')) {
        const name = target.getAttribute('data-name');
        this.state.procedureValues[name] = target.value;
      }
      
      else if (target.id === 'fs-cl-rt') {
        this.state.clMaterials.rt = target.value;
      }
      else if (target.id === 'fs-cl-lt') {
        this.state.clMaterials.lt = target.value;
      }
      else if (target.id === 'fs-cl-s1') {
        this.state.clMaterials.s1 = target.value;
      }
      else if (target.id === 'fs-cl-s2') {
        this.state.clMaterials.s2 = target.value;
      }
      
      else if (target.id === 'fs-routine-medical') {
        this.state.routineMedical = target.value;
        this.autoSumTotal();
      }
      else if (target.id === 'fs-contacts-other') {
        this.state.contactsOther = target.value;
        this.autoSumTotal();
        this.updateBothOverlay();
      }
      else if (target.id === 'fs-total') {
        this.state.total = target.value;
      }
      else if (target.id === 'fs-received') {
        this.state.received = target.value;
      }
      else if (target.id === 'fs-payment-type') {
        this.state.paymentType = target.value;
      }
      else if (target.id === 'fs-ins-used') {
        this.state.insUsed = target.value;
      }
      
      this.updateState(false); // Update parent state without re-rendering to preserve input focus
    });
  }
  
  autoSumTotal() {
    const rFee = parseFloat(this.state.routineMedical) || 0;
    const cFee = parseFloat(this.state.contactsOther) || 0;
    
    if (this.state.routineMedical !== '' || this.state.contactsOther !== '') {
      const sum = rFee + cFee;
      this.state.total = sum > 0 ? sum.toFixed(2) : '';
      const totalInput = this.container.querySelector('#fs-total');
      if (totalInput) {
        totalInput.value = this.state.total;
      }
    }
  }
  
  updateBothOverlay() {
    const isBothActive = this.state.contactsOther && this.state.contactsOther !== '0' && this.state.contactsOther !== '';
    const watermarkContainer = this.container.querySelector('.relative.min-h-\\[50px\\]');
    if (watermarkContainer) {
      if (isBothActive) {
        watermarkContainer.innerHTML = `<div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-12 text-[32pt] font-black uppercase border-4 border-black px-12 py-2 bg-white">BOTH</div>`;
      } else {
        watermarkContainer.innerHTML = '';
      }
    }
  }
  
  updateState(reRender = true) {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
    if (reRender) {
      this.render();
      this.bindEvents();
    }
  }
  
  reset() {
    this.state = {
      patientName: '',
      dateOfService: new Date().toISOString().split('T')[0],
      procedures: {},
      procedureValues: {},
      diagnosis: {},
      clMaterials: {
        rt: '',
        lt: '',
        s1: '',
        s2: '',
        sphere: '',
        toric: ''
      },
      routineMedical: '',
      contactsOther: '',
      total: '',
      received: '',
      paymentType: '',
      insUsed: ''
    };
    this.render();
    this.bindEvents();
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
}
