import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
import { CardDataViewModule } from '../card-data-view/card-data-view.module';

import { SvgModule } from '../svg/svg.module';
import { DataTableModule, VerbenaButtonModule, VerbenaInputModule } from 'verben-ng-ui/src/public-api';
import { OutSideClickDirective } from './data-view-click-outside.directive';
@NgModule({
  declarations:[DataViewComponent],
  imports: [CommonModule,CardDataViewModule,DataTableModule,SvgModule,VerbenaInputModule,VerbenaButtonModule,OutSideClickDirective],
  exports: [DataViewComponent]
})
export class DataViewModule {}
