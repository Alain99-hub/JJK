import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';

import { AudioService } from '../../core/services/audio.service';
import { ExperienceService } from '../../core/services/experience.service';
import { clamp } from '../../core/utils/motion';
import { DOSSIER } from '../../data/dossier.data';
import { Phase } from '../../models/phase.model';

/**
 * Barra fija de la interfaz de inteligencia.
 *
 * Muestra el identificador del expediente, el raíl de fases (que además navega)
 * y el interruptor de sonido. El progreso de lectura se escribe directamente
 * como variable CSS para no provocar detección de cambios en cada scroll.
 */
@Component({
  selector: 'app-classified-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './classified-header.component.html',
  styleUrl: './classified-header.component.scss',
})
export class ClassifiedHeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  protected readonly experience = inject(ExperienceService);
  protected readonly audio = inject(AudioService);
  protected readonly dossier = DOSSIER;

  protected readonly activePhase = computed<Phase>(
    () => this.experience.phases[this.experience.activePhaseIndex()],
  );

  private frame = 0;

  constructor() {
    afterNextRender(() => this.trackProgress());

    inject(DestroyRef).onDestroy(() => {
      cancelAnimationFrame(this.frame);
      this.document.defaultView?.removeEventListener('scroll', this.onScroll);
    });
  }

  protected goToPhase(phase: Phase): void {
    this.audio.play('tick');
    this.document.getElementById(phase.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected isReached(index: number): boolean {
    return index <= this.experience.activePhaseIndex();
  }

  private trackProgress(): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      view.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  private readonly onScroll = (): void => {
    cancelAnimationFrame(this.frame);

    this.frame = requestAnimationFrame(() => {
      const element = this.document.documentElement;
      const scrollable = element.scrollHeight - element.clientHeight;
      const ratio = scrollable > 0 ? clamp(element.scrollTop / scrollable) : 0;

      this.host.nativeElement.style.setProperty('--read-progress', `${(ratio * 100).toFixed(2)}%`);
    });
  };
}
