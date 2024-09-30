import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaInputDirective } from './verbena-input.directive';

@NgModule({
  declarations: [VerbenaInputDirective],
  imports: [CommonModule],
  exports: [VerbenaInputDirective] // Exporting the directive
})
export class VerbenaInputModule {}
