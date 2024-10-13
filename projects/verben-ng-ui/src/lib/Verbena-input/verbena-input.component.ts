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
  @Input() min?: number;
  @Input() max?: number;

  @Input() showBorder: boolean = true;
  @Input() showErrorMessage: boolean = true;
  @Input() errorMessageColor: string = 'red';
  @Input() errorBorderColor: string = 'red';
  @Input() errorPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';

  @Input() capitalization: 'none' | 'uppercase' | 'lowercase' | 'sentencecase' | 'pascalcase' | 'camelcase' = 'none';

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

    const sanitizedValue = this.sanitizeValue(this.value);
    const numericValue = parseFloat(sanitizedValue);

    if (['integer', 'number', 'decimal'].includes(this.type)) {
      if (this.min !== undefined && numericValue < this.min) {
        this.errorMessage = `Minimum value is ${this.min}.`;
        return;
      } else if (this.max !== undefined && numericValue > this.max) {
        this.errorMessage = `Maximum value is ${this.max}.`;
        return;
      }
    }

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
