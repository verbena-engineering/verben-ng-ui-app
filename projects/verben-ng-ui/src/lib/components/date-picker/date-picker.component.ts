import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
  forwardRef,
} from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DATE_PERIODS,
  DATE_PRESETS,
  DEFAULT_DATE_PRESETS,
  DatePeriod,
  DatePreset,
  DatePresetId,
  dayPreset,
  findPreset,
  presetSpan,
  resolvePresets,
  spanPreset,
} from './date-presets';
import {
  DateSpan,
  VerbenDateFormat,
  compareDays,
  dayCount,
  endOfDay,
  formatDate,
  formatShortSpan,
  isOutside,
  parseDate,
  startOfDay,
  startOfMonth,
  toLocalIso,
} from './date-utils';
import {
  DatePickerSelectionMode,
  DatePickerVariant,
  DateRange,
  DateSelection,
} from './date-picker.types';

/*
 * <app-date-picker>: the library's one date picker.
 *
 *   <app-date-picker [(ngModel)]="due"></app-date-picker>                           one day
 *   <app-date-picker selectionMode="range" [(ngModel)]="period"></app-date-picker>  a range
 *   <app-date-picker variant="simple" …>     + "Range" checkbox and a preset search
 *   <app-date-picker variant="advanced" …>   + Date | Range | Periods tabs
 *
 * Everything the classic picker accepted still works: [(date)], [(range)],
 * selectionMode, showTime, useDefaultDate, minDate / maxDate, format, bgColor,
 * border, overlayWidth, datePickerWidth (useDropdowns and the dropdown
 * placeholders are accepted but no longer needed: click the month caption).
 *
 * Built from small parts in this folder:
 *   date-utils.ts, date-presets.ts, date-preset-parser.ts   pure logic, unit tested
 *   calendar/        month navigation + days / months / years views
 *   calendar-grid/   one month of days
 *   period-panel/    the Periods tab (advanced, or selectionMode="preset")
 *   preset-search/   the preset combobox (simple)
 *
 * Value (ngModel / formControl), local time without a time zone:
 *   one day       → "2026-10-07T00:00:00"   (with showTime: the picked time)
 *   range, preset → ["2026-09-01T00:00:00", "2026-09-30T23:59:59"]
 * (selectionChange) gives the full DateSelection, incl. a preset's id.
 */

const POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 6 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -6 },
];

const ALL_MODES: DatePickerSelectionMode[] = ['default', 'range', 'preset'];

const MODE_LABELS: Record<DatePickerSelectionMode, string> = {
  default: 'Date',
  range: 'Range',
  preset: 'Periods',
};

/** Every built-in preset: the simple variant's search lists them all */
const ALL_PRESETS = Object.keys(DATE_PRESETS) as DatePresetId[];

/** Singular unit per period tab, for "Several months" / "pick the last month" */
const PERIOD_UNITS: Record<string, string> = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

const pad = (n: number) => String(n).padStart(2, '0');

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
export class DatePickerComponent implements ControlValueAccessor, OnChanges, OnInit {
  // ---------- What it picks ----------
  /** How much UI around the calendar: 'default' (just the calendar), 'simple' or 'advanced' */
  @Input() variant: DatePickerVariant = 'default';
  /** What a click picks. Use [(selectionMode)] when the user can switch (simple / advanced) */
  @Input() selectionMode: DatePickerSelectionMode = 'default';
  /** advanced: the tabs to offer, in order. Unset = all three */
  @Input() modes: DatePickerSelectionMode[] | null = null;
  /** advanced: rename the tabs, e.g. { preset: 'Reports' } */
  @Input() modeLabels: Partial<Record<DatePickerSelectionMode, string>> = {};
  /**
   * Presets: built-in ids and/or your own DatePreset objects.
   * Unset = a short list for the Periods tab, every built-in one for the search.
   */
  @Input() presets: (DatePresetId | DatePreset)[] | null = null;
  /** Periods tab: which period tabs to show, in order */
  @Input() periods: DatePeriod[] = DATE_PERIODS;
  /** Periods tab: offer the "Several months" checkbox to pick a span of periods */
  @Input({ transform: booleanAttribute }) allowSeveral = true;
  /** simple: show the "Range" checkbox */
  @Input({ transform: booleanAttribute }) allowRange = true;
  /** simple: understand typed presets that aren't listed ("last 5 months", "q2 2025") */
  @Input({ transform: booleanAttribute }) allowTypedPresets = true;
  @Input() searchPlaceholder = 'Preset, e.g. last 3 months';
  /** One day: also pick hours and minutes */
  @Input({ transform: booleanAttribute }) showTime = false;

