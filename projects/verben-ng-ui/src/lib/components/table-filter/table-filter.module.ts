import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFilterComponent } from './table-filter.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from '../drop-down/drop-down.module';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';
import { TooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableFilterComponent,
    DropDownModule,
    VerbenaInputModule,
    TooltipModule
  ],
  exports: [TableFilterComponent]
})
export class TableFilterModule {}
