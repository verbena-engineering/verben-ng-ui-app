import { NgModule } from '@angular/core';
import { VbnAvatarComponent } from './avatar.component';
import { VbnBadgeComponent } from './badge.component';
import { VbnCardComponent, VbnCardHeaderComponent } from './card.component';
import {
  VbnCardActionComponent,
  VbnCardContentComponent,
  VbnCardDescriptionComponent,
  VbnCardDividerComponent,
  VbnCardFooterComponent,
  VbnCardMediaDirective,
  VbnCardTitleComponent,
} from './card-parts';
import { VbnAmountComponent, VbnStatComponent } from './stat-amount.components';

/** Every card part, for standalone components: `imports: [...VBN_CARD]` */
export const VBN_CARD = [
  VbnCardComponent,
  VbnCardHeaderComponent,
  VbnCardTitleComponent,
  VbnCardDescriptionComponent,
  VbnCardActionComponent,
  VbnCardContentComponent,
  VbnCardFooterComponent,
  VbnCardDividerComponent,
  VbnCardMediaDirective,
  VbnAvatarComponent,
  VbnStatComponent,
  VbnAmountComponent,
  VbnBadgeComponent,
] as const;

/**
 * ⚠️ UNSTABLE — the composable card, under team review.
 * The name says so on purpose: importing it is an explicit opt-in.
 * When promoted it will be renamed (e.g. VbnCardModule); the tags stay the same.
 */
@NgModule({
  imports: [...VBN_CARD],
  exports: [...VBN_CARD],
})
export class UnstableCardModule {}
