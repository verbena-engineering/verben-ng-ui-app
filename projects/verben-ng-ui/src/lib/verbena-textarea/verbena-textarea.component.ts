import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  Optional, 
  Self, 
  Inject, 
  forwardRef 
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'verbena-textarea',
  templateUrl: './verbena-textarea.component.html',
  styleUrls: ['./verbena-textarea.component.css']
})
export class VerbenaTextareaComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() rows: number = 5;
  @Input() cols: number = 40;
  @Input() bgColor: string = '#fff';
  @Input() textColor: string = '#000';
  @Input() border: string = '1px solid #ccc';
  @Input() borderRadius: string = '4px';
  @Input() pd: string = '10px';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  @Input() value: string = '';
  @Input() errorMessageColor: string = 'red';

  @Output() valueChange = new EventEmitter<string>();

  errorMessage: string | undefined;
  textareaId: string = '';
  isInvalid: boolean = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(@Optional() @Self() @Inject(forwardRef(() => NgControl)) private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      this.ngControl.statusChanges?.subscribe((status) => {
        this.isInvalid = this.ngControl.touched
          ? status === 'INVALID' && this.ngControl.touched
          : false;
      });
    }
  }

  ngOnInit() {
    this.textareaId = `verbena-textarea-${Math.random().toString(36).substr(2, 9)}`;
  }

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value.trim();
    this.validate();
    this.onChange(this.value); // Notify form control of value change
    this.onTouch(); // Mark as touched
    this.valueChange.emit(this.value); // Emit the value change
  }

  validate() {
    if (this.required && !this.value) {
      this.errorMessage = 'This field is required';
      this.isInvalid = true;
    } else {
      this.errorMessage = undefined;
      this.isInvalid = false;
    }
  }

  writeValue(value: any): void {
    this.value = value ? value.trim() : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const textarea = document.getElementById(this.textareaId) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.disabled = isDisabled;
    }
  }
  onValueChange(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(this.value);  // Emit the value when it changes
    this.validate();  // Optional: Re-validate on each change
  }
}
