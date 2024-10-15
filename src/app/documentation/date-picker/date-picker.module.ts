import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleDatePickerComponent } from './date-picker.component';
import { SampleDatePickerComponentRoutingModule } from './date-picker-routing.module';
import { DatePickerModule } from 'verben-ng-ui/src/public-api';
;


@NgModule({
  declarations:[SampleDatePickerComponent],
  imports: [CommonModule,SampleDatePickerComponentRoutingModule,DatePickerModule,],
  exports:[SampleDatePickerComponent]
})
export class AppDatePickerSample {}
