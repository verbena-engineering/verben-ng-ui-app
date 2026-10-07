import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DATE_PERIODS,
  DEFAULT_DATE_PRESETS,
  DatePeriod,
  DatePreset,
  DatePresetId,
  dayPreset,
  findPreset,
  spanPreset,
  resolvePresets,
} from './date-presets';
import {
  DateSpan,
  VerbenDateFormat,
  addMonths,
  clampSpan,
  compareDays,
  dayCount,
  endOfDay,
  endOfMonth,
  formatDate,
  isOutside,
  parseDate,
  startOfDay,
  startOfMonth,
  toLocalIso,
} from './date-utils';
import { DateSelection, VerbenDatePickerMode } from './verben-date-picker.types';

/**
 * One date picker that can change what it picks ("mutate"):
 *   mode="single"  → one day (default, behaves like a normal date picker)
 *   mode="range"   → start + end day, with a hover preview
 *   mode="preset"  → a period, organised in tabs: Daily · Weekly · Monthly ·
 *                    Quarterly · Yearly (quick choices + specific periods)
 * Pass [modes]="['single', 'range', 'preset']" to let the USER switch between
 * them inside the popup; [(mode)] tells you which one is active.
 *
 * Built from small parts so each can be read / reused on its own:
 *   date-utils.ts        pure date maths (local time, whole days)
 *   date-presets.ts      periods, built-in presets + helpers to define your own
 *   calendar-grid/       one month of days (presentational)
 *   period-panel/        period tabs, quick choices, specific-period grid
 *   this component       the field, popup, mode switch, value + forms wiring
 *
 * Value (ngModel / formControl):
 *   single        → "2026-10-07T00:00:00"
 *   range, preset → ["2026-09-01T00:00:00", "2026-09-30T23:59:59"]
 * (selectionChange) gives the full DateSelection, incl. the preset id.
 */

const POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 6 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -6 },
];

const MODE_LABELS: Record<VerbenDatePickerMode, string> = {
  single: 'Date',
  range: 'Range',
  preset: 'Periods',
};

/** Singular unit per period tab, for "Several months" / "pick the last month" */
const PERIOD_UNITS: Record<string, string> = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

interface VisibleMonth {
  date: Date;
  caption: string;
}

interface MonthCell {
  index: number;
  label: string;
  disabled: boolean;
  current: boolean;
}

@Component({
  selector: 'verben-date-picker',
  templateUrl: './verben-date-picker.component.html',
  styleUrls: ['./verben-date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerbenDatePickerComponent),
      multi: true,
    },
  ],
})
export class VerbenDatePickerComponent implements ControlValueAccessor, OnChanges {
  // ---------- Inputs ----------
  /** What a click picks. Use [(mode)] when the user can switch */
  @Input() mode: VerbenDatePickerMode = 'single';
  /** Modes the user can switch between in the popup. Unset = only `mode` */
  @Input() modes: VerbenDatePickerMode[] | null = null;
  /** Preset mode: quick choices — built-in ids and/or your own DatePreset objects */
  @Input() presets: (DatePresetId | DatePreset)[] = DEFAULT_DATE_PRESETS;
  /** Preset mode: which period tabs to show, in order */
  @Input() periods: DatePeriod[] = DATE_PERIODS;
  /** Preset mode: offer the "Several months" checkbox to pick a span of periods */
  @Input() allowSeveral = true;
  @Input() placeholder = 'Select date';
  @Input() format: VerbenDateFormat = 'MM/DD/YYYY';
  @Input() minDate: Date | string | null = null;
  @Input() maxDate: Date | string | null = null;
  @Input() weekStartsOn: 0 | 1 = 1;
  /** Range mode: show one or two months side by side */
  @Input() monthsShown: 1 | 2 = 1;
  @Input() clearable = true;
  @Input() disabled = false;
  /** Override "today" (presets are relative to it). Mainly for demos / tests */
  @Input() today: Date | null = null;
  /** Rename the mode switcher buttons, e.g. { preset: 'Reports' } */
  @Input() modeLabels: Partial<Record<VerbenDatePickerMode, string>> = {};

