import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertToIntegerDirective } from './convert-to-integer.directive';

@NgModule({
  declarations: [ConvertToIntegerDirective],
  imports: [CommonModule],
  exports: [ConvertToIntegerDirective]
})
export class ConvertToIntegerModule {}