  // ---------- Value, besides ngModel / formControl ----------
  /** One day, two-way: [(date)] */
  @Input() date: Date | string | null = null;
  /** A range, two-way: [(range)] */
  @Input() range: DateRange | null = null;
  /** Pick today when there is no value yet (one-day mode) */
  @Input({ transform: booleanAttribute }) useDefaultDate = false;

  // ---------- Limits & text ----------
  @Input() minDate: Date | string | null | undefined = null;
  @Input() maxDate: Date | string | null | undefined = null;
  @Input() placeholder = 'Select date';
  @Input() format: VerbenDateFormat | (string & {}) = 'MM/DD/YYYY';
  @Input() weekStartsOn: 0 | 1 = 1;
  /** Range: one or two months side by side (always one on phones) */
  @Input() monthsShown: 1 | 2 = 1;
  @Input({ transform: booleanAttribute }) clearable = true;
  @Input({ transform: booleanAttribute }) disabled = false;
  /** Override "today" (presets are relative to it). Mainly for demos and tests */
  @Input() today: Date | null = null;

  // ---------- Look ----------
  /** Field background, e.g. "var(--vbn-color-surface-alt)" */
  @Input() bgColor: string | null = null;
  /** Field border, e.g. "1px solid var(--vbn-color-primary)" */
  @Input() border: string | null = null;
  /** Popup width in px. Unset = fits its content */
  @Input() overlayWidth: number | null = null;
  /** Popup width as CSS, e.g. "400px". Unset = fits its content */
  @Input() datePickerWidth: string | null = null;
  /** @deprecated Kept so old templates compile: month and year are picked by clicking the caption */
  @Input() useDropdowns = true;
  /** @deprecated See useDropdowns */
  @Input() yearPlaceholder = '';
  /** @deprecated See useDropdowns */
  @Input() monthPlaceholder = '';

  // ---------- Outputs ----------
  /** Full details of what was picked (null when cleared) */
  @Output() selectionChange = new EventEmitter<DateSelection | null>();
  /** The user switched mode (simple checkbox / advanced tabs). Enables [(selectionMode)] */
  @Output() selectionModeChange = new EventEmitter<DatePickerSelectionMode>();
  /** One day picked or cleared. Enables [(date)] */
  @Output() dateChange = new EventEmitter<Date | null>();
  /** Range or period picked or cleared. Enables [(range)] */
  @Output() rangeChange = new EventEmitter<DateRange | null>();

  @ViewChild('trigger') trigger?: ElementRef<HTMLButtonElement>;

  readonly positions = POSITIONS;
  readonly hourOptions = Array.from({ length: 24 }, (_, i) => pad(i));
  readonly minuteOptions = Array.from({ length: 60 }, (_, i) => pad(i));

  // ---------- State ----------
  open = false;
  selection: DateSelection | null = null;
  /** First month on screen */
  viewMonth = startOfMonth(new Date());
  /** Range: first click, waiting for the second */
  draftStart: Date | null = null;
  hoverDate: Date | null = null;
  /** A preset being hovered (Periods tab) or highlighted (preset search) */
  hoverPreset: DatePreset | null = null;
  /** Periods: active tab ('day', 'week', …) as reported by the panel */
  periodTab = '';
  /** Periods: "Several …" checkbox, pick a span of periods */
  multi = false;
  /** Periods: first period of a span in progress */
  periodDraft: DatePreset | null = null;
  /** showTime: the time given to the picked day */
  hour = 0;
  minute = 0;

