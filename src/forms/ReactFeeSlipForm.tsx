/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeeSlipSchema, FeeSlipData } from '../types';
import { cn } from '../lib/utils';

const InputLine = ({ label, name, className, placeholder = "" }: { label?: string, name: string, className?: string, placeholder?: string }) => {
  const { register } = useFormContext<FeeSlipData>();
  return (
    <div className={cn("flex items-end gap-2", className)}>
      {label && <span className="label-text whitespace-nowrap">{label}</span>}
      <input
        {...register(name as any)}
        placeholder={placeholder}
        className="flex-1 border-b border-current uppercase px-1 focus:outline-none min-h-[1.5rem]"
      />
    </div>
  );
};

const SectionHeader = ({ title, className }: { title: string, className?: string }) => (
  <h2 className={cn("section-title text-center py-0.5 mb-1 bg-neutral-100 dark:bg-neutral-900 border-x-4 border-current text-black dark:text-white", className)}>{title}</h2>
);

const GroupTitle = ({ title }: { title: string }) => (
  <h3 className="font-black text-[9px] uppercase border-b-2 border-current inline-block mb-0.5">{title}</h3>
);

const ProcedureItem = ({ label, code, name }: { label: string, code?: string, name: string }) => {
  const { register } = useFormContext<FeeSlipData>();
  return (
    <div className="flex items-center justify-between gap-1 py-0 px-0 text-black dark:text-white">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <input type="checkbox" {...register(`procedures.${name}` as any)} className="checkbox-custom shrink-0 scale-75 border-current" />
        <span className="label-text truncate text-[8px]">{label}</span>
      </div>
      {code && <span className="code-text shrink-0 text-[8px]">{code}</span>}
      <input 
        type="text" 
        {...register(`procedureValues.${name}` as any)}
        className="w-12 border-b border-current text-right focus:outline-none bg-transparent" 
      />
    </div>
  );
};

const DiagnosisItem = ({ label, name }: { label: string, name: string }) => {
  const { register } = useFormContext<FeeSlipData>();
  return (
    <div className="flex items-start gap-1 py-0 text-black dark:text-white">
      <input type="checkbox" {...register(`diagnosis.${name}` as any)} className="checkbox-custom mt-0.5 shrink-0 scale-75 border-current" />
      <span className="label-text text-[8px] leading-tight">{label}</span>
    </div>
  );
};

interface ReactFeeSlipFormProps {
  initialState: Partial<FeeSlipData>;
  onStateChange: (data: FeeSlipData) => void;
  resetTrigger?: number;
}

