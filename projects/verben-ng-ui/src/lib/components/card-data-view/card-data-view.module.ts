import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDataViewComponent } from './card-data-view.component';
import { LeftCardDataComponent } from './left-card-data/left-card-data.component';
import { LeftCardDataViewComponent } from './left-card-data-view/left-card-data-view.component';
import { RightCardDataViewComponent } from './right-card-data-view/right-card-data-view.component';
import { CardDataViewFooterComponent } from './card-data-view-footer/card-data-view-footer.component';
import { CardDataViewHeaderComponent } from './card-data-view-header/card-data-view-header.component';
import { CardHoverActionsComponent } from './card-hover-actions/card-hover-actions.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [
    CardDataViewComponent,
    LeftCardDataComponent,
    LeftCardDataViewComponent,
    RightCardDataViewComponent,
    CardDataViewFooterComponent,
    CardDataViewHeaderComponent,
    CardHoverActionsComponent,
  ],
  imports: [CommonModule, SvgModule, ScrollingModule],
  exports: [
    CardDataViewComponent,
    LeftCardDataComponent,
    LeftCardDataViewComponent,
    RightCardDataViewComponent,
    CardDataViewFooterComponent,
    CardDataViewHeaderComponent,
    CardHoverActionsComponent,
  ],
})
export class CardDataViewModule {}
