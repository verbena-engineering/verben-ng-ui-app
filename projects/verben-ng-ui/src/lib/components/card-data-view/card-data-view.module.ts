import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDataViewComponent } from './card-data-view.component';

@NgModule({
  declarations:[CardDataViewComponent],
  imports: [ CommonModule],
  exports: [CardDataViewComponent]
})
export class CardDataViewModule {}
