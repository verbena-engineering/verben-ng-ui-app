/**
 * Periods for <verben-date-picker> preset mode.
 *
 * The panel has one tab per period: Daily · Weekly · Monthly · Quarterly ·
 * Yearly. Each tab shows a few QUICK presets (relative: "Last month") and,
 * except Daily, a grid of SPECIFIC periods (fixed: "September 2026").
 *
 * A preset is a label + a function that turns "today" into [start, end], so
 * teams can add their own. Its `group` decides the tab: a period key below,
 * or any other text to get a separate tab with that name.
 *
 *   const lastFortnight: DatePreset = {
 *     id: 'last-14-days',
 *     label: 'Last 14 days',
 *     group: 'day',
 *     range: (today) => [addDays(today, -13), endOfDay(today)],
 *   };
 *
 * Week / month / quarter / year presets are CALENDAR based: on Wed 7 Oct
 * 2026, "Last 2 months" = 1 Aug – 30 Sep (the two full months before this
 * one). "Last N days" presets are rolling and include today.
 */
import {
  DateSpan,
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from './date-utils';

export type DatePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export const DATE_PERIODS: DatePeriod[] = ['day', 'week', 'month', 'quarter', 'year'];

/** Tab labels */
export const DATE_PERIOD_LABELS: Record<DatePeriod, string> = {
  day: 'Daily',
  week: 'Weekly',
  month: 'Monthly',
  quarter: 'Quarterly',
  year: 'Yearly',
};

/** Settings a preset may need to resolve itself */
export interface DatePresetContext {
  weekStartsOn: 0 | 1;
}

export interface DatePreset {
  /** Stable id: emitted in selectionChange and accepted as an ngModel value */
  id: string;
  label: string;
  /** Tab it is listed under: a DatePeriod, or any text for a custom tab */
  group?: DatePeriod | string;
  /** true when the label already names the dates ("Q3 2026"), so the field doesn't repeat them */
  fixed?: boolean;
  /** Resolves the period for the given day */
  range: (today: Date, context: DatePresetContext) => DateSpan;
}

export type DatePresetId =
  | 'today'
  | 'yesterday'
  | 'last-7-days'
  | 'last-30-days'
  | 'last-90-days'
  | 'this-week'
  | 'last-week'
  | 'last-2-weeks'
  | 'last-4-weeks'
  | 'this-month'
  | 'last-month'
  | 'last-2-months'
  | 'last-3-months'
  | 'last-6-months'
  | 'last-12-months'
  | 'this-quarter'
  | 'last-quarter'
  | 'this-year'
  | 'year-to-date'
  | 'last-year'
  | 'last-2-years';

const lastDays = (n: number): DatePreset['range'] => (t) => [
  addDays(startOfDay(t), -(n - 1)),
  endOfDay(t),
];

// The n full weeks before the current one
const lastWeeks = (n: number): DatePreset['range'] => (t, { weekStartsOn }) => {
  const thisWeek = startOfWeek(t, weekStartsOn);
  return [addDays(thisWeek, -7 * n), endOfDay(addDays(thisWeek, -1))];
};

const lastMonths = (n: number): DatePreset['range'] => (t) => [
  startOfMonth(addMonths(t, -n)),
  endOfMonth(addMonths(t, -1)),
];

const lastYears = (n: number): DatePreset['range'] => (t) => [
  new Date(t.getFullYear() - n, 0, 1),
  endOfYear(new Date(t.getFullYear() - 1, 0, 1)),
];

// The n full quarters before the current one
const lastQuarters = (n: number): DatePreset['range'] => (t) => {
  const thisQuarter = startOfQuarter(t);
  return [addMonths(thisQuarter, -3 * n), endOfDay(addDays(thisQuarter, -1))];
};

const preset = (
  id: DatePresetId,
  label: string,
  group: DatePeriod,
  range: DatePreset['range'],
): DatePreset => ({ id, label, group, range });

/** Every built-in relative preset, by id */
export const DATE_PRESETS: Record<DatePresetId, DatePreset> = {
  today: preset('today', 'Today', 'day', (t) => [startOfDay(t), endOfDay(t)]),
  yesterday: preset('yesterday', 'Yesterday', 'day', (t) => [
    addDays(startOfDay(t), -1),
    endOfDay(addDays(t, -1)),
  ]),
  'last-7-days': preset('last-7-days', 'Last 7 days', 'day', lastDays(7)),
  'last-30-days': preset('last-30-days', 'Last 30 days', 'day', lastDays(30)),
  'last-90-days': preset('last-90-days', 'Last 90 days', 'day', lastDays(90)),

  'this-week': preset('this-week', 'This week', 'week', (t, { weekStartsOn }) => [
    startOfWeek(t, weekStartsOn),
    endOfWeek(t, weekStartsOn),
  ]),
  'last-week': preset('last-week', 'Last week', 'week', lastWeeks(1)),
  'last-2-weeks': preset('last-2-weeks', 'Last 2 weeks', 'week', lastWeeks(2)),
  'last-4-weeks': preset('last-4-weeks', 'Last 4 weeks', 'week', lastWeeks(4)),

  'this-month': preset('this-month', 'This month', 'month', (t) => [
    startOfMonth(t),
    endOfMonth(t),
  ]),
  'last-month': preset('last-month', 'Last month', 'month', lastMonths(1)),
  'last-2-months': preset('last-2-months', 'Last 2 months', 'month', lastMonths(2)),
  'last-3-months': preset('last-3-months', 'Last 3 months', 'month', lastMonths(3)),
  'last-6-months': preset('last-6-months', 'Last 6 months', 'month', lastMonths(6)),
  'last-12-months': preset('last-12-months', 'Last 12 months', 'month', lastMonths(12)),

  'this-quarter': preset('this-quarter', 'This quarter', 'quarter', (t) => [
    startOfQuarter(t),
    endOfQuarter(t),
  ]),
  'last-quarter': preset('last-quarter', 'Last quarter', 'quarter', (t) => {
    const inLastQuarter = addMonths(startOfQuarter(t), -3);
    return [startOfQuarter(inLastQuarter), endOfQuarter(inLastQuarter)];
  }),

  'this-year': preset('this-year', 'This year', 'year', (t) => [startOfYear(t), endOfYear(t)]),
  'year-to-date': preset('year-to-date', 'Year to date', 'year', (t) => [
    startOfYear(t),
    endOfDay(t),
  ]),
  'last-year': preset('last-year', 'Last year', 'year', lastYears(1)),
  'last-2-years': preset('last-2-years', 'Last 2 years', 'year', lastYears(2)),
};

/** Quick choices shown when [presets] isn't set: at most 4 per tab */
export const DEFAULT_DATE_PRESETS: DatePresetId[] = [
  'today',
  'yesterday',
  'last-7-days',
  'last-30-days',
  'this-week',
  'last-week',
  'last-2-weeks',
  'this-month',
  'last-month',
  'last-2-months',
  'last-3-months',
  'this-quarter',
  'last-quarter',
  'this-year',
  'year-to-date',
  'last-year',
  'last-2-years',
];

// ---------- Specific (fixed) periods, used by the grids ----------

const pad = (n: number) => String(n).padStart(2, '0');
const shortDay = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const shortMonth = (d: Date) => d.toLocaleDateString(undefined, { month: 'short' });
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "Oct 5 – Oct 11, 2026", or with both years when they differ */
function dayRangeLabel(from: Date, to: Date): string {
  if (from.getFullYear() === to.getFullYear()) {
    return `${shortDay(from)} – ${shortDay(to)}, ${to.getFullYear()}`;
  }
  return `${shortDay(from)}, ${from.getFullYear()} – ${shortDay(to)}, ${to.getFullYear()}`;
}

/** One day as a period, e.g. "Oct 7, 2026" (picked on the Daily tab's calendar) */
export function dayPreset(date: Date): DatePreset {
  const day = startOfDay(date);
  return {
    id: `day-${isoDay(day)}`,
    label: `${shortDay(day)}, ${day.getFullYear()}`,
    group: 'day',
    fixed: true,
    range: () => [day, endOfDay(day)],
  };
}

/** The 7 days starting at `start`, e.g. "Oct 5 – Oct 11, 2026" */
export function weekPreset(start: Date): DatePreset {
  const from = startOfDay(start);
  const to = addDays(from, 6);
  return {
    id: `week-${isoDay(from)}`,
    label: dayRangeLabel(from, to),
    group: 'week',
    fixed: true,
    range: () => [from, endOfDay(to)],
  };
}

/** A calendar month, e.g. monthPreset(2026, 8) = "September 2026" (month is 0-based) */
export function monthPreset(year: number, month: number): DatePreset {
  const first = new Date(year, month, 1);
  return {
    id: `month-${year}-${pad(month + 1)}`,
    label: first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    group: 'month',
    fixed: true,
    range: () => [first, endOfMonth(first)],
  };
}

/** A specific quarter, e.g. quarterPreset(2026, 3) = "Q3 2026" (1 Jul – 30 Sep) */
export function quarterPreset(year: number, quarter: number): DatePreset {
  return {
    id: `q${quarter}-${year}`,
    label: `Q${quarter} ${year}`,
    group: 'quarter',
    fixed: true,
    range: () => [
      new Date(year, (quarter - 1) * 3, 1),
      endOfDay(new Date(year, quarter * 3, 0)),
    ],
  };
}

/** A whole calendar year, e.g. yearPreset(2025) = "2025" */
export function yearPreset(year: number): DatePreset {
  return {
    id: `year-${year}`,
    label: String(year),
    group: 'year',
    fixed: true,
    range: () => [new Date(year, 0, 1), endOfDay(new Date(year, 11, 31))],
  };
}

/**
 * Several consecutive periods of the same kind as one selection, e.g.
 * Aug 2026 … Mar 2027 → id "month-2026-08..month-2027-03",
 * label "Aug 2026 – Mar 2027". Works in either order.
 */
export function spanPreset(a: DatePreset, b: DatePreset): DatePreset {
  const ctx: DatePresetContext = { weekStartsOn: 1 }; // fixed periods ignore it
  const now = new Date();
  const [first, last] = a.range(now, ctx)[0] <= b.range(now, ctx)[0] ? [a, b] : [b, a];
  if (first.id === last.id) return first;

  const start = first.range(now, ctx)[0];
  const end = last.range(now, ctx)[1];
  const sameYear = start.getFullYear() === end.getFullYear();
  const join = (from: string, to: string) =>
    sameYear
      ? `${from} – ${to} ${end.getFullYear()}`
      : `${from} ${start.getFullYear()} – ${to} ${end.getFullYear()}`;
  const quarter = (d: Date) => `Q${Math.floor(d.getMonth() / 3) + 1}`;

  const label =
    first.group === 'month'
      ? join(shortMonth(start), shortMonth(end))
      : first.group === 'quarter'
        ? join(quarter(start), quarter(end))
        : first.group === 'year'
          ? `${start.getFullYear()} – ${end.getFullYear()}`
          : dayRangeLabel(start, end); // days and weeks

  return {
    id: `${first.id}..${last.id}`,
    label,
    group: first.group,
    fixed: true,
    range: () => [start, end],
  };
}

/**
 * "Last N days / weeks / months / quarters / years" for any N, e.g.
 * lastPeriodsPreset(5, 'month') = "Last 5 months" (id "last-5-months").
 * Same rules as the built-ins: days are rolling (include today), the others
 * are the N full periods before the current one. N = 1 gives the built-in
 * ("Last month"; for days, "Today").
 */
export function lastPeriodsPreset(n: number, unit: DatePeriod): DatePreset {
  const count = Math.max(1, Math.floor(n));
  if (count === 1) return unit === 'day' ? DATE_PRESETS.today : DATE_PRESETS[`last-${unit}` as DatePresetId];
  const id = `last-${count}-${unit}s`;
  if (id in DATE_PRESETS) return DATE_PRESETS[id as DatePresetId];
  const range =
    unit === 'day'
      ? lastDays(count)
      : unit === 'week'
        ? lastWeeks(count)
        : unit === 'month'
          ? lastMonths(count)
          : unit === 'quarter'
            ? lastQuarters(count)
            : lastYears(count);
  return { id, label: `Last ${count} ${unit}s`, group: unit, range };
}

/** Turns the [presets] input (ids and/or objects) into preset objects */
export function resolvePresets(list: (DatePresetId | DatePreset)[]): DatePreset[] {
  return list
    .map((item) => (typeof item === 'string' ? DATE_PRESETS[item] : item))
    .filter((p): p is DatePreset => !!p);
}

/**
 * Finds a preset by id: the given list first, then the built-ins, then the
 * fixed periods ("day-2026-10-07", "week-2026-10-05", "month-2026-09",
 * "q3-2026", "year-2025") and spans of them ("month-2026-08..month-2027-03").
 * Used to restore a saved selection.
 */
export function findPreset(id: string, list: DatePreset[]): DatePreset | null {
  const listed = list.find((p) => p.id === id);
  if (listed) return listed;
  if (id in DATE_PRESETS) return DATE_PRESETS[id as DatePresetId];

  // A span: "month-2026-08..month-2027-03"
  const parts = id.split('..');
  if (parts.length === 2) {
    const [a, b] = parts.map((part) => findPreset(part, list));
    return a && b ? spanPreset(a, b) : null;
  }

  let m = /^last-(\d{1,3})-(day|week|month|quarter|year)s$/.exec(id);
  if (m) return lastPeriodsPreset(+m[1], m[2] as DatePeriod);
  m = /^day-(\d{4})-(\d{2})-(\d{2})$/.exec(id);
  if (m) return dayPreset(new Date(+m[1], +m[2] - 1, +m[3]));
  m = /^week-(\d{4})-(\d{2})-(\d{2})$/.exec(id);
  if (m) return weekPreset(new Date(+m[1], +m[2] - 1, +m[3]));
  m = /^month-(\d{4})-(\d{2})$/.exec(id);
  if (m) return monthPreset(+m[1], +m[2] - 1);
  m = /^q([1-4])-(\d{4})$/.exec(id);
  if (m) return quarterPreset(+m[2], +m[1]);
  m = /^year-(\d{4})$/.exec(id);
  if (m) return yearPreset(+m[1]);
  return null;
}

/** Which period tab a preset belongs to ('day'…'year' or its custom group) */
export function periodOf(preset: DatePreset): string {
  return preset.group ?? 'custom';
}
