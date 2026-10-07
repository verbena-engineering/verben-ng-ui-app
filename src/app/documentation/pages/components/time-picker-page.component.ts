import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-time-picker-page',
  templateUrl: './time-picker-page.component.html',
})
export class TimePickerPageComponent {
  start = new Date(2026, 0, 1, 9, 30);
  shift = new Date(2026, 0, 1, 18, 0);
  lastChange = '';

  onTimeChange(t: { hours: number; minutes: number; meridiem: string }): void {
    this.lastChange = `${t.hours}:${String(t.minutes).padStart(2, '0')} ${t.meridiem}`;
  }

  code = {
    basic: `<verben-time-picker
  [(model)]="start"
  (timeChange)="onTimeChange($event)"
></verben-time-picker>`,

    basicTs: `start = new Date(2026, 0, 1, 9, 30);

onTimeChange(t: { hours: number; minutes: number; meridiem: string }) {
  console.log(t); // { hours: 9, minutes: 30, meridiem: 'AM' }
}`,

    format24: `<verben-time-picker [(model)]="shift" [format24]="true"></verben-time-picker>`,
  };

  inputs: DocsProp[] = [
    { name: 'model', type: 'Date', default: 'new Date()', description: 'The time, as a Date. Supports [(model)].' },
    { name: 'format24', type: 'boolean', default: 'false', description: '24-hour clock instead of AM/PM.' },
  ];

  outputs: DocsProp[] = [
    { name: 'modelChange', type: 'EventEmitter<Date>', description: 'Updated Date when hours, minutes or AM/PM change.' },
    { name: 'timeChange', type: 'EventEmitter<{ hours; minutes; meridiem }>', description: 'The parts of the new time.' },
  ];
}
