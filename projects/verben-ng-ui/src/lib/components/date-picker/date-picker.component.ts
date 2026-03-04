import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  forwardRef,
} from '@angular/core';
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
  @Input() overlayWidth: number | null = null;

  @Input() datePickerWidth: string = '400px';
  @Input() useDefaultDate: boolean = false;

  @Output() dateChange = new EventEmitter<Date | null>();
  @ViewChild('datePickerContainer', { static: true })
  datePickerContainer!: ElementRef;
  @ViewChild('datePickerExpansion', { static: false })
  datePickerExpansion!: ElementRef;

  yearRange: number[] = [];
  filteredYearRange: number[] = [];

  selectedDate: Date | null = null;
  tempSelectedDate: Date | null = null;

  showCalendar = false;

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  selectedMonth: number = 1;
  selectedMonthString: string = '';
  selectedYear: number = new Date().getFullYear();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: Date | string | null): void {
    if (value) {
      if (typeof value === 'string') {
        value = this.sanitizeDateString(value);
      }

      const parsedDate = typeof value === 'string' ? new Date(value) : value;
      this.date = parsedDate;

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
      let d = this.date;
      if (typeof d === 'string') d = this.sanitizeDateString(d);

      const parsedDate = new Date(d);
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
      (_, i) => 1960 + i,
    );
    this.yearRange.sort((a, b) => b - a);

    if (!this.date && this.useDefaultDate) {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');

      const localDateString = `${now.getFullYear()}-${pad(
        now.getMonth() + 1,
      )}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(
        now.getMinutes(),
      )}:${pad(now.getSeconds())}`;

      this.selectedDate = new Date(localDateString);
      this.tempSelectedDate = new Date(localDateString);
      this.date = this.selectedDate;

      if (this.showTime) {
        const hours = now.getHours();
        const minutes = now.getMinutes();

        this.selectedHour = hours.toString().padStart(2, '0');
        this.selectedMinute = minutes.toString().padStart(2, '0');
        this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;
      }

      this.dateChange.emit(this.selectedDate);
      this.onChange(localDateString);
    }
  }

  get displayDate(): string {
    const parsedDate =
      typeof this.date === 'string' ? new Date(this.date) : this.date;
    return parsedDate ? this.formatDate(parsedDate, this.format) : '';
  }

  tempTime: string = '';
  selectedHour = '00';
  selectedMinute = '00';

  showHourOptions = false;
  showMinuteOptions = false;

  hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;

    if (this.date) {
      this.tempSelectedDate = new Date(this.date);
    } else {
      this.tempSelectedDate = this.useDefaultDate ? new Date() : null;
    }

    if (this.tempSelectedDate) {
      this.selectedMonth = this.tempSelectedDate.getMonth();
      this.selectedMonthString = this.months[this.selectedMonth];
      this.selectedYear = this.tempSelectedDate.getFullYear();
    }

    if (this.showTime && !this.tempTime) {
      const today = new Date();
      const isToday =
        this.tempSelectedDate && this.isSameDate(this.tempSelectedDate, today);

      const hours = isToday ? today.getHours() : 0;
      const minutes = isToday ? today.getMinutes() : 0;

      if (this.tempSelectedDate) {
        this.tempSelectedDate.setHours(hours, minutes, 0, 0);
      }
      this.selectedHour = hours.toString().padStart(2, '0');
      this.selectedMinute = minutes.toString().padStart(2, '0');
      this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;
    }
  }

  initTimeFromDate(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    this.selectedHour = hours.toString().padStart(2, '0');
    this.selectedMinute = minutes.toString().padStart(2, '0');
    this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;
    this.tempSelectedDate?.setHours(hours, minutes, 0, 0);
  }
  clearDate() {
    this.date = null;
    this.selectedDate = null;
    this.tempSelectedDate = null;
    this.tempTime = '';
    this.selectedHour = '00';
    this.selectedMinute = '00';

    this.dateChange.emit(null);

    this.onChange(null);
    this.onTouched();

    this.showCalendar = false;
  }

  fixToUTC(dateValue: any) {
    if (!dateValue) return null;

    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (isNaN(date.getTime())) return null;

    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      ),
    );
  }

  confirm() {
    if (!this.tempSelectedDate) return;
    if (this.isDisabled(this.tempSelectedDate)) return;

    const hours = Number(this.selectedHour);
    const minutes = Number(this.selectedMinute);

    this.tempSelectedDate.setHours(hours, minutes, 0, 0);

    this.selectedDate = new Date(this.tempSelectedDate);
    this.date = this.selectedDate;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const localDateString = `${this.selectedDate.getFullYear()}-${pad(
      this.selectedDate.getMonth() + 1,
    )}-${pad(this.selectedDate.getDate())}T${pad(
      this.selectedDate.getHours(),
    )}:${pad(this.selectedDate.getMinutes())}:${pad(
      this.selectedDate.getSeconds(),
    )}`;

    this.dateChange.emit(this.selectedDate);
    this.onChange(localDateString);
    this.onTouched();

    this.showCalendar = false;
  }

  setToStartOfDay() {
    if (!this.tempSelectedDate) return;

    this.selectedHour = '00';
    this.selectedMinute = '00';

    this.tempSelectedDate.setHours(0, 0, 0, 0);
    this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;

    this.selectedDate = new Date(this.tempSelectedDate);
  }

  setToEndOfDay() {
    if (!this.tempSelectedDate) return;

    this.selectedHour = '23';
    this.selectedMinute = '59';

    this.tempSelectedDate.setHours(23, 59, 59, 999);
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
    if (!this.tempSelectedDate) return;
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

  sanitizeDateString(value: string): string {
    return value?.endsWith('Z') ? value.slice(0, -1) : value;
  }

  isDisabled(day: Date | string): boolean {
    const dayDate = this.toDate(day);

    if (this.minDate && dayDate < this.stripTime(this.toDate(this.minDate)))
      return true;
    if (this.maxDate && dayDate > this.stripTime(this.toDate(this.maxDate)))
      return true;

    return false;
  }

  private stripTime(date: Date | string): Date {
    const d = this.toDate(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  toDate(value: Date | string): Date {
    if (value instanceof Date) return value;
    return new Date(this.sanitizeDateString(value));
  }

  is24Hour: boolean = true;

  selectTemporaryDate(day: Date) {
    if (!this.tempSelectedDate) this.tempSelectedDate = new Date(day);
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

        this.selectedHour = hours.toString().padStart(2, '0');
        this.selectedMinute = minutes.toString().padStart(2, '0');
        this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;
      } else {
        const [h, m] = this.tempTime.split(':');
        this.selectedHour = h;
        this.selectedMinute = m;
      }
    }
  }

  isSelected(day: Date): boolean {
    if (!this.tempSelectedDate) return false;

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

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) {
    if (!this.showCalendar) {
      return;
    }
    const isInsidePane = targetElement.closest('.cdk-overlay-pane') !== null;

    // !this.datePickerContainer.nativeElement.contains(targetElement)
    if (
      this.showCalendar &&
      this.datePickerExpansion &&
      !this.datePickerExpansion.nativeElement.contains(targetElement) &&
      !isInsidePane
    ) {
      this.showCalendar = false;
    }
  }
}
