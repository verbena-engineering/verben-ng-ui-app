import { NgModule } from '@angular/core';
import { ImageComponent } from './image.component';
import { CommonModule } from '@angular/common';
import { VerbenaInputModule } from 'verben-ng-ui/src/lib/verbena-input';

@NgModule({
  declarations: [ImageComponent],
  imports: [CommonModule, VerbenaInputModule, CommonModule],
  exports: [ImageComponent],
})
export class ImageModule {}
