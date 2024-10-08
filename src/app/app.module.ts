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
import { CDVModule } from './Components/card-data-view/cdv.module';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { HomeComponent } from './home/home.component';
import { DropdownSampleComponent } from './views/dropdown-sample/dropdown-sample.component';
import { FormsModule } from '@angular/forms';

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

    VerbenaBadgeModule,
    ValidateInputModule,
    VerbenaInputModule,
    VerbenaButtonModule,
    DropDownModule,
    ChipModule,
    ImageModule,
    SvgModule,
    TableFilterModule,
    CardModule,
    VerbenaTextareaModule,
    CardDataViewModule,
    VerbenaSwitchModule,
    TooltipModule


],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
