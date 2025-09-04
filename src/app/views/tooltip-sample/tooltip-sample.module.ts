import { NgModule } from '@angular/core';
import { TooltipSampleComponent } from './tooltip-sample.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'verben-ng-ui';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: TooltipSampleComponent,
  },
];

@NgModule({
  declarations: [TooltipSampleComponent],
  imports: [RouterModule.forChild(appRoutes), TooltipModule, CommonModule],
})
export class TooltipSampleModule {}
