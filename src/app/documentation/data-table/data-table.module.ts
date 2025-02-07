import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTableRoutingModule } from './data-table-routing.module';
import { DataTableComponent } from './data-table.component';
// import { DataTableModule as LibDataTableModule } from '../../../../projects/verben-ng-ui/src/lib/components/data-table/data-table.module';
import {
  DataTableModule as LibDataTableModule,
  CardModule,
  DataExportModule,
  DataExportService,
  DropDownModule,
  SvgModule,
  TooltipModule,
  VerbenaInputModule,
  VerbenaTextareaModule,
} from 'verben-ng-ui/src/public-api';
import { TableExportComponent } from './table-export/table-export.component';
import { DataFilterModule, DataXportModule, DataSortModule } from 'verben-ng-ui';

@NgModule({
  declarations: [DataTableComponent, TableExportComponent],
  imports: [
    CommonModule,
    DataTableRoutingModule,
    LibDataTableModule,
    FormsModule,
    ReactiveFormsModule,
    DataExportModule,
    DataXportModule,
    DataFilterModule,
    DataSortModule,
    DropDownModule,
    VerbenaInputModule,
    CardModule,
    SvgModule,
    TooltipModule,
    VerbenaTextareaModule,
  ],
  exports: [DataTableComponent],
  providers: [DataExportService],
})
export class DataTableModule {}
