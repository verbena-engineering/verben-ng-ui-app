import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CardDataViewComponent } from './views/card-data-view/cdv.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsSampleComponent } from './views/notifications-sample/notifications-sample.component';
import { ImageSampleComponent } from './views/image-sample/image-sample.component';


import {
    ConvertToIntegerModule,
    ConvertToNumberModule,
    EmailValidatorModule,
    NumberRangeModule,
    PhoneNumberModule,
    RequiredInputModule,
    ValidateInputModule,
    DropDownModule,
    SvgModule,
    CardModule,
    CardDataViewModule,
    ValidationModule,
    ButtonModule,
    VerbenaButtonModule,
    VerbenaBadgeModule,
    VerbenaInputModule,
    ChipModule,
    TableFilterModule,
    VerbenaTextareaModule,
    VerbenaSwitchModule,
    NotificationModule
     } from '../../projects/verben-ng-ui/src/public-api';

@NgModule({
  declarations: [AppComponent, HomeComponent,CardDataViewComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NumberRangeModule,
    RequiredInputModule,
    EmailValidatorModule,
    ConvertToNumberModule,
    ConvertToIntegerModule,
    PhoneNumberModule,
    ValidationModule,
    ButtonModule,
    VerbenaBadgeModule,
    ValidateInputModule,
    VerbenaInputModule,
    VerbenaButtonModule,
    SvgModule,
    TableFilterModule,
    CardModule,
    VerbenaTextareaModule,
    CardDataViewModule,
    VerbenaSwitchModule,
    NotificationModule,

],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
