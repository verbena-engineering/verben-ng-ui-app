import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataViewComponentRoutingModule } from './data-view-routing.module';
import { DataViewComponent  } from './data-view.component';
import {CardDataViewModule,DataViewModule, SortTableModule, SvgModule, TableFilterModule, VerbenaButtonModule, VisibleColumnModule, DataTableModule } from 'verben-ng-ui/src/public-api';



@NgModule({
  declarations:[DataViewComponent],
  imports: [CommonModule, DataViewComponentRoutingModule, DataViewModule, FormsModule,DataTableModule,CardDataViewModule,SvgModule,SortTableModule,VisibleColumnModule,TableFilterModule, VerbenaButtonModule],
  exports:[DataViewComponent]
})
export class AppDataViewModule {}
