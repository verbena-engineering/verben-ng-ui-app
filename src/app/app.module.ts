import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ConvertToIntegerModule,
  ConvertToNumberModule,
  EmailValidatorModule,
  NumberRangeModule,
  PhoneNumberModule,
  RequiredInputModule,
  ValidateInputModule,
  SvgModule,
  CardModule,
  CardDataViewModule,
  ValidationModule,
  VerbenaButtonModule,
  VerbenaBadgeModule,
  VerbenaInputModule,
  VerbenaTextareaModule,
  VerbenaSwitchModule,
  NotificationModule,
  SortTableModule,
  VisibleColumnModule,
  DataViewModule,
  VerbenaMailTemplateModule,
  DataTableModule,
  DatePickerModule,
  VerbenDialogueModule,
} from '../../projects/verben-ng-ui/src/public-api';
import { CDVModule } from './views/card-data-view/cdv.module';
import { CommonModule } from '@angular/common';
import { CardViewModule } from './views/card-view/card-view.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NumberRangeModule,
    RequiredInputModule,
    EmailValidatorModule,
    ConvertToNumberModule,
    ConvertToIntegerModule,
    PhoneNumberModule,
    ValidationModule,
    NotificationModule,
    VerbenaBadgeModule,
    ValidateInputModule,
    VerbenaInputModule,
    VerbenaButtonModule,
    SvgModule,
    CardModule,
    VerbenaTextareaModule,
    CardDataViewModule,
    VerbenaSwitchModule,
    SortTableModule,
    VisibleColumnModule,
    DataViewModule,
    VerbenaMailTemplateModule,
    DataTableModule,
    CDVModule,
    CardViewModule,
    DatePickerModule,
    VerbenDialogueModule
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
