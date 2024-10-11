import { NgModule } from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { SvgModule } from '../svg/svg.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations:[TooltipComponent],
  imports: [SvgModule,CommonModule],
  exports: [TooltipComponent]
})
export class TooltipModule {}
