import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { RevealObserverService } from '../services/reveal-observer.service';
import { prefersReducedMotion } from '../utils/motion';

/**
 * Revela el elemento al entrar en el viewport.
 *
 * `appReveal` admite directamente el retardo en milisegundos, de modo que
 * escalonar una lista es tan simple como `appReveal="120"`.
 *
 * @example
 * ```html
 * <article appReveal="180" revealShift="34px">…</article>
 * ```
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly observer = inject(RevealObserverService);

  /** Retardo de entrada en ms. */
  readonly delay = input(0, {
    alias: 'appReveal',
    transform: (value: unknown) => numberAttribute(value, 0),
  });

  /** Distancia del desplazamiento inicial. */
  readonly shift = input<string | null>(null, { alias: 'revealShift' });

  private revealed = false;

  ngOnInit(): void {
    const element = this.host.nativeElement;
    element.classList.add('reveal');

    const shift = this.shift();
    if (shift) {
      element.style.setProperty('--reveal-shift', shift);
    }

    if (prefersReducedMotion()) {
      this.reveal();
      return;
    }

    element.style.setProperty('--reveal-delay', `${this.delay()}ms`);

    this.observer.observe(element, (entry) => {
      if (entry.isIntersecting) {
        this.reveal();
      }
    });
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.host.nativeElement);
  }

  private reveal(): void {
    if (this.revealed) {
      return;
    }

    this.revealed = true;
    this.host.nativeElement.classList.add('reveal--in');
    this.observer.unobserve(this.host.nativeElement);
  }
}
