import { Component } from '@angular/core';

@Component({
  selector: 'app-verbena-input-textarea',
  templateUrl: './verbena-input-textarea.component.html',
  styleUrl: './verbena-input-textarea.component.scss'
})
export class VerbenaInputTextareaComponent {
  email: string = '';
  age: string = '';
  decimalValue: string = '';

  submit() {
    console.log('Submitted Values:', {
      email: this.email,
      age: this.age,
      decimalValue: this.decimalValue
    });
  }

}
