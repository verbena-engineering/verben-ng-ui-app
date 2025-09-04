import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataImportComponent } from './data-import.component';
import { CardModule } from 'verben-ng-ui/src/lib/components/card';
import { VerbenDialogueModule } from 'verben-ng-ui/src/lib/components/verben-dialogue';
import { DataTableModule } from 'verben-ng-ui/src/lib/components/data-table';
import { VerbenaInputModule } from 'verben-ng-ui/src/lib/verbena-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { DropDownModule } from 'verben-ng-ui/src/lib/components/drop-down';

@NgModule({
  declarations: [DataImportComponent],
  imports: [
    CommonModule,
    CardModule,
    VerbenDialogueModule,
    DataTableModule,
    VerbenaInputModule,
    DropDownModule,
    ReactiveFormsModule,
    FormsModule,
    SvgModule,
  ],
  exports: [DataImportComponent],
})
export class DataImportModule {}
