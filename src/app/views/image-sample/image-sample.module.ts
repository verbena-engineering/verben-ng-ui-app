import { NgModule } from '@angular/core';
import { ImageSampleComponent } from './image-sample.component';
import { ImageModule } from 'verben-ng-ui/src/public-api';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: ImageSampleComponent,
  },
];


@NgModule({
  declarations:[ImageSampleComponent],
  imports: [
    RouterModule.forChild(appRoutes),
    ImageModule,
    CommonModule
  ],
})
export class ImageSampleModule {}
