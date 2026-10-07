/**
 * Pure date helpers for <verben-date-picker>.
 *
 * Everything works in LOCAL time and on whole days. No dependency (no
 * date-fns / moment), and no function mutates the Date it receives.
 */

export type VerbenDateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';

/** [start, end] of a period. start is 00:00:00.000, end is 23:59:59.999 */
export type DateSpan = [Date, Date];

const DAY_MS = 86_400_000;

export const startOfDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const endOfDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export const addDays = (d: Date, days: number): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

/** Adds months, keeping the day but clamping it (Jan 31 + 1 month = Feb 28/29) */
export function addMonths(d: Date, months: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() + months, 1);
  const lastDay = daysInMonth(target);
  target.setDate(Math.min(d.getDate(), lastDay));
  return target;
}

export const daysInMonth = (d: Date): number =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

export const startOfMonth = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), 1);

export const endOfMonth = (d: Date): Date =>
  endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));

/** First day of the week containing d (weekStartsOn: 0 = Sunday, 1 = Monday) */
export function startOfWeek(d: Date, weekStartsOn: 0 | 1): Date {
  const back = (d.getDay() - weekStartsOn + 7) % 7;
  return addDays(d, -back);
}

export const endOfWeek = (d: Date, weekStartsOn: 0 | 1): Date =>
  endOfDay(addDays(startOfWeek(d, weekStartsOn), 6));

/** ISO 8601 week number (weeks start on Monday, week 1 contains 4 January) */
export function isoWeek(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1);
  return Math.ceil(((t.getTime() - yearStart) / DAY_MS + 1) / 7);
}

/** Quarter number 1-4 */
export const quarterOf = (d: Date): number => Math.floor(d.getMonth() / 3) + 1;

export const startOfQuarter = (d: Date): Date =>
  new Date(d.getFullYear(), (quarterOf(d) - 1) * 3, 1);

export const endOfQuarter = (d: Date): Date =>
  endOfDay(new Date(d.getFullYear(), quarterOf(d) * 3, 0));

export const startOfYear = (d: Date): Date => new Date(d.getFullYear(), 0, 1);

export const endOfYear = (d: Date): Date =>
  endOfDay(new Date(d.getFullYear(), 11, 31));

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Negative if a is an earlier day than b, 0 if same day, positive if later */
export const compareDays = (a: Date, b: Date): number =>
  startOfDay(a).getTime() - startOfDay(b).getTime();

/** Number of days in a span, counting both ends (Oct 1 - Oct 7 = 7) */
export const dayCount = (start: Date, end: Date): number =>
  Math.round(compareDays(end, start) / DAY_MS) + 1;

/**
 * Accepts a Date or a date string and returns a Date in LOCAL time.
 * "2026-10-07" and "2026-10-07T09:30:00" are read as local time on purpose:
 * `new Date("2026-10-07")` would be UTC midnight, i.e. the previous day in
 * time zones west of UTC. A trailing "Z" is ignored, like the old date picker.
 */
export function parseDate(value: unknown): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string' || !value.trim()) return null;

  const m =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(value.trim());
  if (m) {
    const [, y, mo, d, h = '0', mi = '0', s = '0'] = m;
    return new Date(+y, +mo - 1, +d, +h, +mi, +s);
  }
  const fallback = new Date(value);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/** "2026-10-07T00:00:00": local time, no time zone (same as the old picker) */
export function toLocalIso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
    `T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
  );
}

export function formatDate(d: Date, format: VerbenDateFormat): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${month}/${day}/${year}`;
  }
}

/**
 * Trims a span to [min, max]. Returns null when nothing is left, so callers
 * can disable a preset that falls completely outside the allowed dates.
 */
export function clampSpan(
  span: DateSpan,
  min?: Date | null,
  max?: Date | null,
): DateSpan | null {
  let [start, end] = span;
  if (min && compareDays(start, min) < 0) start = startOfDay(min);
  if (max && compareDays(end, max) > 0) end = endOfDay(max);
  return compareDays(start, end) <= 0 ? [start, end] : null;
}

export const isOutside = (d: Date, min?: Date | null, max?: Date | null): boolean =>
  (!!min && compareDays(d, min) < 0) || (!!max && compareDays(d, max) > 0);
