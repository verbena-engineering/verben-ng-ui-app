import { ButtonBadgeModule } from './button-badge.module';
import { Component } from '@angular/core';

@Component({
  selector: 'button-badge-component',
  templateUrl: './button-badge.component.html',
  styleUrl: './button-badge.scss'
})
export class ButtonBadgeComponent {
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
