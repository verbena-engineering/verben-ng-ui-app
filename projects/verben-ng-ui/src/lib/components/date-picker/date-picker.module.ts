import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { SvgModule } from "../svg/svg.module";
import { DropDownModule } from '../drop-down/drop-down.module';
@NgModule({
  declarations:[DatePickerComponent],
  imports: [FormsModule, CommonModule, SvgModule,DropDownModule],
  exports: [DatePickerComponent]
})
export class DatePickerModule {}
