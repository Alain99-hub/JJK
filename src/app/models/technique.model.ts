/** Identificador del icono SVG que ilustra cada técnica. */
export type TechniqueIcon = 'smile' | 'eye' | 'voice' | 'domain';

/** Una técnica maldita documentada en la Fase 3. */
export interface Technique {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly icon: TechniqueIcon;
  /** Clasificación interna del departamento, p. ej. `CLASE A`. */
  readonly grade: string;
  /** Nombre propio de la técnica, sólo lo tiene la definitiva. */
  readonly alias?: string;
  /** La 04 ocupa todo el ancho y recibe tratamiento especial. */
  readonly ultimate?: boolean;
}
