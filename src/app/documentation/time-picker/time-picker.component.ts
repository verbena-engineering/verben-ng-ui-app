import { Component } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent {
  selectedTime: Date = new Date(); // Default time

  onTimeSelected(newTime: Date) {
    console.log('Selected Time:', newTime);
    this.selectedTime = newTime; // Update the model when the time changes
  }
}
