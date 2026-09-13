import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';

import { TypewriterDirective } from '../../core/directives/typewriter.directive';
import { AudioService } from '../../core/services/audio.service';
import { ExperienceService } from '../../core/services/experience.service';
import { prefersReducedMotion } from '../../core/utils/motion';
import { BOOT_LOG, DEPARTMENT, DOSSIER } from '../../data/dossier.data';

type IntroPhase = 'idle' | 'booting' | 'wiping';

/** Ritmo de la apertura: del clic al expediente visible en menos de dos segundos. */
const LINE_STEP = 210;
const WIPE_AT = 1180;
const DONE_AT = 1880;

/**
 * Pantalla de bloqueo del expediente.
 *
 * Es lo primero que ve la lectora: sello confidencial, departamento y un único
 * botón. Al pulsarlo corre un desencriptado breve y un barrido descubre el
 * informe que ya está montado detrás.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TypewriterDirective],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
  host: {
    '[attr.data-phase]': 'phase()',
  },
})
export class IntroComponent implements OnDestroy {
  private readonly experience = inject(ExperienceService);
  private readonly audio = inject(AudioService);

  protected readonly dossier = DOSSIER;
  protected readonly department = DEPARTMENT;
  protected readonly bootLog = BOOT_LOG;

  protected readonly phase = signal<IntroPhase>('idle');
  protected readonly visibleLines = signal(0);

  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  ngOnDestroy(): void {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
  }

  protected open(): void {
    if (this.phase() !== 'idle') {
      return;
    }

    this.phase.set('booting');
    this.audio.play('unlock');
    // El expediente se monta ya: el barrido descubre contenido real, no un hueco.
    this.experience.beginUnlock();

    if (prefersReducedMotion()) {
      this.visibleLines.set(this.bootLog.length);
      this.defer(() => this.experience.completeUnlock(), 200);
      return;
    }

    this.bootLog.forEach((_, index) => {
      this.defer(() => {
        this.visibleLines.set(index + 1);
        this.audio.play('tick');
      }, index * LINE_STEP);
    });

    this.defer(() => this.phase.set('wiping'), WIPE_AT);
    this.defer(() => this.experience.completeUnlock(), DONE_AT);
  }

  protected progress(): number {
    return Math.round((this.visibleLines() / this.bootLog.length) * 100);
  }

  private defer(action: () => void, delay: number): void {
    this.timers.push(setTimeout(action, delay));
  }
}
