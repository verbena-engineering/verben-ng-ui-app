import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-verbena-input-textarea',
  templateUrl: './verbena-input-textarea.component.html',
  styleUrl: './verbena-input-textarea.component.scss'
})
export class VerbenaInputTextareaComponent {
  email: string = '';
  age: string = '';
  decimalValue: string = '';

  form = new FormGroup({
    quantity: new FormControl(5), // Initial value
  });

  onSubmit() {
    console.log('Form Value:', this.form.value);
  }

  quantity: number = 1;

  onValueChange(newValue: number) {
    console.log('Updated Value:', newValue, this.quantity);
  }


  submit() {
    console.log('Submitted Values:', {
      quantity: this.quantity,
      email: this.email,
      age: this.age,
      decimalValue: this.decimalValue
    });
  }

}
