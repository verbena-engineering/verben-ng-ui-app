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
import { parsePresetText } from '../date-preset-parser';
import {
  DATE_PERIOD_LABELS,
  DATE_PRESETS,
  DatePeriod,
  DatePreset,
  DatePresetId,
  findPreset,
  resolvePresets,
} from '../date-presets';
import {
  DateSpan,
  VerbenDateFormat,
  addMonths,
  clampSpan,
  compareDays,
  endOfDay,
  endOfMonth,
  formatDate,
  isOutside,
  parseDate,
  startOfDay,
  startOfMonth,
  toLocalIso,
} from '../date-utils';
import { DateSelection } from '../verben-date-picker.types';

/**
 * <verben-simple-date-picker>: an ALTERNATIVE design to <verben-date-picker>,
 * built alongside it so the two can be compared. No mode tabs:
 *
 *   ☐ Range   [🔍 preset combobox …]     ← one checkbox + one search field
 *   calendar                             ← one day, or a range when ticked
 *
 * The combobox lists presets tagged by period (Daily … Yearly) and also
 * understands typed ones that aren't in the list ("last 5 months",
 * "q2 2025", "march 2026", "2024", see date-preset-parser.ts).
 *
 * Same value shape as <verben-date-picker>:
 *   one day       → "2026-10-07T00:00:00"
 *   range, preset → ["2026-09-01T00:00:00", "2026-09-30T23:59:59"]
 */

const POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 6 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -6 },
];

/** Every built-in preset, in catalog order (the combobox is searchable) */
const ALL_PRESETS = Object.keys(DATE_PRESETS) as DatePresetId[];

interface PresetOption {
  preset: DatePreset;
  /** Period tag: Daily, Weekly, Monthly, Quarterly, Yearly (or a custom group) */
  tag: string;
  /** Short dates, e.g. "Sep 1 – Sep 30" */
  dates: string;
  disabled: boolean;
  /** Made from the typed text rather than taken from the list */
  typed: boolean;
}

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

let nextId = 0;

@Component({
  selector: 'verben-simple-date-picker',
  templateUrl: './simple-date-picker.component.html',
  styleUrls: ['./simple-date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerbenSimpleDatePickerComponent),
      multi: true,
    },
  ],
})
export class VerbenSimpleDatePickerComponent implements ControlValueAccessor, OnChanges {
  // ---------- Inputs ----------
  /** The "Range" checkbox: false = one day per click, true = start + end. Two-way: [(rangeMode)] */
  @Input() rangeMode = false;
  /** Show the "Range" checkbox */
  @Input() allowRange = true;
  /** Presets in the combobox: built-in ids and/or your own DatePreset objects */
  @Input() presets: (DatePresetId | DatePreset)[] = ALL_PRESETS;
  /** Understand typed presets that aren't in the list ("last 5 months", "q2 2025") */
  @Input() allowTypedPresets = true;
  @Input() placeholder = 'Select date';
  @Input() searchPlaceholder = 'Preset, e.g. last 3 months';
  @Input() format: VerbenDateFormat = 'MM/DD/YYYY';
  @Input() minDate: Date | string | null = null;
  @Input() maxDate: Date | string | null = null;
  @Input() weekStartsOn: 0 | 1 = 1;
  /** Months side by side while "Range" is ticked (always 1 on phones) */
  @Input() monthsShown: 1 | 2 = 1;
  @Input() clearable = true;
  @Input() disabled = false;
  /** Override "today" (presets are relative to it). Mainly for demos / tests */
  @Input() today: Date | null = null;

  // ---------- Outputs ----------
  @Output() selectionChange = new EventEmitter<DateSelection | null>();
  @Output() rangeModeChange = new EventEmitter<boolean>();

  @ViewChild('trigger') trigger?: ElementRef<HTMLButtonElement>;

  readonly positions = POSITIONS;
  readonly listId = `vsp-list-${nextId++}`;

  // ---------- State ----------
  open = false;
  selection: DateSelection | null = null;
  view: 'days' | 'months' = 'days';
  viewMonth = startOfMonth(new Date());
  draftStart: Date | null = null;
  hoverDate: Date | null = null;
  // Combobox
  query = '';
  listOpen = false;
  options: PresetOption[] = [];
  activeIndex = -1;

