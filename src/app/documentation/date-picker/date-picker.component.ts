import { Component } from '@angular/core';
import { DateRange } from 'verben-ng-ui';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
})
export class SampleDatePickerComponent {
  plainDate: Date | string | null = null;
  selectedDate: Date | null = new Date('2025-07-31T23:59:59');
  endDate: Date = new Date();
  minDate: Date = new Date(2025, 8, 1);
  maxDate: Date = new Date(Date.now());

  rangeModel: [string, string] | null = null;
  range: DateRange | null = null;

  // maxDate: Date = new Date(Date.now());
  //maxDate: Date = new Date(new Date().setHours(23, 59, 59, 999));
  onDateChange(date: Date) {}
}
