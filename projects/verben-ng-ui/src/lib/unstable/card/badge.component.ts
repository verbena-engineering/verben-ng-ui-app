import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { VbnTone } from './avatar.component';

/**
 * A soft status pill: <vbn-badge tone="success">Posted</vbn-badge>
 * The tint is mixed from the tone's main color, so it works in light and dark.
 */
@Component({
  selector: 'vbn-badge',
  standalone: true,
  template: '<ng-content></ng-content>',
  styles: [
    `.vbn-badge {
       --_tone: var(--vbn-color-text-muted);
       display: inline-flex; align-items: center; height: 24px; padding: 0 10px;
       border-radius: 999px; white-space: nowrap; font-size: 12.5px; font-weight: 500;
       color: var(--_tone); background: color-mix(in srgb, var(--_tone) 14%, transparent);
     }
     .vbn-badge[data-tone='success'] { --_tone: var(--vbn-color-success); }
     .vbn-badge[data-tone='warning'] { --_tone: var(--vbn-color-warning); }
     .vbn-badge[data-tone='error'] { --_tone: var(--vbn-color-error); }
     .vbn-badge[data-tone='info'] { --_tone: var(--vbn-color-info); }`,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'vbn-badge', '[attr.data-tone]': 'tone' },
})
export class VbnBadgeComponent {
  @Input() tone: VbnTone = 'neutral';
}
