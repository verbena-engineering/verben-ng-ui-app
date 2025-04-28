import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { SvgModule } from "../svg/svg.module";
import { DropDownModule } from '../drop-down/drop-down.module';
import { VerbenPopUpModule } from '../pop-up/pop-up.module';
import { OutSideClickDirective } from '../data-view/data-view-click-outside.directive';
@NgModule({
  declarations:[DatePickerComponent],
  imports: [FormsModule, CommonModule, SvgModule,DropDownModule, VerbenPopUpModule,OutSideClickDirective],
  exports: [DatePickerComponent]
})
export class DatePickerModule {}
