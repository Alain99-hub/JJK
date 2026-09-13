/** Estado global de la experiencia: sellada, abriéndose o abierta. */
export type ExperienceStage = 'locked' | 'unlocking' | 'open';

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
