import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { DropdownChangeEvent } from 'verben-ng-ui/src/lib/components/drop-down';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'Select date';
  @Input() format = 'MM/DD/YYYY';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() disabled?: boolean = false;
  @Input() bgColor?: string = '#fff';
  @Input() border?: string = '';
  @Input() useDropdowns: boolean = true;
  @Input() yearPlaceholder: string = 'Select a year';
  @Input() monthPlaceholder: string = 'Select a month';
  @Input() date: Date | null | string = null;
@Input() showTime: boolean = false;
  @Output() dateChange = new EventEmitter<Date>();

  yearRange: number[] = [];
  filteredYearRange: number[] = [];
  selectedDate: Date = new Date();
  tempSelectedDate: Date = new Date();
  showCalendar = false;
    
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  selectedMonth: number = 1;
  selectedMonthString: string = '';
  selectedYear: number = new Date().getFullYear();

  private onChange: any = () => {};
  private onTouched: any = () => {};

writeValue(value: Date | string | null): void {
  if (value) {
    this.date = value;
    const parsedDate = typeof value === 'string' ? new Date(value) : value;
    this.selectedDate = new Date(parsedDate);
    this.tempSelectedDate = new Date(parsedDate);
    this.selectedMonth = this.selectedDate.getMonth();
    this.selectedYear = this.selectedDate.getFullYear();

    if (this.showTime) {
      this.initTimeFromDate(this.selectedDate);
    }
  }
}


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnChanges() {
    if (this.date) {
      const parsedDate =
        typeof this.date === 'string' ? new Date(this.date) : this.date;
      this.selectedDate = new Date(parsedDate);
      this.tempSelectedDate = new Date(parsedDate);
      this.selectedMonth = this.selectedDate.getMonth();
      this.selectedYear = this.selectedDate.getFullYear();
    }
  }
isSameDate(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
  ngOnInit() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 10;
    this.yearRange = Array.from(
      { length: endYear - 1960 + 1 },
      (_, i) => 1960 + i
    );
    this.yearRange.sort((a, b) => b - a);
  }

  get displayDate(): string {
    const parsedDate =
      typeof this.date === 'string' ? new Date(this.date) : this.date;
    return parsedDate ? this.formatDate(parsedDate, this.format) : '';
  }

tempTime: string = '';
amPm: 'AM' | 'PM' = 'AM';



selectedHour = "12";
selectedMinute = "00";


showHourOptions = false;
showMinuteOptions = false;

hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

toggleHourDropdown() {
  this.showHourOptions = !this.showHourOptions;
  this.showMinuteOptions = false;
}

toggleMinuteDropdown() {
  this.showMinuteOptions = !this.showMinuteOptions;
  this.showHourOptions = false;
}

selectHour(h: string) {
  this.selectedHour = h;
  this.showHourOptions = false;
}

selectMinute(m: string) {
  this.selectedMinute = m;
  this.showMinuteOptions = false;
}

toggleAmPm() {
  this.amPm = this.amPm === "AM" ? "PM" : "AM";
}

toggleCalendar() {
  this.showCalendar = !this.showCalendar;

  this.tempSelectedDate = new Date(this.date || new Date());
  this.selectedMonth = this.tempSelectedDate.getMonth();
  this.selectedMonthString = this.months[this.selectedMonth];
  this.selectedYear = this.tempSelectedDate.getFullYear();

  if (this.showTime && !this.tempTime) {
    const today = new Date();
    const isToday = this.isSameDate(this.tempSelectedDate, today);

    const hours = isToday ? today.getHours() : 0;
    const minutes = isToday ? today.getMinutes() : 0;

    this.tempSelectedDate.setHours(hours, minutes, 0, 0);

    this.selectedHour = (!this.is24Hour && hours > 12 ? hours - 12 : hours)
      .toString()
      .padStart(2, "0");
    this.selectedMinute = minutes.toString().padStart(2, "0");
    this.amPm = !this.is24Hour && hours >= 12 ? "PM" : "AM";

    this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;
  }
}


 initTimeFromDate(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  this.selectedHour = (!this.is24Hour && hours > 12 ? hours - 12 : hours)
    .toString()
    .padStart(2, "0");
  this.selectedMinute = minutes.toString().padStart(2, "0");
  this.amPm = !this.is24Hour && hours >= 12 ? "PM" : "AM";

  this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;
  this.tempSelectedDate.setHours(hours, minutes, 0, 0);
}
fixToUTC(dateValue: any) {
  if (!dateValue) return null;

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (isNaN(date.getTime())) return null;

  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ));
}

