import { NgModule } from '@angular/core';
import { ValidateInputDirective } from './validate-input.directive';

@NgModule({
  declarations: [ValidateInputDirective],
  exports: [ValidateInputDirective]
})
export class ValidateInputModule {}
