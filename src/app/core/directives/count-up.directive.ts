import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject, input } from '@angular/core';

import { RevealObserverService } from '../services/reveal-observer.service';
import { easeOutCubic, prefersReducedMotion } from '../utils/motion';

/**
 * Incrementa un número desde 0 hasta el valor indicado al entrar en pantalla.
 *
 * Escribe directamente en el DOM fuera de la zona de Angular: son ~60 fotogramas
 * por contador y no tiene sentido disparar detección de cambios en cada uno.
 *
 * @example
 * ```html
 * <span [appCountUp]="100" suffix="%"></span>
 * ```
 */
@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly observer = inject(RevealObserverService);
  private readonly zone = inject(NgZone);

  readonly value = input.required<number>({ alias: 'appCountUp' });
  readonly duration = input(1500);
  readonly decimals = input(0);
  readonly prefix = input('');
  readonly suffix = input('');
  readonly startDelay = input(0);

  private frame = 0;
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const element = this.host.nativeElement;
    this.render(0);

    if (prefersReducedMotion()) {
      this.render(this.value());
      return;
    }

    this.observer.observe(element, (entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      this.observer.unobserve(element);
      this.timer = setTimeout(() => this.animate(), this.startDelay());
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    clearTimeout(this.timer);
    this.observer.unobserve(this.host.nativeElement);
  }

  private animate(): void {
    const target = this.value();
    const duration = this.duration();

    this.zone.runOutsideAngular(() => {
      const start = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        this.render(target * easeOutCubic(progress));

        if (progress < 1) {
          this.frame = requestAnimationFrame(step);
        }
      };

      this.frame = requestAnimationFrame(step);
    });
  }

  private render(current: number): void {
    this.host.nativeElement.textContent =
      `${this.prefix()}${current.toFixed(this.decimals())}${this.suffix()}`;
  }
}
