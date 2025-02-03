import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'verben-time-picker',
  templateUrl: './verben-time-picker.component.html',
  styleUrls: ['./verben-time-picker.component.scss']
})
export class VerbenTimePickerComponent {
  @Input() model: Date = new Date();
  @Input() format24: boolean = false; // Toggle between 12h and 24h format
  @Output() timeChange = new EventEmitter<{ hours: number; minutes: number; meridiem: string }>();
  
  hours!: number;
  minutes!: number;
  meridiem: string = 'AM';

  constructor() {
    this.initializeTime();
  }

  initializeTime() {
    this.hours = this.format24 ? this.model.getHours() : this.get12HourFormat(this.model.getHours());
    this.minutes = this.model.getMinutes();
    if (!this.format24) {
      this.meridiem = this.model.getHours() >= 12 ? 'PM' : 'AM';
    }
  }

  get12HourFormat(hours: number): number {
    return hours % 12 || 12;
  }

  onTimeChange() {
    this.timeChange.emit({
      hours: this.hours,
      minutes: this.minutes,
      meridiem: this.format24 ? '' : this.meridiem
    });
  }

  setMeridiem(value: string) {
    this.meridiem = value;
    this.onTimeChange();
  }
}