  // ---------- Derived (set in refresh(), the template only reads fields) ----------
  presetList: DatePreset[] = resolvePresets(ALL_PRESETS);
  min: Date | null = null;
  max: Date | null = null;
  todayDate = startOfDay(new Date());
  visibleMonths: VisibleMonth[] = [];
  monthCells: MonthCell[] = [];
  highlightStart: Date | null = null;
  highlightEnd: Date | null = null;
  displayText = '';
  hint = '';

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
    this.refresh();
  }

  // ---------- Popup ----------

  toggle(): void {
    if (this.disabled) return;
    this.open ? this.close() : this.openPopup();
  }

  openPopup(): void {
    this.open = true;
    this.view = 'days';
    this.resetDraft();
    this.query = '';
    this.listOpen = false;
    this.viewMonth = startOfMonth(this.selection?.start ?? this.clampToBounds(this.todayDate));
    this.refresh();
  }

  close(): void {
    if (!this.open) return;
    this.open = false;
    this.listOpen = false;
    this.resetDraft();
    this.onTouched();
    this.refresh();
    setTimeout(() => this.trigger?.nativeElement.focus());
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    // First Esc closes the preset list, the next one the popup
    if (this.listOpen) this.closeList();
    else this.close();
  }

  // ---------- Range checkbox ----------

  toggleRange(): void {
    this.rangeMode = !this.rangeMode;
    this.rangeModeChange.emit(this.rangeMode);
    this.resetDraft();
    this.refresh();
  }

  // ---------- Calendar ----------

  onDayPick(day: Date): void {
    if (!this.rangeMode) {
      this.commit({ mode: 'single', start: startOfDay(day), end: endOfDay(day) });
      return;
    }
    if (!this.draftStart) {
      this.draftStart = startOfDay(day);
      this.hoverDate = null;
      this.refresh();
      return;
    }
    // Second click ends the range, in either order
    const [start, end] = compareDays(day, this.draftStart) < 0 ? [day, this.draftStart] : [this.draftStart, day];
    this.commit({ mode: 'range', start: startOfDay(start), end: endOfDay(end) });
  }

  onDayHover(day: Date | null): void {
    if (!this.draftStart) return;
    this.hoverDate = day;
    this.refresh();
  }

  goToToday(): void {
    if (!this.rangeMode && !isOutside(this.todayDate, this.min, this.max)) {
      this.onDayPick(this.todayDate);
      return;
    }
    this.viewMonth = startOfMonth(this.todayDate);
    this.view = 'days';
    this.refresh();
  }

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

  // ---------- Preset combobox ----------

  onSearchFocus(): void {
    this.listOpen = true;
    this.buildOptions();
    this.refresh();
  }

  onSearchBlur(): void {
    this.closeList();
  }

  onQueryInput(value: string): void {
    this.query = value;
    this.listOpen = true;
    this.buildOptions();
    // Pre-select the best match so Enter picks it and the calendar shows it
    const first = this.options.findIndex((o) => !o.disabled);
    if (first >= 0) this.setActive(first);
    else {
      this.activeIndex = -1;
      this.refresh();
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.listOpen) this.onSearchFocus();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const count = this.options.length;
        if (!count) return;
        let i = this.activeIndex;
        // Move to the next enabled option, wrapping around
        for (let tries = 0; tries < count; tries++) {
          i = (i + step + count) % count;
          if (!this.options[i].disabled) break;
        }
        this.setActive(i);
        break;
      }
      case 'Enter': {
        const option = this.options[this.activeIndex];
        if (this.listOpen && option) {
          event.preventDefault();
          this.chooseOption(option);
        }
        break;
      }
      case 'Escape':
        if (this.listOpen) {
          event.preventDefault();
          event.stopPropagation(); // keep the popup open; only the list closes
          this.closeList();
        }
        break;
      case 'Tab':
        this.closeList();
        break;
    }
  }

  trackByOption(_: number, option: PresetOption): string {
    return option.preset.id;
  }

  setActive(index: number): void {
    this.activeIndex = index;
    const option = this.options[index];
    // Show the hovered / arrowed preset on the calendar
    const span = option && this.spanFor(option.preset);
    if (span) this.viewMonth = startOfMonth(span[0]);
    this.refresh();
  }

  chooseOption(option: PresetOption): void {
    const span = this.spanFor(option.preset);
    if (option.disabled || !span) return;
    this.commit({
      mode: 'preset',
      start: span[0],
      end: span[1],
      presetId: option.preset.id,
      label: option.preset.label,
    });
  }

  // ---------- Clearing ----------

  clear(): void {
    this.selection = null;
    this.resetDraft();
    this.selectionChange.emit(null);
    this.onChange(null);
    this.onTouched();
    this.close();
    this.refresh();
  }

  // ---------- ControlValueAccessor ----------

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
    this.onChange(
      selection.mode === 'single'
        ? toLocalIso(selection.start)
        : [toLocalIso(selection.start), toLocalIso(selection.end)],
    );
    this.close();
  }

  /** Accepts a day, [start, end], or a preset id ("last-month", "q2-2025") */
  private fromModel(value: unknown): DateSelection | null {
    if (value == null || value === '') return null;
    if (typeof value === 'string') {
      const preset = findPreset(value, this.presetList);
      const span = preset && this.spanFor(preset);
      if (preset && span) {
        return { mode: 'preset', start: span[0], end: span[1], presetId: preset.id, label: preset.label };
      }
    }
    if (Array.isArray(value)) {
      const start = parseDate(value[0]);
      const end = parseDate(value[1]);
      if (!start) return null;
      return end
        ? { mode: 'range', start: startOfDay(start), end: endOfDay(end) }
        : { mode: 'single', start: startOfDay(start), end: endOfDay(start) };
    }
    const date = parseDate(value);
    return date ? { mode: 'single', start: startOfDay(date), end: endOfDay(date) } : null;
  }

  private closeList(): void {
    this.listOpen = false;
    this.activeIndex = -1;
    this.refresh();
  }

  /** List presets matching every typed word (in label or tag), typed preset first */
  private buildOptions(): void {
    const words = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const listed = this.presetList
      .map((preset) => this.toOption(preset, false))
      .filter((o) => words.every((w) => `${o.preset.label} ${o.tag}`.toLowerCase().includes(w)));

    const typed = this.allowTypedPresets ? parsePresetText(this.query, this.todayDate) : null;
    if (typed) {
      const existing = listed.findIndex((o) => o.preset.id === typed.id);
      if (existing >= 0) listed.unshift(...listed.splice(existing, 1));
      else listed.unshift(this.toOption(typed, true));
    }
    this.options = listed;
  }

  private toOption(preset: DatePreset, typed: boolean): PresetOption {
    const span = this.spanFor(preset);
    const group = preset.group ?? '';
    return {
      preset,
      typed,
      tag: DATE_PERIOD_LABELS[group as DatePeriod] ?? group,
      dates: span ? this.shortSpan(span) : 'outside the allowed dates',
      disabled: !span,
    };
  }

  private spanFor(preset: DatePreset): DateSpan | null {
    return clampSpan(
      preset.range(this.todayDate, { weekStartsOn: this.weekStartsOn }),
      this.min,
      this.max,
    );
  }

  // "Sep 1 – Sep 30", with years only when they differ from this year
  private shortSpan([start, end]: DateSpan): string {
    const year = this.todayDate.getFullYear();
    const f = (d: Date) =>
      d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        ...(d.getFullYear() !== year ? { year: 'numeric' } : {}),
      });
    return compareDays(start, end) === 0 ? f(start) : `${f(start)} – ${f(end)}`;
  }

  private resetDraft(): void {
    this.draftStart = null;
    this.hoverDate = null;
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

  private isNarrowScreen(): boolean {
    return typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 520px)').matches;
  }

  private fmt(d: Date): string {
    return formatDate(d, this.format);
  }

  private refresh(): void {
    const s = this.selection;
    const dates = s ? `${this.fmt(s.start)} – ${this.fmt(s.end)}` : '';
    const fixed = !!s?.presetId && !!findPreset(s.presetId, this.presetList)?.fixed;
    this.displayText = !s
      ? ''
      : s.mode === 'single'
        ? this.fmt(s.start)
        : s.label
          ? fixed
            ? s.label
            : `${s.label} (${dates})`
          : dates;

    // Calendar highlight: range in progress > previewed preset > selection
    const active = this.listOpen ? this.options[this.activeIndex] : undefined;
    let highlight: [Date | null, Date | null] = s ? [s.start, s.end] : [null, null];
    if (this.draftStart) {
      const other = this.hoverDate ?? this.draftStart;
      highlight =
        compareDays(other, this.draftStart) < 0 ? [other, this.draftStart] : [this.draftStart, other];
    } else if (active) {
      highlight = this.spanFor(active.preset) ?? highlight;
    }
    [this.highlightStart, this.highlightEnd] = highlight;

    this.hint = this.draftStart
      ? `From ${this.fmt(this.draftStart)}, pick the end day`
      : active
        ? `${active.preset.label} · ${active.dates}`
        : this.rangeMode
          ? 'Pick the start day'
          : 'Pick a day or a preset';

    const count = this.rangeMode && this.monthsShown === 2 && !this.isNarrowScreen() ? 2 : 1;
    this.visibleMonths = Array.from({ length: count }, (_, i) => {
      const date = addMonths(this.viewMonth, i);
      return { date, caption: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) };
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
