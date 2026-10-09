import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  compareDays,
  daysInMonth,
  isOutside,
  isSameDay,
  startOfMonth,
} from '../date-utils';

interface CalendarDay {
  date: Date;
  label: string;
  ariaLabel: string;
  disabled: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  /** Cell is part of a multi-day band (and where the band starts / ends) */
  band: boolean;
  bandStart: boolean;
  bandEnd: boolean;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * One month of days. Purely presentational: it knows nothing about modes or
 * forms. The parent passes what to highlight (start / end) and reacts to
 * (pick) and (hover). The same grid is used for single, range and preset
 * preview, and twice side by side when two months are shown.
 */
@Component({
  selector: 'verben-calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerbenCalendarGridComponent implements OnChanges {
  /** Any date inside the month to show */
  @Input() month: Date = new Date();
  @Input() weekStartsOn: 0 | 1 = 1;
  /** Highlighted period. For a single day pass the same day as start and end */
  @Input() start: Date | null = null;
  @Input() end: Date | null = null;
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() today: Date = new Date();
  /** false = preview only (preset mode): days can't be clicked */
  @Input() interactive = true;

  @Output() pick = new EventEmitter<Date>();
  @Output() hover = new EventEmitter<Date | null>();

  weekdays: string[] = [];
  weeks: (CalendarDay | null)[][] = [];
  caption = '';

  // Rebuild only when an input changes (OnPush), never during rendering
  ngOnChanges(): void {
    this.weekdays = [
      ...WEEKDAYS.slice(this.weekStartsOn),
      ...WEEKDAYS.slice(0, this.weekStartsOn),
    ];
    this.caption = this.month.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
    this.weeks = this.buildWeeks();
  }

  // trackBy (like React's `key`): keep the same day buttons when only the
  // highlight changes, instead of re-creating them on every hover
  trackByIndex(index: number): number {
    return index;
  }

  trackByDay(index: number, day: CalendarDay | null): number | string {
    return day ? day.date.getTime() : `empty-${index}`;
  }

  onPick(day: CalendarDay): void {
    if (this.interactive && !day.disabled) this.pick.emit(day.date);
  }

  private buildWeeks(): (CalendarDay | null)[][] {
    const first = startOfMonth(this.month);
    // Empty cells before day 1 so it lands under the right weekday
    const leading = (first.getDay() - this.weekStartsOn + 7) % 7;
    const cells: (CalendarDay | null)[] = Array(leading).fill(null);

    for (let d = 1; d <= daysInMonth(first); d++) {
      cells.push(this.buildDay(new Date(first.getFullYear(), first.getMonth(), d)));
    }
    while (cells.length % 7) cells.push(null);

    const weeks: (CalendarDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }

  private buildDay(date: Date): CalendarDay {
    const { start, end } = this;
    const isStart = !!start && isSameDay(date, start);
    const isEnd = !!end && isSameDay(date, end);
    const inRange =
      !!start && !!end && compareDays(date, start) > 0 && compareDays(date, end) < 0;
    const multiDay = !!start && !!end && !isSameDay(start, end);

    return {
      date,
      label: String(date.getDate()),
      ariaLabel: date.toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      disabled: isOutside(date, this.min, this.max),
      isToday: isSameDay(date, this.today),
      isStart,
      isEnd,
      inRange,
      band: multiDay && (inRange || isStart || isEnd),
      bandStart: multiDay && isStart,
      bandEnd: multiDay && isEnd,
    };
  }
}
