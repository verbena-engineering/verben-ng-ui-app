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
  VerbenTimePickerModule,
  DatePickerModule,
  VerbenDialogueModule,
  VerbenUiModule,
} from 'verben-ng-ui';
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
    // Configure the verben-ng-ui theme once. Every component obeys these tokens;
    // omit forRoot entirely to use the shipped defaults, or override --vbn-*
    // tokens directly in styles. (Also load styles/theme.css — see styles.scss.)
    VerbenUiModule.forRoot({
      color: { primary: '#FFE681' },
      typography: { fontFamily: 'Montserrat, sans-serif' },
    }),
    NumberRangeModule,
    RequiredInputModule,
    VerbenTimePickerModule,
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
    VerbenDialogueModule,
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
