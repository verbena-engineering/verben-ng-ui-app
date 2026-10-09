import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { addMonths, compareDays, endOfMonth, startOfMonth } from '../date-utils';

interface VisibleMonth {
  date: Date;
  caption: string;
}

interface Cell {
  value: number;
  label: string;
  current: boolean;
  disabled: boolean;
}

const YEARS_PER_PAGE = 12;

/**
 * The calendar of <app-date-picker>: month navigation and three views
 *   days   → one or two months of days (click the caption for months)
 *   months → the 12 months of a year (click the year for years)
 *   years  → 12 years at a time, to jump far quickly (birth dates…)
 * It replaces the classic picker's month / year dropdowns. What to
 * highlight, the bounds and the clicks pass straight through to
 * <verben-calendar-grid>.
 */
@Component({
  selector: 'verben-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerbenCalendarComponent implements OnChanges {
  /** First month on screen. Two-way: [(month)] */
  @Input() month: Date = startOfMonth(new Date());
  /** Months side by side in the days view */
  @Input() count: 1 | 2 = 1;
  /** Highlighted period. For a single day pass the same day as start and end */
  @Input() start: Date | null = null;
  @Input() end: Date | null = null;
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() today: Date = new Date();
  @Input() weekStartsOn: 0 | 1 = 1;
  /** false = preview only: days can't be clicked */
  @Input() interactive = true;

  @Output() monthChange = new EventEmitter<Date>();
  @Output() pick = new EventEmitter<Date>();
  @Output() hover = new EventEmitter<Date | null>();

  view: 'days' | 'months' | 'years' = 'days';
  visibleMonths: VisibleMonth[] = [];
  monthCells: Cell[] = [];
  yearCells: Cell[] = [];
  yearsCaption = '';
  private firstYear = 0;
  /** The last month this component emitted, to tell it apart from a jump made by the parent */
  private emitted: Date | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // The parent moved the calendar (Today, a previewed preset…): show the days
    if (changes['month'] && this.month !== this.emitted) this.view = 'days';
    this.build();
  }

  // trackBy: build() makes new objects, and re-creating the grid under the
  // mouse would lose clicks
  trackByMonth(_: number, month: VisibleMonth): number {
    return month.date.getTime();
  }

  shiftMonth(delta: number): void {
    this.go(addMonths(this.month, delta));
  }

  shiftYear(delta: number): void {
    this.go(new Date(this.month.getFullYear() + delta, this.month.getMonth(), 1));
  }

  shiftYearPage(delta: number): void {
    this.firstYear += delta * YEARS_PER_PAGE;
    this.build();
  }

  showMonths(): void {
    this.view = 'months';
    this.build();
  }

  showYears(): void {
    const year = this.month.getFullYear();
    this.firstYear = year - (year % YEARS_PER_PAGE);
    this.view = 'years';
    this.build();
  }

  pickMonth(index: number): void {
    this.view = 'days';
    this.go(new Date(this.month.getFullYear(), index, 1));
  }

  pickYear(year: number): void {
    this.view = 'months';
    this.go(new Date(year, this.month.getMonth(), 1));
  }

  private go(month: Date): void {
    this.month = startOfMonth(month);
    this.emitted = this.month;
    this.monthChange.emit(this.month);
    this.build();
  }

  private build(): void {
    this.visibleMonths = Array.from({ length: this.count }, (_, i) => {
      const date = addMonths(this.month, i);
      return { date, caption: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) };
    });

    const year = this.month.getFullYear();
    this.monthCells = Array.from({ length: 12 }, (_, index) => {
      const first = new Date(year, index, 1);
      return {
        value: index,
        label: first.toLocaleDateString(undefined, { month: 'short' }),
        current: index === this.month.getMonth(),
        disabled:
          (!!this.min && compareDays(endOfMonth(first), this.min) < 0) ||
          (!!this.max && compareDays(first, this.max) > 0),
      };
    });

    if (this.view === 'years') {
      this.yearCells = Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
        const y = this.firstYear + i;
        return {
          value: y,
          label: String(y),
          current: y === year,
          disabled: (!!this.min && y < this.min.getFullYear()) || (!!this.max && y > this.max.getFullYear()),
        };
      });
      this.yearsCaption = `${this.firstYear} – ${this.firstYear + YEARS_PER_PAGE - 1}`;
    }
  }
}