  // ---------- Outputs ----------
  /** Full details of what was picked (null when cleared) */
  @Output() selectionChange = new EventEmitter<DateSelection | null>();
  /** The user switched mode. Enables [(mode)] */
  @Output() modeChange = new EventEmitter<VerbenDatePickerMode>();

  @ViewChild('trigger') trigger?: ElementRef<HTMLButtonElement>;

  readonly positions = POSITIONS;

  // ---------- State ----------
  open = false;
  selection: DateSelection | null = null;
  view: 'days' | 'months' = 'days';
  /** First day of the (first) month on screen */
  viewMonth = startOfMonth(new Date());
  /** Range mode: first click, waiting for the second */
  draftStart: Date | null = null;
  hoverDate: Date | null = null;
  hoverPreset: DatePreset | null = null;
  /** Periods mode: active tab ('day', 'week', …) as reported by the panel */
  periodTab = '';
  /** Periods mode: "Several …" checkbox — pick a span of periods */
  multi = false;
  /** Periods mode: first period of a span in progress */
  periodDraft: DatePreset | null = null;

  // ---------- Derived (set by refresh(), never computed in the template) ----------
  modeList: VerbenDatePickerMode[] = ['single'];
  presetList: DatePreset[] = resolvePresets(DEFAULT_DATE_PRESETS);
  min: Date | null = null;
  max: Date | null = null;
  todayDate = startOfDay(new Date());
  /** Where the period panel's steppers start */
  panelFocus = this.todayDate;
  /** Days can be clicked: Date / Range modes, and the Daily tab of Periods */
  calendarInteractive = true;
  /** Periods mode shows the calendar next to the grid (hidden on phones except Daily) */
  showPeriodCalendar = true;
  /** Label of the "Several …" checkbox for the current tab ('' = hidden) */
  severalLabel = '';
  visibleMonths: VisibleMonth[] = [];
  monthCells: MonthCell[] = [];
  highlightStart: Date | null = null;
  highlightEnd: Date | null = null;
  displayText = '';
  hint = '';
  summary = '';

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['presets']) this.presetList = resolvePresets(this.presets ?? []);
    if (changes['minDate']) this.min = this.toDay(this.minDate);
    if (changes['maxDate']) this.max = this.toDay(this.maxDate);
    if (changes['today']) this.todayDate = startOfDay(this.today ?? new Date());
    if (changes['mode'] || changes['modes']) {
      this.modeList = this.modes?.length ? [...this.modes] : [this.mode];
      if (!this.modeList.includes(this.mode)) this.mode = this.modeList[0];
    }
    this.refresh();
  }

  labelFor(mode: VerbenDatePickerMode): string {
    return this.modeLabels[mode] ?? MODE_LABELS[mode];
  }

  // ---------- Opening / closing ----------

  toggle(): void {
    if (this.disabled) return;
    this.open ? this.close() : this.openPopup();
  }

  openPopup(): void {
    this.open = true;
    this.view = 'days';
    this.resetDraft();
    const focus = this.selection?.start ?? this.clampToBounds(this.todayDate);
    this.viewMonth = startOfMonth(focus);
    this.panelFocus = focus;
    this.refresh();
  }

  close(): void {
    if (!this.open) return;
    this.open = false;
    this.resetDraft();
    this.onTouched();
    this.refresh();
    // Give focus back to the field once the overlay is gone
    setTimeout(() => this.trigger?.nativeElement.focus());
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  // ---------- Mutating: switching mode ----------

  setMode(mode: VerbenDatePickerMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.modeChange.emit(mode);
    this.view = 'days';
    this.resetDraft();
    // The current value stays until the user picks something new
    if (this.selection) this.viewMonth = startOfMonth(this.selection.start);
    this.refresh();
  }

  // ---------- Picking ----------

  onDayPick(day: Date): void {
    // Periods mode, Daily tab: a day is a period; with "Several days", a span
    if (this.mode === 'preset') {
      if (!this.multi) {
        this.onPresetChoose(dayPreset(day));
      } else if (!this.draftStart) {
        this.draftStart = startOfDay(day);
        this.hoverDate = null;
        this.refresh();
      } else {
        this.onPresetChoose(spanPreset(dayPreset(this.draftStart), dayPreset(day)));
      }
      return;
    }
    if (this.mode === 'single') {
      this.commit({ mode: 'single', start: startOfDay(day), end: endOfDay(day) });
      return;
    }
    // Range: 1st click = start. 2nd click = end (an earlier day restarts)
    if (!this.draftStart || compareDays(day, this.draftStart) < 0) {
      this.draftStart = startOfDay(day);
      this.hoverDate = null;
      this.refresh();
      return;
    }
    this.commit({ mode: 'range', start: this.draftStart, end: endOfDay(day) });
  }

  onDayHover(day: Date | null): void {
    if (this.mode === 'single' || !this.draftStart) return;
    this.hoverDate = day;
    this.refresh();
  }

  onPresetPreview(preset: DatePreset | null): void {
    this.hoverPreset = preset;
    // Let the calendar follow what is hovered: its start, or for a span its end
    const span = preset && this.spanFor(preset);
    if (span && this.periodTab !== 'day') {
      this.viewMonth = startOfMonth(preset.id.includes('..') ? span[1] : span[0]);
      this.view = 'days';
    }
    this.refresh();
  }

  onPeriodTab(tab: string): void {
    this.periodTab = tab;
    this.resetDraft();
    this.refresh();
  }

  onSpanStart(preset: DatePreset | null): void {
    this.periodDraft = preset;
    this.refresh();
  }

  toggleMulti(): void {
    this.multi = !this.multi;
    this.resetDraft();
    this.refresh();
  }

  onPresetChoose(preset: DatePreset): void {
    const span = this.spanFor(preset);
    if (!span) return;
    this.commit({
      mode: 'preset',
      start: span[0],
      end: span[1],
      presetId: preset.id,
      label: preset.label,
    });
  }

  clear(): void {
    this.selection = null;
    this.resetDraft();
    this.selectionChange.emit(null);
    this.onChange(null);
    this.onTouched();
    this.close();
    this.refresh();
  }

  /** Single mode: picks today. Other modes: jumps to today's month */
  goToToday(): void {
    if (this.mode === 'single' && !isOutside(this.todayDate, this.min, this.max)) {
      this.onDayPick(this.todayDate);
      return;
    }
    this.viewMonth = startOfMonth(this.todayDate);
    this.view = 'days';
    this.refresh();
  }

  // ---------- Navigation ----------

  // trackBy: refresh() rebuilds visibleMonths, so without this every hover
  // would destroy and re-create the calendar grids (and the button under the cursor)
  trackByMonth(_: number, month: VisibleMonth): number {
    return month.date.getTime();
  }

  shiftMonth(delta: number): void {
    this.viewMonth = addMonths(this.viewMonth, delta);
    this.refresh();
  }

  shiftYear(delta: number): void {
    this.viewMonth = new Date(this.viewMonth.getFullYear() + delta, this.viewMonth.getMonth(), 1);
    this.refresh();
  }

  pickMonth(index: number): void {
    this.viewMonth = new Date(this.viewMonth.getFullYear(), index, 1);
    this.view = 'days';
    this.refresh();
  }

  // ---------- ControlValueAccessor (ngModel / reactive forms) ----------

  writeValue(value: unknown): void {
    this.selection = this.fromModel(value);
    this.resetDraft();
    this.refresh();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ---------- Internals ----------

  private commit(selection: DateSelection): void {
    this.selection = selection;
    this.selectionChange.emit(selection);
    this.onChange(this.toModel(selection));
    this.close();
  }

  private toModel(s: DateSelection): string | [string, string] {
    return s.mode === 'single'
      ? toLocalIso(s.start)
      : [toLocalIso(s.start), toLocalIso(s.end)];
  }

  /**
   * Accepts everything the component can emit, plus:
   *   a preset id ('last-month', 'q3-2026') → resolved against today, so a
   *     saved "Last month" stays relative instead of freezing the dates
   *   a DateSelection object
   * An array that exactly matches a preset shows that preset's label.
   */
  private fromModel(value: unknown): DateSelection | null {
    if (value == null || value === '') return null;

    if (typeof value === 'string') {
      const preset = findPreset(value, this.presetList);
      if (preset) return this.presetSelection(preset);
    }

    if (Array.isArray(value)) {
      const start = parseDate(value[0]);
      const end = parseDate(value[1]);
      if (!start) return null;
      if (!end) return this.daySelection(start);
      return this.matchPreset(start, end) ?? {
        mode: 'range',
        start: startOfDay(start),
        end: endOfDay(end),
      };
    }

    if (typeof value === 'object' && !(value instanceof Date)) {
      const v = value as Partial<DateSelection>;
      const start = parseDate(v.start);
      const end = parseDate(v.end);
      if (!start || !end) return null;
      return { ...v, mode: v.mode ?? 'range', start: startOfDay(start), end: endOfDay(end) };
    }

    const date = parseDate(value);
    return date ? this.daySelection(date) : null;
  }

  private daySelection(date: Date): DateSelection {
    return { mode: 'single', start: startOfDay(date), end: endOfDay(date) };
  }

  private presetSelection(preset: DatePreset): DateSelection | null {
    const span = this.spanFor(preset);
    return span
      ? { mode: 'preset', start: span[0], end: span[1], presetId: preset.id, label: preset.label }
      : null;
  }

  // Only when preset mode is available, so a plain range picker never relabels
  private matchPreset(start: Date, end: Date): DateSelection | null {
    if (!this.modeList.includes('preset')) return null;
    for (const preset of this.presetList) {
      const span = this.spanFor(preset);
      if (span && compareDays(span[0], start) === 0 && compareDays(span[1], end) === 0) {
        return this.presetSelection(preset);
      }
    }
    return null;
  }

  private spanFor(preset: DatePreset): DateSpan | null {
    return clampSpan(
      preset.range(this.todayDate, { weekStartsOn: this.weekStartsOn }),
      this.min,
      this.max,
    );
  }

  private resetDraft(): void {
    this.draftStart = null;
    this.hoverDate = null;
    this.hoverPreset = null;
    this.periodDraft = null;
  }

  private toDay(value: Date | string | null): Date | null {
    const d = parseDate(value);
    return d ? startOfDay(d) : null;
  }

  private clampToBounds(day: Date): Date {
    if (this.min && compareDays(day, this.min) < 0) return this.min;
    if (this.max && compareDays(day, this.max) > 0) return this.max;
    return day;
  }

  // Two months don't fit on a phone; show one there regardless of monthsShown
  private isNarrowScreen(): boolean {
    return typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 520px)').matches;
  }

  private fmt(d: Date): string {
    return formatDate(d, this.format);
  }

  // Footer text in Periods mode: what is hovered, else what to do next
  private periodHint(): string {
    const unit = PERIOD_UNITS[this.periodTab] ?? 'period';
    if (this.hoverPreset && this.summary) return this.summary;
    if (this.draftStart) return `From ${this.fmtShort(this.draftStart)}, pick the last day`;
    if (this.periodDraft) return `From ${this.periodDraft.label}, pick the last ${unit}`;
    if (this.multi) return `Pick the first ${unit}`;
    return this.summary || 'Choose a period';
  }

  private fmtShort(d: Date): string {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   * Recomputes everything the template shows. Called after every state
   * change, so the template only reads plain fields (no new objects during
   * change detection).
   */
  private refresh(): void {
    const s = this.selection;
    const dates = s ? `${this.fmt(s.start)} – ${this.fmt(s.end)}` : '';
    // "Q3 2026" already names its dates; "Last month" gets them added
    const namesItsDates = !!s?.presetId && !!findPreset(s.presetId, this.presetList)?.fixed;
    this.displayText = !s
      ? ''
      : s.mode === 'single'
        ? this.fmt(s.start)
        : s.label
          ? namesItsDates
            ? s.label
            : `${s.label} (${dates})`
          : dates;

    // What the calendar highlights
    let highlight: [Date | null, Date | null] = s ? [s.start, s.end] : [null, null];
    if (this.mode === 'range' && this.draftStart) {
      const previewEnd =
        this.hoverDate && compareDays(this.hoverDate, this.draftStart) >= 0
          ? this.hoverDate
          : null;
      highlight = [this.draftStart, previewEnd];
    } else if (this.mode === 'preset' && this.draftStart) {
      // Daily tab, "Several days": band from the first click to the hovered day
      const other = this.hoverDate ?? this.draftStart;
      highlight =
        compareDays(other, this.draftStart) < 0 ? [other, this.draftStart] : [this.draftStart, other];
    } else if (this.mode === 'preset' && (this.hoverPreset || this.periodDraft)) {
      highlight = this.spanFor((this.hoverPreset ?? this.periodDraft)!) ?? [null, null];
    }
    [this.highlightStart, this.highlightEnd] = highlight;

    // Preset mode: describe the hovered (or selected) period
    const described = this.hoverPreset
      ? this.presetSelection(this.hoverPreset)
      : s?.mode === 'preset'
        ? s
        : null;
    if (described) {
      const days = dayCount(described.start, described.end);
      const count = `${days} ${days === 1 ? 'day' : 'days'}`;
      // A fixed period's label already names its dates ("Q3 2026", "Aug 3 – Aug 9, 2026")
      const isFixed = !!described.presetId && !!findPreset(described.presetId, this.presetList)?.fixed;
      this.summary = isFixed
        ? `${described.label} · ${count}`
        : `${described.label} · ${this.fmtShort(described.start)} – ${this.fmtShort(described.end)} · ${count}`;
    } else {
      this.summary = '';
    }

    this.hint =
      this.mode === 'range'
        ? this.draftStart
          ? `From ${this.fmt(this.draftStart)}, pick the end date`
          : 'Pick the start date'
        : this.mode === 'single'
          ? 'Pick a day'
          : this.periodHint();

    // Periods mode layout
    const unit = PERIOD_UNITS[this.periodTab];
    this.severalLabel = unit ? `Several ${unit}s` : '';
    this.calendarInteractive = this.mode !== 'preset' || this.periodTab === 'day';
    this.showPeriodCalendar = this.periodTab === 'day' || !this.isNarrowScreen();

    const count =
      this.mode === 'range' && this.monthsShown === 2 && !this.isNarrowScreen() ? 2 : 1;
    this.visibleMonths = Array.from({ length: count }, (_, i) => {
      const date = addMonths(this.viewMonth, i);
      return {
        date,
        caption: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
      };
    });

    const year = this.viewMonth.getFullYear();
    this.monthCells = Array.from({ length: 12 }, (_, index) => {
      const first = new Date(year, index, 1);
      return {
        index,
        label: first.toLocaleDateString(undefined, { month: 'short' }),
        current: index === this.viewMonth.getMonth(),
        disabled:
          (!!this.min && compareDays(endOfMonth(first), this.min) < 0) ||
          (!!this.max && compareDays(first, this.max) > 0),
      };
    });
  }
}
