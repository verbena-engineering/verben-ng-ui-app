import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlOptionsDirective } from './control-options.directive';

@NgModule({
  declarations: [ControlOptionsDirective],
  imports: [CommonModule],
  exports: [ControlOptionsDirective]
})
export class ControlOptionsModule {}
