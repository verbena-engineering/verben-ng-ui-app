import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataTableRoutingModule } from './data-table-routing.module';
import { DataTableComponent } from './data-table.component';
import { DataTableModule as LibDataTableModule } from '../../../../projects/verben-ng-ui/src/lib/components/data-table/data-table.module';
import { DataExportModule, DataExportService } from 'verben-ng-ui/src/public-api';

@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    DataTableRoutingModule,
    LibDataTableModule,
    FormsModule,
    DataExportModule,
  ],
  providers: [DataExportService]
})
export class DataTableModule {}
