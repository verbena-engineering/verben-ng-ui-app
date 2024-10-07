// verbena-textarea.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { VerbenaTextareaComponent } from './verbena-textarea.component';

@NgModule({
  declarations: [VerbenaTextareaComponent],
  imports: [
    CommonModule,
    FormsModule,  // Add FormsModule here
  ],
  exports: [VerbenaTextareaComponent],
})
export class VerbenaTextareaModule {}
