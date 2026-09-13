import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { ExperienceService } from '../../core/services/experience.service';
import { prefersReducedMotion } from '../../core/utils/motion';
import { BIRTHDAY } from '../../data/dossier.data';
import { ParticlesComponent } from '../ui/particles/particles.component';

type CardState = 'closed' | 'open' | 'breaking';

interface ConfettiPiece {
  readonly dx: string;
  readonly dy: string;
  readonly spin: string;
  readonly delay: string;
  readonly tint: string;
  readonly round: boolean;
}

/** Toques al sello necesarios para romperlo. */
const TAPS_TO_BREAK = 3;

/** Lo que tarda el vacío en tragarse la tarjeta antes de ceder el paso a la expansión. */
const VOID_MS = 950;

const TINTS = ['#e9c27c', '#e8788f', '#fff3e6', '#f4a6b8'] as const;

/** Ráfaga fija, no aleatoria: la tarjeta se abre igual de bonita cada vez. */
const CONFETTI: readonly ConfettiPiece[] = Array.from({ length: 30 }, (_, index) => {
  const angle = (index / 30) * Math.PI * 2 + (index % 4) * 0.21;
  const distance = 110 + ((index * 37) % 120);

  return {
    dx: `${Math.round(Math.cos(angle) * distance)}px`,
    dy: `${Math.round(Math.sin(angle) * distance * 0.75 - 70)}px`,
    spin: `${(index * 53) % 540}deg`,
    delay: `${(index % 6) * 25}ms`,
    tint: TINTS[index % TINTS.length],
    round: index % 3 === 0,
  };
});

/**
 * Pantalla principal: la tarjeta de cumpleaños.
 *
 * Se abre con un botón y guarda un secreto: el sello de cera del final se rompe
 * al tocarlo tres veces, y un vacío se traga la tarjeta para dar paso a la
 * expansión de dominio y, tras ella, al expediente clasificado.
 */
@Component({
  selector: 'app-birthday-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ParticlesComponent],
  templateUrl: './birthday-card.component.html',
  styleUrl: './birthday-card.component.scss',
})
export class BirthdayCardComponent {
  private readonly experience = inject(ExperienceService);
  private readonly injector = inject(Injector);

  protected readonly card = BIRTHDAY;
  protected readonly confetti = CONFETTI;

  protected readonly state = signal<CardState>('closed');
  protected readonly taps = signal(0);
  /** Centro del sello: desde ahí se abre el vacío. */
  protected readonly origin = signal({ x: '50%', y: '50%' });
  protected readonly postscript = computed(() =>
    this.taps() === TAPS_TO_BREAK - 1 ? this.card.sealAlmost : this.card.postscript,
  );

  private readonly inside = viewChild<ElementRef<HTMLElement>>('inside');
  private readonly seal = viewChild<ElementRef<HTMLButtonElement>>('seal');
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const timer of this.timers) {
        clearTimeout(timer);
      }
    });
  }

  protected open(): void {
    if (this.state() !== 'closed') {
      return;
    }

    this.state.set('open');
    // La expansión de dominio usa esta imagen: se precarga para que no aparezca a medias.
    new Image().src = 'art/verdict.jpg';

    // El botón desaparece al abrir; el foco pasa al interior de la tarjeta.
    afterNextRender(() => this.inside()?.nativeElement.focus({ preventScroll: true }), {
      injector: this.injector,
    });
  }

  protected tapSeal(): void {
    if (this.state() !== 'open') {
      return;
    }

    const taps = this.taps() + 1;
    this.taps.set(taps);

    if (taps < TAPS_TO_BREAK) {
      return;
    }

    const rect = this.seal()?.nativeElement.getBoundingClientRect();
    if (rect) {
      this.origin.set({
        x: `${Math.round(rect.left + rect.width / 2)}px`,
        y: `${Math.round(rect.top + rect.height / 2)}px`,
      });
    }

    this.state.set('breaking');
    this.timers.push(
      setTimeout(() => this.experience.expandDomain(), prefersReducedMotion() ? 0 : VOID_MS),
    );
  }
}
