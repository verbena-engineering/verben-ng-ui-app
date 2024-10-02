import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'verbena-input',
  template: `
    <label [for]="inputId">{{ label }}</label>
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
    <span *ngIf="showErrorMessage && errorMessage" class="error">{{ errorMessage }}</span>
  `,
  styles: [`
    .error {
      color: red;
      font-size: 12px;
    }
  `]
})
export class VerbenaInputComponent implements OnInit {
  // Custom Inputs for CSS properties
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

  // Other Inputs
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() value: string = '';

  @Input() showErrorMessage: boolean = true;
  @Input() showBorder: boolean = true;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  errorMessage: string | undefined;
  inputId: string = '';

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
    this.valueChange.emit(this.value);  // Emit the input value
  }
}
