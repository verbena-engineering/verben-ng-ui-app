import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VerbenaTextareaComponent } from './verbena-textarea.component';

@NgModule({
  declarations: [VerbenaTextareaComponent],
  imports: [CommonModule, FormsModule],
  exports: [VerbenaTextareaComponent]
})
export class VerbenaTextareaModule {}
