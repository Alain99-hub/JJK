import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CountUpDirective } from '../../core/directives/count-up.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { injectVisibility } from '../../core/utils/visibility';
import { PHASES, SUBJECT } from '../../data/dossier.data';
import { PhaseLabelComponent } from '../ui/phase-label/phase-label.component';
import { RedactedTextComponent } from '../ui/redacted-text/redacted-text.component';

/** Número de bloques del medidor de peligro: `██████████`. */
const METER_SEGMENTS = 10;

/** Fase 1 — ficha de inteligencia del sujeto clasificado. */
@Component({
  selector: 'app-threat-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseLabelComponent, RedactedTextComponent, RevealDirective, CountUpDirective],
  templateUrl: './threat-profile.component.html',
  styleUrl: './threat-profile.component.scss',
  host: {
    class: 'phase',
    '[attr.id]': 'phase.id',
    '[attr.data-phase-id]': 'phase.id',
  },
})
export class ThreatProfileComponent {
  protected readonly phase = PHASES[0];
  protected readonly subject = SUBJECT;
  protected readonly segments = Array.from({ length: METER_SEGMENTS }, (_, i) => i);

  protected readonly visible = injectVisibility(0.3);
}
