/* Pal Optical Forms Web App - Dr. Side New Patient Form */
import { SignaturePad } from '../components/SignaturePad.js';

export class DrSideNewPatientForm {
  constructor(container, state = {}, onStateChange) {
    this.container = container;
    
    // Set default values in state if not present
    this.state = {
      lastName: '', firstName: '', mi: '', address: '', city: '', stateVal: '', zip: '',
      phone: '', email: '', dob: '', ssn: '', gender: '', maritalStatus: '',
      employer: '', occupation: '', medInsurance: '', memberId: '', groupNum: '', holderName: '',
      bp: '', height: '', weight: '',
      drive: '', tobacco: '', alcohol: '', transfusion: '', drugs: '', drugsList: '',
      selectedMedicalConditions: [],
      diabetes: '', diabetesType: '', lastA1c: '',
      allergicMeds: '', allergicMedsList: '',
      currentMeds: '',
      dilationPref: '',
      selectedOcularConditions: [],
      familyHistory: {}, // Stores key -> array of family members, e.g. { Blindness: ['Mom', 'Dad'] }
      familyDoctor: '', pharmacyLoc: '',
      sigDate: '',
      signature: '',
      ...state
    };
    
    this.onStateChange = onStateChange;
    this.sigPad = null;
    
    this.familyConditions = [
      'Blindness', 'Cancer', 'Cataracts', 'Diabetes', 'Heart Disease', 
      'High Blood Pressure', 'High Cholesterol', 'Glaucoma', 
      'Macular Degeneration', 'Retinal Detachment', 'Strabismus', 'Thyroid Disease'
    ];
    
    this.familyMembers = ['Mom', 'Dad', 'Bro', 'Sis', 'MGF', 'MGM', 'PGF', 'PGM'];
    
    this.render();
    this.bindEvents();
    this.initSignature();
  }
  
