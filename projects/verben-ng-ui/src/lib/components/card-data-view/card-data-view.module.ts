import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDataViewComponent } from './card-data-view.component';
import { LeftCardDataComponent } from './left-card-data/left-card-data.component';
import { LeftCardDataViewComponent } from './left-card-data-view/left-card-data-view.component';
import { RightCardDataViewComponent } from './right-card-data-view/right-card-data-view.component';

@NgModule({
  declarations:[CardDataViewComponent,LeftCardDataComponent,LeftCardDataViewComponent,RightCardDataViewComponent],
  imports: [ CommonModule],
  exports: [CardDataViewComponent]
})
export class CardDataViewModule {}
