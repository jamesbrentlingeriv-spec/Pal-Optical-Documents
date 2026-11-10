/* Pal Optical Forms Web App - Patient Information Sheet Form (EN / ES / FR) */
import { SignaturePad } from '../components/SignaturePad.js';
import { render2UpBlankSheet } from './waiverPrintBlankHelper.js';

export const PATIENT_INFO_I18N = {
  en: {
    langName: 'English',
    title: 'Patient Information Sheet',
    subtitle: 'Pal Optical • 1555 E New Circle Rd, Lexington, KY 40509',
    docRecord: 'Office Record',
    cutText: 'CUT HERE TO SEPARATE COPIES • PAL OPTICAL',
    
    // Section 1: Demographics
    sec1Title: '1. Patient Demographics',
    fullName: "Patient's Full Name",
    fullNameShort: 'Patient Full Name:',
    fullNamePlaceholder: 'Last, First Middle',
    dob: 'Date of Birth',
    dobShort: 'DOB:',
    dobPlaceholder: 'MM/DD/YYYY',
    gender: 'Gender',
    genderShort: 'Gender:',
    genderM: 'M',
    genderF: 'F',
    genderOther: 'Other',
    genderPlaceholder: 'Male / Female / Other',
    address: 'Street Address',
    addressShort: 'Street Address:',
    addressPlaceholder: '123 Main St',
    city: 'City',
    cityShort: 'City:',
    cityPlaceholder: 'Lexington',
    state: 'State',
    stateShort: 'State:',
    statePlaceholder: 'KY',
    zip: 'Zip Code',
    zipShort: 'Zip:',
    zipPlaceholder: '40509',
    ssn: 'Social Security Number',
    ssnShort: 'SSN:',
    ssnPlaceholder: 'XXX-XX-XXXX',
    phone: 'Phone Number',
    phoneShort: 'Phone:',
    phonePlaceholder: '(859) 555-0199',
    email: 'Email Address',
    emailShort: 'Email:',
    emailPlaceholder: 'patient@example.com',
    language: 'Preferred Language',
    languageShort: 'Language:',
    languagePlaceholder: 'English',
    race: 'Race',
    raceShort: 'Race:',
    raceOptions: [
      { value: 'White', label: 'White' },
      { value: 'Black', label: 'Black' },
      { value: 'Asian', label: 'Asian' },
      { value: 'Other', label: 'Other' }
    ],
    ethnicity: 'Ethnicity',
    ethnicityShort: 'Ethnicity:',
    ethnicityOptions: [
      { value: 'Hispanic', label: 'Hispanic' },
      { value: 'Pacific Islander', label: 'Pacific Islander' },
      { value: 'American Indian', label: 'American Indian' },
      { value: 'Non-Hispanic', label: 'Non-Hispanic' }
    ],
    ethnicityShortNonHisp: 'Non-Hispanic',
    preferredComm: 'Preferred Method of Communication',
    commShort: 'Preferred Contact:',
    commPhone: 'Phone',
    commEmail: 'Email',
    commMail: 'Mail',
    commTextMail: 'Text / Mail',
    reminderCalls: 'Consent to Receive Reminder Calls for Next Exam?',
    reminderCallsShort: 'Exam Reminder Calls?',
    yes: 'Yes',
    no: 'No',

    // Section 2: Primary Insurance
    sec2Title: '2. Primary Insurance Information',
    insCompany: 'Insurance Company Name',
    insCompanyShort: 'Insurance Co:',
    insCompanyPlaceholder: 'Avesis / Medicaid / EyeMed',
    cardholderName: 'Cardholder Full Name',
    cardholderNameShort: 'Cardholder Full Name:',
    cardholderNamePlaceholder: 'John H. Doe',
    memberId: 'Insurance ID Number',
    memberIdShort: 'Member ID / Policy #:',
    memberIdPlaceholder: 'ID Number',
    cardholderDob: 'Cardholder Date of Birth',
    cardholderDobShort: 'Cardholder DOB:',
    cardholderDobPlaceholder: 'MM/DD/YYYY',
    relation: 'Relationship to Patient',
    relationShort: 'Relation:',
    relationPlaceholder: 'Self / Spouse / Child',
    relationSelf: 'Self',
    relationSpouse: 'Spouse',
    relationChild: 'Child',
    relationOther: 'Other',
    employer: 'Policyholder Employer / Sponsor',
    employerShort: 'Employer / Policy Sponsor:',
    employerPlaceholder: 'Employer Name',

    // Section 3: Cataract Surgery History
    sec3Title: '3. Cataract Surgery History',
    sec3TitleBlank: '3. Cataract Surgery History • Parent/Guardian (If Minor)',
    catSurgeryQuestion: 'Have you had Cataract Surgery?',
    catSurgeryShort: 'Cataract Surgery?',
    dateOd: 'Date of Right Eye (OD)',
    dateOdShort: 'Date OD (Right):',
    dateOs: 'Date of Left Eye (OS)',
    dateOsShort: 'Date OS (Left):',
    datePlaceholder: 'MM/DD/YYYY',
    surgeonName: "Surgeon's Full Name",
    surgeonCityShort: 'Surgeon / City:',
    surgeonPlaceholder: 'Dr. John Smith',
    surgeonCity: "Surgeon's City",
    surgeonCityPlaceholder: 'Lexington',
    surgeonState: "Surgeon's State",
    surgeonStatePlaceholder: 'KY',

    // Section 4 (Interactive) & Parent/Guardian
    sec4Title: '4. Parent / Guardian Information (If patient is under 18)',
    guardianName: 'Guardian Name',
    guardianNameShort: 'Parent/Guardian Name (under 18):',
    guardianNamePlaceholder: 'Full Name',
    guardianAddress: 'Street Address',
    guardianAddressPlaceholder: 'If different from patient',
    guardianPhoneAddressShort: 'Guardian Phone/Address:',
    guardianDobSsnShort: 'Guardian DOB/SSN:',
    guardianCity: 'City',
    guardianCityPlaceholder: 'City',
    guardianState: 'State',
    guardianStatePlaceholder: 'State',
    guardianZip: 'Zip Code',
    guardianZipPlaceholder: 'Zip',
    guardianDob: 'Guardian Date of Birth',
    guardianDobPlaceholder: 'MM/DD/YYYY',
    guardianSsn: 'Guardian Social Security Number',
    guardianSsnPlaceholder: 'XXX-XX-XXXX',

    // Section 5: Authorization
    sec5Title: '5. Authorization & Policy Statement',
    sec4TitleBlank: '4. Authorization & Policy Statement',
    policyEstimateTitle: '1. INSURANCE ESTIMATE POLICY:',
    policyEstimateText: "PLEASE NOTE THE AMOUNT YOUR INSURANCE HAS QUOTED IS AN ESTIMATE. THIS IS NOT A GUARANTEE OF PAYMENT. INSURANCE COMPANIES WILL DETERMINE THE EXACT AMOUNT WHEN THE CLAIM IS PROCESSED. IF IT IS DIFFERENT FROM TODAY'S QUOTE, WE WILL SEND YOU A BILL OR REFUND THE DIFFERENCE.",
    policyEstimateShort: '1. Insurance Estimate Policy: Quoted insurance amounts are estimates, not a guarantee of payment. Final determination is made by your insurer upon claim processing. Any difference is patient responsibility.',
    releaseInfoTitle: '2. RELEASE OF INFORMATION:',
    releaseInfoText: 'I AUTHORIZE THE RELEASE OF ANY AND ALL INFORMATION TO ANY NECESSARY PARTIES FOR INSURANCE CLAIMS OR THE COLLECTION OF ANY FEES.',
    releaseInfoShort: '2. Release of Information: I authorize the release of any medical/vision information to necessary parties for insurance claims processing and fee collection.',
    sigLabel: 'Patient / Authorized Guardian Signature',
    dateSigned: 'Date Signed',
    dateSignedShort: 'Date Signed (MM/DD/YYYY)',
    dateSignedPlaceholder: 'MM/DD/YYYY',
    sigPadPrompt: 'Sign here with finger or mouse'
  },
  es: {
    langName: 'Español',
    title: 'Hoja de Información del Paciente',
    subtitle: 'Pal Optical • 1555 E New Circle Rd, Lexington, KY 40509',
    docRecord: 'Registro de la Oficina • Copia de Archivo',
    cutText: 'CORTE AQUÍ PARA SEPARAR COPIAS • PAL OPTICAL',

    // Section 1: Demographics
    sec1Title: '1. Datos Demográficos del Paciente',
    fullName: 'Nombre Completo del Paciente',
    fullNameShort: 'Nombre del Paciente:',
    fullNamePlaceholder: 'Apellido, Nombre Segundo',
    dob: 'Fecha de Nacimiento',
    dobShort: 'Fecha Nacimiento:',
    dobPlaceholder: 'MM/DD/AAAA',
    gender: 'Sexo / Género',
    genderShort: 'Sexo:',
    genderM: 'M',
    genderF: 'F',
    genderOther: 'Otro',
    genderPlaceholder: 'Masculino / Femenino / Otro',
    address: 'Dirección (Calle y Número)',
    addressShort: 'Dirección:',
    addressPlaceholder: '123 Main St',
    city: 'Ciudad',
    cityShort: 'Ciudad:',
    cityPlaceholder: 'Lexington',
    state: 'Estado',
    stateShort: 'Estado:',
    statePlaceholder: 'KY',
    zip: 'Código Postal',
    zipShort: 'Cód. Postal:',
    zipPlaceholder: '40509',
    ssn: 'Número de Seguro Social (SSN)',
    ssnShort: 'SSN:',
    ssnPlaceholder: 'XXX-XX-XXXX',
    phone: 'Número de Teléfono',
    phoneShort: 'Teléfono:',
    phonePlaceholder: '(859) 555-0199',
    email: 'Correo Electrónico',
    emailShort: 'Correo:',
    emailPlaceholder: 'paciente@ejemplo.com',
    language: 'Idioma Preferido',
    languageShort: 'Idioma:',
    languagePlaceholder: 'Español',
    race: 'Raza',
    raceShort: 'Raza:',
    raceOptions: [
      { value: 'White', label: 'Blanco' },
      { value: 'Black', label: 'Negro' },
      { value: 'Asian', label: 'Asiático' },
      { value: 'Other', label: 'Otro' }
    ],
    ethnicity: 'Etnicidad',
    ethnicityShort: 'Etnicidad:',
    ethnicityOptions: [
      { value: 'Hispanic', label: 'Hispano' },
      { value: 'Pacific Islander', label: 'Islas del Pacífico' },
      { value: 'American Indian', label: 'Indígena Americano' },
      { value: 'Non-Hispanic', label: 'No Hispano' }
    ],
    ethnicityShortNonHisp: 'No Hispano',
    preferredComm: 'Método Preferido de Comunicación',
    commShort: 'Contacto Preferido:',
    commPhone: 'Teléfono',
    commEmail: 'Correo Electrónico',
    commMail: 'Correo Postal',
    commTextMail: 'Texto / Correo',
    reminderCalls: '¿Consiente recibir llamadas de recordatorio para su próximo examen?',
    reminderCallsShort: '¿Llamadas recordatorio?',
    yes: 'Sí',
    no: 'No',

    // Section 2: Primary Insurance
    sec2Title: '2. Información del Seguro Principal',
    insCompany: 'Nombre de la Compañía de Seguros',
    insCompanyShort: 'Compañía de Seguros:',
    insCompanyPlaceholder: 'Avesis / Medicaid / EyeMed',
    cardholderName: 'Nombre Completo del Titular',
    cardholderNameShort: 'Nombre del Titular:',
    cardholderNamePlaceholder: 'Nombre del Titular',
    memberId: 'Número de Identificación de Seguro (ID)',
    memberIdShort: 'N° Miembro / Póliza:',
    memberIdPlaceholder: 'Número de ID / Póliza',
    cardholderDob: 'Fecha de Nacimiento del Titular',
    cardholderDobShort: 'Fecha Nac. Titular:',
    cardholderDobPlaceholder: 'MM/DD/AAAA',
    relation: 'Relación con el Paciente',
    relationShort: 'Relación:',
    relationPlaceholder: 'Titular / Cónyuge / Hijo(a)',
    relationSelf: 'Titular',
    relationSpouse: 'Cónyuge',
    relationChild: 'Hijo/a',
    relationOther: 'Otro',
    employer: 'Empleador / Patrocinador del Seguro',
    employerShort: 'Empleador / Patrocinador:',
    employerPlaceholder: 'Nombre de la Empresa / Empleador',

    // Section 3: Cataract Surgery History
    sec3Title: '3. Historial de Cirugía de Cataratas',
    sec3TitleBlank: '3. Historial de Cataratas • Padre/Tutor (Si es Menor)',
    catSurgeryQuestion: '¿Ha tenido Cirugía de Cataratas?',
    catSurgeryShort: '¿Cirugía Cataratas?',
    dateOd: 'Fecha Ojo Derecho (OD)',
    dateOdShort: 'Fecha OD (Der.):',
    dateOs: 'Fecha Ojo Izquierdo (OS)',
    dateOsShort: 'Fecha OS (Izq.):',
    datePlaceholder: 'MM/DD/AAAA',
    surgeonName: 'Nombre Completo del Cirujano',
    surgeonCityShort: 'Cirujano / Ciudad:',
    surgeonPlaceholder: 'Dr. John Smith',
    surgeonCity: 'Ciudad del Cirujano',
    surgeonCityPlaceholder: 'Lexington',
    surgeonState: 'Estado del Cirujano',
    surgeonStatePlaceholder: 'KY',

    // Section 4 (Interactive) & Parent/Guardian
    sec4Title: '4. Información del Padre / Tutor Legal (Si es menor de 18 años)',
    guardianName: 'Nombre del Tutor',
    guardianNameShort: 'Padre / Tutor (menor 18):',
    guardianNamePlaceholder: 'Nombre Completo',
    guardianAddress: 'Dirección del Tutor',
    guardianAddressPlaceholder: 'Si es diferente a la del paciente',
    guardianPhoneAddressShort: 'Teléfono / Dirección del Tutor:',
    guardianDobSsnShort: 'Fecha Nac. / SSN del Tutor:',
    guardianCity: 'Ciudad',
    guardianCityPlaceholder: 'Ciudad',
    guardianState: 'Estado',
    guardianStatePlaceholder: 'Estado',
    guardianZip: 'Código Postal',
    guardianZipPlaceholder: 'Cód. Postal',
    guardianDob: 'Fecha de Nacimiento del Tutor',
    guardianDobPlaceholder: 'MM/DD/AAAA',
    guardianSsn: 'Número de Seguro Social del Tutor',
    guardianSsnPlaceholder: 'XXX-XX-XXXX',

    // Section 5: Authorization
    sec5Title: '5. Declaración de Autorización y Políticas',
    sec4TitleBlank: '4. Declaración de Autorización y Políticas',
    policyEstimateTitle: '1. PÓLIZA DE ESTIMACIÓN DE SEGURO:',
    policyEstimateText: 'TENGA EN CUENTA QUE EL MONTO COTIZADO POR SU SEGURO ES SOLO UN ESTIMADO. ESTO NO ES UNA GARANTÍA DE PAGO. LAS COMPAÑÍAS DE SEGURO DETERMINARÁN EL MONTO EXACTO AL PROCESAR EL RECLAMO. SI ES DIFERENTE DE LA COTIZACIÓN DE HOY, LE ENVIAREMOS UNA FACTURA O LE REEMBOLSAREMOS LA DIFERENCIA.',
    policyEstimateShort: '1. Póliza de Estimación de Seguro: El monto cotizado de su seguro es un estimado, no una garantía de pago. La determinación final la hace su aseguradora al procesar el reclamo. Cualquier diferencia es responsabilidad del paciente.',
    releaseInfoTitle: '2. AUTORIZACIÓN DE DIVULGACIÓN DE INFORMACIÓN:',
    releaseInfoText: 'AUTORIZO LA DIVULGACIÓN DE CUALQUIER INFORMACIÓN MÉDICA O DE LA VISTA A LAS PARTES NECESARIAS PARA PROCESAR RECLAMOS DE SEGUROS O EL COBRO DE CUALQUIER HONORARIO.',
    releaseInfoShort: '2. Divulgación de Información: Autorizo la divulgación de cualquier información médica / visual a las partes necesarias para procesar reclamos y cobro de honorarios.',
    sigLabel: 'Firma del Paciente o Tutor Autorizado',
    dateSigned: 'Fecha de Firma',
    dateSignedShort: 'Fecha Firma (MM/DD/AAAA)',
    dateSignedPlaceholder: 'MM/DD/AAAA',
    sigPadPrompt: 'Firme aquí con el dedo o ratón'
  },
  fr: {
    langName: 'Français',
    title: 'Fiche de Renseignements du Patient',
    subtitle: 'Pal Optical • 1555 E New Circle Rd, Lexington, KY 40509',
    docRecord: 'Dossier du Cabinet • Copie d\'Archive',
    cutText: 'COUPER ICI POUR SÉPARER LES COPIES • PAL OPTICAL',

    // Section 1: Demographics
    sec1Title: '1. Renseignements Démographiques du Patient',
    fullName: 'Nom Complet du Patient',
    fullNameShort: 'Nom du Patient :',
    fullNamePlaceholder: 'Nom, Prénom Deuxième prénom',
    dob: 'Date de Naissance',
    dobShort: 'Date Naissance :',
    dobPlaceholder: 'MM/JJ/AAAA',
    gender: 'Sexe / Genre',
    genderShort: 'Sexe :',
    genderM: 'M',
    genderF: 'F',
    genderOther: 'Autre',
    genderPlaceholder: 'Masculin / Féminin / Autre',
    address: 'Adresse (Rue et Numéro)',
    addressShort: 'Adresse :',
    addressPlaceholder: '123 Main St',
    city: 'Ville',
    cityShort: 'Ville :',
    cityPlaceholder: 'Lexington',
    state: 'État / Prov.',
    stateShort: 'État :',
    statePlaceholder: 'KY',
    zip: 'Code Postal',
    zipShort: 'Code Postal :',
    zipPlaceholder: '40509',
    ssn: 'Numéro de Sécurité Sociale (SSN)',
    ssnShort: 'SSN :',
    ssnPlaceholder: 'XXX-XX-XXXX',
    phone: 'Numéro de Téléphone',
    phoneShort: 'Téléphone :',
    phonePlaceholder: '(859) 555-0199',
    email: 'Adresse Courriel',
    emailShort: 'Courriel :',
    emailPlaceholder: 'patient@exemple.com',
    language: 'Langue Préférée',
    languageShort: 'Langue :',
    languagePlaceholder: 'Français',
    race: 'Race',
    raceShort: 'Race :',
    raceOptions: [
      { value: 'White', label: 'Blanc' },
      { value: 'Black', label: 'Noir' },
      { value: 'Asian', label: 'Asiatique' },
      { value: 'Other', label: 'Autre' }
    ],
    ethnicity: 'Ethnicité',
    ethnicityShort: 'Ethnicité :',
    ethnicityOptions: [
      { value: 'Hispanic', label: 'Hispanique' },
      { value: 'Pacific Islander', label: 'Insulaire du Pacifique' },
      { value: 'American Indian', label: 'Autochtone d\'Amérique' },
      { value: 'Non-Hispanic', label: 'Non-Hispanique' }
    ],
    ethnicityShortNonHisp: 'Non-Hispanique',
    preferredComm: 'Mode de Communication Préféré',
    commShort: 'Contact Préféré :',
    commPhone: 'Téléphone',
    commEmail: 'Courriel',
    commMail: 'Courrier',
    commTextMail: 'Texto / Courrier',
    reminderCalls: 'Acceptez-vous de recevoir des rappels téléphoniques pour votre prochain examen ?',
    reminderCallsShort: 'Rappels téléphone ?',
    yes: 'Oui',
    no: 'Non',

    // Section 2: Primary Insurance
    sec2Title: '2. Renseignements sur l\'Assurance Principale',
    insCompany: 'Nom de la Compagnie d\'Assurance',
    insCompanyShort: 'Compagnie Assurance :',
    insCompanyPlaceholder: 'Avesis / Medicaid / EyeMed',
    cardholderName: 'Nom Complet du Titulaire de la Carte',
    cardholderNameShort: 'Nom du Titulaire :',
    cardholderNamePlaceholder: 'Nom du Titulaire',
    memberId: 'Numéro d\'Adhérent / Police',
    memberIdShort: 'N° Adhérent / Police :',
    memberIdPlaceholder: 'Numéro de Police / ID',
    cardholderDob: 'Date de Naissance du Titulaire',
    cardholderDobShort: 'Date Naiss. Adhérent :',
    cardholderDobPlaceholder: 'MM/JJ/AAAA',
    relation: 'Lien de Parenté avec le Patient',
    relationShort: 'Lien :',
    relationPlaceholder: 'Adhérent / Conjoint / Enfant',
    relationSelf: 'Adhérent',
    relationSpouse: 'Conjoint',
    relationChild: 'Enfant',
    relationOther: 'Autre',
    employer: 'Employeur / Souscripteur de la Police',
    employerShort: 'Employeur / Souscripteur :',
    employerPlaceholder: 'Nom de l\'Employeur',

    // Section 3: Cataract Surgery History
    sec3Title: '3. Antécédents de Chirurgie de la Cataracte',
    sec3TitleBlank: '3. Antécédents de Cataracte • Parent/Tuteur (Si Mineur)',
    catSurgeryQuestion: 'Avez-vous déjà eu une Chirurgie de la Cataracte ?',
    catSurgeryShort: 'Chirurgie Cataracte ?',
    dateOd: 'Date Œil Droit (OD)',
    dateOdShort: 'Date OD (Droit) :',
    dateOs: 'Date Œil Gauche (OS)',
    dateOsShort: 'Date OS (Gauche) :',
    datePlaceholder: 'MM/JJ/AAAA',
    surgeonName: 'Nom Complet du Chirurgien',
    surgeonCityShort: 'Chirurgien / Ville :',
    surgeonPlaceholder: 'Dr. John Smith',
    surgeonCity: 'Ville du Chirurgien',
    surgeonCityPlaceholder: 'Lexington',
    surgeonState: 'État du Chirurgien',
    surgeonStatePlaceholder: 'KY',

    // Section 4 (Interactive) & Parent/Guardian
    sec4Title: '4. Renseignements sur le Parent / Tuteur (Si moins de 18 ans)',
    guardianName: 'Nom du Tuteur',
    guardianNameShort: 'Parent / Tuteur (moins 18) :',
    guardianNamePlaceholder: 'Nom Complet',
    guardianAddress: 'Adresse du Tuteur',
    guardianAddressPlaceholder: 'Si différente de celle du patient',
    guardianPhoneAddressShort: 'Tél. / Adresse du Tuteur :',
    guardianDobSsnShort: 'Date Naiss. / SSN Tuteur :',
    guardianCity: 'Ville',
    guardianCityPlaceholder: 'Ville',
    guardianState: 'État / Prov.',
    guardianStatePlaceholder: 'État',
    guardianZip: 'Code Postal',
    guardianZipPlaceholder: 'Code Postal',
    guardianDob: 'Date de Naissance du Tuteur',
    guardianDobPlaceholder: 'MM/JJ/AAAA',
    guardianSsn: 'Numéro de Sécurité Sociale du Tuteur',
    guardianSsnPlaceholder: 'XXX-XX-XXXX',

    // Section 5: Authorization
    sec5Title: '5. Autorisation et Déclaration de Conditions',
    sec4TitleBlank: '4. Autorisation et Déclaration de Conditions',
    policyEstimateTitle: '1. POLITIQUE D\'ESTIMATION D\'ASSURANCE :',
    policyEstimateText: 'VEUILLEZ NOTER QUE LE MONTANT INDIQUÉ PAR VOTRE ASSURANCE N\'EST QU\'UNE ESTIMATION. CECI NE CONSTITUE PAS UNE GARANTIE DE PAIEMENT. LES COMPAGNIES D\'ASSURANCE DÉTERMINERONT LE MONTANT EXACT LORS DU TRAITEMENT DE LA DEMANDE. S\'IL DIFFÈRE DU DEVIS D\'AUJOURD\'HUI, NOUS VOUS ENVERRONS UNE FACTURE OU VOUS REMBOURSERONS LA DIFFÉRENCE.',
    policyEstimateShort: '1. Politique d\'Estimation d\'Assurance : Les montants indiqués sont des estimations et non une garantie de paiement. La décision finale est prise par votre assureur lors du traitement. Tout solde restant incombe au patient.',
    releaseInfoTitle: '2. DIVULGATION DE RENSEIGNEMENTS :',
    releaseInfoText: 'J\'AUTORISE LA TRANSMISSION DE TOUS RENSEIGNEMENTS MÉDICAUX OU VISUELS AUX PARTIES NÉCESSAIRES POUR LE TRAITEMENT DES RÉCLAMATIONS D\'ASSURANCE OU LE RECOUVREMENT DES FRAIS.',
    releaseInfoShort: '2. Divulgation de Renseignements : J\'autorise la communication de mes renseignements médicaux/visuels aux parties requises pour le traitement des réclamations et le recouvrement des frais.',
    sigLabel: 'Signature du Patient ou Tuteur Autorisé',
    dateSigned: 'Date de Signature',
    dateSignedShort: 'Date Signature (MM/JJ/AAAA)',
    dateSignedPlaceholder: 'MM/JJ/AAAA',
    sigPadPrompt: 'Signez ici avec le doigt ou la souris'
  }
};

