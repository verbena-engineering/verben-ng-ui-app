import { NgModule } from '@angular/core';
import { RequiredInputDirective } from './required-input.directive';

@NgModule({
  declarations: [RequiredInputDirective],
  exports: [RequiredInputDirective]
}) 
export class RequiredInputModule {}
