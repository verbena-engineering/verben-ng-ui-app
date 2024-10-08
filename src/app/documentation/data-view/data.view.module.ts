import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataViewComponentRoutingModule } from './data-view-routing.module';
import { DataViewComponent  } from './data-view.component';
import {CardDataViewModule, DataTableComponent, DataViewModule, SvgModule } from 'verben-ng-ui/src/public-api';
import { DataTableModule } from '../data-table/data-table.module';


@NgModule({
  declarations:[DataViewComponent],
  imports: [CommonModule, DataViewComponentRoutingModule, DataViewModule, FormsModule,DataTableModule,CardDataViewModule,SvgModule],
  exports:[DataViewComponent]
})
export class AppDataViewModule {}
