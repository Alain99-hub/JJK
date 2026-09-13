import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Chip técnico que encabeza cada fase del expediente. */
@Component({
  selector: 'app-phase-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './phase-label.component.html',
  styleUrl: './phase-label.component.scss',
})
export class PhaseLabelComponent {
  readonly code = input.required<string>();
  /** Texto pequeño opcional a la derecha del código. */
  readonly note = input<string | null>(null);
}
