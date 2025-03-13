import { NgModule } from '@angular/core';
import { EmailValidatorDirective } from './email-validator.directive';

@NgModule({
  declarations: [EmailValidatorDirective],
  exports: [EmailValidatorDirective]
})
export class EmailValidatorModule {}


// import { MaxNumberModule } from 'verbena-ui-peace22/max-number';
// import { MinNumberModule } from 'verbena-ui-peace22/min-number';
// import { RequiredInputModule } from 'verbena-ui-peace22/required-input';
// import { EmailValidatorModule } from 'verbena-ui-peace22/email-validator';
