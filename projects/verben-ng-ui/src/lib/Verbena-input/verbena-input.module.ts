import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerbenaInputComponent } from './verbena-input.component'

@NgModule({
  declarations: [VerbenaInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [VerbenaInputComponent]
})
export class VerbenaInputModule {}
