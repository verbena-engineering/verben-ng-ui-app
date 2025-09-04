import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { SvgModule } from 'verben-ng-ui/src/lib/components/svg';
import { DropDownModule } from 'verben-ng-ui/src/lib/components/drop-down';
import { VerbenPopUpModule } from 'verben-ng-ui/src/lib/components/pop-up';
import { OutSideClickDirective } from 'verben-ng-ui/src/lib/components/data-view';
@NgModule({
  declarations: [DatePickerComponent],
  imports: [
    FormsModule,
    CommonModule,
    SvgModule,
    DropDownModule,
    VerbenPopUpModule,
    OutSideClickDirective,
  ],
  exports: [DatePickerComponent],
})
export class DatePickerModule {}
