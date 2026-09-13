import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { PHASES } from '../../data/dossier.data';
import { ExperienceStage, Phase } from '../../models/phase.model';

/**
 * Estado global de la experiencia.
 *
 * Guarda en qué punto está la lectora — tarjeta, expansión de dominio o
 * expediente — y traduce la fase activa a `--warmth`, la variable CSS que va
 * calentando la paleta: el informe empieza frío y termina en tonos cálidos sin
 * un solo corte brusco.
 */
@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly document = inject(DOCUMENT);

  readonly stage = signal<ExperienceStage>('card');
  readonly activePhaseId = signal<string>(PHASES[0].id);
  readonly warmth = signal(0);

  readonly phases = PHASES;
  /** El scroll permanece bloqueado hasta que el barrido de apertura termina. */
  readonly isSealed = computed(() => this.stage() !== 'open');
  readonly isOpen = computed(() => this.stage() === 'open');
  /** El expediente se monta ya durante la apertura, para que el barrido lo descubra. */
  readonly isMounted = computed(() => this.stage() === 'unlocking' || this.stage() === 'open');
  /** La pantalla de bloqueo espera debajo de la expansión, lista para quedar al descubierto. */
  readonly showsIntro = computed(() => {
    const stage = this.stage();
    return stage === 'domain' || stage === 'locked' || stage === 'unlocking';
  });
  readonly activePhaseIndex = computed(() =>
    Math.max(
      0,
      PHASES.findIndex((phase) => phase.id === this.activePhaseId()),
    ),
  );

  constructor() {
    effect(() => {
      this.document.documentElement.style.setProperty('--warmth', this.warmth().toFixed(3));
    });

    effect(() => {
      // Mientras el expediente sigue sellado no se puede hacer scroll por detrás.
      this.document.body.classList.toggle('is-sealed', this.isSealed());
    });
  }

  /** El sello de la tarjeta se rompió: arranca la expansión de dominio. */
  expandDomain(): void {
    if (this.stage() === 'card') {
      this.stage.set('domain');
    }
  }

  /** La expansión terminó de disiparse: queda a la vista el expediente sellado. */
  completeDomain(): void {
    if (this.stage() === 'domain') {
      this.stage.set('locked');
    }
  }

  /** Arranca la secuencia de desencriptado disparada por «Abrir expediente». */
  beginUnlock(): void {
    if (this.stage() === 'locked') {
      this.stage.set('unlocking');
    }
  }

  /** El barrido terminó: el expediente queda abierto y navegable. */
  completeUnlock(): void {
    this.stage.set('open');
  }

  setActivePhase(phase: Phase): void {
    this.activePhaseId.set(phase.id);
    this.warmth.set(phase.warmth);
  }

  /** «Volver a investigar»: vuelve a sellar el expediente desde cero. */
  reset(): void {
    this.stage.set('locked');
    this.activePhaseId.set(PHASES[0].id);
    this.warmth.set(0);
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'auto' });
  }
}
