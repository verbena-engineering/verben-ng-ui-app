import { ThemeSwitcherModule } from './../../projects/verben-ng-ui/src/lib/theme-switcher/theme-switcher.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
<<<<<<< HEAD
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
    CardDataViewModule,
    ValidationModule,

    VerbenaButtonModule,
    VerbenaBadgeModule,
    VerbenaInputModule,
    ChipModule,
    TableFilterModule,
    VerbenaTextareaModule,
    VerbenaSwitchModule,
    TooltipModule

     } from '../../projects/verben-ng-ui/src/public-api';
=======
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
  NotificationModule,
} from '../../projects/verben-ng-ui/src/public-api';
>>>>>>> 1935064e4fe0428690a5ce9566fa3f9e86e124eb
import { CDVModule } from './Components/card-data-view/cdv.module';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { NotificationsSampleComponent } from './views/notifications-sample/notifications-sample.component';
import { TableFilterSampleComponent } from './views/table-filter-sample/table-filter-sample.component';
import { TooltipSampleComponent } from './views/tooltip-sample/tooltip-sample.component';
import { ImageSampleComponent } from './views/image-sample/image-sample.component';


@NgModule({
<<<<<<< HEAD
  declarations: [
    AppComponent,
    CardDataViewComponent,
    HomeComponent,
    DropdownSampleComponent,
  
  ],
=======
  declarations: [AppComponent, CardDataViewComponent, HomeComponent],
>>>>>>> 1935064e4fe0428690a5ce9566fa3f9e86e124eb
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
    TableFilterModule,
    CardModule,
    VerbenaTextareaModule,
    CardDataViewModule,
    VerbenaSwitchModule,
<<<<<<< HEAD
    TooltipModule


],
  providers: [
    provideHttpClient(withFetch())
=======
    NotificationModule,
    ImageSampleComponent,
    NotificationsSampleComponent,
    // TableFilterSampleComponent,
    // TooltipSampleComponent,
>>>>>>> 1935064e4fe0428690a5ce9566fa3f9e86e124eb
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
