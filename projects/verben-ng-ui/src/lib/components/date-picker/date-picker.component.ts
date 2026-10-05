import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { DropdownChangeEvent } from 'verben-ng-ui/src/lib/components/drop-down';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/*
 * CHANGE LOG (2026-10-02) — search for "[DP-n]" to find each change.
 *  [DP-1]  New public API: selectionMode ('default' | 'range'), range input,
 *          rangeChange output, DateRange + DatePickerSelectionMode types.
 *  [DP-2]  Range state fields + isRangeMode helper.
 *  [DP-3]  Incoming values (ngModel / [range] / useDefaultDate) handle range mode.
 *  [DP-4]  Select-to-commit: clicking a day sets the value immediately (no OK).
 *          Closes right away unless showTime is on (stays open to pick time).
 *  [DP-5]  Range selection flow: open, pick start, pick end, commit, clear.
 *  [DP-6]  Range highlighting helpers (start / end / in-between / hover preview).
 *  [DP-7]  Input text shows "start – end" in range mode.
 *  [DP-8]  Changing the visible month never moves a range selection.
 *  [DP-9]  Footer: "Cancel" -> "Close"; range hint text and Clear button (template).
 *  [DP-10] Bug fix: empty picker opened on December of last year.
 *  [DP-11] Hour/minute lists float over the calendar instead of pushing it down.
 *  [DP-12] Year dropdown scrolls to the selected year (template).
 *  [DP-13] Range value is an array [start, end] (was an { start, end } object).
 */

// [DP-1] 'default' = one date (existing behaviour), 'range' = start + end date
export type DatePickerSelectionMode = 'default' | 'range';

// [DP-1]/[DP-13] Range value: [start, end]. Emitted by rangeChange and
// accepted by [range]. ngModel gets the same shape with local date strings.
export type DateRange = [Date, Date];

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
export class DatePickerComponent implements ControlValueAccessor, OnChanges {
  @Input() placeholder = 'Select date';
  @Input() format = 'MM/DD/YYYY';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() disabled?: boolean = false;
  @Input() bgColor?: string = 'var(--vbn-color-surface)';
  @Input() border?: string = '';
  @Input() useDropdowns: boolean = true;
  @Input() yearPlaceholder: string = 'Select a year';
  @Input() monthPlaceholder: string = 'Select a month';
  @Input() date: Date | null | string = null;
  @Input() showTime: boolean = false;
  @Input() overlayWidth: number | null = 400;

  @Input() datePickerWidth: string = '400px';
  @Input() useDefaultDate: boolean = false;
  // [DP-1] 'range' picks a start and an end date; the popup closes once both are chosen
  @Input() selectionMode: DatePickerSelectionMode = 'default';
  // [DP-1] Range value for [(range)] two-way binding (alternative to ngModel)
  @Input() range: DateRange | null = null;

  @Output() dateChange = new EventEmitter<Date | null>();
  // [DP-1] Fires when a full range is picked, or null when cleared
  @Output() rangeChange = new EventEmitter<DateRange | null>();
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

  daysInMonth: (Date | null)[] = [];

  // [DP-2] Range mode state:
  //   rangeStart/rangeEnd         = committed range (what the input shows)
  //   tempRangeStart/tempRangeEnd = range being picked while the popup is open
  //   hoverDate                   = day under the mouse, used for the preview band
  rangeStart: Date | null = null;
  rangeEnd: Date | null = null;
  tempRangeStart: Date | null = null;
  tempRangeEnd: Date | null = null;
  hoverDate: Date | null = null;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  // [DP-2] Shorthand used throughout the class and the template
  get isRangeMode(): boolean {
    return this.selectionMode === 'range';
  }

