import { VerbenaComponentModule } from './verbena-component.module';
import { Component } from '@angular/core';

@Component({
  selector: 'app-verbena-component',
  templateUrl: './verbena-component.component.html',
  styleUrl: './verbena-component.component.scss'
})
export class VerbenaComponentComponent {
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
