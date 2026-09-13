import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';

import { AudioService } from '../../../core/services/audio.service';
import { injectVisibility } from '../../../core/utils/visibility';

/** Sello de caucho que se estampa sobre el documento al entrar en pantalla. */
@Component({
  selector: 'app-stamp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stamp.component.html',
  styleUrl: './stamp.component.scss',
})
export class StampComponent {
  private readonly audio = inject(AudioService);

  readonly label = input.required<string>();
  readonly sub = input<string | null>(null);
  /** `resolved` usa la paleta cálida del cierre; `alert` la roja del informe. */
  readonly tone = input<'resolved' | 'alert'>('resolved');

  protected readonly visible = injectVisibility(0.4);

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.audio.play('stamp');
      }
    });
  }
}
