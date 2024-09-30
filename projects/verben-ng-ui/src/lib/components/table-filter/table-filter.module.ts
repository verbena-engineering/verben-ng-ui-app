import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFilterComponent } from './table-filter.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from '../drop-down/drop-down.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableFilterComponent ,
    DropDownModule
  ],
  exports: [TableFilterComponent]
})
export class TableFilterModule {}
