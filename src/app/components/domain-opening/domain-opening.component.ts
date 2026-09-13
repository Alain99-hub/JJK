import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ExperienceService } from '../../core/services/experience.service';
import { prefersReducedMotion } from '../../core/utils/motion';
import { DOMAIN_OPENING } from '../../data/dossier.data';

/** Instante (ms) en que se descubre cada capa: arte, kanji, título y técnica. */
const SCRIPT = [80, 750, 1550, 2800] as const;

/** Cuándo empieza a disiparse la expansión. */
const LEAVE_AT = 4900;
const REDUCED_LEAVE_AT = 2600;

/** Lo que dura el fundido de salida (igual que su transición en el SCSS). */
const FADE_MS = 900;

/**
 * El secreto de la tarjeta: expansión de dominio a pantalla completa.
 *
 * Aparece ya en negro — el vacío de la tarjeta la precede — y al disiparse deja
 * a la vista la pantalla de bloqueo del expediente, que espera montada debajo.
 */
@Component({
  selector: 'app-domain-opening',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './domain-opening.component.html',
  styleUrl: './domain-opening.component.scss',
  host: {
    '[class.at-1]': 'step() >= 1',
    '[class.at-2]': 'step() >= 2',
    '[class.at-3]': 'step() >= 3',
    '[class.at-4]': 'step() >= 4',
    '[class.is-leaving]': 'leaving()',
  },
})
export class DomainOpeningComponent {
  private readonly experience = inject(ExperienceService);

  protected readonly copy = DOMAIN_OPENING;
  protected readonly step = signal(0);
  protected readonly leaving = signal(false);

  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const timer of this.timers) {
        clearTimeout(timer);
      }
    });

    const reduced = prefersReducedMotion();
    const leaveAt = reduced ? REDUCED_LEAVE_AT : LEAVE_AT;

    if (reduced) {
      this.step.set(SCRIPT.length);
    } else {
      SCRIPT.forEach((delay, index) => this.defer(() => this.step.set(index + 1), delay));
    }

    this.defer(() => this.leaving.set(true), leaveAt);
    this.defer(() => this.experience.completeDomain(), leaveAt + FADE_MS);
  }

  private defer(action: () => void, delay: number): void {
    this.timers.push(setTimeout(action, delay));
  }
}
