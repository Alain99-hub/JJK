import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealDirective } from '../../core/directives/reveal.directive';
import { INCIDENT, PHASES, SYMPTOMS } from '../../data/dossier.data';
import { PhaseLabelComponent } from '../ui/phase-label/phase-label.component';

/** Fase 2 — cronología del incidente y protocolo de contención fallido. */
@Component({
  selector: 'app-incident-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseLabelComponent, RevealDirective],
  templateUrl: './incident-timeline.component.html',
  styleUrl: './incident-timeline.component.scss',
  host: {
    class: 'phase',
    '[attr.id]': 'phase.id',
    '[attr.data-phase-id]': 'phase.id',
  },
})
export class IncidentTimelineComponent {
  protected readonly phase = PHASES[1];
  protected readonly incident = INCIDENT;
  protected readonly symptoms = SYMPTOMS;
}
