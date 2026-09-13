import {
  DestroyRef,
  ElementRef,
  Signal,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

import { RevealObserverService } from '../services/reveal-observer.service';

/**
 * Señal que pasa a `true` la primera vez que el componente entra en pantalla.
 *
 * Debe llamarse en contexto de inyección (inicializador de campo o constructor).
 *
 * @example
 * ```ts
 * protected readonly visible = injectVisibility();
 * ```
 */
export function injectVisibility(threshold = 0.2): Signal<boolean> {
  const host = inject<ElementRef<HTMLElement>>(ElementRef);
  const observer = inject(RevealObserverService);
  const visible = signal(false);

  afterNextRender(() => {
    const element = host.nativeElement;
    observer.observe(
      element,
      (entry) => {
        if (entry.isIntersecting) {
          visible.set(true);
          observer.unobserve(element);
        }
      },
      threshold,
    );
  });

  inject(DestroyRef).onDestroy(() => observer.unobserve(host.nativeElement));

  return visible.asReadonly();
}
