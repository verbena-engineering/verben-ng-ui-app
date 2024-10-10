import { ThemeSwitcherModule } from './../../projects/verben-ng-ui/src/lib/theme-switcher/theme-switcher.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
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

  VerbenaButtonModule,
  VerbenaBadgeModule,
  VerbenaInputModule,


  VerbenaTextareaModule,
  VerbenaSwitchModule,

} from '../../projects/verben-ng-ui/src/public-api';

import { CDVModule } from './views/card-data-view/cdv.module';
import { CardDataViewComponent } from './views/card-data-view/cdv.component';

import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { NotificationsSampleComponent } from './views/notifications-sample/notifications-sample.component';
import { TableFilterSampleComponent } from './views/table-filter-sample/table-filter-sample.component';
import { TooltipSampleComponent } from './views/tooltip-sample/tooltip-sample.component';
import { ImageSampleComponent } from './views/image-sample/image-sample.component';


@NgModule({
  declarations: [AppComponent, CardDataViewComponent, HomeComponent],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NumberRangeModule,
    RequiredInputModule,
    EmailValidatorModule,
    ConvertToNumberModule,
    ConvertToIntegerModule,
    PhoneNumberModule,
    ValidationModule,

    VerbenaBadgeModule,
    ValidateInputModule,
    VerbenaInputModule,
    VerbenaButtonModule,
    SvgModule,

    CardModule,
    VerbenaTextareaModule,
    CardDataViewModule,
    VerbenaSwitchModule,

  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
