import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgModule } from '../svg/svg.module';
import { CardModule } from '../card/card.module';
import { DropDownModule } from '../drop-down/drop-down.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { DataSortComponent } from './data-sort.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DataSortComponent],
  imports: [
    CommonModule,
    SvgModule,
    CardModule,
    DropDownModule,
    TooltipModule,
    FormsModule,
  ],
  exports: [DataSortComponent],
})
export class DataSortModule {}
