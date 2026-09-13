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

import { RevealDirective } from '../../core/directives/reveal.directive';
import { TypewriterDirective } from '../../core/directives/typewriter.directive';
import { injectVisibility } from '../../core/utils/visibility';
import { prefersReducedMotion } from '../../core/utils/motion';
import { PHASES, REVIEW } from '../../data/dossier.data';
import { PhaseLabelComponent } from '../ui/phase-label/phase-label.component';

/** Cadencia del log de análisis. */
const LOG_STEP = 620;

/**
 * Fase 5 — el expediente se revisa a sí mismo.
 *
 * Aquí el informe cambia de tono: corre un análisis de reciprocidad y el
 * resultado deja de sonar a informe técnico.
 */
@Component({
  selector: 'app-domain-expansion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseLabelComponent, RevealDirective, TypewriterDirective],
  templateUrl: './domain-expansion.component.html',
  styleUrl: './domain-expansion.component.scss',
  host: {
    class: 'phase',
    '[attr.id]': 'phase.id',
    '[attr.data-phase-id]': 'phase.id',
  },
})
export class DomainExpansionComponent {
  protected readonly phase = PHASES[4];
  protected readonly review = REVIEW;

  protected readonly analysing = signal(false);
  protected readonly logIndex = signal(0);
  protected readonly resultReady = signal(false);
  protected readonly primaryTyped = signal(false);

  protected readonly currentLog = computed(() => this.review.analysisLog[this.logIndex()]);
  protected readonly progress = computed(() =>
    this.resultReady()
      ? 100
      : Math.round(((this.logIndex() + 1) / this.review.analysisLog.length) * 100),
  );

  private readonly visible = injectVisibility(0.3);
  private timer?: ReturnType<typeof setInterval>;
  private started = false;

  constructor() {
    effect(() => {
      if (!this.visible() || this.started) {
        return;
      }

      this.started = true;
      untracked(() => this.runAnalysis());
    });

    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  private runAnalysis(): void {
    if (prefersReducedMotion()) {
      this.logIndex.set(this.review.analysisLog.length - 1);
      this.resultReady.set(true);
      return;
    }

    this.analysing.set(true);

    this.timer = setInterval(() => {
      const next = this.logIndex() + 1;

      if (next >= this.review.analysisLog.length) {
        clearInterval(this.timer);
        this.analysing.set(false);
        this.resultReady.set(true);
        return;
      }

      this.logIndex.set(next);
    }, LOG_STEP);
  }
}
