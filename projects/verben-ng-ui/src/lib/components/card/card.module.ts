import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';

@NgModule({
  imports: [CardComponent, CommonModule],
  exports: [CardComponent]
})
export class CardModule {}
