import { NgModule } from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TooltipComponent],
  imports: [SvgModule, CommonModule],
  exports: [TooltipComponent],
})
export class TooltipModule {}
