import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { RevealDirective } from '../../core/directives/reveal.directive';
import { TiltDirective } from '../../core/directives/tilt.directive';
import { PHASES, TECHNIQUES } from '../../data/dossier.data';
import { PhaseLabelComponent } from '../ui/phase-label/phase-label.component';

/** Fase 3 — catálogo de técnicas malditas, con la definitiva a ancho completo. */
@Component({
  selector: 'app-cursed-techniques',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseLabelComponent, RevealDirective, TiltDirective],
  templateUrl: './cursed-techniques.component.html',
  styleUrl: './cursed-techniques.component.scss',
  host: {
    class: 'phase',
    '[attr.id]': 'phase.id',
    '[attr.data-phase-id]': 'phase.id',
  },
})
export class CursedTechniquesComponent {
  protected readonly phase = PHASES[2];

  protected readonly standard = computed(() => TECHNIQUES.filter((t) => !t.ultimate));
  protected readonly ultimate = computed(() => TECHNIQUES.find((t) => t.ultimate));
  protected readonly rings = [0, 1, 2];
}
