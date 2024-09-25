import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  ConvertToIntegerModule,
  ConvertToNumberModule,
  EmailValidatorModule,
  NumberRangeModule,
  PhoneNumberModule,
  RequiredInputModule,
  ValidateInputModule,
  DropDownModule,
} from '../../projects/verben-ng-ui/src/public-api';
import { DropdownSampleComponent } from './views/dropdown-sample/dropdown-sample.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, DropdownSampleComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NumberRangeModule,
    RequiredInputModule,
    EmailValidatorModule,
    ConvertToNumberModule,
    ConvertToIntegerModule,
    PhoneNumberModule,
    ValidateInputModule,
    DropDownModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
