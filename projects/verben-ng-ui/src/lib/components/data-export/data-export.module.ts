import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExportService } from './data-export.service';
import { DataExportComponent } from './data-export.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { CardModule } from 'verben-ng-ui/src/lib/components/card';
import { DropDownModule } from 'verben-ng-ui/src/lib/components/drop-down';
import { TooltipModule } from 'verben-ng-ui/src/lib/components/tooltip';
import { VerbenaInputModule } from 'verben-ng-ui/src/lib/verbena-input';

@NgModule({
  declarations: [DataExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgModule,
    CardModule,
    DropDownModule,
    TooltipModule,
    VerbenaInputModule,
  ],
  providers: [DataExportService],
  exports: [DataExportComponent],
})
export class DataExportModule {}
