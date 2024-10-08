import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'verbena-textarea',
  templateUrl: './verbena-textarea.component.html',
  styleUrls: ['./verbena-textarea.component.css']
})
export class VerbenaTextareaComponent implements OnInit {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() rows: number = 5;
  @Input() cols: number = 40;
  @Input() value: string = '';
  @Input() bgColor: string = '#fff';
  @Input() textColor: string = '#000';
  @Input() border: string = '1px solid #ccc';
  @Input() borderRadius: string = '4px';
  @Input() pd: string = '10px';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';

  @Output() valueChange = new EventEmitter<string>();  // Output for emitting the value

  errorMessage: string | undefined;
  textareaId: string = '';

  ngOnInit() {
    this.textareaId = `verbena-textarea-${Math.random().toString(36).substr(2, 9)}`;
  }

  onValueChange(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(this.value);  // Emit the value when it changes
    this.validate();  // Optional: Re-validate on each change
  }

  validate() {
    if (this.required && !this.value) {
      this.errorMessage = 'This field is required';
    } else {
      this.errorMessage = undefined;
    }
  }
}
