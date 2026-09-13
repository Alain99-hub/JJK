import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  effect,
  inject,
  viewChildren,
} from '@angular/core';

import { BirthdayCardComponent } from '../../components/birthday-card/birthday-card.component';
import { ClassifiedHeaderComponent } from '../../components/classified-header/classified-header.component';
import { CursedTechniquesComponent } from '../../components/cursed-techniques/cursed-techniques.component';
import { DomainExpansionComponent } from '../../components/domain-expansion/domain-expansion.component';
import { DomainOpeningComponent } from '../../components/domain-opening/domain-opening.component';
import { EmotionalDamageComponent } from '../../components/emotional-damage/emotional-damage.component';
import { FinalVerdictComponent } from '../../components/final-verdict/final-verdict.component';
import { IncidentTimelineComponent } from '../../components/incident-timeline/incident-timeline.component';
import { IntroComponent } from '../../components/intro/intro.component';
import { ThreatProfileComponent } from '../../components/threat-profile/threat-profile.component';
import { ExperienceService } from '../../core/services/experience.service';
import { DEPARTMENT, DOSSIER, PHASES } from '../../data/dossier.data';

/**
 * Página única de la experiencia.
 *
 * Monta la pantalla de bloqueo por encima del expediente y vigila qué fase está
 * en el centro del viewport para actualizar el raíl de la cabecera y la
 * temperatura de color.
 */
@Component({
  selector: 'app-expediente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BirthdayCardComponent,
    DomainOpeningComponent,
    IntroComponent,
    ClassifiedHeaderComponent,
    ThreatProfileComponent,
    IncidentTimelineComponent,
    CursedTechniquesComponent,
    EmotionalDamageComponent,
    DomainExpansionComponent,
    FinalVerdictComponent,
  ],
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.scss',
})
export class ExpedienteComponent {
  private readonly zone = inject(NgZone);

  protected readonly experience = inject(ExperienceService);
  protected readonly dossier = DOSSIER;
  protected readonly department = DEPARTMENT;

  /** Las fases sólo existen tras abrir el expediente, y vuelven a crearse al reiniciar. */
  private readonly sections = viewChildren('phase', { read: ElementRef<HTMLElement> });

  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const sections = this.sections();
      const observer = this.ensureObserver();

      if (!observer) {
        return;
      }

      for (const section of sections) {
        observer.observe(section.nativeElement);
      }
    });

    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  /**
   * Observer que marca como activa la fase que cruza la franja central de la
   * pantalla: el `rootMargin` recorta el viewport a esa franja, así que sólo
   * una fase puede estar activa a la vez.
   */
  private ensureObserver(): IntersectionObserver | undefined {
    if (this.observer || typeof IntersectionObserver === 'undefined') {
      return this.observer;
    }

    this.observer = this.zone.runOutsideAngular(
      () =>
        new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) {
                continue;
              }

              const id = (entry.target as HTMLElement).dataset['phaseId'];
              const phase = PHASES.find((candidate) => candidate.id === id);

              if (phase) {
                this.zone.run(() => this.experience.setActivePhase(phase));
              }
            }
          },
          { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
        ),
    );

    return this.observer;
  }
}
