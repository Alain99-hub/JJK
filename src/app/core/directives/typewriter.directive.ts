import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { AudioService } from '../services/audio.service';
import { RevealObserverService } from '../services/reveal-observer.service';
import { prefersReducedMotion } from '../utils/motion';

/**
 * Escribe el texto carácter a carácter cuando el elemento entra en pantalla.
 *
 * `play` permite encadenar frases desde fuera (lo usa el veredicto final para
 * respetar las pausas dramáticas). Con `prefers-reduced-motion` el texto
 * aparece completo al instante.
 *
 * @example
 * ```html
 * <span [appTypewriter]="'Acceso concedido.'" [speed]="24"></span>
 * ```
 */
@Directive({
  selector: '[appTypewriter]',
})
export class TypewriterDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly observer = inject(RevealObserverService);
  private readonly audio = inject(AudioService);

  readonly text = input.required<string>({ alias: 'appTypewriter' });
  /** Milisegundos por carácter. */
  readonly speed = input(26);
  readonly startDelay = input(0);
  /** Compuerta externa: la escritura espera hasta que sea `true`. */
  readonly play = input(true);
  /** Mantiene el cursor parpadeando cuando termina. */
  readonly keepCaret = input(false);
  /** Reproduce un clic por carácter si el sonido está encendido. */
  readonly sonify = input(false);

  readonly typed = output<void>();

  private readonly visible = signal(false);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private started = false;

  constructor() {
    effect(() => {
      const text = this.text();
      const ready = this.visible() && this.play();

      if (!ready || this.started) {
        return;
      }

      this.started = true;
      untracked(() => this.run(text));
    });
  }

  ngOnInit(): void {
    const element = this.host.nativeElement;
    element.textContent = '';

    this.observer.observe(
      element,
      (entry) => {
        if (entry.isIntersecting) {
          this.visible.set(true);
          this.observer.unobserve(element);
        }
      },
      0,
    );
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.observer.unobserve(this.host.nativeElement);
  }

  private run(text: string): void {
    const element = this.host.nativeElement;

    if (prefersReducedMotion()) {
      element.textContent = text;
      this.finish();
      return;
    }

    element.classList.add('caret');

    const characters = [...text];
    const speed = this.speed();

    characters.forEach((_, index) => {
      this.defer(
        () => {
          element.textContent = characters.slice(0, index + 1).join('');
          if (this.sonify() && index % 3 === 0) {
            this.audio.play('tick');
          }
        },
        this.startDelay() + index * speed,
      );
    });

    this.defer(() => this.finish(), this.startDelay() + characters.length * speed + 40);
  }

  private finish(): void {
    if (!this.keepCaret()) {
      this.host.nativeElement.classList.remove('caret');
    }
    this.typed.emit();
  }

  private defer(action: () => void, delay: number): void {
    this.timers.push(setTimeout(action, delay));
  }

  private clearTimers(): void {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
    this.timers.length = 0;
  }
}
