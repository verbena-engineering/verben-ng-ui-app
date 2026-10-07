/**
 * 'single' = one day (a normal date picker)
 * 'range'  = a start day and an end day
 * 'preset' = a named period such as "Last month" or "Q3 2026"
 */
export type VerbenDatePickerMode = 'single' | 'range' | 'preset';

/**
 * What the user picked, emitted by (selectionChange).
 * start is always 00:00:00.000 and end 23:59:59.999, so every selection —
 * even a single day — can be used directly as a from/to filter.
 */
export interface DateSelection {
  mode: VerbenDatePickerMode;
  start: Date;
  end: Date;
  /** Preset mode: the preset's id, e.g. 'last-month' or 'q3-2026' */
  presetId?: string;
  /** Preset mode: the preset's label, e.g. 'Last month' */
  label?: string;
}
