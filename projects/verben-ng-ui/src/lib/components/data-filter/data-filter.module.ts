import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from '../svg/svg.module';
import { CardModule } from '../card/card.module';
import { DropDownModule } from '../drop-down/drop-down.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';
import { DataFilterComponent } from './data-filter.component';

@NgModule({
  declarations: [DataFilterComponent],
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
  exports: [DataFilterComponent],
})
export class DataFilterModule {}
