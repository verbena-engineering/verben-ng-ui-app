import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SortTableComponent } from './sort-table.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
@NgModule({
  declarations: [SortTableComponent],
  imports: [FormsModule, CommonModule, CommonModule, FormsModule, SvgModule],
  exports: [SortTableComponent],
})
export class SortTableModule {}
