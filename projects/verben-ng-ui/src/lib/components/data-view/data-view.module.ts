import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
import { CardDataViewModule } from '../card-data-view/card-data-view.module';
import { DataTableModule } from '../data-table';
@NgModule({
  imports: [CommonModule,DataViewComponent,CardDataViewModule,DataTableModule],
  exports: [DataViewComponent]
})
export class DataViewModule {}
