import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaTextAreaDirective } from './textarea.directive';

@NgModule({
  declarations: [VerbenaTextAreaDirective],
  imports: [CommonModule],
  exports: [VerbenaTextAreaDirective]
})
export class VerbenaTextAreaModule {}
