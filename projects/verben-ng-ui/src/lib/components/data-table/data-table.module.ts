import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDirective } from './column.directive';
import { DataTableComponent } from './data-table.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [DataTableComponent, ColumnDirective],
  imports: [CommonModule, ScrollingModule],
  exports: [DataTableComponent, ColumnDirective],
})
export class DataTableModule {}
