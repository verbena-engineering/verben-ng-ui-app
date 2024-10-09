import { NgModule } from '@angular/core';
import { TooltipSampleComponent } from './tooltip-sample.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../../../../projects/verben-ng-ui/src/lib/components/tooltip/tooltip.module';

@NgModule({
 declarations:[TooltipSampleComponent],
  imports: [TooltipModule,CommonModule],
  exports: [TooltipSampleComponent]
})
export class TooltipSampleModule {}
