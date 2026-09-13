import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';

import { AudioService } from '../../core/services/audio.service';
import { ExperienceService } from '../../core/services/experience.service';
import { prefersReducedMotion } from '../../core/utils/motion';
import { injectVisibility } from '../../core/utils/visibility';
import { CLOSING, DEPARTMENT, PHASES, VERDICT } from '../../data/dossier.data';
import { ParticlesComponent } from '../ui/particles/particles.component';
import { StampComponent } from '../ui/stamp/stamp.component';

/**
 * Guion del desenlace. Cada número es el instante (ms desde que la sección
 * entra en pantalla) en el que se descubre el paso correspondiente.
 */
const SCRIPT = [0, 520, 1150, 2750, 4300, 6500] as const;

/** El paso en el que aparece la frase clave. */
const CLIMAX_STEP = 4;

/**
 * Conclusión — el expediente abandona la estética fría y dice lo que quería
 * decir desde el principio.
 */
@Component({
  selector: 'app-final-verdict',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ParticlesComponent, StampComponent],
  templateUrl: './final-verdict.component.html',
  styleUrl: './final-verdict.component.scss',
  host: {
    class: 'phase',
    '[attr.id]': 'phase.id',
    '[attr.data-phase-id]': 'phase.id',
    '[attr.data-step]': 'step()',
  },
})
export class FinalVerdictComponent {
  private readonly audio = inject(AudioService);
  private readonly experience = inject(ExperienceService);

  protected readonly phase = PHASES[5];
  protected readonly verdict = VERDICT;
  protected readonly closing = CLOSING;
  protected readonly department = DEPARTMENT;

  protected readonly step = signal(-1);
  protected readonly climaxReached = computed(() => this.step() >= CLIMAX_STEP);

  private readonly visible = injectVisibility(0.25);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private started = false;

  constructor() {
    effect(() => {
      if (!this.visible() || this.started) {
        return;
      }

      this.started = true;
      untracked(() => this.play());
    });

    inject(DestroyRef).onDestroy(() => {
      for (const timer of this.timers) {
        clearTimeout(timer);
      }
    });
  }

  protected restart(): void {
    this.audio.play('tick');
    this.experience.reset();
  }

  private play(): void {
    if (prefersReducedMotion()) {
      this.step.set(SCRIPT.length - 1);
      return;
    }

    SCRIPT.forEach((delay, index) => {
      this.timers.push(
        setTimeout(() => {
          this.step.set(index);
          if (index === CLIMAX_STEP) {
            this.audio.play('chime');
          }
        }, delay),
      );
    });
  }
}
