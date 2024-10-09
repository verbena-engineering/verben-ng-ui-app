import { NgModule } from '@angular/core';
import { ValidateDirective } from './validate.directive';
import { ErrorMessageService } from './error-message.service';

@NgModule({
  declarations: [
    ValidateDirective
  ],
  providers: [
    ErrorMessageService
  ],
  exports: [
    ValidateDirective
  ]
})
export class ValidationModule { }
