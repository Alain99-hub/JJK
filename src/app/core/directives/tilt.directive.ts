import {
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

import { prefersReducedMotion } from '../utils/motion';

/**
 * Inclina la tarjeta siguiendo al puntero y publica su posición como variables
 * CSS (`--mx` / `--my`) para que el brillo la acompañe.
 *
 * Los listeners se registran fuera de la zona de Angular: un `pointermove`
 * dispara decenas de eventos por segundo y ninguno necesita detección de
 * cambios. Sólo se activa en dispositivos con puntero fino.
 */
@Directive({
  selector: '[appTilt]',
})
export class TiltDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  /** Grados máximos de inclinación. */
  readonly strength = input(5, { alias: 'appTilt' });

  private frame = 0;

  constructor() {
    afterNextRender(() => this.attach());

    inject(DestroyRef).onDestroy(() => {
      cancelAnimationFrame(this.frame);
      const element = this.host.nativeElement;
      element.removeEventListener('pointermove', this.onMove);
      element.removeEventListener('pointerleave', this.onLeave);
    });
  }

  private attach(): void {
    const supportsHover =
      typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!supportsHover || prefersReducedMotion()) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const element = this.host.nativeElement;
      element.addEventListener('pointermove', this.onMove, { passive: true });
      element.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  private readonly onMove = (event: PointerEvent): void => {
    cancelAnimationFrame(this.frame);

    this.frame = requestAnimationFrame(() => {
      const element = this.host.nativeElement;
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) {
        return;
      }

      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const strength = this.strength();

      element.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
      element.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
      element.style.setProperty('--tilt-x', `${((0.5 - y) * strength).toFixed(2)}deg`);
      element.style.setProperty('--tilt-y', `${((x - 0.5) * strength).toFixed(2)}deg`);
    });
  };

  private readonly onLeave = (): void => {
    cancelAnimationFrame(this.frame);

    const element = this.host.nativeElement;
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
    element.style.setProperty('--mx', '50%');
    element.style.setProperty('--my', '50%');
  };
}
