import { NgModule } from '@angular/core';
import { ConvertToNumberDirective } from './convert-to-number.directive';

@NgModule({
  declarations: [ConvertToNumberDirective],
  exports: [ConvertToNumberDirective]
})
export class ConvertToNumberModule {}
