import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CountUpDirective } from '../../core/directives/count-up.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { injectVisibility } from '../../core/utils/visibility';
import {
  DAMAGE_EVENTS,
  DAMAGE_REPORT,
  DAMAGE_SAFETY_LIMIT,
  DAMAGE_SCALE_MAX,
  PHASES,
} from '../../data/dossier.data';
import { EmotionalEvent } from '../../models/emotional-event.model';
import { PhaseLabelComponent } from '../ui/phase-label/phase-label.component';

/** Fase 4 — telemetría del daño emocional acumulado. */
@Component({
  selector: 'app-emotional-damage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseLabelComponent, RevealDirective, CountUpDirective],
  templateUrl: './emotional-damage.component.html',
  styleUrl: './emotional-damage.component.scss',
  host: {
    class: 'phase',
    '[attr.id]': 'phase.id',
    '[attr.data-phase-id]': 'phase.id',
  },
})
export class EmotionalDamageComponent {
  protected readonly phase = PHASES[3];
  protected readonly events = DAMAGE_EVENTS;
  protected readonly report = DAMAGE_REPORT;
  protected readonly safetyLimit = DAMAGE_SAFETY_LIMIT;

  /** Marcas del eje: 0, 2, 4, 6, 8 y 10. */
  protected readonly ticks = [0, 2, 4, 6, 8, 10].map((value) => ({
    value,
    offset: this.toPercent(value),
  }));

  protected readonly limitOffset = this.toPercent(DAMAGE_SAFETY_LIMIT);

  protected readonly visible = injectVisibility(0.25);

  /** Anchura final de la barra, en porcentaje de la escala. */
  protected barWidth(event: EmotionalEvent): string {
    return `${this.toPercent(event.value).toFixed(3)}%`;
  }

  private toPercent(value: number): number {
    return (value / DAMAGE_SCALE_MAX) * 100;
  }
}
