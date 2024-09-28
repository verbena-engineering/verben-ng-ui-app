import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
    
    ConvertToNumberModule,
    EmailValidatorModule,
    BadgeModule,
    ButtonModule,
    ThemeSwitcherModule,
    NumberRangeModule,
    PhoneNumberModule,
    RequiredInputModule,
    ValidationModule,DropDownModule } from '../../projects/verben-ng-ui/src/public-api';
import { ValidateInputModule } from '../../dist/verbena-ui-library';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      NumberRangeModule,
    RequiredInputModule,
    EmailValidatorModule,
    ConvertToNumberModule,
    ValidationModule,

    PhoneNumberModule,
    ValidateInputModule,
    DropDownModule,
    ThemeSwitcherModule,
    ButtonModule,
    BadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
