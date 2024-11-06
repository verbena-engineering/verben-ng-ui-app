import { Component, Input, Output, EventEmitter, OnInit, Optional, Self, Inject, forwardRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'verbena-input',
  templateUrl: './verbena-input.component.html',
  styleUrls: ['./verbena-input.component.css']
})
export class VerbenaInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeHolder: string = '';
  @Input() required: boolean = false;
  @Input() svgPosition: 'left' | 'right' = 'left';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() type: 'text' | 'password' | 'integer' | 'number' | 'decimal' | 'email' | 'date' | 'tel' | 'url' | 'file' | 'color' = 'text';
  @Input() bgColor: string = '#f9f9f9';
  @Input() border: string = '';
  @Input() borderRadius: string = '5px';
  @Input() textColor: string = '#333';
  @Input() value: string = '';
  @Input() labelPosition: string = 'start';
  @Input() labelColor: string = 'black';
  @Input() disable: boolean = false;
  @Input() readOnly: boolean = false; // New input property for read-only
  @Input() min?: number;
  @Input() max?: number;
  @Input() showBorder: boolean = true;
  @Input() showErrorMessage: boolean = true;
  @Input() errorMessageColor: string = 'red';
  @Input() errorBorderColor?: string;
  @Input() errorPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
  @Input() svg: string = '';
  @Input() svgWidth: number = 20;
  @Input() svgHeight: number = 20;
  @Input() svgColor: string = '';
  @Input() capitalization: 'none' | 'uppercase' | 'lowercase' | 'sentencecase' | 'pascalcase' | 'camelcase' = 'none';

  @Input() inputContainerClass: string = '';
  @Input() inputFieldClass: string = '';
  @Input() inputWrapperClass: string = '';
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

  @Output() valueChange = new EventEmitter<string | FileList>();

  errorMessage: string | undefined;
  inputId: string = '';
  onChange: any = () => {};
  onTouch: any = () => {};
  isInvalid: boolean = false;

  constructor(@Optional() @Self() @Inject(forwardRef(() => NgControl)) private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      this.ngControl?.statusChanges?.subscribe((status) => {
        this.isInvalid = this.ngControl.touched
          ? status === 'INVALID' && this.ngControl.touched
          : false;
      });
    }
  }

  ngOnInit() {
    this.inputId = `verbena-input-${Math.random().toString(36).substr(2, 9)}`;
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;

    if (this.type === 'file' && target.files) {
      const files = target.files;
      this.onChange(files);
      this.valueChange.emit(files);
    } else {
      this.value = target.value.trim();
      this.value = this.applyCapitalization(this.value, this.capitalization);
      this.validate();
      const sanitizedValue = this.sanitizeValue(this.value);
      this.onChange(sanitizedValue);
      this.valueChange.emit(sanitizedValue);
    }
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
      this.isInvalid = true;
      return;
    }

    if (this.minLength && this.value.length < this.minLength) {
      this.errorMessage = this.customErrorMessages.minLength || `Minimum length is ${this.minLength}.`;
      this.isInvalid = true;
      return;
    }

    if (this.maxLength && this.value.length > this.maxLength) {
      this.errorMessage = this.customErrorMessages.maxLength || `Maximum length is ${this.maxLength}.`;
      this.isInvalid = true;
      return;
    }

    const sanitizedValue = this.sanitizeValue(this.value);
    const numericValue = parseFloat(sanitizedValue);

    if (['integer', 'number', 'decimal'].includes(this.type)) {
      if (this.min !== undefined && numericValue < this.min) {
        this.errorMessage = this.customErrorMessages.minValue || `Minimum value is ${this.min}.`;
        this.isInvalid = true;
        return;
      } else if (this.max !== undefined && numericValue > this.max) {
        this.errorMessage = this.customErrorMessages.maxValue || `Maximum value is ${this.max}.`;
        this.isInvalid = true;
        return;
      }
    }

    if (this.type === 'integer' && !/^\d+$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.integer || 'Please enter a valid integer.';
      this.isInvalid = true;
      return;
    }

    if (this.type === 'number' && !/^\d+(\.\d+)?$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.number || 'Please enter a valid number.';
      this.isInvalid = true;
      return;
    }

    if (this.type === 'decimal' && !/^\d+(\.\d+)?$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.decimal || 'Please enter a valid decimal.';
      this.isInvalid = true;
      return;
    }

    if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.email || 'Please enter a valid email address.';
      this.isInvalid = true;
      return;
    }

    if (this.type === 'password' && this.value.length < 8) {
      this.errorMessage = this.customErrorMessages.password || 'Password must be at least 8 characters long.';
      this.isInvalid = true;
      return;
    }

    if (this.type === 'tel' && !/^\+?[1-9]\d{1,14}$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.tel || 'Please enter a valid telephone number.';
      this.isInvalid = true;
      return;
    }

    if (this.type === 'url' && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(this.value)) {
      this.errorMessage = this.customErrorMessages.url || 'Please enter a valid URL.';
      this.isInvalid = true;
      return;
    }

    this.isInvalid = false;
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
