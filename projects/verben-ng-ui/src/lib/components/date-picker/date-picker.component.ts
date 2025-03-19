import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownChangeEvent } from '../drop-down/DropdownChangeEvent';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  @Input() placeholder = 'Select date';
  @Input() format = 'MM/DD/YYYY';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() useDropdowns: boolean = true;
  @Input() yearPlaceholder: string = 'Select a year';
  @Input() monthPlaceholder: string = 'Select a month';
  @Input() date: Date | null = null; // Two-way binding support
  @Output() dateChange = new EventEmitter<Date>(); // Emit date changes

  selectedDate: Date = new Date();
  tempSelectedDate: Date = new Date();
  showCalendar = false;

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  yearRange: number[] = Array.from({ length: new Date().getFullYear() - 1960 + 1 }, (_, i) => 1960 + i);
  
  selectedMonth: number = 1;
  selectedYear: number = new Date().getFullYear();

  ngOnChanges() {
    if (this.date) {
      this.selectedDate = new Date(this.date);
      this.tempSelectedDate = new Date(this.date);
      this.selectedMonth = this.selectedDate.getMonth();
      this.selectedYear = this.selectedDate.getFullYear();
    }
  }

  get displayDate(): string {
    return this.date ? this.formatDate(this.date, this.format) : '';
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.tempSelectedDate = new Date(this.date || new Date());
    this.selectedMonth = this.tempSelectedDate.getMonth();
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
    this.selectedMonth = event.value;
    this.updateTempSelectedDate();
  }

  updateTempSelectedDate() {
    this.tempSelectedDate.setMonth(this.selectedMonth);
    this.tempSelectedDate.setFullYear(this.selectedYear);
  }

  getDaysInMonth(): Date[] {
    const days = [];
    const year = this.tempSelectedDate.getFullYear();
    const month = this.tempSelectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }

  selectTemporaryDate(day: Date) {
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
    this.selectedDate = new Date(this.tempSelectedDate);
    this.dateChange.emit(this.selectedDate); // Emit change
    this.showCalendar = false;
  }

  cancel() {
    this.showCalendar = false;
  }
}
