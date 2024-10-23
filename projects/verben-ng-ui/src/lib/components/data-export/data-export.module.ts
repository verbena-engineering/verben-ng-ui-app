import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExportService } from './data-export.service';
import { DataExportComponent } from './data-export.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from '../svg/svg.module';
import { CardModule } from '../card/card.module';
import { DropDownModule } from '../drop-down/drop-down.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';

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
