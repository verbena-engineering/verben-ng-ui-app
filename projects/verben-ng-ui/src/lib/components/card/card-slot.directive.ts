import { Directive, HostAttributeToken, inject } from '@angular/core';

/**
 * Lets <verben-card> see which of its slots you filled (it adds nothing to
 * your element). The card uses it to show the corner only when there is
 * something in it, and to float the corner over card-media when there is no
 * header:
 *   <button card-actions class="card-action" (click)="pin()">…</button>
 */
@Directive({ selector: '[card-header], [card-media], [card-actions]' })
export class CardSlotDirective {
  readonly slot: 'header' | 'media' | 'actions' =
    inject(new HostAttributeToken('card-actions'), { optional: true }) !== null
      ? 'actions'
      : inject(new HostAttributeToken('card-media'), { optional: true }) !== null
        ? 'media'
        : 'header';
}
