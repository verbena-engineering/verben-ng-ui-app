import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { VerbenaInputComponent } from './verbena-input.component';

@NgModule({
  declarations: [VerbenaInputComponent],
  imports: [CommonModule, FormsModule], // Add FormsModule
  exports: [VerbenaInputComponent]
})
export class VerbenaInputModule {}
