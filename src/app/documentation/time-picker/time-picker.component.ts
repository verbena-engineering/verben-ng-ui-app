import { Component } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent {
  selectedTime: Date = new Date(); // Default time

  onTimeSelected(newTime: { hours: number; minutes: number; meridiem: string }) {
    const date = new Date();
    date.setHours(newTime.meridiem === 'PM' ? newTime.hours + 12 : newTime.hours);
    date.setMinutes(newTime.minutes);
    this.selectedTime = date; // Update the model when the time changes
    console.log('Selected Time:', this.selectedTime);
  }
}
