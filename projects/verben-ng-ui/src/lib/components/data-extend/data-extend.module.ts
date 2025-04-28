import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExtendComponent } from './data-extend.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgModule } from '../svg/svg.module';
import { CardModule } from '../card/card.module';
import { DropDownModule } from '../drop-down/drop-down.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';
import { VerbenaSwitchModule } from '../../verbena-switch/verbena-switch.module';
import { ChipModule } from '../chip/chip.module';

@NgModule({
  declarations: [DataExtendComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgModule,
    CardModule,
    DropDownModule,
    TooltipModule,
    VerbenaInputModule,
    VerbenaSwitchModule,
    ChipModule,
  ],
  exports: [DataExtendComponent],
})
export class DataExtendModule {}
