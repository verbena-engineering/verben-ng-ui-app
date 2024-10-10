import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsSampleComponent } from './views/notifications-sample/notifications-sample.component';
import { ImageSampleComponent } from './views/image-sample/image-sample.component';
import { QuillModule } from 'ngx-quill';

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
  ButtonModule,
  VerbenaButtonModule,
  VerbenaBadgeModule,
  VerbenaInputModule,
  TableFilterModule,
  VerbenaTextareaModule,
  VerbenaSwitchModule,
  NotificationModule,
  SortTableModule,
  VisibleColumnModule,
  DataViewModule,
  VerbenaMailTemplateModule,
  DataTableModule,
} from '../../projects/verben-ng-ui/src/public-api';

@NgModule({
  declarations: [AppComponent, CardDataViewComponent, HomeComponent],
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
    SortTableModule,
    VisibleColumnModule,
    DataViewModule,
    VerbenaMailTemplateModule,
    DataTableModule,
    QuillModule.forRoot() 

],
  providers: [provideHttpClient(withFetch()),  NotificationModule,
    ImageSampleComponent,
    NotificationsSampleComponent,],
  bootstrap: [AppComponent],
})
export class AppModule {}
