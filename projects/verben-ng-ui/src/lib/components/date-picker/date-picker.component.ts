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

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.tempSelectedDate = new Date(this.date || new Date());
    this.selectedMonth = this.tempSelectedDate.getMonth();
    this.selectedMonthString = this.months[this.selectedMonth];
    this.selectedYear = this.tempSelectedDate.getFullYear();
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


  selectTemporaryDate(day: Date) {
    if (this.isDisabled(day)) return;
    this.tempSelectedDate = day;
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

  confirm() {
    if (this.isDisabled(this.tempSelectedDate)) return;

    this.tempSelectedDate.setHours(12, 0, 0, 0);
    this.selectedDate = new Date(this.tempSelectedDate);
    this.date = this.selectedDate;

    this.dateChange.emit(this.selectedDate);
    this.onChange(this.selectedDate);
    this.onTouched();

    this.showCalendar = false;
  }

  cancel() {
    this.showCalendar = false;
  }
}
