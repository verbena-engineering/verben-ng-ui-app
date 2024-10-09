import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'verbena-textarea',
  template: `
    <label [for]="textareaId">{{ label }}</label>
    <textarea
      [id]="textareaId"
      [required]="required"
      [attr.rows]="rows"
      [attr.cols]="cols"
      [ngStyle]="{
        'background-color': bgColor,
        'color': textColor,
        'border': border,
        'border-radius': borderRadius,
        'padding': pd,
        'width': width,
        'height': height
      }"
      [(ngModel)]="value"
      (blur)="validate()"
    ></textarea>
    <span *ngIf="errorMessage" class="error">{{ errorMessage }}</span>
  `,
  styles: [`
    .error {
      color: red;
    }
  `]
})
export class VerbenaTextareaComponent implements OnInit {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() rows: number = 5;          // Default number of rows
  @Input() cols: number = 40;         // Default number of columns
  @Input() value: string = '';
  @Input() bgColor: string = '#fff';  // Default background color
  @Input() textColor: string = '#000'; // Default text color
  @Input() border: string = '1px solid #ccc'; // Default border
  @Input() borderRadius: string = '4px'; // Default border radius
  @Input() pd: string = '10px';       // Default padding
  @Input() width: string = '100%';    // Default width
  @Input() height: string = 'auto';    // Default height

  errorMessage: string | undefined;
  textareaId: string = '';

  ngOnInit() {
    // Generate a unique ID for the textarea element
    this.textareaId = `verbena-textarea-${Math.random().toString(36).substr(2, 9)}`;
  }

  validate() {
    if (this.required && !this.value) {
      this.errorMessage = 'This field is required';
    } else {
      this.errorMessage = undefined;
    }
  }
}

