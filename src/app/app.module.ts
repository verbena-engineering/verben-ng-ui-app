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
import { CDVModule } from './Components/card-data-view/cdv.module';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { HomeComponent } from './home/home.component';
import { DropdownSampleComponent } from './views/dropdown-sample/dropdown-sample.component';
import { FormsModule } from '@angular/forms';
import { NotificationsSampleComponent } from './views/notifications-sample/notifications-sample.component';
import { TableFilterSampleComponent } from './views/table-filter-sample/table-filter-sample.component';
import { TooltipSampleComponent } from './views/tooltip-sample/tooltip-sample.component';
import { ImageSampleComponent } from './views/image-sample/image-sample.component';


@NgModule({
  declarations: [
    AppComponent,
    CardDataViewComponent,
    HomeComponent,
    DropdownSampleComponent,
  ],
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
    ButtonModule,
    VerbenaBadgeModule,
    ValidateInputModule,
    VerbenaInputModule,
    VerbenaButtonModule,
    DropDownModule,
    ChipModule,
    SvgModule,
    TableFilterModule,
    CardModule,
    VerbenaTextareaModule,
    CardDataViewModule,
    VerbenaSwitchModule,
    NotificationModule,
    ImageSampleComponent,
    NotificationsSampleComponent,
    // TableFilterSampleComponent,
    // TooltipSampleComponent,
],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
