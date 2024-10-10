import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { SortTableComponent } from './sort-table.component';
@NgModule({
  imports: [FormsModule,CommonModule,SortTableComponent],
  exports: [SortTableComponent]
})
export class SortTableModule {}
