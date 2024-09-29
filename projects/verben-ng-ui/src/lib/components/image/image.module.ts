import { NgModule } from '@angular/core';
import { ImageComponent } from './image.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ImageComponent],
  imports:[CommonModule],
  exports: [ImageComponent]
})
export class ImageModule {}