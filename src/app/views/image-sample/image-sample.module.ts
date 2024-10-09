import { NgModule } from '@angular/core';
import { ImageSampleComponent } from './image-sample.component';
import { ImageModule } from 'verben-ng-ui/src/public-api';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations:[ImageSampleComponent],
  imports: [ImageModule,CommonModule],
  exports: [ImageSampleComponent]
})
export class ImageSampleModule {}
