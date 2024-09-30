import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
<<<<<<< HEAD
import {
  ConvertToNumberModule,
  EmailValidatorModule,
  InputControlModule,
  ButtonModule,
  ThemeSwitcherModule,
  NumberRangeModule,
  PhoneNumberModule,
  RequiredInputModule,
  ValidationModule,
  DropDownModule,


} from '../../projects/verben-ng-ui/src/public-api';
import { ValidateInputModule } from '../../dist/verbena-ui-library';
=======
import { provideHttpClient, withFetch  } from '@angular/common/http';
import {
    ConvertToIntegerModule,
    ConvertToNumberModule,
    EmailValidatorModule,
    NumberRangeModule, 
    PhoneNumberModule, 
    RequiredInputModule, 
    ValidateInputModule,
    DropDownModule,
    ImageModule,
    SvgModule,
    CardModule,
    CardDataViewModule
     } from '../../projects/verben-ng-ui/src/public-api';
import { CDVModule } from './Components/card-data-view/cdv.module';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { HomeComponent } from './home/home.component';
>>>>>>> 43c6618948790334186e069a68ccee2de9d43dc8

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< HEAD
=======
    CardDataViewComponent,
    HomeComponent
>>>>>>> 43c6618948790334186e069a68ccee2de9d43dc8
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NumberRangeModule,
    InputControlModule,
    RequiredInputModule,
    EmailValidatorModule,
    ConvertToNumberModule,
    ValidationModule,
    PhoneNumberModule,
    ValidateInputModule,
    DropDownModule,
<<<<<<< HEAD
    ThemeSwitcherModule,
    ButtonModule,

=======
    ImageModule,
    SvgModule,
    CardModule,
    CardDataViewModule,
  ],
  providers: [
    provideHttpClient(withFetch())
>>>>>>> 43c6618948790334186e069a68ccee2de9d43dc8
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
