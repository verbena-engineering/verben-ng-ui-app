import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFilterComponent } from './table-filter.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from '../drop-down/drop-down.module';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableFilterComponent,
    DropDownModule,
    VerbenaInputModule
  ],
  exports: [TableFilterComponent]
})
export class TableFilterModule {}
