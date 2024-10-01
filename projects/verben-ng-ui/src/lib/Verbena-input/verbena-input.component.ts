import { Component, Input, OnInit } from '@angular/core';

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
      (blur)="validate()"
      [(ngModel)]="value"
      [ngStyle]="{
        'background-color': bgColor,
        'margin': mg,
        'border': border,
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
    }
  `]
})
export class VerbenaInputComponent implements OnInit {
  // Custom Inputs for CSS properties
  @Input() bgColor: string = '';              // background-color
  @Input() mg: string = '';                   // margin
  @Input() border: string = '';               // border
  @Input() borderRadius: string = '';         // border-radius
  @Input() textColor: string = '';            // color
  @Input() width: string = '';                // width
  @Input() height: string = '';               // height
  @Input() aspectRatio: string = '';          // aspect-ratio
  @Input() pd: string = '';                   // padding
  @Input() disable: boolean = false;          // disabled
  @Input() placeHolder: string = '';          // placeholder

  // Other Inputs
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() minLength?: number;

  @Input() maxLength?: number;
  @Input() value: string = '';
  @Input() showErrorMessage: boolean = true;
  @Input() showBorder: boolean = true;

  errorMessage: string | undefined;
  inputId: string = '';

  ngOnInit() {
    // Generate a unique ID for the input element
    this.inputId = `verbena-input-${Math.random().toString(36).substr(2, 9)}`;
  }

  validate() {
    if (this.required && !this.value) {
      this.errorMessage = 'This field is required';
    } else if (this.minLength && this.value.length < this.minLength) {
      this.errorMessage = `Minimum length is ${this.minLength}`;
    } else if (this.maxLength && this.value.length > this.maxLength) {
      this.errorMessage = `Maximum length is ${this.maxLength}`;
    } else {
      this.errorMessage = undefined;
    }
  }
}
