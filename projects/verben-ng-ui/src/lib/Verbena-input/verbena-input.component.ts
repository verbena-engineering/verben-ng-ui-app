import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'verbena-input',
  templateUrl: './verbena-input.component.html',
  styleUrls: ['./verbena-input.component.css']
})
export class VerbenaInputComponent {
  @Input() label: string = '';
  @Input() placeHolder: string = '';
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() type: 'text' | 'integer' | 'number' | 'decimal' = 'text';
  @Input() bgColor: string = '#f9f9f9';
  @Input() border: string = '1px solid #ccc';
  @Input() borderRadius: string = '5px';
  @Input() textColor: string = '#333';
  @Input() value: string = '';
  @Input() labelPosition: string = 'start';
  @Input() labelColor: string = 'black';

  // New input properties
  @Input() showBorder: boolean = true; // Control border visibility
  @Input() showErrorMessage: boolean = true; // Control error message visibility
  @Input() errorMessageColor: string = 'red'; // Color of the error message
  @Input() errorBorderColor: string = 'red'; // Color of the error border
  @Input() errorPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom'; // Position of the error message

  @Output() valueChange = new EventEmitter<string>();

  errorMessage: string | null = null;

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    // Validate based on type
    if (this.type === 'integer' || this.type === 'number') {
      // Allow only digits for integer and digits + optional decimal point for number
      const validInteger = /^\d*$/.test(newValue); // Only digits for integer
      const validNumber = /^\d*\.?\d*$/.test(newValue); // Digits and optional decimal point for number

      if (this.type === 'integer' && !validInteger) {
        this.value = this.value; // Keep the previous valid value
        input.value = this.value; // Set the input to the previous valid value
        this.errorMessage = 'Please enter a valid integer.';
      } else if (this.type === 'number' && !validNumber) {
        this.value = this.value; // Keep the previous valid value
        input.value = this.value; // Set the input to the previous valid value
        this.errorMessage = 'Please enter a valid number.';
      } else {
        this.value = newValue; // Update the value if valid
        this.errorMessage = null; // Clear error message
      }
    } else {
      this.value = newValue; // Update the value for text and decimal types
      this.errorMessage = null; // Clear error message
    }

    // Custom validation logic based on other conditions
    this.validate();

    this.valueChange.emit(this.value);
  }

  validate() {
    this.errorMessage = null;

    if (this.required && !this.value) {
      this.errorMessage = 'This field is required.';
    } else if (this.minLength && this.value.length < this.minLength) {
      this.errorMessage = `Minimum length is ${this.minLength}.`;
    } else if (this.maxLength && this.value.length > this.maxLength) {
      this.errorMessage = `Maximum length is ${this.maxLength}.`;
    } else if (this.type === 'integer' && !/^\d+$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid integer.';
    } else if (this.type === 'number' && !/^\d*\.?\d*$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid number.';
    } else if (this.type === 'decimal' && !/^\d+(\.\d+)?$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid decimal.';
    }
  }
}
