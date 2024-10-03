import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'verbena-input',
  template: `
    <label [for]="inputId">{{ label }}</label>
    <div>
    <input
      [id]="inputId"
      [attr.type]="type"
      [attr.placeholder]="placeHolder"
      [required]="required"
      [attr.minlength]="minLength?.toString()"
      [attr.maxlength]="maxLength?.toString()"
      (input)="onInput($event)"
      (blur)="validate()"
      [(ngModel)]="value"
      [ngStyle]="{
        'background-color': bgColor,
        'margin': mg,
        'border': showBorder ? (errorMessage ? '1px solid red' : border) : 'none',
        'border-radius': borderRadius,
        'color': textColor,
        'width': width,
        'height': height,
        'aspect-ratio': aspectRatio,
        'padding': pd
      }"
      [disabled]="disable"
      class="input-field"
    />
    </div>
    <p *ngIf="showErrorMessage && errorMessage" class="error">{{ errorMessage }}</p>
  `,
  styles: [`
    .error {
      color: red;
      font-size: 12px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerbenaInputComponent),
      multi: true
    }
  ]
})
export class VerbenaInputComponent implements ControlValueAccessor, OnInit {
  @Input() bgColor: string = '';
  @Input() mg: string = '';
  @Input() border: string = '';
  @Input() borderRadius: string = '';
  @Input() textColor: string = '';
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() aspectRatio: string = '';
  @Input() pd: string = '';
  @Input() disable: boolean = false;
  @Input() placeHolder: string = '';

  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;

  @Input() showErrorMessage: boolean = true;
  @Input() showBorder: boolean = true;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  errorMessage: string | undefined;
  inputId: string = '';
  value: string = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnInit() {
    this.inputId = `verbena-input-${Math.random().toString(36).substr(2, 9)}`;
  }

  validate() {
    this.errorMessage = undefined;
    if (this.required && !this.value) {
      this.errorMessage = 'This field is required';
    } else if (this.minLength && this.value.length < this.minLength) {
      this.errorMessage = `Minimum length is ${this.minLength}`;
    } else if (this.maxLength && this.value.length > this.maxLength) {
      this.errorMessage = `Maximum length is ${this.maxLength}`;
    }
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
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
