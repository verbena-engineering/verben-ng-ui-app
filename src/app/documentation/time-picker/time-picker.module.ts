import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { TimePickerComponent } from './time-picker.component';
import { VerbenTimePickerModule } from '../../../../projects/verben-ng-ui/src/lib/components/verben-time-picker/verben-time-picker.module';

import { TimePickerRoutingModule } from './time-picker-routing.module';




@NgModule({
  declarations: [TimePickerComponent],
  imports: [CommonModule, FormsModule, VerbenTimePickerModule, TimePickerRoutingModule],
})
export class TimePickerModule {}
