import { NgModule } from '@angular/core';
import { ImageComponent } from './image.component';
import { CommonModule } from '@angular/common';
import { VerbenaInputModule } from "../../Verbena-input/verbena-input.module";

@NgModule({
  declarations: [ImageComponent],
  imports: [CommonModule, VerbenaInputModule,CommonModule],
  exports: [ImageComponent],
})
export class ImageModule {}
