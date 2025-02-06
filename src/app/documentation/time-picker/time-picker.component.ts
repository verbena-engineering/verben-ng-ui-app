import { Component } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent {
  selectedTime: Date = new Date(); // Default time

  onTimeSelected(time: { hours: number; minutes: number; meridiem: string }) {
    const hours24 =
      time.meridiem === 'PM'
        ? time.hours !== 12
          ? time.hours + 12
          : time.hours
        : time.hours === 12
        ? 0
        : time.hours;
  
    const date = new Date();
    date.setHours(hours24, time.minutes, 0, 0);
  
    console.log('Selected Time:', date);
  }
  
}
