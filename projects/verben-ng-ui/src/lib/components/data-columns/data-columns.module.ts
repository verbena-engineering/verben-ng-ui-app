import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataColumnsComponent } from './data-columns.component';
import { SvgModule } from '../svg/svg.module';
import { CardModule } from '../card/card.module';
import { DropDownModule } from '../drop-down/drop-down.module';
import { TooltipModule } from '../tooltip/tooltip.module';



@NgModule({
  declarations: [DataColumnsComponent],
  imports: [
    CommonModule,
    SvgModule,
    CardModule,
    DropDownModule,
    TooltipModule,
  ],
  exports: [DataColumnsComponent]
})
export class DataColumnsModule { }
