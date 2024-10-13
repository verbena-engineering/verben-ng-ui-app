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
  @Input() min?: number; // Minimum value for number input
  @Input() max?: number; // Maximum value for number input

  @Input() showBorder: boolean = true; // Control border visibility
  @Input() showErrorMessage: boolean = true; // Control error message visibility
  @Input() errorMessageColor: string = 'red'; // Color of the error message
  @Input() errorBorderColor: string = 'red'; // Color of the error border
  @Input() errorPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom'; // Position of the error message

  @Input() capitalization: 'none' | 'uppercase' | 'lowercase' | 'sentencecase' | 'pascalcase' | 'camelcase' = 'none'; // New input for capitalization format

  @Output() valueChange = new EventEmitter<string>();

  errorMessage: string | undefined;
  inputId: string = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnInit() {
    this.inputId = `verbena-input-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Method triggered on input change
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;

    // Keep the value with commas for display purposes
    this.value = target.value.trim();

    // Apply capitalization formatting
    this.value = this.applyCapitalization(this.value, this.capitalization);

    // Validate the value without flagging commas as an error
    this.validate();

    // Emit the sanitized value (commas removed)
    const sanitizedValue = this.sanitizeValue(this.value);

    // Trigger form control change and emit sanitized value
    this.onChange(sanitizedValue);
    this.valueChange.emit(sanitizedValue);
  }

  // Apply the selected capitalization format
  applyCapitalization(value: string, format: string): string {
    switch (format) {
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'sentencecase':
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      case 'pascalcase':
        return value.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
      case 'camelcase':
        return value.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index == 0 ? match.toLowerCase() : match.toUpperCase()
        ).replace(/\s+/g, '');
      default:
        return value;
    }
  }

  // Sanitize value by removing commas for number, decimal, and integer types when emitting the value
  sanitizeValue(value: string): string {
    if (['number', 'decimal', 'integer'].includes(this.type)) {
      return value.replace(/,/g, ''); // Remove commas only for processing/emitting
    }
    return value;
  }

  // Validation method without flagging commas as errors
  validate() {
    this.errorMessage = '';

    // General validation
    if (this.required && !this.value) {
      this.errorMessage = 'This field is required.';
      return;
    }

    if (this.minLength && this.value.length < this.minLength) {
      this.errorMessage = `Minimum length is ${this.minLength}.`;
      return;
    }

    if (this.maxLength && this.value.length > this.maxLength) {
      this.errorMessage = `Maximum length is ${this.maxLength}.`;
      return;
    }

    // Sanitize the value by removing commas for numeric validation only when comparing
    const sanitizedValue = this.sanitizeValue(this.value);
    const numericValue = parseFloat(sanitizedValue);

    // Number range validation
    if (['integer', 'number', 'decimal'].includes(this.type)) {
      if (this.min !== undefined && numericValue < this.min) {
        this.errorMessage = `Minimum value is ${this.min}.`;
        return;
      } else if (this.max !== undefined && numericValue > this.max) {
        this.errorMessage = `Maximum value is ${this.max}.`;
        return;
      }
    }

    // Type-specific validation, no longer flagging commas as errors
    if (this.type === 'integer' && !/^\d{1,3}(,\d{3})*$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid integer.';
      return;
    }

    if (this.type === 'number' && !/^\d{1,3}(,\d{3})*(\.\d*)?$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid number.';
      return;
    }

    if (this.type === 'decimal' && !/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid decimal.';
      return;
    }

    if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }

  // ControlValueAccessor interface methods
  writeValue(value: any): void {
    this.value = value ? this.applyCapitalization(value.trim(), this.capitalization) : '';
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
