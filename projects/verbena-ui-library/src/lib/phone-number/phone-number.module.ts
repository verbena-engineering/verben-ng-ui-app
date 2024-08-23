import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneNumberDirective } from './phone-number.directive';

@NgModule({
  declarations: [PhoneNumberDirective],
  imports: [CommonModule],
  exports: [PhoneNumberDirective]
})
export class PhoneNumberModule {}
