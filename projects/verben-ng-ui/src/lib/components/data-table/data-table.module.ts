import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective } from './column.directive';
import { DataTableComponent } from './data-table.component';

@NgModule({
  declarations: [DataTableComponent, ColumnDirective],
  imports: [CommonModule],
  exports: [DataTableComponent, ColumnDirective],
})
export class DataTableModule {}
