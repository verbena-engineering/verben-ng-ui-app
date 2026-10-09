/**
 * What a click picks (the same values the classic picker used, plus 'preset'):
 *   'default' = one day (optionally with a time, see showTime)
 *   'range'   = a start day and an end day
 *   'preset'  = a named period such as "Last month" or "Q3 2026" (Periods panel)
 */
export type DatePickerSelectionMode = 'default' | 'range' | 'preset';

/**
 * How much UI the popup shows around the calendar:
 *   'default'  = just the calendar; selectionMode decides what is picked (classic behaviour)
 *   'simple'   = + a "Range" checkbox and a preset search ("last 3 months", "Q2 2025")
 *   'advanced' = + Date | Range | Periods tabs, with Daily … Yearly period grids
 */
export type DatePickerVariant = 'default' | 'simple' | 'advanced';

/** Range value: [start, end]. Emitted by (rangeChange) and accepted by [range] */
export type DateRange = [Date, Date];

/**
 * What the user picked, emitted by (selectionChange).
 * start is 00:00:00.000 and end 23:59:59.999, so every selection, even a
 * single day, can be used directly as a from/to filter. With showTime, a
 * single day's start and end are both the picked moment.
 */
export interface DateSelection {
  mode: DatePickerSelectionMode;
  start: Date;
  end: Date;
  /** Presets: the preset's id, e.g. 'last-month' or 'q3-2026' */
  presetId?: string;
  /** Presets: the preset's label, e.g. 'Last month' */
  label?: string;
}
