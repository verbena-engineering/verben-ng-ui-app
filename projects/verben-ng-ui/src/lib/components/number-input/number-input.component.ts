import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const NUMBER_INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberInputComponent),
  multi: true,
};

@Component({
  selector: 'verben-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  providers: [NUMBER_INPUT_VALUE_ACCESSOR],
})
export class NumberInputComponent implements ControlValueAccessor {
  @Input() min?: number;
  @Input() max?: number;
  @Input() step: number = 1;
  @Input() value: number = 0;
  @Input() label?: string = '';
  @Input() controlButton: boolean = false;
  @Input() disabled: boolean = false; // ✅ New input

  @Output() valueChange = new EventEmitter<number>();
  @Output() keyUp = new EventEmitter<{ event: KeyboardEvent; value: number }>();

  private onChange = (value: number) => {};
  private onTouched = () => {};

  errorMessage: string = '';
  inputContainerClass: any;
  inputWrapperClass: any;

  increase() {
    if (this.disabled) return; // ✅ Respect disabled state
    if (this.max === undefined || this.value + this.step <= this.max) {
      this.value += this.step;
      this.validateValue();
      this.valueChange.emit(this.value);
      this.notifyValueChange();
    }
  }

  decrease() {
    if (this.disabled) return;
    if (this.min === undefined || this.value - this.step >= this.min) {
      this.value -= this.step;
      this.validateValue();
      this.valueChange.emit(this.value);
      this.notifyValueChange();
    }
  }

  onKeyUp(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = Number(input.value);
    this.keyUp.emit({ event, value: currentValue });
  }

  onInput(event: Event) {
    if (this.disabled) return;

    const input = event.target as HTMLInputElement;
    let newValue = Number(input.value);

    // Clamp immediately
    if (this.max !== undefined && newValue > this.max) {
      newValue = this.max;
      input.value = String(this.max); // visually correct it
    } else if (this.min !== undefined && newValue < this.min) {
      newValue = this.min;
      input.value = String(this.min);
    }

    // Assign & emit after correction
    this.value = newValue;
    this.errorMessage = ''; // clear existing errors since input is valid now
    this.notifyValueChange(); // your method that emits this.valueChange
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

  // Control Value Accessor methods
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
    this.disabled = isDisabled; // ✅ Sync with external state
  }
}