export class PatientInfoForm {
  constructor(container, state = {}, onStateChange, language = 'en', onLanguageChange = null) {
    this.container = container;
    this.state = state;
    this.onStateChange = onStateChange;
    this.language = ['en', 'es', 'fr'].includes(language) ? language : 'en';
    this.onLanguageChange = onLanguageChange;
    this.sigPad = null;
    
    this.render();
    this.bindEvents();
    this.initSignature();
  }

  getPatientName() {
    return this.state.name || '';
  }

  setLanguage(newLang) {
    if (!['en', 'es', 'fr'].includes(newLang)) return;
    if (this.language === newLang) return;
    
    // Preserve current input values into state before switching language
    this.updateState();
    if (this.sigPad) {
      this.state.signature = this.sigPad.getDataUrl();
    }
    
    this.language = newLang;
    
    // Notify parent controller if handler provided
    if (typeof this.onLanguageChange === 'function') {
      this.onLanguageChange(newLang);
    }
    
    this.render();
    this.bindEvents();
    this.initSignature();
  }

  renderBlankHalfSheet() {
    const t = PATIENT_INFO_I18N[this.language] || PATIENT_INFO_I18N.en;

    return `
      <div class="wb-header" style="margin-bottom: 4px; padding-bottom: 2px;">
        <div class="wb-brand-block">
          <div class="wb-brand-title" style="font-size: 11.5pt;">PAL OPTICAL</div>
          <div class="wb-brand-sub" style="font-size: 6.2pt;">1555 E. New Circle Rd, Lexington, KY 40505 &bull; (859) 253-3031</div>
        </div>
        <div class="wb-doc-title-block">
          <div class="wb-doc-title" style="font-size: 9.3pt; text-transform: uppercase;">${t.title}</div>
          <div class="wb-doc-subtitle" style="font-size: 6.5pt;">${t.docRecord}</div>
        </div>
      </div>
      
      <!-- 1. Patient Demographics -->
      <div class="wb-demographics-block" style="margin-bottom: 3px;">
        <div style="font-size: 6.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 1px solid #000; padding-bottom: 1px; margin-bottom: 3px; color: #000;">
          ${t.sec1Title}
        </div>
        <div class="wb-demographics-row" style="margin-bottom: 3px;">
          <div class="wb-field" style="flex: 6;">
            <span class="wb-field-label">${t.fullNameShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 2.2;">
            <span class="wb-field-label">${t.dobShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 2.5; align-items: center; gap: 4px;">
            <span class="wb-field-label">${t.genderShort}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.genderM}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.genderF}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.genderOther}</span>
          </div>
        </div>
        
        <div class="wb-demographics-row" style="margin-bottom: 3px;">
          <div class="wb-field" style="flex: 5.5;">
            <span class="wb-field-label">${t.addressShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 3;">
            <span class="wb-field-label">${t.cityShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 1.2;">
            <span class="wb-field-label">${t.stateShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 1.5;">
            <span class="wb-field-label">${t.zipShort}</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
        
        <div class="wb-demographics-row" style="margin-bottom: 3px;">
          <div class="wb-field" style="flex: 3.5;">
            <span class="wb-field-label">${t.phoneShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 4.5;">
            <span class="wb-field-label">${t.emailShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 3;">
            <span class="wb-field-label">${t.ssnShort}</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
        
        <div class="wb-demographics-row" style="margin-bottom: 3px; align-items: center;">
          <div class="wb-field" style="flex: 2.2;">
            <span class="wb-field-label">${t.languageShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 4.8; align-items: center; gap: 3px;">
            <span class="wb-field-label">${t.raceShort}</span>
            ${t.raceOptions.map(r => `<span class="wb-box-square"></span><span style="font-size: 6.5pt;">${r.label}</span>`).join('\n            ')}
          </div>
          <div class="wb-field" style="flex: 4; align-items: center; gap: 3px;">
            <span class="wb-field-label">${t.ethnicityShort}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.ethnicityOptions[0].label}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.ethnicityShortNonHisp}</span>
          </div>
        </div>
        
        <div class="wb-demographics-row" style="margin-bottom: 2px; align-items: center;">
          <div class="wb-field" style="flex: 5.5; align-items: center; gap: 3px;">
            <span class="wb-field-label">${t.commShort}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.commPhone}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.commEmail}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.commTextMail}</span>
          </div>
          <div class="wb-field" style="flex: 5.5; align-items: center; gap: 3px;">
            <span class="wb-field-label">${t.reminderCallsShort}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.yes}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.no}</span>
          </div>
        </div>
      </div>
      
      <!-- 2. Primary Insurance -->
      <div class="wb-demographics-block" style="margin-bottom: 3px;">
        <div style="font-size: 6.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 1px solid #000; padding-bottom: 1px; margin-bottom: 3px; color: #000;">
          ${t.sec2Title}
        </div>
        <div class="wb-demographics-row" style="margin-bottom: 3px;">
          <div class="wb-field" style="flex: 5.5;">
            <span class="wb-field-label">${t.insCompanyShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 5.5;">
            <span class="wb-field-label">${t.cardholderNameShort}</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
        <div class="wb-demographics-row" style="margin-bottom: 3px;">
          <div class="wb-field" style="flex: 4;">
            <span class="wb-field-label">${t.memberIdShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 2.5;">
            <span class="wb-field-label">${t.cardholderDobShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 4.5; align-items: center; gap: 3px;">
            <span class="wb-field-label">${t.relationShort}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.relationSelf}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.relationSpouse}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.relationChild}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.relationOther}</span>
          </div>
        </div>
        <div class="wb-demographics-row" style="margin-bottom: 2px;">
          <div class="wb-field" style="flex: 1;">
            <span class="wb-field-label">${t.employerShort}</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
      </div>
      
      <!-- 3. Medical History & Guardian -->
      <div class="wb-demographics-block" style="margin-bottom: 3px;">
        <div style="font-size: 6.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 1px solid #000; padding-bottom: 1px; margin-bottom: 3px; color: #000;">
          ${t.sec3TitleBlank}
        </div>
        <div class="wb-demographics-row" style="margin-bottom: 3px; align-items: center;">
          <div class="wb-field" style="flex: 3.5; align-items: center; gap: 3px;">
            <span class="wb-field-label">${t.catSurgeryShort}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.yes}</span>
            <span class="wb-box-square"></span><span style="font-size: 6.5pt;">${t.no}</span>
          </div>
          <div class="wb-field" style="flex: 2;">
            <span class="wb-field-label">${t.dateOdShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 2;">
            <span class="wb-field-label">${t.dateOsShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 3.5;">
            <span class="wb-field-label">${t.surgeonCityShort}</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
        <div class="wb-demographics-row" style="margin-bottom: 2px;">
          <div class="wb-field" style="flex: 5;">
            <span class="wb-field-label">${t.guardianNameShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 3.5;">
            <span class="wb-field-label">${t.guardianPhoneAddressShort}</span>
            <span class="wb-field-line"></span>
          </div>
          <div class="wb-field" style="flex: 2.5;">
            <span class="wb-field-label">${t.guardianDobSsnShort}</span>
            <span class="wb-field-line"></span>
          </div>
        </div>
      </div>
      
      <!-- 4. Authorization & Policy Statement -->
      <div class="wb-disclosure-box" style="margin-bottom: 3px; padding: 3px 6px; font-size: 5.7pt; line-height: 1.2;">
        <div><strong>${t.policyEstimateShort.split(':')[0]}:</strong> ${t.policyEstimateShort.split(':').slice(1).join(':')}</div>
        <div style="margin-top: 2px;"><strong>${t.releaseInfoShort.split(':')[0]}:</strong> ${t.releaseInfoShort.split(':').slice(1).join(':')}</div>
      </div>
      
      <!-- 5. Signatures -->
      <div class="wb-signatures-row" style="margin-top: 1px;">
        <div class="wb-sig-block" style="flex: 7;">
          <div class="wb-sig-line" style="height: 16px;"></div>
          <div class="wb-sig-label">${t.sigLabel}</div>
        </div>
        <div class="wb-sig-block" style="flex: 3;">
          <div class="wb-sig-line" style="height: 16px;"></div>
          <div class="wb-sig-label">${t.dateSignedShort}</div>
        </div>
      </div>
    `;
  }
  
