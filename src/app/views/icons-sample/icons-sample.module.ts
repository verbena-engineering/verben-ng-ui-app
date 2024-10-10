import { NgModule } from '@angular/core';
import { IconsSampleComponent } from './icons-sample.component';
import { CommonModule } from '@angular/common';
import { SvgModule } from 'verben-ng-ui/src/public-api';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: IconsSampleComponent,
  },
];

@NgModule({
  declarations:[IconsSampleComponent],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule,
    SvgModule],
})
export class IconSampleModule {}


