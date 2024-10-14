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
  @Input() type: 'text' | 'integer' | 'number' | 'decimal' | 'email'|'search'= 'text';
  @Input() bgColor: string = '#f9f9f9';
  @Input() border: string = '1px solid #ccc';
  @Input() borderRadius: string = '5px';
  @Input() textColor: string = '#333';
  @Input() value: string = '';
  @Input() labelPosition: string = 'start';
  @Input() labelColor: string = 'black';

  // New input properties for range validation
  @Input() min?: number; // Minimum value for number input
  @Input() max?: number; // Maximum value for number input

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
    if (this.type === 'integer' || this.type === 'number' || this.type === 'decimal') {
      const validInteger = /^\d+$/.test(newValue);
      const validNumber = /^\d*\.?\d*$/.test(newValue);
      const validDecimal = /^\d+(\.\d+)?$/.test(newValue);

      if (this.type === 'integer' && !validInteger) {
        this.setInvalidInput(input, 'Please enter a valid integer.');
      } else if (this.type === 'number' && !validNumber) {
        this.setInvalidInput(input, 'Please enter a valid number.');
      } else if (this.type === 'decimal' && !validDecimal) {
        this.setInvalidInput(input, 'Please enter a valid decimal.');
      } else {
        this.value = newValue;
        this.errorMessage = null;
      }
    } else if (this.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newValue)) {
        this.setInvalidInput(input, 'Please enter a valid email address.');
      } else {
        this.value = newValue;
        this.errorMessage = null;
      }
    } else {
      this.value = newValue;
      this.errorMessage = null;
    }

    this.validate();
    this.valueChange.emit(this.value);
  }

  // Helper method for setting invalid input
  setInvalidInput(input: HTMLInputElement, message: string) {
    this.value = this.value; // Keep the previous valid value
    input.value = this.value;
    this.errorMessage = message;
  }

  validate() {
    this.errorMessage = null;

    // General validation
    if (this.required && !this.value) {
      this.errorMessage = 'This field is required.';
    } else if (this.minLength && this.value.length < this.minLength) {
      this.errorMessage = `Minimum length is ${this.minLength}.`;
    } else if (this.maxLength && this.value.length > this.maxLength) {
      this.errorMessage = `Maximum length is ${this.maxLength}.`;
    }

    // Number range validation
    const numericValue = parseFloat(this.value);
    if (this.type === 'integer' || this.type === 'number' || this.type === 'decimal') {
      if (this.min !== undefined && numericValue < this.min) {
        this.errorMessage = `Minimum value is ${this.min}.`;
      } else if (this.max !== undefined && numericValue > this.max) {
        this.errorMessage = `Maximum value is ${this.max}.`;
      }
    }

    // Type-specific validation
    if (this.type === 'integer' && !/^\d+$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid integer.';
    } else if (this.type === 'number' && !/^\d*\.?\d*$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid number.';
    } else if (this.type === 'decimal' && !/^\d+(\.\d+)?$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid decimal.';
    } else if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }
}
  