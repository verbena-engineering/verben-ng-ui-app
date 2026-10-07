import { Component } from '@angular/core';
import { DateRange } from 'verben-ng-ui';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-date-picker-page',
  templateUrl: './date-picker-page.component.html',
})
export class DatePickerPageComponent {
  dueDate: string | null = null;
  meeting: string | null = null;
  period: [string, string] | null = null;
  range: DateRange | null = null;
  bounded: string | null = null;
  ukDate: string | null = null;

  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  code = {
    basic: `<app-date-picker
  placeholder="Due date"
  [(ngModel)]="dueDate"
></app-date-picker>`,

    time: `<app-date-picker
  placeholder="Meeting time"
  [showTime]="true"
  [(ngModel)]="meeting"
></app-date-picker>`,

    range: `<app-date-picker
  selectionMode="range"
  placeholder="Reporting period"
  [(ngModel)]="period"
></app-date-picker>`,

    rangeTs: `// ngModel receives [start, end] as local date strings:
// ['2026-10-05T00:00:00', '2026-10-12T23:59:59']
period: [string, string] | null = null;`,

    rangeBinding: `<app-date-picker
  selectionMode="range"
  [useDropdowns]="false"
  [maxDate]="today"
  [(range)]="range"
></app-date-picker>`,

    rangeBindingTs: `import { DateRange } from 'verben-ng-ui';

today = new Date();
// [(range)] gives Date objects: [start 00:00, end 23:59:59.999]
range: DateRange | null = null;`,

    bounds: `<app-date-picker
  placeholder="This month only"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [(ngModel)]="bounded"
></app-date-picker>`,

    boundsTs: `today = new Date();
minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);`,

    format: `<app-date-picker format="DD/MM/YYYY" [(ngModel)]="ukDate"></app-date-picker>`,
  };

  inputs: DocsProp[] = [
    { name: 'selectionMode', type: "'default' | 'range'", default: "'default'", description: 'One date, or a start and end date.' },
    { name: 'showTime', type: 'boolean', default: 'false', description: 'Adds hour/minute selection (default mode only).' },
    { name: 'minDate / maxDate', type: 'Date', default: '—', description: 'Days outside this range are disabled.' },
    { name: 'format', type: "'MM/DD/YYYY' | 'DD/MM/YYYY'", default: "'MM/DD/YYYY'", description: 'How the date is shown in the field.' },
    { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Text when empty.' },
    { name: 'range', type: 'DateRange | null', default: 'null', description: 'Range value for [(range)]: [start, end].' },
    { name: 'date', type: 'Date | string | null', default: 'null', description: 'Value for [(date)] (alternative to ngModel).' },
    { name: 'useDropdowns', type: 'boolean', default: 'true', description: 'Month/year dropdowns; false shows ‹ › arrows.' },
    { name: 'useDefaultDate', type: 'boolean', default: 'false', description: "Pre-fill with today's date." },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
    { name: 'overlayWidth / datePickerWidth', type: 'number / string', default: "400 / '400px'", description: 'Popup size.' },
    { name: 'bgColor / border', type: 'string', default: 'theme', description: 'Field style overrides.' },
  ];

  outputs: DocsProp[] = [
    { name: 'dateChange', type: 'EventEmitter<Date | null>', description: 'Default mode: the picked date (null when cleared).' },
    { name: 'rangeChange', type: 'EventEmitter<DateRange | null>', description: 'Range mode: [start, end] once both are picked.' },
  ];
}