export const ReactFeeSlipForm: React.FC<ReactFeeSlipFormProps> = ({
  initialState,
  onStateChange,
  resetTrigger = 0
}) => {
  // Setup React Hook Form
  const methods = useForm<FeeSlipData>({
    resolver: zodResolver(FeeSlipSchema) as any,
    defaultValues: useMemo(() => {
      return {
        patientName: "",
        dateOfService: new Date().toISOString().split('T')[0],
        procedures: {},
        procedureValues: {},
        diagnosis: {},
        clMaterials: {
          rt: "",
          lt: "",
          s1: "",
          s2: "",
          sphere: "",
          toric: "",
          bifocal: "",
          extWear: "",
        },
        routineMedical: "",
        contactsOther: "",
        routine: false,
        contacts: false,
        both: false,
        total: 0,
        received: 0,
        paymentType: "",
        insUsed: "",
        ...initialState,
      };
    }, [initialState])
  });

  const { watch, reset, register } = methods;

  // React to reset button clicks
  useEffect(() => {
    if (resetTrigger > 0) {
      reset({
        patientName: "",
        dateOfService: new Date().toISOString().split('T')[0],
        procedures: {},
        procedureValues: {},
        diagnosis: {},
        clMaterials: {
          rt: "",
          lt: "",
          s1: "",
          s2: "",
          sphere: "",
          toric: "",
          bifocal: "",
          extWear: "",
        },
        routineMedical: "",
        contactsOther: "",
        routine: false,
        contacts: false,
        both: false,
        total: 0,
        received: 0,
        paymentType: "",
        insUsed: "",
      });
    }
  }, [resetTrigger, reset]);

  // Watch for changes and call state change callback
  const watchedValues = watch();
  useEffect(() => {
    onStateChange(watchedValues);
  }, [watchedValues, onStateChange]);

  const contactsOtherValue = watch("contactsOther");
  const showBoth = contactsOtherValue && contactsOtherValue !== "" && contactsOtherValue !== "0";

  return (
    <div className="fee-slip-container print:shadow-none print:my-0 print:border-none print:w-full print:max-w-none text-black dark:text-white bg-white dark:bg-black border-current border">
      <FormProvider {...methods}>
        <form className="flex flex-col flex-1 h-full">
          
          {/* Header */}
          <div className="flex items-end gap-x-12 mb-4 border-b-2 border-current pb-1">
            <div className="flex-1 flex items-end gap-2 header-input">
              <span className="font-black text-sm tracking-tighter uppercase shrink-0">Patients Name:</span>
              <input 
                {...methods.register("patientName")}
                className="flex-1 border-b border-current uppercase py-0 focus:outline-none text-[16pt] bg-transparent"
              />
            </div>
            <div className="flex items-end gap-2 header-input">
              <span className="font-black text-sm tracking-tighter uppercase shrink-0">Date:</span>
              <input 
                type="date"
                {...methods.register("dateOfService")}
                className="w-48 border-b border-current py-0 focus:outline-none text-[16pt] bg-transparent"
              />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-x-1">

            {/* Left Column: Procedures */}
            <div className="col-span-4 flex flex-col gap-1 border-r-2 border-neutral-200 dark:border-neutral-800 pr-2">
              <div>
                <SectionHeader title="Office Procedures" />
                <SectionHeader title="Routine Exams" />
                <ProcedureItem label="Routine Vision W/Ref/NP" code="90620" name="v90620" />
                <ProcedureItem label="Routine Vision W/Ref/EP" code="90621" name="v90621" />
                
                <SectionHeader title="Contact Lens Services" />
                <div className="grid grid-cols-1">
                  <ProcedureItem label="Contact Lens Fit" code="92320" name="v92320" />
                  <div className="pl-4 flex flex-col">
                    <ProcedureItem label="Low" name="cl_low" />
                    <ProcedureItem label="Med" name="cl_med" />
                    <ProcedureItem label="High" name="cl_high" />
                  </div>
                  <ProcedureItem label="Bridge CL For Disease" code="92070" name="v92070" />
                </div>
              </div>

              <div>
                <SectionHeader title="Vision/Medical Exams" />
                <div className="grid grid-cols-1">
                  <ProcedureItem label="Eye Exam Int/NP" code="92002" name="v92002" />
                  <ProcedureItem label="Eye Exam Int/EP" code="92012" name="v92012" />
                  <ProcedureItem label="Eye Exam Xomp/NP" code="92004" name="v92004" />
                  <ProcedureItem label="Eye Exam Comp/EP" code="92014" name="v92014" />
                  <ProcedureItem label="Refraction" code="92015" name="v92015" />
                  <ProcedureItem label="Glaucoma Screening" code="92140" name="v92140" />
                  <ProcedureItem label="Probfocus/Strtfwd/NP" code="99201" name="v99201" />
                  <ProcedureItem label="Expanded PF/Strtfwd/NP" code="99202" name="v99202" />
                  <ProcedureItem label="Cmprhve/High Complex/NP" code="99205" name="v99205" />
                  <ProcedureItem label="Probfocused/Strtfwd/EP" code="99211" name="v99211" />
                  <ProcedureItem label="Expand PF/Strtfwd/EP" code="99212" name="v99212" />
                  <ProcedureItem label="Detailed/Low Complex/EP" code="99213" name="v99213" />
                  <ProcedureItem label="Cmphve/Med Complex/EP" code="99214" name="v99214" />
                  <ProcedureItem label="Cmphve/High Complex/EP" code="99215" name="v99215" />
                  <ProcedureItem label="Emergency After Hours" code="99058" name="v99058" />
                </div>
              </div>

              <div>
                <SectionHeader title="Co-Management" />
                <div className="grid grid-cols-1">
                  <ProcedureItem label="Laser (IE YAG) Post-OP" code="66821-55" name="v66821" />
                  <ProcedureItem label="Int-Cap Cat 5x W/IOL P-OP" code="66822-55" name="v66822" />
                  <ProcedureItem label="Ext-Cap Cat 5x W/IOL P-OP" code="66984-55" name="v66984" />
                </div>
              </div>

              <div>
                <SectionHeader title="Vision Therapy" />
                <div className="grid grid-cols-1">
                  <ProcedureItem label="Sensormotor Exam" code="92060" name="v92060" />
                  <ProcedureItem label="Orthopic/Picoptic Training" code="92065" name="v92065" />
                  <ProcedureItem label="Blepharitus, Unspecified" code="" name="v92066" />
                </div>
              </div>

              <div>
                <SectionHeader title="Therapeutics" />
                <div className="grid grid-cols-1">
                  <ProcedureItem label="FB Removal, Conj, Support" code="65205" name="v65205" />
                  <ProcedureItem label="FB Removal, Conj, Embed" code="65210" name="v65210" />
                  <ProcedureItem label="FB Removal, Corneal, NO SLE" code="65222" name="v65220" />
                  <ProcedureItem label="FB Removal, Corneal SLE" code="65222" name="v65222" />
                  <ProcedureItem label="Epilation by Focepts Only" code="67820" name="v67820" />
                  <ProcedureItem label="FB Removal, Eyelid Embed" code="67936" name="v67936" />
                  <ProcedureItem label="Punctal Plug Insertion EX" code="68761" name="v68761" />
                  <ProcedureItem label="Dilation of Punct W/Wc IRRI" code="68901" name="v68901" />
                </div>
              </div>

              <div>
                <SectionHeader title="Special Diagnostic Testing" />
                <div className="grid grid-cols-1">
                  <ProcedureItem label="Corneal Topography" code="92025" name="v92025" />
                  <ProcedureItem label="Gonioscopy" code="92020" name="v92020" />
                  <ProcedureItem label="Visual Field, Limited" code="92081" name="v92081" />
                  <ProcedureItem label="Visual Field, Inter" code="92100" name="v92100" />
                  <ProcedureItem label="Visual Field, Extended" code="92083" name="v92083" />
                  <ProcedureItem label="Pachymetry (Uni/Bi)" code="76514" name="v76514" />
                  <ProcedureItem label="Fundus Photography" code="95060" name="v95060" />
                  <ProcedureItem label="Scan Laser/OCT/Ant" code="92135" name="v92135" />
                  <ProcedureItem label="Laser/OCT/OP Nerve" code="92134" name="v92134" />
                  <ProcedureItem label="Laser/OCT/Retina" code="92285" name="v92285" />
                  <ProcedureItem label="Ext Ophthm, Initial (Per Eye)" code="92225" name="v92225" />
                  <ProcedureItem label="Ext Ophthm, Subs (Per Eye)" code="92226" name="v92226" />
                  <ProcedureItem label="Convergence Infuff/Palsy" code="92132" name="v92132" />
                  <ProcedureItem label="Schirmer Tear Test" code="" name="v92227" />
                </div>
              </div>

              <div>
                <SectionHeader title="Functional" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Convergence Excess" name="func_conv_ex" />
                  <DiagnosisItem label="Amblyopia, Unsp." name="func_ambly" />
                  <DiagnosisItem label="Binocular Vis Disorder, Unsp." name="func_bino" />
                  <DiagnosisItem label="Color Vision Deficiencies" name="func_color" />
                  <DiagnosisItem label="Esophoria" name="func_esp" />
                  <DiagnosisItem label="Exophoria" name="func_exop" />
                  <DiagnosisItem label="Diplopia" name="func_diplo" />
                  <DiagnosisItem label="Esotropia, Unsp." name="func_esot" />
                  <DiagnosisItem label="Exotropia, Unsp." name="func_exot" />
                  <DiagnosisItem label="Hypertropia" name="func_hyper" />
                  <DiagnosisItem label="Legal Blindness, USA" name="func_legal" />
                </div>
              </div>

              {/* Doctor Info */}
              <div className="mt-4 pt-4 border-t-2 border-current">
                <div className="text-[10pt] font-black italic leading-tight uppercase text-left">
                  DRS. KLECKER AND ROBBINS<br />
                  1555 E NEW CIRCLE STE 146<br />
                  LEXINGTON, KY 40509<br />
                  (859) 269-6921
                </div>
              </div>
            </div>

            {/* Middle Column: Diagnosis 1 */}
            <div className="col-span-4 flex flex-col gap-1 border-r-2 border-neutral-200 dark:border-neutral-800 pr-2">
              <div>
                <SectionHeader title="Refractive Error" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Myopia" name="ref_myopia" />
                  <DiagnosisItem label="Hyperopia" name="ref_hyperopia" />
                  <DiagnosisItem label="Astigmatism" name="ref_astig" />
                  <DiagnosisItem label="Presbyopia" name="ref_presby" />
                  <DiagnosisItem label="Anisometropia" name="ref_aniso" />
                </div>
              </div>

              <div>
                <SectionHeader title="Conjunctiva" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Conjunctivitus" name="conj_conjunctivitus" />
                  <DiagnosisItem label="Acute Atropic" name="conj_acute" />
                  <DiagnosisItem label="Chronic Allergic" name="conj_allergic" />
                  <DiagnosisItem label="Chronic Unsp." name="conj_chronic" />
                  <DiagnosisItem label="Subconj Hemorrhage" name="conj_hemorrhage" />
                  <DiagnosisItem label="Pinguecula" name="conj_pinguecula" />
                  <DiagnosisItem label="Pterygium" name="conj_pterygium" />
                  <DiagnosisItem label="Foreign Body, Conjunctival" name="conj_foreign" />
                  <DiagnosisItem label="Laceration of Eye, Unsp." name="conj_laceration" />
                </div>
              </div>

              <div>
                <SectionHeader title="Cornea" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Abrasion, Scratch" name="corn_abrasion" />
                  <DiagnosisItem label="Degeneration" name="corn_degen" />
                  <DiagnosisItem label="Unsp. Deposit" name="corn_deposit" />
                  <DiagnosisItem label="Dystrophy, Unsp." name="corn_dystrophy" />
                  <DiagnosisItem label="Edema, Unsp." name="corn_edema" />
                  <DiagnosisItem label="Edema, CL Related" name="corn_edemacl" />
                  <DiagnosisItem label="Neo. Unsp." name="corn_neo" />
                  <DiagnosisItem label="Scar Unsp." name="corn_scar" />
                  <DiagnosisItem label="Ulcer, Central" name="corn_ulcer" />
                  <DiagnosisItem label="Ulcer, Marginal" name="corn_ulcerm" />
                  <DiagnosisItem label="Dry Eye Syndrome" name="corn_dryeye" />
                  <DiagnosisItem label="Endo Corneal Dystrophy" name="corn_endo" />
                  <DiagnosisItem label="Herpes Simplex" name="corn_herpes" />
                  <DiagnosisItem label="Herpes Zoster" name="corn_herpez" />
                  <DiagnosisItem label="Keratitus, Superficial" name="corn_keratitus" />
                  <DiagnosisItem label="Keraoconus, Unsp." name="corn_keratoconus" />
                  <DiagnosisItem label="Poterior Corneal Pigment" name="corn_postpig" />
                  <DiagnosisItem label="Recurrent Corneal Erosion" name="corn_recur" />
                  <DiagnosisItem label="Sleritus/Episcieritus" name="corn_sleritus" />
                  <DiagnosisItem label="Senile Corneal Changes(ARCUS)" name="corn_senile" />
                </div>
              </div>

              <div>
                <SectionHeader title="Eyelid/Adnexa" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Black Eye" name="eye_black" />
                  <DiagnosisItem label="Blepharochalasis(Pseudoptosis)" name="eye_blepha" />
                  <DiagnosisItem label="Chalazion" name="eye_chalazion" />
                  <DiagnosisItem label="Dermatitis, Contact/Allergic" name="eye_dermatitis" />
                  <DiagnosisItem label="Dermatochaisis" name="eye_dermatochaisis" />
                  <DiagnosisItem label="Entropion, Senile" name="eye_entropion" />
                  <DiagnosisItem label="Edema of Eyelid" name="eye_edema" />
                  <DiagnosisItem label="Hordecium, External" name="eye_hordecium" />
                  <DiagnosisItem label="Inflammation of the Eyelid, Unsp." name="eye_inflame" />
                  <DiagnosisItem label="Lagophthalmo" name="eye_lago" />
                  <DiagnosisItem label="Xanthelasma" name="eye_xan" />
                </div>
              </div>

              <div>
                <SectionHeader title="Glaucoma" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Angle Closure Chronic" name="glau_closure" />
                  <DiagnosisItem label="Ocular Hypertension" name="glau_htn" />
                  <DiagnosisItem label="Open-Angle" name="glau_open" />
                  <DiagnosisItem label="Glaucoma Primary" name="glau_prime" />
                  <DiagnosisItem label="Glaucoma Suspect" name="glau_suspect" />
                  <DiagnosisItem label="Glaucoma Unsp." name="glau_unsp" />
                </div>
              </div>

              <div>
                <SectionHeader title="Optic Nerve" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Drusen of Optic Disk" name="optic_drusen" />
                  <DiagnosisItem label="Glaucoma Atrophy, O. Disk" name="optic_glatrophy" />
                  <DiagnosisItem label="Optic Atrophy, Unsp." name="optic_atrophy" />
                  <DiagnosisItem label="Optic Neuropathy, Ischemic" name="optic_neuro" />
                  <DiagnosisItem label="Optic Neuritis" name="optic_neuritis" />
                  <DiagnosisItem label="Papilidema, Unsp." name="optic_papili" />
                  <DiagnosisItem label="Psuedopapillidema" name="optic_pseudo" />
                  <DiagnosisItem label="Pseudotumor Cerebri" name="optic_tumor" />
                </div>
              </div> 
            </div>

            {/* Right Column: Retina & Summary */}
            <div className="col-span-4 flex flex-col gap-1">
              <div>
                <SectionHeader title="Retina" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="CRAO" name="ret_crao" />
                  <DiagnosisItem label="CRVO" name="ret_crvo" />
                  <DiagnosisItem label="BRAO" name="ret_brao" />
                  <DiagnosisItem label="BRVO" name="ret_brvo" />
                  <DiagnosisItem label="Diabetic Retinopathy" name="ret_diab" />
                  <div className="pl-2">
                    <DiagnosisItem label="Background" name="ret_background" />
                    <DiagnosisItem label="Proliferative" name="ret_prolife" />
                    <DiagnosisItem label="Non-Proliferative" name="ret_nonprolife" />
                    <div className="pl-3">
                      <DiagnosisItem label="NDS" name="ret_nds" />
                      <DiagnosisItem label="Mild" name="ret_mild" />
                      <DiagnosisItem label="Moderate" name="ret_Mod" />
                      <DiagnosisItem label="Severe" name="ret_sev" />
                    </div>
                  </div>
                  <DiagnosisItem label="Drusen, Degenerative" name="ret_dr" />
                  <DiagnosisItem label="Lattice, Degenerative" name="ret_latt" />
                  <DiagnosisItem label="Macular" name="ret_mac" />
                  <div className="pl-4">
                    <DiagnosisItem label="Cyst, Hole, Psuedohole" name="ret_cyst" />
                    <DiagnosisItem label="Degeneration, Exud." name="ret_dege" />
                    <DiagnosisItem label="Degeneration, Nonex" name="ret_degnon" />
                    <DiagnosisItem label="Edema, Diabetic" name="ret_ede" />
                    <DiagnosisItem label="CME" name="ret_cmc" />
                    <DiagnosisItem label="Puckering" name="ret_puck" />
                    <DiagnosisItem label="Scars, Other" name="ret_scar" />
                  </div>
                  <DiagnosisItem label="Retinal" name="ret_ret" />
                  <div className="pl-4">
                    <DiagnosisItem label="Benign Neoplasm" name="ret_ben" />
                    <DiagnosisItem label="Defect Unsp." name="ret_def" />
                    <DiagnosisItem label="Detach w/ Defect" name="ret_det" />
                    <DiagnosisItem label="Edema" name="ret_edem" />
                    <DiagnosisItem label="Hemorrhage" name="ret_hem" />
                    <DiagnosisItem label="Ptaquanti" name="ret_ptaq" />
                    <DiagnosisItem label="POHS" name="ret_pohs" />
                    <DiagnosisItem label="Pigmentosa" name="ret_pigm" />
                    <DiagnosisItem label="Tear w/o Defect" name="ret_tear" />
                  </div>
                  <DiagnosisItem label="Retinopathy" name="ret_ret" />
                  <div className="pl-4">
                    <DiagnosisItem label="Central Sarous" name="ret_cent" />
                    <DiagnosisItem label="Hypertensive" name="ret_hyp" />
                    <DiagnosisItem label="Degeneration" name="ret_degener" />
                    <DiagnosisItem label="Floaters" name="ret_float" />
                    <DiagnosisItem label="Hemorrhage" name="ret_rethem" />
                  </div>
                  <DiagnosisItem label="Vitrous" name="ret_vit" />
                </div>
              </div>

              <div className="mt-1">
                <SectionHeader title="Contact Materials" />
                <div className="grid grid-cols-4 gap-x-1 mb-1">
                  <div className="flex items-end gap-1">
                    <span className="text-[7px] font-bold">RT</span>
                    <input {...register("clMaterials.rt")} className="w-full border-b border-current focus:outline-none bg-transparent" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-[7px] font-bold">LT</span>
                    <input {...register("clMaterials.lt")} className="w-full border-b border-current focus:outline-none bg-transparent" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-[7px] font-bold">S</span>
                    <input {...register("clMaterials.s1")} className="w-full border-b border-current focus:outline-none bg-transparent" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-[7px] font-bold">S</span>
                    <input {...register("clMaterials.s2")} className="w-full border-b border-current focus:outline-none bg-transparent" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="label-text text-[8px]">Sphere</span>
                    <div className="flex gap-1">
                      <label className="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.sphere")} value="V2510" className="radio-custom scale-75" /> V2510
                      </label>
                      <label className="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.sphere")} value="V2520" className="radio-custom scale-75" /> V2520
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="label-text text-[8px]">Toric</span>
                    <div className="flex gap-1">
                      <label className="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.toric")} value="V2511" className="radio-custom scale-75" /> V2511
                      </label>
                      <label className="flex items-center gap-0.5 text-[7px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.toric")} value="V2521" className="radio-custom scale-75" /> V2521
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <SectionHeader title="Iris" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="Iridocyclitus/Uveitis" name="irid_irid" />
                  <div className="pl-5">
                    <DiagnosisItem label="Acute/Subac" name="iris_ac" />
                    <DiagnosisItem label="Ute Chronic" name="iris_ute" />
                    <DiagnosisItem label="Primary" name="iris_prim" />
                    <DiagnosisItem label="Recurrent" name="iris_recur" />
                  </div>
                  <DiagnosisItem label="Scleritus, Unsp." name="iris_scl" />
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-auto pt-4 flex flex-col gap-1 border-t-4 border-current summary-input">
                <div className="flex items-end justify-between gap-1">
                  <span className="font-black text-[16px] uppercase underline leading-tight shrink-0">ROUTINE / MEDICAL:</span>
                  <input {...methods.register("routineMedical")} className="flex-1 min-w-0 border-b border-current focus:outline-none text-[20pt] font-black bg-transparent" />
                </div>
                <div className="flex items-end justify-between gap-1">
                  <span className="font-black text-[16px] uppercase underline leading-tight shrink-0">CONTACTS / OTHER :</span>
                  <input {...methods.register("contactsOther")} className="flex-1 min-w-0 border-b border-current focus:outline-none text-[20pt] font-black bg-transparent" />
                </div>
                
                <div className="flex items-end justify-between gap-1 mt-2">
                  <span className="font-black text-[16px] uppercase leading-none shrink-0">TOTAL :</span>
                  <div className="flex items-end gap-1 flex-1 border-b border-current">
                    <span className="text-lg font-bold">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      {...methods.register("total", { valueAsNumber: true })}
                      className="flex-1 min-w-0 text-left focus:outline-none bg-transparent font-black text-[20pt]" 
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-1 mt-2">
                  <span className="font-black text-[16px] uppercase leading-none shrink-0">RECEIVED:</span>
                  <div className="flex items-end gap-1 flex-1 border-b border-current">
                    <span className="text-lg font-bold">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      {...methods.register("received", { valueAsNumber: true })}
                      className="flex-1 min-w-0 text-left focus:outline-none bg-transparent font-black text-[20pt]" 
                    />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-1">
                  <span className="font-black text-[16px] uppercase leading-tight shrink-0">PAYMENT TYPE :</span>
                  <input {...methods.register("paymentType")} className="flex-1 min-w-0 border-b border-current focus:outline-none placeholder:text-neutral-300 uppercase font-black text-[20pt] bg-transparent" placeholder="CASH/VISA" />
                </div>
                <div className="flex items-end justify-between gap-1">
                  <span className="font-black text-[16px] uppercase leading-tight shrink-0">INS USED:</span>
                  <input {...methods.register("insUsed")} className="flex-1 min-w-0 border-b border-current focus:outline-none uppercase font-black text-[20pt] bg-transparent" />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Watermark only or empty spacer */}
          <div className="flex justify-between items-end gap-8 mt-4 relative min-h-[50px]">
            {showBoth && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-12 text-[32pt] font-black uppercase border-4 border-current px-12 py-2 text-black dark:text-white bg-white dark:bg-black">
                BOTH
              </div>
            )}
          </div>

        </form>
      </FormProvider>
    </div>
  );
};
export default ReactFeeSlipForm;
