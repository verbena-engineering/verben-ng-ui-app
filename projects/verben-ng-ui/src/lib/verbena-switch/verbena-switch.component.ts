import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'verbena-switch',
  templateUrl: './verbena-switch.component.html',
  styleUrls: ['./verbena-switch.component.css']
})
export class VerbenaSwitchComponent {
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

  toggleSwitch() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.change.emit(this.checked);
    }
  }

  onChange(event: Event) {
    if (!this.disabled) {
      this.checked = (event.target as HTMLInputElement).checked;
      this.change.emit(this.checked);
    }
  }
}