confirm() {
  if (this.isDisabled(this.tempSelectedDate)) return;

  let hours: number;
  let minutes: number;

 
  if (this.showTime) {
    hours = Number(this.selectedHour);
    minutes = Number(this.selectedMinute);

    if (!this.is24Hour) {
      if (this.amPm === "PM" && hours < 12) hours += 12;
      if (this.amPm === "AM" && hours === 12) hours = 0;
    }
  } else {
    hours = 0;
    minutes = 0;
  }


  this.tempSelectedDate.setHours(hours, minutes, 0, 0);

  this.selectedDate = new Date(this.tempSelectedDate);
  this.date = this.selectedDate;


  const pad = (n: number) => n.toString().padStart(2, '0');
  const localDateString = `${this.selectedDate.getFullYear()}-${pad(this.selectedDate.getMonth() + 1)}-${pad(this.selectedDate.getDate())}T${pad(this.selectedDate.getHours())}:${pad(this.selectedDate.getMinutes())}:${pad(this.selectedDate.getSeconds())}`;

 console.log(localDateString);
 
  this.dateChange.emit(this.selectedDate);
  this.onChange(localDateString); 
  this.onTouched();

  this.showCalendar = false;
}



setToStartOfDay() {

  this.selectedHour = this.is24Hour ? '00' : '12';
  this.selectedMinute = '00';
  this.amPm = 'AM';


  this.tempSelectedDate.setHours(0, 0, 0, 0);
  this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;

  this.selectedDate = new Date(this.tempSelectedDate);
}



  previousMonth() {
    this.selectedMonth--;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    }
    this.updateTempSelectedDate();
  }

  nextMonth() {
    this.selectedMonth++;
    if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    }
    this.updateTempSelectedDate();
  }

  onDropdownYearChange(event: DropdownChangeEvent): void {
    this.selectedYear = event.value;
    this.updateTempSelectedDate();
  }

  onDropdownMonthChange(event: DropdownChangeEvent): void {
    this.selectedMonth = this.months.indexOf(event.value);
    this.updateTempSelectedDate();
  }

  updateTempSelectedDate() {
    this.tempSelectedDate.setMonth(this.selectedMonth);
    this.tempSelectedDate.setFullYear(this.selectedYear);
  }

  getDaysInMonth(): (Date | null)[] {
    const days: (Date | null)[] = [];
    const year = this.selectedYear;
    const month = this.selectedMonth;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < offset; i++) {
      days.push(null);
    }

    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      const day = new Date(year, month, i);
      days.push(day);
    }
    return days;
  }

isDisabled(day: Date | string): boolean {
  const dayDate = this.toDate(day);

  if (this.minDate && dayDate < this.stripTime(this.toDate(this.minDate))) return true;
  if (this.maxDate && dayDate > this.stripTime(this.toDate(this.maxDate))) return true;

  return false;
}

private stripTime(date: Date | string): Date {
  const d = this.toDate(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

private toDate(value: Date | string): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}
 is24Hour: boolean = false;
selectTemporaryDate(day: Date) {
  if (this.isDisabled(day)) return;

  const isNewDate = !this.isSameDate(this.tempSelectedDate, day);
  this.tempSelectedDate = new Date(day);

  if (this.showTime) {
    if (isNewDate) {

      const today = new Date();
      const isToday =
        day.getFullYear() === today.getFullYear() &&
        day.getMonth() === today.getMonth() &&
        day.getDate() === today.getDate();

      const hours = isToday ? today.getHours() : 0;
      const minutes = isToday ? today.getMinutes() : 0;

      this.tempSelectedDate.setHours(hours, minutes, 0, 0);

      this.selectedHour = (!this.is24Hour && hours > 12 ? hours - 12 : hours)
        .toString()
        .padStart(2, "0");
      this.selectedMinute = minutes.toString().padStart(2, "0");
      this.amPm = !this.is24Hour && hours >= 12 ? "PM" : "AM";

      this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;
    } else {
 
      const [h, m] = this.tempTime.split(':');
      this.selectedHour = h;
      this.selectedMinute = m;
      if (!this.is24Hour) this.amPm = Number(h) >= 12 ? 'PM' : 'AM';
    }
  }
}





  isSelected(day: Date): boolean {
    return (
      day.getDate() === this.tempSelectedDate.getDate() &&
      day.getMonth() === this.tempSelectedDate.getMonth() &&
      day.getFullYear() === this.tempSelectedDate.getFullYear()
    );
  }

  formatDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`;
    }
  }



  cancel() {
    this.showCalendar = false;
  }
}
