import { DestroyRef, Injectable, NgZone, inject } from '@angular/core';

type RevealCallback = (entry: IntersectionObserverEntry) => void;

/**
 * IntersectionObservers compartidos por toda la aplicación, uno por umbral.
 *
 * Crear un observer por elemento sería derrochar memoria con las decenas de
 * piezas que se revelan al hacer scroll; aquí todas se registran en el mismo.
 * El umbral 0 existe para elementos sin área propia (un `<span>` que todavía no
 * tiene texto porque lo va a teclear), que nunca alcanzarían un umbral mayor.
 */
@Injectable({ providedIn: 'root' })
export class RevealObserverService {
  private readonly zone = inject(NgZone);
  private readonly callbacks = new Map<Element, RevealCallback>();
  private readonly observers = new Map<number, IntersectionObserver>();

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      for (const observer of this.observers.values()) {
        observer.disconnect();
      }
      this.observers.clear();
      this.callbacks.clear();
    });
  }

  observe(element: Element, callback: RevealCallback, threshold = 0.2): void {
    const observer = this.observerFor(threshold);

    if (!observer) {
      // Sin soporte de IntersectionObserver mostramos el contenido sin animar.
      callback({ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry);
      return;
    }

    this.callbacks.set(element, callback);
    observer.observe(element);
  }

  unobserve(element: Element): void {
    this.callbacks.delete(element);
    for (const observer of this.observers.values()) {
      observer.unobserve(element);
    }
  }

  private observerFor(threshold: number): IntersectionObserver | null {
    const existing = this.observers.get(threshold);
    if (existing) {
      return existing;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return null;
    }

    const observer = this.zone.runOutsideAngular(
      () =>
        new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const callback = this.callbacks.get(entry.target);
              if (callback) {
                this.zone.run(() => callback(entry));
              }
            }
          },
          { threshold, rootMargin: '0px 0px -6% 0px' },
        ),
    );

    this.observers.set(threshold, observer);
    return observer;
  }
}
