import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const NUMBER_INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberInputComponent),
  multi: true,
};

/*
 * CHANGE LOG (2026-10-02) — search for "[NI-n]" to find each change.
 *  [NI-1] New formatting inputs: thousandSeparator (default on), separator,
 *         decimalPlaces, prefix, suffix. The bound value is still a number.
 *  [NI-2] Input is type="text" (template) — type="number" can't show commas.
 *         The component writes the displayed text itself via render().
 *  [NI-3] Focus/blur: prefix/suffix + padded decimals shown when not editing.
 *  [NI-4] Typing: strip invalid characters, re-insert separators live, keep
 *         the caret where the user was typing, emit the parsed number.
 *  [NI-5] Arrow Up/Down stepping (replaces the native number spinner).
 *  [NI-6] Step rounding to avoid floating point noise (0.1 + 0.2).
 *  [NI-7] valueChange now also fires while typing; keyUp sends a parsed number.
 *  [NI-8] (2026-10-09) Editing shows no padded decimals, so typing after "0.00"
 *          or "2,500.00" works; a leading 0 is dropped ("05" → "5").
 */
@Component({
  selector: 'verben-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  providers: [NUMBER_INPUT_VALUE_ACCESSOR],
})
export class NumberInputComponent
  implements ControlValueAccessor, OnChanges, AfterViewInit
{
  @Input() min?: number;
  @Input() max?: number;
  @Input() step: number = 1;
  @Input() value: number = 0;
  @Input() label?: string = '';
  @Input() controlButton: boolean = false;
  @Input() disabled: boolean = false; // ✅ New input

  // [NI-1] Display formatting only — the bound value is always a plain number
  @Input() thousandSeparator: boolean = true;
  @Input() separator: string = ',';
  @Input() decimalPlaces?: number;
  @Input() prefix: string = '';
  @Input() suffix: string = '';

  @Output() valueChange = new EventEmitter<number>();
  @Output() keyUp = new EventEmitter<{ event: KeyboardEvent; value: number }>();

  // [NI-2] Direct handle on the <input> so we control exactly what it shows
  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  private onChange = (value: number) => {};
  private onTouched = () => {};

  errorMessage: string = '';
  inputContainerClass: any;
  inputWrapperClass: any;
  // [NI-3] Editing vs. displaying decides whether prefix/suffix are shown
  isFocused = false;

  // [NI-2] Parent changed [value] (or a formatting input): redraw, unless the
  // user is mid-typing (redrawing then would fight their keystrokes)
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isFocused) this.render();
  }

  // [NI-2] First paint of the formatted value
  ngAfterViewInit(): void {
    this.render();
  }

  increase() {
    if (this.disabled) return; // ✅ Respect disabled state
    if (this.max === undefined || this.value + this.step <= this.max) {
      // [NI-6] Rounded so 0.1 steps don't produce 0.30000000000000004
      this.value = this.roundToStep(this.value + this.step);
      this.validateValue();
      this.notifyValueChange();
      this.render();
    }
  }

  decrease() {
    if (this.disabled) return;
    if (this.min === undefined || this.value - this.step >= this.min) {
      // [NI-6]
      this.value = this.roundToStep(this.value - this.step);
      this.validateValue();
      this.notifyValueChange();
      this.render();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // [NI-5] Text inputs lose the native number arrow-key stepping, so restore it
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.increase();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrease();
    }
  }

  onKeyUp(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    // [NI-7] Was Number(input.value), which is NaN once commas are shown
    const currentValue = this.parse(this.sanitize(input.value));
    this.keyUp.emit({ event, value: currentValue });
  }

  // [NI-3] Editing: show just the number (no prefix/suffix)
  onFocus() {
    this.isFocused = true;
    this.render();
  }

  // [NI-3] Done editing: validate min/max, then show the full formatted text
  onBlur() {
    this.isFocused = false;
    this.validateValue();
    this.render();
  }

  onInput(event: Event) {
    if (this.disabled) return;

    const input = event.target as HTMLInputElement;
    // [NI-4] Remember how many real characters (digits, ".", "-") were before
    // the caret, so it can be put back after separators move around
    const caret = input.selectionStart ?? input.value.length;
    const significantBeforeCaret = this.sanitize(
      input.value.slice(0, caret),
    ).length;

    const raw = this.sanitize(input.value);
    let newValue = this.parse(raw);

    // Clamp immediately
    if (this.max !== undefined && newValue > this.max) {
      newValue = this.max;
      this.value = newValue;
      this.render();
    } else if (this.min !== undefined && newValue < this.min) {
      newValue = this.min;
      this.value = newValue;
      this.render();
    } else {
      // [NI-4] Re-group the digits while typing and keep the caret in place
      input.value = this.formatRaw(raw);
      this.restoreCaret(input, significantBeforeCaret);
    }

    // Assign & emit after correction
    this.value = newValue;
    this.errorMessage = ''; // clear existing errors since input is valid now
    // [NI-7] Emit while typing so [(value)] stays in sync, not only on blur
    this.valueChange.emit(this.value);
    this.notifyValueChange();
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

  // ---- [NI-1..4] Formatting helpers ----

  // Formatted text for display: prefix + grouped number (+ fixed decimals) + suffix.
  // While focused, prefix/suffix are hidden so only the number is edited.
  get displayValue(): string {
    const value = Number.isFinite(this.value) ? this.value : 0;
    // [NI-8] While editing, no padded decimals ("2500.5", not "2500.50"):
    // padded zeros would sit at the end and block typing there
    const raw =
      this.decimalPlaces === undefined
        ? String(value)
        : this.isFocused
          ? String(Number(value.toFixed(this.decimalPlaces)))
          : value.toFixed(this.decimalPlaces);
    const formatted = this.formatRaw(raw);
    return this.isFocused ? formatted : `${this.prefix}${formatted}${this.suffix}`;
  }

  private render() {
    if (this.inputEl) this.inputEl.nativeElement.value = this.displayValue;
  }

  // Keeps only a leading minus (if negatives are allowed), digits and one
  // decimal point, truncated to decimalPlaces
  private sanitize(text: string): string {
    const allowNegative = this.min === undefined || this.min < 0;
    const negative = allowNegative && text.trim().startsWith('-');
    let [intPart, ...rest] = text.replace(/[^\d.]/g, '').split('.');
    let fraction = rest.join('');
    // [NI-8] "05" → "5" (typing after a 0)
    intPart = intPart.replace(/^0+(?=\d)/, '');
    const hasPoint = text.includes('.') && this.decimalPlaces !== 0;

    if (this.decimalPlaces !== undefined) {
      fraction = fraction.slice(0, this.decimalPlaces);
    }
    return `${negative ? '-' : ''}${intPart}${hasPoint ? '.' + fraction : ''}`;
  }

  private parse(raw: string): number {
    const n = parseFloat(raw);
    return Number.isNaN(n) ? 0 : n;
  }

  private formatRaw(raw: string): string {
    if (!this.thousandSeparator) return raw;
    const [intPart, ...rest] = raw.split('.');
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, this.separator);
    return rest.length ? `${grouped}.${rest.join('')}` : grouped;
  }

  // Put the caret after the same number of significant characters it was
  // after before the separators were re-inserted
  private restoreCaret(input: HTMLInputElement, significantCount: number) {
    let pos = 0;
    let seen = 0;
    while (pos < input.value.length && seen < significantCount) {
      if (/[\d.-]/.test(input.value[pos])) seen++;
      pos++;
    }
    input.setSelectionRange(pos, pos);
  }

  // Avoids floating point noise like 0.1 + 0.2 = 0.30000000000000004
  private roundToStep(n: number): number {
    const decimals = (String(this.step).split('.')[1] ?? '').length;
    const places = Math.max(decimals, this.decimalPlaces ?? 0);
    return Number(n.toFixed(places));
  }

  // Control Value Accessor methods
  writeValue(value: number): void {
    this.value = value ?? 0;
    this.validateValue();
    // [NI-2] Value set from the form (ngModel / formControl): redraw
    this.render();
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
