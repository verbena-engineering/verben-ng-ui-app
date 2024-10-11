import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDataViewComponent } from './card-data-view.component';
import { LeftCardDataComponent } from './left-card-data/left-card-data.component';
import { LeftCardDataViewComponent } from './left-card-data-view/left-card-data-view.component';
import { RightCardDataViewComponent } from './right-card-data-view/right-card-data-view.component';
import { CardDataViewFooterComponent } from './card-data-view-footer/card-data-view-footer.component';
import { CardDataViewHeaderComponent } from './card-data-view-header/card-data-view-header.component';
import { SvgModule } from "../svg/svg.module";

@NgModule({
  declarations:[CardDataViewComponent,LeftCardDataComponent,
    LeftCardDataViewComponent,RightCardDataViewComponent,CardDataViewFooterComponent,
    CardDataViewHeaderComponent],
  imports: [CommonModule, SvgModule],
  exports: [CardDataViewComponent,LeftCardDataComponent,
    LeftCardDataViewComponent,RightCardDataViewComponent,CardDataViewFooterComponent,
    CardDataViewHeaderComponent]
})
export class CardDataViewModule {}