  writeValue(value: any): void {
    // [DP-3]/[DP-13] In range mode ngModel gives us [start, end] instead of a date
    if (this.isRangeMode) {
      this.setRange(value);
      return;
    }
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

  ngOnChanges(changes: SimpleChanges) {
    // [DP-3] In range mode, sync from the [range] input instead of [date]
    if (this.isRangeMode) {
      if (changes['range']) this.setRange(this.range);
      return;
    }
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

    // [DP-3] useDefaultDate (pre-fill today) only applies to single-date mode
    if (!this.date && this.useDefaultDate && !this.isRangeMode) {
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
    this.generateDaysInMonth();
  }

  get displayDate(): string {
    // [DP-7] Range mode shows "10/05/2026 – 10/12/2026" (empty until both ends exist)
    if (this.isRangeMode) {
      if (!this.rangeStart || !this.rangeEnd) return '';
      return `${this.formatDate(this.rangeStart, this.format)} – ${this.formatDate(
        this.rangeEnd,
        this.format,
      )}`;
    }
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
    // [DP-4] Time changes save immediately (no OK button any more)
    this.commitDate(false);
  }

  selectMinute(m: string) {
    this.selectedMinute = m;
    this.showMinuteOptions = false;
    // [DP-4] Time changes save immediately (no OK button any more)
    this.commitDate(false);
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    // [DP-11] Never reopen with an hour/minute list still expanded
    this.showHourOptions = false;
    this.showMinuteOptions = false;

    // [DP-5] Range mode has its own opening logic
    if (this.isRangeMode) {
      this.openRangeCalendar();
      return;
    }

    if (this.date) {
      this.tempSelectedDate = new Date(this.date);
    } else {
      this.tempSelectedDate = this.useDefaultDate ? new Date() : null;
    }

    // [DP-10] Bug fix: always set the visible month. Before, an empty picker
    // kept selectedMonth = 1 and the month dropdown was blank, which (see
    // onDropdownMonthChange) ended up showing December of the previous year.
    const focus = this.tempSelectedDate ?? new Date();
    this.selectedMonth = focus.getMonth();
    this.selectedMonthString = this.months[this.selectedMonth];
    this.selectedYear = focus.getFullYear();

    this.generateDaysInMonth();

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
    // [DP-5] Clearing a range resets start + end
    if (this.isRangeMode) {
      this.clearRange();
      return;
    }
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

  // [DP-4] Saves tempSelectedDate (with the chosen time) as the value.
  // Replaces the old OK-button-only confirm(); called on day click and on
  // every time change. close = whether to hide the popup afterwards.
  commitDate(close: boolean) {
    if (!this.tempSelectedDate) return;

    const hours = Number(this.selectedHour);
    const minutes = Number(this.selectedMinute);

    // Apply selected time FIRST
    this.tempSelectedDate.setHours(hours, minutes, 0, 0);

    // THEN validate
    if (this.isDisabled(this.tempSelectedDate)) return;

    this.selectedDate = new Date(this.tempSelectedDate);
    this.date = this.selectedDate;

    this.dateChange.emit(this.selectedDate);
    this.onChange(this.toLocalDateString(this.selectedDate));
    this.onTouched();

    if (close) this.showCalendar = false;
  }

  // [DP-4] Kept so any external caller of confirm() still works
  confirm() {
    this.commitDate(true);
  }

  // [DP-4] Extracted from the old confirm() so single and range modes share it.
  // Local time, no "Z" — same format ngModel has always received.
  private toLocalDateString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds(),
    )}`;
  }

  setToStartOfDay() {
    if (!this.tempSelectedDate) return;

    this.selectedHour = '00';
    this.selectedMinute = '00';

    this.tempSelectedDate.setHours(0, 0, 0, 0);
    this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;

    // [DP-4] Previously only updated a draft; now saves immediately
    this.commitDate(false);
  }

  setToEndOfDay() {
    if (!this.tempSelectedDate) return;

    this.selectedHour = '23';
    this.selectedMinute = '59';

    this.tempSelectedDate.setHours(23, 59, 59, 999);
    this.tempTime = `${this.selectedHour}:${this.selectedMinute}`;

    // [DP-4] Previously only updated a draft; now saves immediately
    this.commitDate(false);
  }

  // ---- [DP-5] Range mode ----

  // [DP-3]/[DP-5]/[DP-13] Accepts [start, end] as Dates or strings (from
  // ngModel or [range]). Anything that isn't an array counts as "no range".
  private setRange(value: any) {
    const [rawStart, rawEnd] = Array.isArray(value) ? value : [];
    const start = rawStart ? this.stripTime(rawStart) : null;
    const end = rawEnd ? this.stripTime(rawEnd) : null;
    this.rangeStart = start;
    this.rangeEnd = start && end ? end : null;
    if (this.rangeStart) {
      this.selectedMonth = this.rangeStart.getMonth();
      this.selectedYear = this.rangeStart.getFullYear();
    }
  }

  // [DP-5] Copy the committed range into the working range and show its month
  private openRangeCalendar() {
    this.tempRangeStart = this.rangeStart;
    this.tempRangeEnd = this.rangeEnd;
    this.hoverDate = null;

    const focus = this.rangeStart ?? new Date();
    this.selectedMonth = focus.getMonth();
    this.selectedMonthString = this.months[this.selectedMonth];
    this.selectedYear = focus.getFullYear();
    this.generateDaysInMonth();
  }

  // [DP-5] 1st click sets the start, 2nd click sets the end and closes.
  // Clicking a day before the start restarts the range from that day.
  private selectRangeDay(day: Date) {
    const picked = this.stripTime(day);

    if (
      !this.tempRangeStart ||
      this.tempRangeEnd ||
      picked < this.tempRangeStart
    ) {
      this.tempRangeStart = picked;
      this.tempRangeEnd = null;
      return;
    }

    this.tempRangeEnd = picked;
    this.commitRange();
  }

  // [DP-5] Save the range, notify ngModel / (rangeChange), close the popup
  private commitRange() {
    if (!this.tempRangeStart || !this.tempRangeEnd) return;

    // Whole days: start at 00:00:00.000, end at 23:59:59.999
    const start = new Date(this.tempRangeStart);
    const end = new Date(this.tempRangeEnd);
    end.setHours(23, 59, 59, 999);

    this.rangeStart = this.tempRangeStart;
    this.rangeEnd = this.tempRangeEnd;
    // [DP-13] Array shape: [start, end]
    this.range = [start, end];

    this.rangeChange.emit([start, end]);
    this.onChange([
      this.toLocalDateString(start),
      this.toLocalDateString(end),
    ]);
    this.onTouched();

    this.showCalendar = false;
  }

  // [DP-5] Reset everything and emit null
  private clearRange() {
    this.rangeStart = null;
    this.rangeEnd = null;
    this.tempRangeStart = null;
    this.tempRangeEnd = null;
    this.hoverDate = null;
    this.range = null;

    this.rangeChange.emit(null);
    this.onChange(null);
    this.onTouched();

    this.showCalendar = false;
  }

  // [DP-6] Template helpers that decide which CSS class each day button gets
  isRangeStart(day: Date): boolean {
    return !!this.tempRangeStart && this.isSameDate(day, this.tempRangeStart);
  }

  isRangeEnd(day: Date): boolean {
    const end = this.tempRangeEnd ?? this.previewEnd;
    return !!end && this.isSameDate(day, end);
  }

  // [DP-6] Strictly between start and end (or the hovered day while picking the end)
  isInRange(day: Date): boolean {
    const end = this.tempRangeEnd ?? this.previewEnd;
    if (!this.tempRangeStart || !end) return false;
    const d = this.stripTime(day);
    return d > this.tempRangeStart && d < end;
  }

  // [DP-6] While only the start is picked, the hovered day acts as a temporary end
  private get previewEnd(): Date | null {
    if (!this.tempRangeStart || !this.hoverDate) return null;
    const hovered = this.stripTime(this.hoverDate);
    return hovered >= this.tempRangeStart ? hovered : null;
  }

  previousMonth() {
    this.selectedMonth--;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    }
    this.updateTempSelectedDate();
    this.generateDaysInMonth();
  }

  nextMonth() {
    this.selectedMonth++;
    if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    }
    this.updateTempSelectedDate();
    this.generateDaysInMonth();
  }

  // [DP-10] The dropdowns also fire onChange when initialised with an empty
  // value; ignore those so the calendar doesn't jump to month -1 (December)
  onDropdownYearChange(event: DropdownChangeEvent): void {
    if (event.value == null) return;
    this.selectedYear = event.value;
    this.updateTempSelectedDate();
    this.generateDaysInMonth();
  }

  onDropdownMonthChange(event: DropdownChangeEvent): void {
    const month = this.months.indexOf(event.value);
    if (month < 0) return;
    this.selectedMonth = month;
    this.updateTempSelectedDate();
    this.generateDaysInMonth();
  }

  updateTempSelectedDate() {
    // [DP-8] Changing the visible month must never move a range selection
    if (this.isRangeMode || !this.tempSelectedDate) return;
    this.tempSelectedDate.setMonth(this.selectedMonth);
    this.tempSelectedDate.setFullYear(this.selectedYear);
  }

  generateDaysInMonth() {
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
      days.push(new Date(year, month, i));
    }

    this.daysInMonth = days;
  }

  // getDaysInMonth(): (Date | null)[] {
  //   const days: (Date | null)[] = [];
  //   const year = this.selectedYear;
  //   const month = this.selectedMonth;

  //   const firstDayOfMonth = new Date(year, month, 1).getDay();
  //   const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  //   for (let i = 0; i < offset; i++) {
  //     days.push(null);
  //   }

  //   const totalDays = new Date(year, month + 1, 0).getDate();
  //   for (let i = 1; i <= totalDays; i++) {
  //     const day = new Date(year, month, i);
  //     days.push(day);
  //   }
  //   return days;
  // }

  sanitizeDateString(value: string): string {
    return value?.endsWith('Z') ? value.slice(0, -1) : value;
  }

  // isDisabled(day: Date | string): boolean {
  //   const dayDate = this.toDate(day);

  //   if (this.minDate && dayDate < this.stripTime(this.toDate(this.minDate)))
  //     return true;
  //   if (this.maxDate && dayDate > this.stripTime(this.toDate(this.maxDate)))
  //     return true;

  //   return false;
  // }

  isDisabled(day: Date | string): boolean {
    const dayDate = this.stripTime(day);

    if (this.minDate && dayDate < this.stripTime(this.minDate)) return true;

    if (this.maxDate && dayDate > this.stripTime(this.maxDate)) return true;

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

  // toDate(value: Date | string): Date {
  //   if (value instanceof Date) return value;

  //   const sanitized = this.sanitizeDateString(value);

  //   const [datePart, timePart] = sanitized.split('T');
  //   const [year, month, day] = datePart.split('-').map(Number);

  //   if (!timePart) {
  //     return new Date(year, month - 1, day);
  //   }

  //   const [hours, minutes, seconds] = timePart.split(':').map(Number);

  //   return new Date(
  //     year,
  //     month - 1,
  //     day,
  //     hours || 0,
  //     minutes || 0,
  //     seconds || 0,
  //   );
  // }

  is24Hour: boolean = true;

  selectTemporaryDate(day: Date) {
    if (this.isDisabled(day)) return;
    // [DP-11] Picking a day closes any open hour/minute list
    this.showHourOptions = false;
    this.showMinuteOptions = false;
    // [DP-5] In range mode a click is a start/end pick instead
    if (this.isRangeMode) {
      this.selectRangeDay(day);
      return;
    }
    if (!this.tempSelectedDate) this.tempSelectedDate = new Date(day);

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

    // [DP-4] Selecting a day sets the value right away. With showTime the
    // popup stays open so the time can still be adjusted.
    this.commitDate(!this.showTime);
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

  // [DP-9] Was cancel(); renamed with the "Close" caption. Nothing to discard
  // any more because every pick is saved immediately.
  close() {
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
