/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from "zod";

/**
 * Validation schema for the Fee Slip
 */
export const FeeSlipSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  dateOfService: z.string().min(1, "Date of service is required"),
  
  // Procedures
  procedures: z.record(z.string(), z.boolean()).default({}),
  procedureValues: z.record(z.string(), z.string()).default({}),

  // Diagnosis
  diagnosis: z.record(z.string(), z.boolean()).default({}),
  
  // Optical Materials
  opticalMaterials: z.object({
    frames: z.string().optional(),
    lenses: z.string().optional(),
    options: z.string().optional(),
  }).default({}),

  // Contact Lens Materials
  clMaterials: z.object({
    rt: z.string().optional(),
    lt: z.string().optional(),
    s1: z.string().optional(),
    s2: z.string().optional(),
    sphere: z.enum(["V2510", "V2520", ""]).optional(),
    toric: z.enum(["V2511", "V2521", ""]).optional(),
    bifocal: z.enum(["V2512", "V2522", ""]).optional(),
    extWear: z.enum(["V2513", "V2523", ""]).optional(),
  }).default({}),

  // Summary
  routineMedical: z.string().optional(),
  contactsOther: z.string().optional(),
  routine: z.boolean().default(false),
  contacts: z.boolean().default(false),
  both: z.boolean().default(false),
  total: z.number().min(0).default(0),
  received: z.number().min(0).default(0),
  paymentType: z.string().optional(),
  insUsed: z.string().optional(),
});

export type FeeSlipData = z.infer<typeof FeeSlipSchema>;

/**
 * Data Model Class for the Fee Slip
 * Handles data manipulation and business logic
 */
export class FeeSlipModel {
  private data: FeeSlipData;

  constructor(initialData?: Partial<FeeSlipData>) {
    this.data = FeeSlipSchema.parse({
      patientName: "",
      dateOfService: new Date().toISOString().split('T')[0],
      procedures: {},
      procedureValues: {},
      diagnosis: {},
      clMaterials: {},
      routineMedical: "",
      contactsOther: "",
      routine: false,
      contacts: false,
      both: false,
      total: 0,
      received: 0,
      paymentType: "",
      insUsed: "",
      ...initialData,
    });
  }

  get patientName() { return this.data.patientName; }
  set patientName(val: string) { this.data.patientName = val; }

  get dateOfService() { return this.data.dateOfService; }
  set dateOfService(val: string) { this.data.dateOfService = val; }

  get total() { return this.data.total; }
  set total(val: number) { this.data.total = val; }

  get received() { return this.data.received; }
  set received(val: number) { this.data.received = val; }

  /**
   * Validates the data against the schema
   */
  validate() {
    return FeeSlipSchema.safeParse(this.data);
  }

  /**
   * Returns the plain data object
   */
  toJSON(): FeeSlipData {
    return { ...this.data };
  }

  /**
   * Toggles a procedure checkbox
   */
  toggleProcedure(code: string) {
    this.data.procedures[code] = !this.data.procedures[code];
  }

  /**
   * Updates a procedure's specific value (e.g. price or modifier)
   */
  setProcedureValue(code: string, value: string) {
    this.data.procedureValues[code] = value;
  }
}
