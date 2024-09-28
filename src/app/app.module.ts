import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch  } from '@angular/common/http';

import {
    
   
    EmailValidatorModule,
    BadgeModule,
    ButtonModule,
    ThemeSwitcherModule,
    NumberRangeModule,
    PhoneNumberModule,
    RequiredInputModule,
    ValidationModule,DropDownModule,SvgModule,    ImageModule, DropDownModule } from '../../projects/verben-ng-ui/src/public-api';



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
  
    ValidationModule,

    PhoneNumberModule,
     ValidationModule,
    DropDownModule,
    ThemeSwitcherModule,
    ButtonModule,
    BadgeModule
    ImageModule,
    SvgModule,
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
