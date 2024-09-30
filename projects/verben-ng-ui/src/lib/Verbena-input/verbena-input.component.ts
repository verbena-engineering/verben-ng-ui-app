import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'verbena-input',
  template: `
    <label [for]="inputId">{{ label }}</label>
    <input
      [id]="inputId"
      [attr.type]="type"
      [required]="required"
      [attr.minlength]="minLength?.toString()"
      [attr.maxlength]="maxLength?.toString()"
      (blur)="validate()"
      [(ngModel)]="value"
      class="border"
    />
    <span *ngIf="errorMessage" class="error">{{ errorMessage }}</span>
  `,
  styles: [`
    .error {
      color: red;
    }
  `]
})
export class VerbenaInputComponent implements OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() value: string = '';

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
