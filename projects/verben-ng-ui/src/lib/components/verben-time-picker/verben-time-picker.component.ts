import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

/*
 * CHANGE LOG (2026-10-05) — search for "[TP-n]" to find each change.
 *  [TP-1] [model] / [format24] are now read when they change (ngOnChanges).
 *         Before, they were read only in the constructor — before Angular sets
 *         inputs — so the picker ignored [model] and showed the current time.
 *  [TP-2] 12h -> 24h conversion fixed: typed values are strings ("9" + 12 was
 *         "912"), 12 PM became 24 and 12 AM stayed noon.
 */
@Component({
  selector: 'verben-time-picker',
  templateUrl: './verben-time-picker.component.html',
  styleUrls: ['./verben-time-picker.component.css']
})
export class VerbenTimePickerComponent implements OnChanges {
  @Input() model: Date = new Date();
  @Output() modelChange = new EventEmitter<Date>(); // Add this line
  @Input() format24: boolean = false; // Toggle between 12h and 24h format
  @Output() timeChange = new EventEmitter<{ hours: number; minutes: number; meridiem: string }>();
  
  hours!: number;
  minutes!: number;
  meridiem: string = 'AM';

  constructor() {
    this.initializeTime();
  }

  // [TP-1] Inputs arrive after the constructor, so re-read them here
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] || changes['format24']) {
      this.initializeTime();
    }
  }

  initializeTime() {
    if (!this.model) return; // [TP-1] tolerate [model]="null"
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
    const newDate = new Date(this.model);
    // [TP-2] The inputs give strings after typing, so convert first.
    // 12h: 12 AM -> 0, 1-11 PM -> 13-23, 12 PM -> 12.
    const hours = Number(this.hours) || 0;
    const minutes = Number(this.minutes) || 0;
    newDate.setHours(
      this.format24 ? hours : (hours % 12) + (this.meridiem === 'PM' ? 12 : 0),
    );
    newDate.setMinutes(minutes);

    this.modelChange.emit(newDate); // Emit the updated date
    this.timeChange.emit({
      hours,
      minutes,
      meridiem: this.format24 ? '' : this.meridiem
    });
  }
  

  setMeridiem(value: string) {
    this.meridiem = value;
    this.onTimeChange();
  }
}
