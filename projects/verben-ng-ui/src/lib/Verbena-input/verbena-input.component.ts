import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'verbena-input',
  templateUrl: './verbena-input.component.html',
  styleUrls: ['./verbena-input.component.css'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerbenaInputComponent),
      multi: true
    }
  ]
})
export class VerbenaInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeHolder: string = '';
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() type: 'text' | 'integer' | 'number' | 'decimal' | 'email' | 'date' = 'text';
  @Input() bgColor: string = '#f9f9f9';
  @Input() border: string = '1px solid #ccc';
  @Input() borderRadius: string = '5px';
  @Input() textColor: string = '#333';
  @Input() value: string = '';
  @Input() labelPosition: string = 'start';
  @Input() labelColor: string = 'black';
  @Input() disable: boolean = false;
  // New input properties for range validation
  @Input() min?: number; // Minimum value for number input
  @Input() max?: number; // Maximum value for number input

  @Input() showBorder: boolean = true; // Control border visibility
  @Input() showErrorMessage: boolean = true; // Control error message visibility
  @Input() errorMessageColor: string = 'red'; // Color of the error message
  @Input() errorBorderColor: string = 'red'; // Color of the error border
  @Input() errorPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom'; // Position of the error message

  @Output() valueChange = new EventEmitter<string>();

  errorMessage: string | undefined;
  inputId: string = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnInit() {
    this.inputId = `verbena-input-${Math.random().toString(36).substr(2, 9)}`;
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  // // Helper method for setting invalid input
  // setInvalidInput(input: HTMLInputElement, message: string) {
  //   this.value = this.value; // Keep the previous valid value
  //   input.value = this.value;
  //   this.errorMessage = message;
  // }

  validate() {
    this.errorMessage = '';

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

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

}
  