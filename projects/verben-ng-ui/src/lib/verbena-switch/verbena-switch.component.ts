import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'verbena-switch',
  templateUrl: './verbena-switch.component.html',
  styleUrls: ['./verbena-switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerbenaSwitchComponent),
      multi: true
    }
  ]
})
export class VerbenaSwitchComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() offColor: string = '#ccc'; // Default off color
  @Input() onColor: string = '#4caf50'; // Default on color
  @Input() onText: string = 'On'; // Text for ON state
  @Input() offText: string = 'Off'; // Text for OFF state
  @Input() width: string = '60px'; // Width of the switch
  @Input() height: string = '30px'; // Height of the switch
  @Input() customStyles: string = ''; // Accepts user-defined class for extra styling

  @Output() change = new EventEmitter<boolean>();

  // Function to call when the toggle changes
  public onChange: (value: boolean) => void = () => {};

  // Function to call when the component is touched
  private onTouched: () => void = () => {};

  // Toggle function to handle switch changes
  toggleSwitch() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.change.emit(this.checked);
    }
  }

  // ControlValueAccessor: Write a new value to the element
  writeValue(value: boolean): void {
    this.checked = value;
  }

  // ControlValueAccessor: Set the function to be called when the control value changes
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  // ControlValueAccessor: Set the function to be called when the control is touched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // ControlValueAccessor: Set the disabled state
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Method to handle input change directly from template
  onChangeEvent(event: Event): void {
    if (!this.disabled) {
      const checked = (event.target as HTMLInputElement).checked;
      this.checked = checked;
      this.onChange(checked); // Call the onChange function with a boolean
      this.change.emit(checked); // Emit the change event
    }
  }

}
