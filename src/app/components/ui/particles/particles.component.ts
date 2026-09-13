import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { prefersReducedMotion } from '../../../core/utils/motion';

interface Mote {
  x: number;
  y: number;
  radius: number;
  drift: number;
  rise: number;
  alpha: number;
  phase: number;
  heart: boolean;
  tint: string;
}

const TINTS = ['233, 194, 124', '232, 120, 143', '255, 243, 230'] as const;

/**
 * Motas de luz cálidas que acompañan al veredicto final.
 *
 * Discretas a propósito: unas pocas partículas a la deriva y algún corazón
 * diminuto entre ellas, nada de lluvia de emojis. El bucle vive fuera de la
 * zona de Angular y se detiene solo cuando la sección no está activa.
 */
@Component({
  selector: 'app-particles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #surface aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: block;
    }

    canvas {
      width: 100%;
      height: 100%;
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        display: none;
      }
    }
  `,
})
export class ParticlesComponent {
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** El lienzo sólo se anima mientras esté activo. */
  readonly active = input(false);
  readonly count = input(34);

  private readonly surface = viewChild.required<ElementRef<HTMLCanvasElement>>('surface');

  private motes: Mote[] = [];
  private frame = 0;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      if (this.active() && !prefersReducedMotion()) {
        this.start();
      } else {
        this.stop();
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.stop();
      this.resizeObserver?.disconnect();
    });
  }

  private start(): void {
    if (this.frame) {
      return;
    }

    const canvas = this.surface().nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    this.resize(canvas);
    this.seed();

    if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.resize(canvas);
        this.seed();
      });
      this.resizeObserver.observe(this.host.nativeElement);
    }

    this.zone.runOutsideAngular(() => {
      const render = () => {
        this.draw(context);
        this.frame = requestAnimationFrame(render);
      };
      this.frame = requestAnimationFrame(render);
    });
  }

  private stop(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private resize(canvas: HTMLCanvasElement): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = this.host.nativeElement.getBoundingClientRect();

    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));

    const context = canvas.getContext('2d');
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  private seed(): void {
    const { width, height } = this.host.nativeElement.getBoundingClientRect();
    if (!width || !height) {
      return;
    }

    const total = Math.round(this.count() * Math.min(1, width / 900 + 0.35));

    this.motes = Array.from({ length: total }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 2.2,
      drift: (Math.random() - 0.5) * 0.14,
      rise: 0.09 + Math.random() * 0.26,
      alpha: 0.18 + Math.random() * 0.42,
      phase: Math.random() * Math.PI * 2,
      // Sólo uno de cada siete es un corazón, y minúsculo.
      heart: index % 7 === 3,
      tint: TINTS[index % TINTS.length],
    }));
  }

  private draw(context: CanvasRenderingContext2D): void {
    const { width, height } = this.host.nativeElement.getBoundingClientRect();
    if (!width || !height) {
      return;
    }

    context.clearRect(0, 0, width, height);

    for (const mote of this.motes) {
      mote.y -= mote.rise;
      mote.phase += 0.012;
      mote.x += mote.drift + Math.sin(mote.phase) * 0.18;

      if (mote.y < -12) {
        mote.y = height + 12;
        mote.x = Math.random() * width;
      }
      if (mote.x < -12) {
        mote.x = width + 12;
      } else if (mote.x > width + 12) {
        mote.x = -12;
      }

      const twinkle = 0.65 + Math.sin(mote.phase * 1.6) * 0.35;
      const alpha = mote.alpha * twinkle;

      if (mote.heart) {
        this.drawHeart(context, mote, alpha);
      } else {
        this.drawMote(context, mote, alpha);
      }
    }
  }

  private drawMote(context: CanvasRenderingContext2D, mote: Mote, alpha: number): void {
    const glow = context.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, mote.radius * 4);
    glow.addColorStop(0, `rgba(${mote.tint}, ${alpha})`);
    glow.addColorStop(1, `rgba(${mote.tint}, 0)`);

    context.fillStyle = glow;
    context.beginPath();
    context.arc(mote.x, mote.y, mote.radius * 4, 0, Math.PI * 2);
    context.fill();
  }

  private drawHeart(context: CanvasRenderingContext2D, mote: Mote, alpha: number): void {
    const size = mote.radius * 1.9;

    context.save();
    context.translate(mote.x, mote.y);
    context.rotate(Math.sin(mote.phase) * 0.18);
    context.fillStyle = `rgba(232, 120, 143, ${alpha * 0.75})`;

    context.beginPath();
    context.moveTo(0, size * 0.85);
    context.bezierCurveTo(-size * 1.5, -size * 0.2, -size * 0.5, -size * 1.2, 0, -size * 0.35);
    context.bezierCurveTo(size * 0.5, -size * 1.2, size * 1.5, -size * 0.2, 0, size * 0.85);
    context.closePath();
    context.fill();
    context.restore();
  }
}
