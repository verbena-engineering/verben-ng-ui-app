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
    @Input() disabled?: boolean=false
  @Input() bgColor?: string='#fff'
    @Input() border?: string=''
  @Input() useDropdowns: boolean = true;
  @Input() yearPlaceholder: string = 'Select a year';
  @Input() monthPlaceholder: string = 'Select a month';
  @Input() date: Date | null|string = null; // Two-way binding support
  @Output() dateChange = new EventEmitter<Date>(); // Emit date changes
  yearRange: number[] = [];
  filteredYearRange: number[] = [];
  selectedDate: Date = new Date();
  tempSelectedDate: Date = new Date();
  showCalendar = false;

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


  
  selectedMonth: number = 1;
  selectedMonthString:string=''
  selectedYear: number = new Date().getFullYear();

  ngOnChanges() {
    if (this.date) {
      const parsedDate = typeof this.date === 'string' ? new Date(this.date) : this.date;
      this.selectedDate = new Date(parsedDate);
      this.tempSelectedDate = new Date(parsedDate);
      this.selectedMonth = this.selectedDate.getMonth();
      this.selectedYear = this.selectedDate.getFullYear();
    }
  }
  ngOnInit() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 10;
    this.yearRange = Array.from({ length: endYear - 1960 + 1 }, (_, i) => 1960 + i);
    this.yearRange.sort((a, b) => b - a);
  }
  get displayDate(): string {
    const parsedDate = typeof this.date === 'string' ? new Date(this.date) : this.date;
    return parsedDate ? this.formatDate(parsedDate, this.format) : '';
  }
  

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.tempSelectedDate = new Date(this.date || new Date());
    this.selectedMonth = this.tempSelectedDate.getMonth();
    this.selectedMonthString=this.months[this.selectedMonth]
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
   
    this.selectedMonth = this.months.indexOf(event.value)
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
    const offset = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); 
  
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
  
    const totalDays = new Date(year, month + 1, 0).getDate(); 
  
    // Add the actual days of the month
    for (let i = 1; i <= totalDays; i++) {
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
    this.tempSelectedDate.setHours(12, 0, 0, 0);
    this.selectedDate = new Date(this.tempSelectedDate);
    this.dateChange.emit(this.selectedDate);
    this.showCalendar = false;
  }

  cancel() {
    this.showCalendar = false;
  }
  
  
}
 