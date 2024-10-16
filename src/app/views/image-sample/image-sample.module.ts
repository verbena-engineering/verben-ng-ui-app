import { NgModule } from '@angular/core';
import { ImageSampleComponent } from './image-sample.component';
import { ImageModule } from '../../../../projects/verben-ng-ui/src/lib/components/image/image.module';
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