  render() {
    const medCheck = (cond) => this.state.selectedMedicalConditions.includes(cond) ? 'checked' : '';
    const ocCheck = (cond) => this.state.selectedOcularConditions.includes(cond) ? 'checked' : '';
    
    // Generate Family History Grid rows
    let familyGridHTML = '';
    this.familyConditions.forEach(cond => {
      const isNoChecked = (!this.state.familyHistory[cond] || this.state.familyHistory[cond].length === 0) ? 'checked' : '';
      
      let checkboxesHTML = '';
      this.familyMembers.forEach(member => {
        const isChecked = (this.state.familyHistory[cond] && this.state.familyHistory[cond].includes(member)) ? 'checked' : '';
        checkboxesHTML += `
          <label style="display: inline-flex; align-items: center; gap: 2px; font-size: 0.725rem; font-weight: 500;">
            <input type="checkbox" class="fam-cb" data-condition="${cond}" data-member="${member}" ${isChecked}> ${member}
          </label>
        `;
      });
      
      familyGridHTML += `
        <div style="display: grid; grid-template-columns: 3fr 1fr 8fr; gap: 8px; align-items: center; border-bottom: 1px solid var(--border-color); padding: 6px 0;">
          <div style="font-weight: 600; font-size: 0.8rem; color: var(--text-primary);">${cond}</div>
          <div>
            <label style="display: inline-flex; align-items: center; gap: 2px; font-size: 0.725rem; font-weight: bold; color: var(--text-secondary);">
              <input type="checkbox" class="fam-no-cb" data-condition="${cond}" ${isNoChecked}> No
            </label>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${checkboxesHTML}
          </div>
        </div>
      `;
    });
    
    this.container.innerHTML = `
      <div class="form-card" id="dr-side-patient-card" style="max-width: 900px; padding: 36px;">
        <!-- Header -->
        <div class="form-header-block" style="border-bottom: 2px solid var(--primary); padding-bottom: 12px; margin-bottom: 24px;">
          <h2>New Patient Registration</h2>
          <p style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">Pal Optical • Dr. Klecker and Dr. Robbins Office</p>
          <p style="font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Clinical Intake Sheet (Dr. Side Form)</p>
        </div>
        
        <form id="dr-side-patient-form">
          <!-- Top dates -->
          <div class="form-grid" style="margin-bottom: 24px;">
            <div class="form-group col-6">
              <label for="ds-date">Today's Date</label>
              <input type="text" class="form-control" id="ds-date" placeholder="MM/DD/YYYY" value="${this.state.todayDate || ''}">
            </div>
            <div class="form-group col-6">
              <label for="ds-last-exam">Date of Last Eye Exam</label>
              <input type="text" class="form-control" id="ds-last-exam" placeholder="MM/DD/YYYY" value="${this.state.lastExamDate || ''}">
            </div>
          </div>
          
          <!-- Section 1: Patient's Personal Information -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              I. Patient's Personal Information
            </div>
            
            <div class="form-grid">
              <div class="form-group col-12">
                <label for="ds-last-name">Last Name</label>
                <input type="text" class="form-control" id="ds-last-name" placeholder="Doe" value="${this.state.lastName}">
              </div>
              <div class="form-group col-12">
                <label for="ds-first-name">First Name</label>
                <input type="text" class="form-control" id="ds-first-name" placeholder="John" value="${this.state.firstName}">
              </div>
              <div class="form-group col-12">
                <label for="ds-mi">M.I. (Middle Initial)</label>
                <input type="text" class="form-control" id="ds-mi" placeholder="H" value="${this.state.mi}">
              </div>
              
              <div class="form-group col-12">
                <label for="ds-address">Street Address</label>
                <input type="text" class="form-control" id="ds-address" placeholder="Street Address" value="${this.state.address}">
              </div>
              <div class="form-group col-12">
                <label for="ds-city">City</label>
                <input type="text" class="form-control" id="ds-city" placeholder="City" value="${this.state.city}">
              </div>
              <div class="form-group col-12">
                <label>Kentucky / Zip Code / Phone Number</label>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                  <input type="text" class="form-control" id="ds-state" placeholder="KY" value="${this.state.stateVal}" style="flex: 1; min-width: 80px;">
                  <input type="text" class="form-control" id="ds-zip" placeholder="Zip Code" value="${this.state.zip}" style="flex: 2; min-width: 120px;">
                  <input type="tel" class="form-control" id="ds-phone" placeholder="Phone Number" value="${this.state.phone}" style="flex: 3; min-width: 160px;">
                </div>
              </div>
              
              <div class="form-group col-12">
                <label for="ds-email">Email Address</label>
                <input type="email" class="form-control" id="ds-email" placeholder="Email" value="${this.state.email}">
              </div>
              
              <div class="form-group col-4">
                <label for="ds-dob">Date of Birth</label>
                <input type="text" class="form-control" id="ds-dob" placeholder="MM/DD/YYYY" value="${this.state.dob}">
              </div>
              <div class="form-group col-4">
                <label for="ds-ssn">SSN</label>
                <input type="text" class="form-control" id="ds-ssn" placeholder="XXX-XX-XXXX" value="${this.state.ssn}">
              </div>
              <div class="form-group col-4">
                <label>Gender</label>
                <div style="display: flex; gap: 16px; margin-top: 10px; font-size: 0.85rem;">
                  <label class="radio-label"><input type="radio" name="ds-gender" value="Male" ${this.state.gender === 'Male' ? 'checked' : ''}> M</label>
                  <label class="radio-label"><input type="radio" name="ds-gender" value="Female" ${this.state.gender === 'Female' ? 'checked' : ''}> F</label>
                  <label class="radio-label"><input type="radio" name="ds-gender" value="Other" ${this.state.gender === 'Other' ? 'checked' : ''}> Other</label>
                </div>
              </div>
              
              <div class="form-group col-6">
                <label>Marital Status</label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; font-size: 0.8rem;">
                  <label class="radio-label"><input type="radio" name="ds-marital" value="Single" ${this.state.maritalStatus === 'Single' ? 'checked' : ''}> Single</label>
                  <label class="radio-label"><input type="radio" name="ds-marital" value="Married" ${this.state.maritalStatus === 'Married' ? 'checked' : ''}> Married</label>
                  <label class="radio-label"><input type="radio" name="ds-marital" value="Divorced" ${this.state.maritalStatus === 'Divorced' ? 'checked' : ''}> Divorced</label>
                  <label class="radio-label"><input type="radio" name="ds-marital" value="Separated" ${this.state.maritalStatus === 'Separated' ? 'checked' : ''}> Separated</label>
                  <label class="radio-label"><input type="radio" name="ds-marital" value="Widowed" ${this.state.maritalStatus === 'Widowed' ? 'checked' : ''}> Widowed</label>
                </div>
              </div>
              <div class="form-group col-3">
                <label for="ds-employer">Employer</label>
                <input type="text" class="form-control" id="ds-employer" placeholder="Employer" value="${this.state.employer}">
              </div>
              <div class="form-group col-3">
                <label for="ds-occupation">Occupation</label>
                <input type="text" class="form-control" id="ds-occupation" placeholder="Occupation" value="${this.state.occupation}">
              </div>
              
              <div class="form-group col-4">
                <label for="ds-med-ins">Primary Medical Insurance</label>
                <input type="text" class="form-control" id="ds-med-ins" placeholder="Insurance Co" value="${this.state.medInsurance}">
              </div>
              <div class="form-group col-4">
                <label for="ds-member-id">Member ID / Policy #</label>
                <input type="text" class="form-control" id="ds-member-id" placeholder="ID Number" value="${this.state.memberId}">
              </div>
              <div class="form-group col-2">
                <label for="ds-group">Group Number</label>
                <input type="text" class="form-control" id="ds-group" placeholder="Group #" value="${this.state.groupNum}">
              </div>
              <div class="form-group col-2">
                <label for="ds-holder">Policy Holder Name</label>
                <input type="text" class="form-control" id="ds-holder" placeholder="If different" value="${this.state.holderName}">
              </div>
            </div>
          </div>
          
          <!-- Section 2: Patient Social & Medical History -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              II. Patient Social & Medical History
            </div>
            
            <div class="form-grid">
              <div class="form-group col-4">
                <label for="ds-bp">Last Blood Pressure</label>
                <input type="text" class="form-control" id="ds-bp" placeholder="120/80" value="${this.state.bp}">
              </div>
              <div class="form-group col-4">
                <label for="ds-height">Height</label>
                <input type="text" class="form-control" id="ds-height" placeholder="5'10\\\"" value="${this.state.height}">
              </div>
              <div class="form-group col-4">
                <label for="ds-weight">Weight (lbs)</label>
                <input type="text" class="form-control" id="ds-weight" placeholder="165" value="${this.state.weight}">
              </div>
              
              <div class="form-group col-12">
                <label>Social Health Profile</label>
                <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 6px; font-size: 0.85rem;">
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <strong>Do you drive?</strong>
                    <label><input type="radio" name="ds-drive" value="Yes" ${this.state.drive === 'Yes' ? 'checked' : ''}> Yes</label>
                    <label><input type="radio" name="ds-drive" value="No" ${this.state.drive === 'No' ? 'checked' : ''}> No</label>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <strong>Use tobacco?</strong>
                    <label><input type="radio" name="ds-tobacco" value="Yes" ${this.state.tobacco === 'Yes' ? 'checked' : ''}> Yes</label>
                    <label><input type="radio" name="ds-tobacco" value="No" ${this.state.tobacco === 'No' ? 'checked' : ''}> No</label>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <strong>Drink alcohol?</strong>
                    <label><input type="radio" name="ds-alcohol" value="Yes" ${this.state.alcohol === 'Yes' ? 'checked' : ''}> Yes</label>
                    <label><input type="radio" name="ds-alcohol" value="No" ${this.state.alcohol === 'No' ? 'checked' : ''}> No</label>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <strong>Blood transfusion?</strong>
                    <label><input type="radio" name="ds-transfusion" value="Yes" ${this.state.transfusion === 'Yes' ? 'checked' : ''}> Yes</label>
                    <label><input type="radio" name="ds-transfusion" value="No" ${this.state.transfusion === 'No' ? 'checked' : ''}> No</label>
                  </div>
                </div>
              </div>
              
              <div class="form-group col-12" style="border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 4px;">
                <div style="display: flex; gap: 12px; align-items: center; font-size: 0.85rem;">
                  <strong>Use illegal drugs?</strong>
                  <label><input type="radio" name="ds-drugs" value="Yes" ${this.state.drugs === 'Yes' ? 'checked' : ''}> Yes</label>
                  <label><input type="radio" name="ds-drugs" value="No" ${this.state.drugs === 'No' ? 'checked' : ''}> No</label>
                  <input type="text" class="form-control" id="ds-drugs-list" placeholder="If yes, which ones?" value="${this.state.drugsList}" style="width: 300px; display: inline-block; height: 28px; padding: 4px 8px; font-size: 0.8rem; margin-left: 8px;">
                </div>
              </div>
              
              <!-- Medical conditions checkboxes -->
              <div class="form-group col-12">
                <label>Do you have any of the following medical conditions? (Check all that apply)</label>
                <div class="checkbox-grid">
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="Allergies" ${medCheck('Allergies')}> Allergies / Hay Fever</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="Arthritis" ${medCheck('Arthritis')}> Arthritis, Rheumatoid</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="Asthma" ${medCheck('Asthma')}> Asthma</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="Bronchitis" ${medCheck('Bronchitis')}> Bronchitis</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="Emphysema" ${medCheck('Emphysema')}> Emphysema</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="HeartDisease" ${medCheck('HeartDisease')}> Heart Disease</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="HighBP" ${medCheck('HighBP')}> High Blood Pressure</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="HighChol" ${medCheck('HighChol')}> High Cholesterol</label>
                  <label class="checkbox-label"><input type="checkbox" class="med-cond-cb" value="Thyroid" ${medCheck('Thyroid')}> Thyroid Disease</label>
                </div>
              </div>
              
              <!-- Diabetes Block -->
              <div class="form-group col-12" style="border-top: 1px solid var(--border-color); padding-top: 10px;">
                <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; font-size: 0.85rem;">
                  <strong>Do you have diabetes?</strong>
                  <label><input type="radio" name="ds-diabetes" value="Yes" ${this.state.diabetes === 'Yes' ? 'checked' : ''}> Yes</label>
                  <label><input type="radio" name="ds-diabetes" value="No" ${this.state.diabetes === 'No' ? 'checked' : ''}> No</label>
                  
                  <span style="margin-left: 20px; font-weight: bold;">If yes, type:</span>
                  <label><input type="radio" name="ds-diab-type" value="Type 1" ${this.state.diabetesType === 'Type 1' ? 'checked' : ''}> Type 1</label>
                  <label><input type="radio" name="ds-diab-type" value="Type 2" ${this.state.diabetesType === 'Type 2' ? 'checked' : ''}> Type 2</label>
                  
                  <span style="margin-left: 20px; font-weight: bold;">Last A1C:</span>
                  <input type="text" class="form-control" id="ds-a1c" placeholder="A1C %" value="${this.state.lastA1c}" style="width: 100px; display: inline-block; height: 28px; padding: 4px 8px; font-size: 0.8rem;">
                </div>
              </div>
              
              <!-- Drug Allergies -->
              <div class="form-group col-12" style="border-top: 1px solid var(--border-color); padding-top: 10px;">
                <div style="display: flex; gap: 12px; align-items: center; font-size: 0.85rem;">
                  <strong>Are you allergic to any medications?</strong>
                  <label><input type="radio" name="ds-med-allergy" value="Yes" ${this.state.allergicMeds === 'Yes' ? 'checked' : ''}> Yes</label>
                  <label><input type="radio" name="ds-med-allergy" value="No" ${this.state.allergicMeds === 'No' ? 'checked' : ''}> No</label>
                  <input type="text" class="form-control" id="ds-med-allergy-list" placeholder="If yes, which ones?" value="${this.state.allergicMedsList}" style="width: 320px; display: inline-block; height: 28px; padding: 4px 8px; font-size: 0.8rem; margin-left: 8px;">
                </div>
              </div>
              
              <div class="form-group col-12">
                <label for="ds-meds">Current Medications (including eye drops, vitamins, etc.)</label>
                <textarea class="form-control" id="ds-meds" placeholder="List your current prescription and over-the-counter medications..." style="height: 50px;">${this.state.currentMeds || ''}</textarea>
              </div>
            </div>
          </div>
          
          <!-- Section 3: Pupil Dilation Preference -->
          <div class="form-section" style="background-color: var(--primary-light); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); page-break-inside: avoid;">
            <div style="font-weight: 800; font-size: 0.85rem; color: var(--primary); text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              Dilation Preference Acknowledgement
            </div>
            <p style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
              Dilating the pupils is the medical standard of care. It allows the doctor to fully examine the retina for signs of disease (bleeding, tumors, or damage to blood vessels), which can occur without symptoms and lead to permanent vision loss if untreated.
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <label class="radio-label" style="font-weight: 700;">
                <input type="radio" name="ds-dilation" value="Agree" ${this.state.dilationPref === 'Agree' ? 'checked' : ''}> I AGREE to be Dilated (Recommended)
              </label>
              <div style="padding-left: 24px; font-size: 0.75rem; color: var(--text-light); margin-top: -4px; margin-bottom: 4px;">
                I understand I may be light-sensitive and have blurry near vision for 2-4 hours. I understand that my distance vision and ability to drive will generally not be blurred, though sunglasses are recommended for glare.
              </div>
              <label class="radio-label" style="font-weight: 700;">
                <input type="radio" name="ds-dilation" value="Decline" ${this.state.dilationPref === 'Decline' ? 'checked' : ''}> I PREFER NOT to be Dilated
              </label>
              <div style="padding-left: 24px; font-size: 0.75rem; color: var(--text-light); margin-top: -4px;">
                I understand the risks of undiagnosed retinal conditions and assume responsibility for opting out today.
              </div>
            </div>
          </div>
          
          <!-- Section III: Ocular History -->
          <div class="form-section" style="margin-top: 24px;">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
              III. Ocular (Eye) History
            </div>
            
            <div class="form-group col-12">
              <label>Do you have any of the following ocular conditions? (Check all that apply)</label>
              <div class="checkbox-grid">
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Amblyopia" ${ocCheck('Amblyopia')}> Amblyopia (lazy eye)</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Blindness" ${ocCheck('Blindness')}> Blindness / Loss of Vision</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Blurred" ${ocCheck('Blurred')}> Blurred Vision</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Cataracts" ${ocCheck('Cataracts')}> Cataracts</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Discharge" ${ocCheck('Discharge')}> Discharge (yellow/green)</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Double" ${ocCheck('Double')}> Double Vision</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="DryEye" ${ocCheck('DryEye')}> Dry / Sandy / Gritty Eyes</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Pain" ${ocCheck('Pain')}> Eye Pain / Soreness</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Floaters" ${ocCheck('Floaters')}> Flashes / Floaters</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Glaucoma" ${ocCheck('Glaucoma')}> Glaucoma</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Itchy" ${ocCheck('Itchy')}> Itchy Eyes</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="MacDeg" ${ocCheck('MacDeg')}> Macular Degeneration</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Strabismus" ${ocCheck('Strabismus')}> Strabismus (eye turn)</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Sty" ${ocCheck('Sty')}> Sty / Eyelid Bump</label>
                <label class="checkbox-label"><input type="checkbox" class="oc-cond-cb" value="Watery" ${ocCheck('Watery')}> Watery Eyes</label>
              </div>
            </div>
          </div>
          
          <!-- Section V: Family Medical & Ocular History -->
          <div class="form-section" style="page-break-inside: avoid;">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              V. Family Medical & Ocular History
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 12px;">
              <div style="display: grid; grid-template-columns: 3fr 1fr 8fr; gap: 8px; font-weight: 800; font-size: 0.65rem; text-transform: uppercase; color: var(--text-secondary); border-bottom: 2px solid var(--border-color); padding-bottom: 6px; margin-bottom: 4px;">
                <span>Condition</span>
                <span>Negative</span>
                <span>If Yes, Check Family Members affected</span>
              </div>
              <div style="font-size: 0.55rem; color: var(--text-light); margin-bottom: 6px; line-height: 1.4; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
                <strong>Family Member Key:</strong> MGF = Maternal Grandfather &bull; MGM = Maternal Grandmother &bull; PGF = Paternal Grandfather &bull; PGM = Paternal Grandmother &bull; Bro = Brother &bull; Sis = Sister
              </div>
              ${familyGridHTML}
            </div>
          </div>
          
          <!-- Section VI: Provider Information -->
          <div class="form-section" style="page-break-inside: avoid;">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              VI. Provider Information
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="ds-fam-doc">Name of Family Doctor</label>
                <input type="text" class="form-control" id="ds-fam-doc" placeholder="Dr. John Doe" value="${this.state.familyDoctor}">
              </div>
              <div class="form-group col-6">
                <label for="ds-pharmacy">Pharmacy & Location</label>
                <input type="text" class="form-control" id="ds-pharmacy" placeholder="Walgreens - Lexington" value="${this.state.pharmacyLoc}">
              </div>
            </div>
          </div>
          
          <!-- Section VII: Authorization & Signature -->
          <div class="form-section" style="page-break-inside: avoid;">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              VII. Patient HIPAA Authorization & Sign-Off
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 16px; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 20px;">
              By signing this, I hereby authorize the office of <strong>Dr. Steven Klecker and Dr. Kathryn Robbins (Pal Optical)</strong> to release any protected health information (PHI) necessary to process insurance claims and coordinate my care. This includes, but is not limited to, clinical findings, prescriptions, and billing data shared with my insurance carriers or third-party administrators to determine benefits and secure payment. I understand that this authorization is voluntary, remains in effect until revoked in writing, and that I have the right to receive a copy of this notice upon request.
            </div>
            
            <div class="form-grid">
              <div class="form-group col-8" id="ds-sig-target">
                <!-- Signature pad -->
              </div>
              <div class="form-group col-4">
                <label for="ds-sig-date">Date Signed</label>
                <input type="text" class="form-control" id="ds-sig-date" placeholder="MM/DD/YYYY" value="${this.state.sigDate}" style="margin-top: 30px;">
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#dr-side-patient-form');
    
    // Demographics and text inputs
    form.addEventListener('input', () => this.updateState());
    
    // Checkbox and Radio toggles
    form.addEventListener('change', (e) => {
      // Handle medical conditions checkboxes
      if (e.target.classList.contains('med-cond-cb')) {
        const val = e.target.value;
        if (e.target.checked) {
          if (!this.state.selectedMedicalConditions.includes(val)) {
            this.state.selectedMedicalConditions.push(val);
          }
        } else {
          this.state.selectedMedicalConditions = this.state.selectedMedicalConditions.filter(c => c !== val);
        }
      }
      
      // Handle ocular conditions checkboxes
      if (e.target.classList.contains('oc-cond-cb')) {
        const val = e.target.value;
        if (e.target.checked) {
          if (!this.state.selectedOcularConditions.includes(val)) {
            this.state.selectedOcularConditions.push(val);
          }
        } else {
          this.state.selectedOcularConditions = this.state.selectedOcularConditions.filter(c => c !== val);
        }
      }
      
      // Handle Family history affected members checkboxes
      if (e.target.classList.contains('fam-cb')) {
        const cond = e.target.getAttribute('data-condition');
        const member = e.target.getAttribute('data-member');
        
        if (!this.state.familyHistory[cond]) {
          this.state.familyHistory[cond] = [];
        }
        
        if (e.target.checked) {
          if (!this.state.familyHistory[cond].includes(member)) {
            this.state.familyHistory[cond].push(member);
          }
          // Uncheck the "No" checkbox since there is an affected member
          const noCb = this.container.querySelector(`.fam-no-cb[data-condition="${cond}"]`);
          if (noCb) noCb.checked = false;
        } else {
          this.state.familyHistory[cond] = this.state.familyHistory[cond].filter(m => m !== member);
        }
      }
      
      // Handle Family history "No" (negative) checkboxes
      if (e.target.classList.contains('fam-no-cb')) {
        const cond = e.target.getAttribute('data-condition');
        
        if (e.target.checked) {
          // Clear all checked members
          this.state.familyHistory[cond] = [];
          const cbs = this.container.querySelectorAll(`.fam-cb[data-condition="${cond}"]`);
          cbs.forEach(cb => { cb.checked = false; });
        }
      }
      
      this.updateState();
    });
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#ds-sig-target');
    this.sigPad = new SignaturePad(sigTarget, 'dr-side-patient', 'Patient or Guardian Signature');
    
    if (this.state.signature) {
      this.sigPad.setDataUrl(this.state.signature);
    }
    
    const canvas = sigTarget.querySelector('canvas');
    canvas.addEventListener('mouseup', () => this.saveSignature());
    canvas.addEventListener('touchend', () => this.saveSignature());
    canvas.addEventListener('signature-change', () => this.saveSignature());
  }
  
  saveSignature() {
    this.state.signature = this.sigPad.getDataUrl();
    this.onStateChange(this.state);
  }
  
  updateState() {
    const form = this.container.querySelector('#dr-side-patient-form');
    
    const genderRadio = form.querySelector('input[name="ds-gender"]:checked');
    const maritalRadio = form.querySelector('input[name="ds-marital"]:checked');
    const driveRadio = form.querySelector('input[name="ds-drive"]:checked');
    const tobaccoRadio = form.querySelector('input[name="ds-tobacco"]:checked');
    const alcoholRadio = form.querySelector('input[name="ds-alcohol"]:checked');
    const transfusionRadio = form.querySelector('input[name="ds-transfusion"]:checked');
    const drugsRadio = form.querySelector('input[name="ds-drugs"]:checked');
    const diabetesRadio = form.querySelector('input[name="ds-diabetes"]:checked');
    const diabetesTypeRadio = form.querySelector('input[name="ds-diab-type"]:checked');
    const allergyRadio = form.querySelector('input[name="ds-med-allergy"]:checked');
    const dilationRadio = form.querySelector('input[name="ds-dilation"]:checked');
    
    this.state = {
      ...this.state,
      todayDate: form.querySelector('#ds-date').value,
      lastExamDate: form.querySelector('#ds-last-exam').value,
      
      lastName: form.querySelector('#ds-last-name').value,
      firstName: form.querySelector('#ds-first-name').value,
      mi: form.querySelector('#ds-mi').value,
      address: form.querySelector('#ds-address').value,
      city: form.querySelector('#ds-city').value,
      stateVal: form.querySelector('#ds-state').value,
      zip: form.querySelector('#ds-zip').value,
      phone: form.querySelector('#ds-phone').value,
      email: form.querySelector('#ds-email').value,
      dob: form.querySelector('#ds-dob').value,
      ssn: form.querySelector('#ds-ssn').value,
      
      gender: genderRadio ? genderRadio.value : '',
      maritalStatus: maritalRadio ? maritalRadio.value : '',
      employer: form.querySelector('#ds-employer').value,
      occupation: form.querySelector('#ds-occupation').value,
      
      medInsurance: form.querySelector('#ds-med-ins').value,
      memberId: form.querySelector('#ds-member-id').value,
      groupNum: form.querySelector('#ds-group').value,
      holderName: form.querySelector('#ds-holder').value,
      
      bp: form.querySelector('#ds-bp').value,
      height: form.querySelector('#ds-height').value,
      weight: form.querySelector('#ds-weight').value,
      
      drive: driveRadio ? driveRadio.value : '',
      tobacco: tobaccoRadio ? tobaccoRadio.value : '',
      alcohol: alcoholRadio ? alcoholRadio.value : '',
      transfusion: transfusionRadio ? transfusionRadio.value : '',
      drugs: drugsRadio ? drugsRadio.value : '',
      drugsList: form.querySelector('#ds-drugs-list').value,
      
      diabetes: diabetesRadio ? diabetesRadio.value : '',
      diabetesType: diabetesTypeRadio ? diabetesTypeRadio.value : '',
      lastA1c: form.querySelector('#ds-a1c').value,
      
      allergicMeds: allergyRadio ? allergyRadio.value : '',
      allergicMedsList: form.querySelector('#ds-med-allergy-list').value,
      currentMeds: form.querySelector('#ds-meds').value,
      
      dilationPref: dilationRadio ? dilationRadio.value : '',
      
      familyDoctor: form.querySelector('#ds-fam-doc').value,
      pharmacyLoc: form.querySelector('#ds-pharmacy').value,
      
      sigDate: form.querySelector('#ds-sig-date').value
    };
    
    this.onStateChange(this.state);
  }
  
  reset() {
    this.state = {
      lastName: '', firstName: '', mi: '', address: '', city: '', stateVal: '', zip: '',
      phone: '', email: '', dob: '', ssn: '', gender: '', maritalStatus: '',
      employer: '', occupation: '', medInsurance: '', memberId: '', groupNum: '', holderName: '',
      bp: '', height: '', weight: '',
      drive: '', tobacco: '', alcohol: '', transfusion: '', drugs: '', drugsList: '',
      selectedMedicalConditions: [],
      diabetes: '', diabetesType: '', lastA1c: '',
      allergicMeds: '', allergicMedsList: '',
      currentMeds: '',
      dilationPref: '',
      selectedOcularConditions: [],
      familyHistory: {},
      familyDoctor: '', pharmacyLoc: '',
      sigDate: ''
    };
    this.render();
    this.bindEvents();
    this.initSignature();
    this.onStateChange(this.state);
  }
}
