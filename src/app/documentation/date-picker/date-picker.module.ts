import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ✅ add this
import { SampleDatePickerComponent } from './date-picker.component';
import { SampleDatePickerComponentRoutingModule } from './date-picker-routing.module';
import { DatePickerModule } from 'verben-ng-ui';

@NgModule({
  declarations: [SampleDatePickerComponent],
  imports: [
    CommonModule,
    FormsModule, 
    SampleDatePickerComponentRoutingModule,
    DatePickerModule,
  ],
  exports: [SampleDatePickerComponent],
})
export class AppDatePickerSample {}
