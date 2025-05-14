import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataImportComponent } from './data-import.component';
import { CardModule } from '../card/card.module';
import { VerbenDialogueModule } from '../verben-dialogue/verben-dialogue.module';
import { DataTableModule } from '../data-table/data-table.module';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from '../svg/svg.module';
import { DropDownModule } from '../drop-down/drop-down.module';

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
