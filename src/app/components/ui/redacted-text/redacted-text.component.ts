import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { injectVisibility } from '../../../core/utils/visibility';

/**
 * Texto tachado por una barra de censura que se retira al entrar en pantalla.
 *
 * El texto real siempre está en el DOM, así que los lectores de pantalla lo
 * anuncian sin depender de la animación.
 */
@Component({
  selector: 'app-redacted-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './redacted-text.component.html',
  styleUrl: './redacted-text.component.scss',
  host: {
    '[style.--redact-delay]': 'delayCss()',
  },
})
export class RedactedTextComponent {
  readonly text = input.required<string>();
  /** Retardo antes de desclasificar, en ms. */
  readonly delay = input(0);

  private readonly visible = injectVisibility(0.35);

  protected readonly open = computed(() => this.visible());
  protected readonly delayCss = computed(() => `${this.delay()}ms`);
}
