import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import your library modules or directives
import { NumberRangeModule } from 'verbena-ui-library';
import { RequiredInputModule } from 'verbena-ui-library';
import { EmailValidatorModule } from 'verbena-ui-library';
import { ConvertToNumberModule } from 'verbena-ui-library';
import { ConvertToIntegerModule } from 'verbena-ui-library';
import { PhoneNumberModule } from 'verbena-ui-library';
import { ValidateInputModule } from 'verbena-ui-library';
// Import the entire library or specific modules

@NgModule({
  declarations: [
    AppComponent,
    // other components in the demo app
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NumberRangeModule,
    RequiredInputModule,
    EmailValidatorModule,
    ConvertToNumberModule,
    ConvertToIntegerModule,
    PhoneNumberModule,
    ValidateInputModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
