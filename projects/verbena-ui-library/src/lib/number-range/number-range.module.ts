import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberRangeDirective } from './number-range.directive';

@NgModule({
  declarations: [NumberRangeDirective],
  imports: [CommonModule],
  exports: [NumberRangeDirective]
})
export class NumberRangeModule {}

