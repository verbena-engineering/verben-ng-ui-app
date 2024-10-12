import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { SortTableComponent } from './sort-table.component';
import { SvgModule } from '../svg/svg.module';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';
@NgModule({
  declarations:[SortTableComponent],
  imports: [FormsModule,CommonModule,CommonModule, FormsModule, SvgModule, VerbenaInputModule],
  exports: [SortTableComponent]
})
export class SortTableModule {}