  render() {
    const t = PATIENT_INFO_I18N[this.language] || PATIENT_INFO_I18N.en;

    this.container.innerHTML = `
      <div class="waiver-interactive-view">
        <div class="form-card" id="patient-info-form-card">
        <!-- Form Header -->
        <div class="form-header-block" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2>${t.title}</h2>
            <p>${t.subtitle}</p>
          </div>
          <div class="patient-lang-selector no-print" style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Language:</span>
            <div class="toggle-group" style="padding: 2px;">
              <button type="button" class="toggle-option lang-btn ${this.language === 'en' ? 'active' : ''}" data-lang="en" style="border: none; cursor: pointer; font-size: 0.75rem; padding: 4px 10px;">🇺🇸 English</button>
              <button type="button" class="toggle-option lang-btn ${this.language === 'es' ? 'active' : ''}" data-lang="es" style="border: none; cursor: pointer; font-size: 0.75rem; padding: 4px 10px;">🇪🇸 Español</button>
              <button type="button" class="toggle-option lang-btn ${this.language === 'fr' ? 'active' : ''}" data-lang="fr" style="border: none; cursor: pointer; font-size: 0.75rem; padding: 4px 10px;">🇫🇷 Français</button>
            </div>
          </div>
        </div>
        
        <form id="patient-info-form">
          <!-- Section 1: Demographics -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${t.sec1Title}
            </div>
            
            <div class="form-grid">
              <div class="form-group col-12">
                <label for="p-name">${t.fullName}</label>
                <input type="text" class="form-control" id="p-name" placeholder="${t.fullNamePlaceholder}" value="${this.state.name || ''}">
              </div>
              
              <div class="form-group col-6">
                <label for="p-address">${t.address}</label>
                <input type="text" class="form-control" id="p-address" placeholder="${t.addressPlaceholder}" value="${this.state.address || ''}">
              </div>
              <div class="form-group col-3">
                <label for="p-city">${t.city}</label>
                <input type="text" class="form-control" id="p-city" placeholder="${t.cityPlaceholder}" value="${this.state.city || ''}">
              </div>
              <div class="form-group col-1.5">
                <label for="p-state">${t.state}</label>
                <input type="text" class="form-control" id="p-state" placeholder="${t.statePlaceholder}" value="${this.state.state || ''}">
              </div>
              <div class="form-group col-1.5">
                <label for="p-zip">${t.zip}</label>
                <input type="text" class="form-control" id="p-zip" placeholder="${t.zipPlaceholder}" value="${this.state.zip || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="p-ssn">${t.ssn}</label>
                <input type="text" class="form-control" id="p-ssn" placeholder="${t.ssnPlaceholder}" value="${this.state.ssn || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-dob">${t.dob}</label>
                <input type="text" class="form-control" id="p-dob" placeholder="${t.dobPlaceholder}" value="${this.state.dob || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-gender">${t.gender}</label>
                <input type="text" class="form-control" id="p-gender" placeholder="${t.genderPlaceholder}" value="${this.state.gender || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="p-phone">${t.phone}</label>
                <input type="tel" class="form-control" id="p-phone" placeholder="${t.phonePlaceholder}" value="${this.state.phone || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-email">${t.email}</label>
                <input type="email" class="form-control" id="p-email" placeholder="${t.emailPlaceholder}" value="${this.state.email || ''}">
              </div>
              <div class="form-group col-4">
                <label for="p-language">${t.language}</label>
                <input type="text" class="form-control" id="p-language" placeholder="${t.languagePlaceholder}" value="${this.state.language || ''}">
              </div>
              
              <div class="form-group col-6">
                <label>${t.race}</label>
                <div class="checkbox-grid">
                  ${t.raceOptions.map(r => `
                    <label class="radio-label">
                      <input type="radio" name="p-race" value="${r.value}" ${this.state.race === r.value ? 'checked' : ''}> ${r.label}
                    </label>
                  `).join('')}
                </div>
              </div>
              
              <div class="form-group col-6">
                <label>${t.ethnicity}</label>
                <div class="checkbox-grid">
                  ${t.ethnicityOptions.map(e => `
                    <label class="radio-label">
                      <input type="radio" name="p-ethnicity" value="${e.value}" ${this.state.ethnicity === e.value ? 'checked' : ''}> ${e.label}
                    </label>
                  `).join('')}
                </div>
              </div>
              
              <div class="form-group col-6">
                <label>${t.preferredComm}</label>
                <div class="checkbox-grid">
                  <label class="radio-label">
                    <input type="radio" name="p-comm" value="Phone" ${this.state.comm === 'Phone' ? 'checked' : ''}> ${t.commPhone}
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-comm" value="Email" ${this.state.comm === 'Email' ? 'checked' : ''}> ${t.commEmail}
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-comm" value="Mail" ${this.state.comm === 'Mail' ? 'checked' : ''}> ${t.commMail}
                  </label>
                </div>
              </div>
              
              <div class="form-group col-6">
                <label>${t.reminderCalls}</label>
                <div class="checkbox-grid" style="margin-top: 10px;">
                  <label class="radio-label">
                    <input type="radio" name="p-reminder" value="Yes" ${this.state.reminder === 'Yes' ? 'checked' : ''}> ${t.yes}
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="p-reminder" value="No" ${this.state.reminder === 'No' ? 'checked' : ''}> ${t.no}
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section 2: Primary Insurance -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              ${t.sec2Title}
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="ins-name">${t.insCompany}</label>
                <input type="text" class="form-control" id="ins-name" placeholder="${t.insCompanyPlaceholder}" value="${this.state.insName || ''}">
              </div>
              <div class="form-group col-6">
                <label for="ins-cardholder">${t.cardholderName}</label>
                <input type="text" class="form-control" id="ins-cardholder" placeholder="${t.cardholderNamePlaceholder}" value="${this.state.insCardholder || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="ins-id">${t.memberId}</label>
                <input type="text" class="form-control" id="ins-id" placeholder="${t.memberIdPlaceholder}" value="${this.state.insId || ''}">
              </div>
              <div class="form-group col-4">
                <label for="ins-dob">${t.cardholderDob}</label>
                <input type="text" class="form-control" id="ins-dob" placeholder="${t.cardholderDobPlaceholder}" value="${this.state.insDob || ''}">
              </div>
              <div class="form-group col-4">
                <label for="ins-relation">${t.relation}</label>
                <input type="text" class="form-control" id="ins-relation" placeholder="${t.relationPlaceholder}" value="${this.state.insRelation || ''}">
              </div>
              
              <div class="form-group col-12">
                <label for="ins-employer">${t.employer}</label>
                <input type="text" class="form-control" id="ins-employer" placeholder="${t.employerPlaceholder}" value="${this.state.insEmployer || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 3: Cataract Surgery History -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              ${t.sec3Title}
            </div>
            
            <div class="form-grid">
              <div class="form-group col-4">
                <label>${t.catSurgeryQuestion}</label>
                <div class="checkbox-grid" style="margin-top: 10px;">
                  <label class="radio-label">
                    <input type="radio" name="cat-surgery" value="Yes" ${this.state.catSurgery === 'Yes' ? 'checked' : ''}> ${t.yes}
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="cat-surgery" value="No" ${this.state.catSurgery === 'No' ? 'checked' : ''}> ${t.no}
                  </label>
                </div>
              </div>
              
              <div class="form-group col-4">
                <label for="cat-date-od">${t.dateOd}</label>
                <input type="text" class="form-control" id="cat-date-od" placeholder="${t.datePlaceholder}" value="${this.state.catDateOd || ''}">
              </div>
              <div class="form-group col-4">
                <label for="cat-date-os">${t.dateOs}</label>
                <input type="text" class="form-control" id="cat-date-os" placeholder="${t.datePlaceholder}" value="${this.state.catDateOs || ''}">
              </div>
              
              <div class="form-group col-4">
                <label for="cat-surgeon">${t.surgeonName}</label>
                <input type="text" class="form-control" id="cat-surgeon" placeholder="${t.surgeonPlaceholder}" value="${this.state.catSurgeon || ''}">
              </div>
              <div class="form-group col-4">
                <label for="cat-city">${t.surgeonCity}</label>
                <input type="text" class="form-control" id="cat-city" placeholder="${t.surgeonCityPlaceholder}" value="${this.state.catCity || ''}">
              </div>
              <div class="form-group col-4">
                <label for="cat-state">${t.surgeonState}</label>
                <input type="text" class="form-control" id="cat-state" placeholder="${t.surgeonStatePlaceholder}" value="${this.state.catState || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 4: Parent / Guardian Info (Under 18) -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              ${t.sec4Title}
            </div>
            
            <div class="form-grid">
              <div class="form-group col-6">
                <label for="g-name">${t.guardianName}</label>
                <input type="text" class="form-control" id="g-name" placeholder="${t.guardianNamePlaceholder}" value="${this.state.gName || ''}">
              </div>
              <div class="form-group col-6">
                <label for="g-address">${t.guardianAddress}</label>
                <input type="text" class="form-control" id="g-address" placeholder="${t.guardianAddressPlaceholder}" value="${this.state.gAddress || ''}">
              </div>
              
              <div class="form-group col-3">
                <label for="g-city">${t.guardianCity}</label>
                <input type="text" class="form-control" id="g-city" placeholder="${t.guardianCityPlaceholder}" value="${this.state.gCity || ''}">
              </div>
              <div class="form-group col-3">
                <label for="g-state">${t.guardianState}</label>
                <input type="text" class="form-control" id="g-state" placeholder="${t.guardianStatePlaceholder}" value="${this.state.gState || ''}">
              </div>
              <div class="form-group col-3">
                <label for="g-zip">${t.guardianZip}</label>
                <input type="text" class="form-control" id="g-zip" placeholder="${t.guardianZipPlaceholder}" value="${this.state.gZip || ''}">
              </div>
              <div class="form-group col-3">
                <label for="g-dob">${t.guardianDob}</label>
                <input type="text" class="form-control" id="g-dob" placeholder="${t.guardianDobPlaceholder}" value="${this.state.gDob || ''}">
              </div>
              
              <div class="form-group col-6">
                <label for="g-ssn">${t.guardianSsn}</label>
                <input type="text" class="form-control" id="g-ssn" placeholder="${t.guardianSsnPlaceholder}" value="${this.state.gSsn || ''}">
              </div>
            </div>
          </div>
          
          <!-- Section 5: Authorization & Signatures -->
          <div class="form-section">
            <div class="form-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              ${t.sec5Title}
            </div>
            
            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 16px; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 20px;">
              <p style="margin-bottom: 8px;"><strong>${t.policyEstimateTitle}</strong> ${t.policyEstimateText}</p>
              <p><strong>${t.releaseInfoTitle}</strong> ${t.releaseInfoText}</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group col-8" id="sig-pad-target">
                <!-- SignaturePad will render here -->
              </div>
              <div class="form-group col-4">
                <label for="p-sig-date">${t.dateSigned}</label>
                <input type="text" class="form-control" id="p-sig-date" placeholder="${t.dateSignedPlaceholder}" value="${this.state.sigDate || ''}" style="margin-top: 30px;">
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    ${render2UpBlankSheet(
      () => this.renderBlankHalfSheet(),
      t.cutText
    )}
    `;
  }
  
