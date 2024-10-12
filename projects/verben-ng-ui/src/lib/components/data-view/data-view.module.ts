import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
import { CardDataViewModule } from '../card-data-view/card-data-view.module';
import { DataTableModule } from '../data-table/data-table.module';
import { SvgModule } from '../svg/svg.module';
@NgModule({
  declarations: [DataViewComponent],
  imports: [CommonModule,CardDataViewModule,DataTableModule, SvgModule],
  exports: [DataViewComponent]
})
export class DataViewModule {}
