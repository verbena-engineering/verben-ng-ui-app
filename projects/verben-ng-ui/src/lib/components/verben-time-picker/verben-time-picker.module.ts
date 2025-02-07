import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenTimePickerComponent } from './verben-time-picker.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VerbenTimePickerComponent],
  imports: [CommonModule, FormsModule],
  exports: [VerbenTimePickerComponent]
})
export class VerbenTimePickerModule {}