  bindEvents() {
    const form = this.container.querySelector('#patient-info-form');
    if (form) {
      // Listen to changes and update state
      form.addEventListener('input', () => {
        this.updateState();
      });
      
      form.addEventListener('change', () => {
        this.updateState();
      });
    }

    // Language switcher buttons
    const langBtns = this.container.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = btn.getAttribute('data-lang');
        if (selectedLang && selectedLang !== this.language) {
          this.setLanguage(selectedLang);
        }
      });
    });
  }
  
  initSignature() {
    const sigTarget = this.container.querySelector('#sig-pad-target');
    if (!sigTarget) return;
    const t = PATIENT_INFO_I18N[this.language] || PATIENT_INFO_I18N.en;
    this.sigPad = new SignaturePad(sigTarget, 'patient-info', t.sigPadPrompt);
    
    // Load signature if exists in state
    if (this.state.signature) {
      this.sigPad.setDataUrl(this.state.signature);
    }
    
    // Bind signature change listener
    const canvas = sigTarget.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mouseup', () => this.saveSignature());
      canvas.addEventListener('touchend', () => this.saveSignature());
      canvas.addEventListener('signature-change', () => this.saveSignature());
    }
  }
  
  saveSignature() {
    if (!this.sigPad) return;
    const dataUrl = this.sigPad.getDataUrl();
    this.state.signature = dataUrl;
    this.onStateChange(this.state);
  }
  
  updateState() {
    const form = this.container.querySelector('#patient-info-form');
    if (!form) return;
    
    const raceRadio = form.querySelector('input[name="p-race"]:checked');
    const ethnicityRadio = form.querySelector('input[name="p-ethnicity"]:checked');
    const commRadio = form.querySelector('input[name="p-comm"]:checked');
    const reminderRadio = form.querySelector('input[name="p-reminder"]:checked');
    const catSurgeryRadio = form.querySelector('input[name="cat-surgery"]:checked');
    
    this.state = {
      ...this.state,
      name: form.querySelector('#p-name')?.value || '',
      address: form.querySelector('#p-address')?.value || '',
      city: form.querySelector('#p-city')?.value || '',
      state: form.querySelector('#p-state')?.value || '',
      zip: form.querySelector('#p-zip')?.value || '',
      ssn: form.querySelector('#p-ssn')?.value || '',
      dob: form.querySelector('#p-dob')?.value || '',
      gender: form.querySelector('#p-gender')?.value || '',
      phone: form.querySelector('#p-phone')?.value || '',
      email: form.querySelector('#p-email')?.value || '',
      language: form.querySelector('#p-language')?.value || '',
      
      race: raceRadio ? raceRadio.value : (this.state.race || ''),
      ethnicity: ethnicityRadio ? ethnicityRadio.value : (this.state.ethnicity || ''),
      comm: commRadio ? commRadio.value : (this.state.comm || ''),
      reminder: reminderRadio ? reminderRadio.value : (this.state.reminder || ''),
      
      insName: form.querySelector('#ins-name')?.value || '',
      insCardholder: form.querySelector('#ins-cardholder')?.value || '',
      insId: form.querySelector('#ins-id')?.value || '',
      insDob: form.querySelector('#ins-dob')?.value || '',
      insRelation: form.querySelector('#ins-relation')?.value || '',
      insEmployer: form.querySelector('#ins-employer')?.value || '',
      
      catSurgery: catSurgeryRadio ? catSurgeryRadio.value : (this.state.catSurgery || ''),
      catDateOd: form.querySelector('#cat-date-od')?.value || '',
      catDateOs: form.querySelector('#cat-date-os')?.value || '',
      catSurgeon: form.querySelector('#cat-surgeon')?.value || '',
      catCity: form.querySelector('#cat-city')?.value || '',
      catState: form.querySelector('#cat-state')?.value || '',
      
      gName: form.querySelector('#g-name')?.value || '',
      gAddress: form.querySelector('#g-address')?.value || '',
      gCity: form.querySelector('#g-city')?.value || '',
      gState: form.querySelector('#g-state')?.value || '',
      gZip: form.querySelector('#g-zip')?.value || '',
      gDob: form.querySelector('#g-dob')?.value || '',
      gSsn: form.querySelector('#g-ssn')?.value || '',
      
      sigDate: form.querySelector('#p-sig-date')?.value || ''
    };
    
    this.onStateChange(this.state);
  }
  
  reset() {
    this.state = {};
    this.render();
    this.bindEvents();
    this.initSignature();
    this.onStateChange(this.state);
  }

  destroy() {
    if (this.sigPad) {
      this.sigPad.clear();
    }
  }
}