  // ---------- Derived (set by refresh(), never computed in the template) ----------
  modeList: DatePickerSelectionMode[] = ['default'];
  presetList: DatePreset[] = resolvePresets(DEFAULT_DATE_PRESETS);
  min: Date | null = null;
  max: Date | null = null;
  todayDate = startOfDay(new Date());
  /** Where the period panel's steppers start */
  panelFocus = this.todayDate;
  /** Days can be clicked: everywhere except the Periods tabs other than Daily */
  calendarInteractive = true;
  /** Periods: the calendar shows next to the grid (hidden on phones except Daily) */
  showPeriodCalendar = true;
  calendarCount: 1 | 2 = 1;
  /** Hour and minute selects are shown */
  timeOn = false;
  /** Label of the "Several …" checkbox for the current tab ('' = hidden) */
  severalLabel = '';
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
    if (changes['presets'] || changes['variant']) {
      const fallback = this.variant === 'simple' ? ALL_PRESETS : DEFAULT_DATE_PRESETS;
      this.presetList = resolvePresets(this.presets ?? fallback);
    }
    if (changes['minDate']) this.min = this.toDay(this.minDate);
    if (changes['maxDate']) this.max = this.toDay(this.maxDate);
    if (changes['today']) this.todayDate = startOfDay(this.today ?? new Date());
    if (changes['variant'] || changes['modes'] || changes['selectionMode']) {
      this.modeList =
        this.variant === 'advanced' ? (this.modes?.length ? [...this.modes] : ALL_MODES) : [this.selectionMode];
      if (!this.modeList.includes(this.selectionMode)) this.selectionMode = this.modeList[0];
    }
    // Classic value inputs; ngModel / formControl come in through writeValue
    if (changes['date'] && this.selectionMode === 'default') this.setSelection(this.fromModel(this.date));
    if (changes['range'] && this.selectionMode !== 'default') this.setSelection(this.fromModel(this.range));
    this.refresh();
  }

  ngOnInit(): void {
    if (this.useDefaultDate && !this.selection && this.selectionMode === 'default') {
      this.setSelection(this.daySelection(this.showTime ? new Date() : this.todayDate));
      this.refresh();
      // After the forms directives have registered (they set up after this hook)
      queueMicrotask(() => this.selection && this.emit(this.selection));
    }
  }

  labelFor(mode: DatePickerSelectionMode): string {
    return this.modeLabels[mode] ?? MODE_LABELS[mode];
  }

  // ---------- Opening / closing ----------

  toggle(): void {
    if (this.disabled) return;
    this.open ? this.close() : this.openPopup();
  }

  /** Classic name for toggle() */
  toggleCalendar(): void {
    this.toggle();
  }

  openPopup(): void {
    this.open = true;
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

  // ---------- Switching what is picked ----------

  setMode(mode: DatePickerSelectionMode): void {
    if (mode === this.selectionMode) return;
    this.selectionMode = mode;
    this.selectionModeChange.emit(mode);
    this.resetDraft();
    // The current value stays until something new is picked
    if (this.selection) this.viewMonth = startOfMonth(this.selection.start);
    this.refresh();
  }

  /** simple: the "Range" checkbox */
  toggleRange(): void {
    this.setMode(this.selectionMode === 'range' ? 'default' : 'range');
  }

  // ---------- Picking ----------

  onDayPick(day: Date): void {
    switch (this.selectionMode) {
      case 'preset':
        // Periods, Daily tab: a day is a period; with "Several days", a span
        if (!this.multi) this.onPresetChoose(dayPreset(day));
        else if (!this.draftStart) this.startDraft(day);
        else this.onPresetChoose(spanPreset(dayPreset(this.draftStart), dayPreset(day)));
        return;
      case 'range':
        // 1st click = start, 2nd click = end (an earlier day restarts)
        if (!this.draftStart || compareDays(day, this.draftStart) < 0) this.startDraft(day);
        else this.commit({ mode: 'range', start: this.draftStart, end: endOfDay(day) });
        return;
      default:
        // With showTime the popup stays open so the time can still change
        if (this.timeOn) this.commitTime(day);
        else this.commit(this.daySelection(day));
    }
  }

  onDayHover(day: Date | null): void {
    if (!this.draftStart) return;
    this.hoverDate = day;
    this.refresh();
  }

  /** A preset is hovered (Periods tab) or highlighted (preset search): show it */
  onPresetPreview(preset: DatePreset | null): void {
    this.hoverPreset = preset;
    const span = preset && this.spanFor(preset);
    if (span && this.periodTab !== 'day') {
      // Its start, or for a span of periods its end
      this.viewMonth = startOfMonth(preset.id.includes('..') ? span[1] : span[0]);
    }
    this.refresh();
  }

  onPresetChoose(preset: DatePreset): void {
    const span = this.spanFor(preset);
    if (!span) return;
    this.commit({ mode: 'preset', start: span[0], end: span[1], presetId: preset.id, label: preset.label });
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

  /** One day: picks today (now, with showTime). Otherwise: shows today's month */
  goToToday(): void {
    if (this.selectionMode === 'default' && !isOutside(this.todayDate, this.min, this.max)) {
      if (this.timeOn) {
        const now = new Date();
        [this.hour, this.minute] = [now.getHours(), now.getMinutes()];
      }
      this.onDayPick(this.todayDate);
      return;
    }
    this.viewMonth = startOfMonth(this.todayDate);
    this.refresh();
  }

  clear(): void {
    this.setSelection(null);
    this.resetDraft();
    this.emit(null);
    this.close();
    this.refresh();
  }

  /** Classic name for clear() */
  clearDate(): void {
    this.clear();
  }

  // ---------- Time (showTime) ----------

  setTime(hour: number, minute: number, endOfMinute = false): void {
    [this.hour, this.minute] = [hour, minute];
    if (this.selection) this.commitTime(this.selection.start, endOfMinute);
    else this.refresh();
  }

  // ---------- ControlValueAccessor (ngModel / reactive forms) ----------

  writeValue(value: unknown): void {
    // Classic behaviour: with useDefaultDate an empty form value keeps today
    if ((value == null || value === '') && this.useDefaultDate && this.selection) return;
    this.setSelection(this.fromModel(value));
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

  private commit(selection: DateSelection, close = true): void {
    this.setSelection(selection);
    this.emit(selection);
    if (close) this.close();
    this.refresh();
  }

  /** showTime: the day at the chosen hour and minute ("End of day" adds :59.999) */
  private commitTime(day: Date, endOfMinute = false): void {
    const at = new Date(
      day.getFullYear(), day.getMonth(), day.getDate(),
      this.hour, this.minute, endOfMinute ? 59 : 0, endOfMinute ? 999 : 0,
    );
    this.commit({ mode: 'default', start: at, end: at }, false);
  }

  /** Tells every listener: ngModel / formControl, (selectionChange), and [(date)] or [(range)] */
  private emit(s: DateSelection | null): void {
    this.selectionChange.emit(s);
    if (!s) {
      this.onChange(null);
      this.date = null;
      this.range = null;
      this.dateChange.emit(null);
      this.rangeChange.emit(null);
      return;
    }
    if (s.mode === 'default') {
      this.onChange(toLocalIso(s.start));
      this.date = new Date(s.start);
      this.dateChange.emit(this.date);
    } else {
      this.onChange([toLocalIso(s.start), toLocalIso(s.end)]);
      this.range = [new Date(s.start), new Date(s.end)];
      this.rangeChange.emit(this.range);
    }
  }

  private setSelection(selection: DateSelection | null): void {
    this.selection = selection;
    // The time selects follow the value
    if (selection?.mode === 'default' && this.showTime) {
      [this.hour, this.minute] = [selection.start.getHours(), selection.start.getMinutes()];
    }
  }

  private startDraft(day: Date): void {
    this.draftStart = startOfDay(day);
    this.hoverDate = null;
    this.refresh();
  }

  /**
   * Accepts everything the picker emits, plus a DateSelection object and a
   * preset id ('last-month', 'q3-2026'), which is resolved against today so a
   * saved "Last month" stays relative. An array that exactly matches a preset
   * shows that preset's name.
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
      return this.matchPreset(start, end) ?? { mode: 'range', start: startOfDay(start), end: endOfDay(end) };
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

  /** One day; with showTime it keeps its time */
  private daySelection(date: Date): DateSelection {
    return this.showTime
      ? { mode: 'default', start: new Date(date), end: new Date(date) }
      : { mode: 'default', start: startOfDay(date), end: endOfDay(date) };
  }

  private presetSelection(preset: DatePreset): DateSelection | null {
    const span = this.spanFor(preset);
    return span ? { mode: 'preset', start: span[0], end: span[1], presetId: preset.id, label: preset.label } : null;
  }

  // Only where presets are offered, so a plain range picker never relabels
  private matchPreset(start: Date, end: Date): DateSelection | null {
    if (this.variant === 'default' && this.selectionMode !== 'preset') return null;
    for (const preset of this.presetList) {
      const span = this.spanFor(preset);
      if (span && compareDays(span[0], start) === 0 && compareDays(span[1], end) === 0) {
        return this.presetSelection(preset);
      }
    }
    return null;
  }

  private spanFor(preset: DatePreset): DateSpan | null {
    return presetSpan(preset, this.todayDate, this.weekStartsOn, this.min, this.max);
  }

  private resetDraft(): void {
    this.draftStart = null;
    this.hoverDate = null;
    this.hoverPreset = null;
    this.periodDraft = null;
  }

  private toDay(value: Date | string | null | undefined): Date | null {
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
    return formatDate(d, this.format as VerbenDateFormat);
  }

  private fmtShort(d: Date): string {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private isFixedPreset(id: string | undefined): boolean {
    return !!id && !!findPreset(id, this.presetList)?.fixed;
  }

  /** Footer text: what is hovered, else what to do next */
  private buildHint(): string {
    if (this.selectionMode === 'preset') {
      const unit = PERIOD_UNITS[this.periodTab] ?? 'period';
      if (this.hoverPreset && this.summary) return this.summary;
      if (this.draftStart) return `From ${this.fmtShort(this.draftStart)}, pick the last day`;
      if (this.periodDraft) return `From ${this.periodDraft.label}, pick the last ${unit}`;
      if (this.multi) return `Pick the first ${unit}`;
      return this.summary || 'Choose a period';
    }
    // The preset search's highlighted option
    const previewed = this.hoverPreset && this.spanFor(this.hoverPreset);
    if (previewed) return `${this.hoverPreset!.label} · ${formatShortSpan(previewed, this.todayDate)}`;
    if (this.selectionMode === 'range') {
      return this.draftStart ? `From ${this.fmt(this.draftStart)}, pick the end date` : 'Pick the start date';
    }
    if (this.timeOn) return 'Pick a day, then a time';
    return this.variant === 'simple' ? 'Pick a day or a preset' : 'Pick a day';
  }

  /**
   * Recomputes everything the template shows. Called after every state
   * change, so the template only reads plain fields.
   */
  private refresh(): void {
    const s = this.selection;
    this.timeOn = this.showTime && this.selectionMode === 'default';

    // The field: "10/07/2026", "10/07/2026 14:30", "Last month (09/01/2026 – 09/30/2026)", "Q3 2026"
    const dates = s ? `${this.fmt(s.start)} – ${this.fmt(s.end)}` : '';
    this.displayText = !s
      ? ''
      : s.mode === 'default'
        ? this.showTime
          ? `${this.fmt(s.start)} ${pad(s.start.getHours())}:${pad(s.start.getMinutes())}`
          : this.fmt(s.start)
        : s.label
          ? this.isFixedPreset(s.presetId)
            ? s.label
            : `${s.label} (${dates})`
          : dates;

    // What the calendar highlights: a range being picked > a previewed preset > the value
    let highlight: [Date | null, Date | null] = s ? [s.start, s.end] : [null, null];
    if (this.selectionMode === 'range' && this.draftStart) {
      const previewEnd = this.hoverDate && compareDays(this.hoverDate, this.draftStart) >= 0 ? this.hoverDate : null;
      highlight = [this.draftStart, previewEnd];
    } else if (this.selectionMode === 'preset' && this.draftStart) {
      // Daily tab, "Several days": from the first click to the hovered day, either way
      const other = this.hoverDate ?? this.draftStart;
      highlight = compareDays(other, this.draftStart) < 0 ? [other, this.draftStart] : [this.draftStart, other];
    } else if (this.hoverPreset || this.periodDraft) {
      highlight = this.spanFor((this.hoverPreset ?? this.periodDraft)!) ?? highlight;
    }
    [this.highlightStart, this.highlightEnd] = highlight;

    // Periods: describe the hovered (or selected) period
    const described = this.hoverPreset
      ? this.presetSelection(this.hoverPreset)
      : s?.mode === 'preset'
        ? s
        : null;
    if (described) {
      const days = dayCount(described.start, described.end);
      const count = `${days} ${days === 1 ? 'day' : 'days'}`;
      this.summary = this.isFixedPreset(described.presetId)
        ? `${described.label} · ${count}`
        : `${described.label} · ${this.fmtShort(described.start)} – ${this.fmtShort(described.end)} · ${count}`;
    } else {
      this.summary = '';
    }
    this.hint = this.buildHint();

    // Layout
    const unit = PERIOD_UNITS[this.periodTab];
    this.severalLabel = unit ? `Several ${unit}s` : '';
    this.calendarInteractive = this.selectionMode !== 'preset' || this.periodTab === 'day';
    this.showPeriodCalendar = this.periodTab === 'day' || !this.isNarrowScreen();
    this.calendarCount = this.selectionMode === 'range' && this.monthsShown === 2 && !this.isNarrowScreen() ? 2 : 1;
  }
}
