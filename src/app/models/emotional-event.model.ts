/** Una medición del registro de daño emocional (Fase 4). */
export interface EmotionalEvent {
  readonly label: string;
  /** Daño medido. Puede superar el máximo de la escala: es parte del chiste. */
  readonly value: number;
  /** Nota técnica que acompaña a la barra. */
  readonly note: string;
  /** Marca la medición que rompe el límite de seguridad. */
  readonly offScale?: boolean;
}
