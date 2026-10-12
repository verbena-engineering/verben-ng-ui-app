import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { CardSlotDirective } from './card-slot.directive';

@NgModule({
  declarations: [CardComponent, CardSlotDirective],
  imports: [CommonModule],
  exports: [CardComponent, CardSlotDirective],
})
export class CardModule {}
