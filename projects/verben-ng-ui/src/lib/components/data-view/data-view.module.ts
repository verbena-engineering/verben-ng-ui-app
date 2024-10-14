import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
import { CardDataViewModule } from '../card-data-view/card-data-view.module';

import { SvgModule } from '../svg/svg.module';
import { DataTableModule } from '../data-table/data-table.module';
import { OutSideClickDirective } from './data-view-click-outside.directive';
import {VerbenaInputModule} from "../../Verbena-input/verbena-input.module"
import {VerbenaButtonModule} from "../../verbena-button/verbena-button.module"
@NgModule({
  declarations:[DataViewComponent],
  imports: [CommonModule,CardDataViewModule,DataTableModule,SvgModule,VerbenaInputModule,VerbenaButtonModule,OutSideClickDirective],
  exports: [DataViewComponent]
})
export class DataViewModule {}
