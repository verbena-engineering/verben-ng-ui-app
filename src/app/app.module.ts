import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch  } from '@angular/common/http';
import {

    ConvertToNumberModule,
    EmailValidatorModule,
    NumberRangeModule,
    InputControlModule,
    PhoneNumberModule,
    ButtonModule,
    ThemeSwitcherModule,
    ValidationModule,
    RequiredInputModule,

    DropDownModule,
    ImageModule,
    SvgModule,
    CardModule,
    CardDataViewModule
     } from '../../projects/verben-ng-ui/src/public-api';
import { CDVModule } from './Components/card-data-view/cdv.module';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { HomeComponent } from './home/home.component';
import { ValidateInputModule } from '../../dist/verbena-ui-library';



@NgModule({
  declarations: [
    AppComponent,
    CardDataViewComponent,
    HomeComponent
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

    ImageModule,
    SvgModule,
    CardModule,
    CardDataViewModule,
    ThemeSwitcherModule,
    ButtonModule,
  ],
  providers: [
    provideHttpClient(withFetch())

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
