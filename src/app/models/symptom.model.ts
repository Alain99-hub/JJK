/** Un síntoma registrado al inicio del incidente (Fase 2). */
export interface Symptom {
  readonly label: string;
  /** Sello de registro que aparece junto al síntoma. */
  readonly status: string;
}
