import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgModule } from '../svg/svg.module';
import { CardModule } from '../card/card.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { DataSortComponent } from './data-sort.component';

@NgModule({
  declarations: [DataSortComponent],
  imports: [
    CommonModule,
    SvgModule,
    CardModule,
    TooltipModule,
  ],
  exports: [DataSortComponent],
})
export class DataSortModule {}
