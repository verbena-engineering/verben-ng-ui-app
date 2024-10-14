import { NgModule } from '@angular/core';
import { TooltipSampleComponent } from './tooltip-sample.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../../../../projects/verben-ng-ui/src/lib/components/tooltip/tooltip.module';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: TooltipSampleComponent,
  },
];

@NgModule({
 declarations:[TooltipSampleComponent],
  imports: [
    RouterModule.forChild(appRoutes),
    TooltipModule,
    CommonModule
  ],
})
export class TooltipSampleModule {}
