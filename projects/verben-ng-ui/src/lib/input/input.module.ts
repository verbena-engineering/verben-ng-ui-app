import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputControlDirective } from './input.directive';

@NgModule({
  declarations: [InputControlDirective],
  imports: [CommonModule],
  exports: [InputControlDirective]
})
export class InputControlModule {}
