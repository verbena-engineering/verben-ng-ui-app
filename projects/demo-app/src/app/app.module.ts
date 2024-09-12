import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// Import modules
// import { MaxNumberModule } from 'verbena-ui-library';
// import { MinNumberModule } from 'verbena-ui-library';
// import { RequiredInputModule } from 'verbena-ui-library';
// import { EmailValidatorModule } from 'verbena-ui-library';
// import { ConvertToDecimalModule } from 'verbena-ui-library';
// import { ConvertToIntegerModule } from 'verbena-ui-library';
// import { ConvertToStringModule } from 'verbena-ui-library';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
