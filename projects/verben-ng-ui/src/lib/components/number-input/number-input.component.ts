import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'verben-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  @Input() min?: number; // Optional min value
  @Input() max?: number; // Optional max value
  @Input() step: number = 1;
  @Input() value: number = 0;
  @Input() controlButton: boolean = false;

  @Output() valueChange = new EventEmitter<number>();

  private onChange = (value: number) => {};
  private onTouched = () => {};

  errorMessage: string = '';
inputContainerClass: any;
inputWrapperClass: any;

  increase() {
    if (this.max === undefined || this.value + this.step <= this.max) {
      this.value += this.step;
      this.validateValue();
      this.valueChange.emit(this.value);
    }
  }

  decrease() {
    if (this.min === undefined || this.value - this.step >= this.min) {
      this.value -= this.step;
      this.validateValue();
      this.valueChange.emit(this.value);
    }
  }

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    let newValue = Number(inputValue);
    this.value = newValue;
    this.validateValue();
  }

  validateValue() {
    if (this.min !== undefined && this.value < this.min) {
      this.value = this.min;
      this.errorMessage = `Value must be at least ${this.min}`;
    } else if (this.max !== undefined && this.value > this.max) {
      this.value = this.max;
      this.errorMessage = `Value cannot exceed ${this.max}`;
    } else {
      this.errorMessage = '';
    }
    this.valueChange.emit(this.value);
  }

  notifyValueChange() {
    this.onChange(this.value);
    this.onTouched();
  }

  // Control Value Accessor Methods
  writeValue(value: number): void {
    this.value = value ?? 0;
    this.validateValue();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: Implement if you want to disable the input field
  }
}
