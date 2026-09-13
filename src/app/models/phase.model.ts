/**
 * Estado global de la experiencia: tarjeta de cumpleaños, expansión de dominio
 * (el secreto de la tarjeta), expediente sellado, abriéndose o abierto.
 */
export type ExperienceStage = 'card' | 'domain' | 'locked' | 'unlocking' | 'open';

/**
 * Una fase del expediente. `warmth` (0 → 1) define la temperatura de color
 * cuando esa fase es la visible: el informe empieza frío y termina cálido.
 */
export interface Phase {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly warmth: number;
}
