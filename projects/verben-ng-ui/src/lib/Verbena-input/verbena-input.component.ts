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
  @Input() svgPosition: 'left' | 'right' = 'left';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() type: 'text' | 'password' | 'integer' | 'number' | 'decimal' | 'email' | 'date' | 'tel' | 'url' = 'text';
  @Input() bgColor: string = '#f9f9f9';
  @Input() border: string = '1px solid #ccc';
  @Input() borderRadius: string = '5px';
  @Input() textColor: string = '#333';
  @Input() value: string = '';
  @Input() labelPosition: string = 'start';
  @Input() labelColor: string = 'black';
  @Input() disable: boolean = false;
  @Input() min?: number;
  @Input() max?: number;

  @Input() showBorder: boolean = true;
  @Input() showErrorMessage: boolean = true;
  @Input() errorMessageColor: string = 'red';
  @Input() errorBorderColor: string = 'red';
  @Input() errorPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';

  @Input() svg: string = '';
  @Input() svgWidth: number = 20;
  @Input() svgHeight: number = 20;
  @Input() svgColor: string = '';

  @Input() capitalization: 'none' | 'uppercase' | 'lowercase' | 'sentencecase' | 'pascalcase' | 'camelcase' = 'none';

  // New property for custom error messages
  @Input() customErrorMessages: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    minValue?: string;
    maxValue?: string;
    integer?: string;
    number?: string;
    decimal?: string;
    email?: string;
    password?: string;
    tel?: string;
    url?: string;
  } = {};

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
    this.value = target.value.trim();
    this.value = this.applyCapitalization(this.value, this.capitalization);
    this.validate();
    const sanitizedValue = this.sanitizeValue(this.value);
    this.onChange(sanitizedValue);
    this.valueChange.emit(sanitizedValue);
  }

  applyCapitalization(value: string, format: string): string {
    switch (format) {
      case 'uppercase': return value.toUpperCase();
      case 'lowercase': return value.toLowerCase();
      case 'sentencecase': return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      case 'pascalcase': return value.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
      case 'camelcase': return value.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()).replace(/\s+/g, '');
      default: return value;
    }
  }

  sanitizeValue(value: string): string {
    if (['number', 'decimal', 'integer'].includes(this.type)) {
      return value.replace(/,/g, '');
    }
    return value;
  }

  validate() {
    this.errorMessage = '';

    if (this.required && !this.value) {
      this.errorMessage = this.customErrorMessages.required || 'This field is required.';
      return;
    }

    if (this.minLength && this.value.length < this.minLength) {
      this.errorMessage = this.customErrorMessages.minLength || `Minimum length is ${this.minLength}.`;
      return;
    }

    if (this.maxLength && this.value.length > this.maxLength) {
      this.errorMessage = this.customErrorMessages.maxLength || `Maximum length is ${this.maxLength}.`;
      return;
    }

    const sanitizedValue = this.sanitizeValue(this.value);
    const numericValue = parseFloat(sanitizedValue);

    if (['integer', 'number', 'decimal'].includes(this.type)) {
      if (this.min !== undefined && numericValue < this.min) {
        this.errorMessage = this.customErrorMessages.minValue || `Minimum value is ${this.min}.`;
        return;
      } else if (this.max !== undefined && numericValue > this.max) {
        this.errorMessage = this.customErrorMessages.maxValue || `Maximum value is ${this.max}.`;
        return;
      }
    }

    if (this.type === 'integer' && !/^\d+$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.integer || 'Please enter a valid integer.';
      return;
    }

    if (this.type === 'number' && !/^\d+(\.\d+)?$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.number || 'Please enter a valid number.';
      return;
    }

    if (this.type === 'decimal' && !/^\d+(\.\d+)?$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.decimal || 'Please enter a valid decimal.';
      return;
    }

    if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.email || 'Please enter a valid email address.';
      return;
    }

    if (this.type === 'password' && this.value.length < 8) {
      this.errorMessage = this.customErrorMessages.password || 'Password must be at least 8 characters long.';
      return;
    }

    if (this.type === 'tel' && !/^\+?[1-9]\d{1,14}$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.tel || 'Please enter a valid telephone number.';
      return;
    }

    if (this.type === 'url' && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.url || 'Please enter a valid URL.';
      return;
    }
  }

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
