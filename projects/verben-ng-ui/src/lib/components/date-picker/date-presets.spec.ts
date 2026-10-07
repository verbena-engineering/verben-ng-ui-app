import {
  DATE_PRESETS,
  DatePresetContext,
  DatePresetId,
  findPreset,
  monthPreset,
  quarterPreset,
  resolvePresets,
  dayPreset,
  spanPreset,
  weekPreset,
} from './date-presets';
import { addMonths, clampSpan, dayCount, isoWeek, parseDate, toLocalIso } from './date-utils';

// Shows a span as "YYYY-MM-DD..YYYY-MM-DD" so expectations read like the docs
const show = ([start, end]: [Date, Date]) =>
  `${toLocalIso(start).slice(0, 10)}..${toLocalIso(end).slice(0, 10)}`;

const monday: DatePresetContext = { weekStartsOn: 1 };
const sunday: DatePresetContext = { weekStartsOn: 0 };
const resolve = (id: DatePresetId, today: Date, ctx = monday) =>
  show(DATE_PRESETS[id].range(today, ctx));

describe('verben-date-picker: presets', () => {
  const today = new Date(2026, 9, 7); // Wed 7 Oct 2026

  it('resolves calendar month presets', () => {
    expect(resolve('this-month', today)).toBe('2026-10-01..2026-10-31');
    expect(resolve('last-month', today)).toBe('2026-09-01..2026-09-30');
    expect(resolve('last-2-months', today)).toBe('2026-08-01..2026-09-30');
    expect(resolve('last-3-months', today)).toBe('2026-07-01..2026-09-30');
  });

  it('resolves week presets for Monday and Sunday starts', () => {
    expect(resolve('this-week', today)).toBe('2026-10-05..2026-10-11');
    expect(resolve('last-week', today)).toBe('2026-09-28..2026-10-04');
    expect(resolve('last-2-weeks', today)).toBe('2026-09-21..2026-10-04');
    expect(resolve('this-week', today, sunday)).toBe('2026-10-04..2026-10-10');
  });

  it('builds specific periods with stable ids', () => {
    const week = weekPreset(new Date(2026, 9, 5));
    expect(week.id).toBe('week-2026-10-05');
    expect(show(week.range(today, monday))).toBe('2026-10-05..2026-10-11');
    const month = monthPreset(2026, 8);
    expect(month.id).toBe('month-2026-09');
    expect(show(month.range(today, monday))).toBe('2026-09-01..2026-09-30');
    expect(month.fixed).toBeTrue();
    expect(isoWeek(new Date(2026, 9, 5))).toBe(41);
  });

  it('joins several periods into one span, in either order, across years', () => {
    const months = spanPreset(monthPreset(2027, 2), monthPreset(2026, 7)); // Mar 2027, Aug 2026
    expect(months.id).toBe('month-2026-08..month-2027-03');
    expect(show(months.range(today, monday))).toBe('2026-08-01..2027-03-31');
    expect(months.fixed).toBeTrue();

    const quarters = spanPreset(quarterPreset(2026, 2), quarterPreset(2027, 1));
    expect(show(quarters.range(today, monday))).toBe('2026-04-01..2027-03-31');
    expect(quarters.label).toBe('Q2 2026 – Q1 2027');

    const weeks = spanPreset(weekPreset(new Date(2027, 0, 4)), weekPreset(new Date(2027, 0, 18)));
    expect(show(weeks.range(today, monday))).toBe('2027-01-04..2027-01-24');

    const days = spanPreset(dayPreset(new Date(2026, 9, 7)), dayPreset(new Date(2026, 9, 1)));
    expect(show(days.range(today, monday))).toBe('2026-10-01..2026-10-07');

    // The same period twice is just that period
    expect(spanPreset(monthPreset(2026, 8), monthPreset(2026, 8)).id).toBe('month-2026-09');
  });

  it('restores spans and days from their ids', () => {
    const span = findPreset('month-2026-08..month-2027-03', []);
    expect(span && show(span.range(today, monday))).toBe('2026-08-01..2027-03-31');
    expect(findPreset('day-2026-10-07', [])?.group).toBe('day');
    expect(findPreset('month-2026-08..nope', [])).toBeNull();
  });

  it('resolves quarter presets', () => {
    expect(resolve('this-quarter', today)).toBe('2026-10-01..2026-12-31');
    expect(resolve('last-quarter', today)).toBe('2026-07-01..2026-09-30');
    expect(show(quarterPreset(2026, 1).range(today, monday))).toBe('2026-01-01..2026-03-31');
  });

  it('resolves year presets', () => {
    expect(resolve('last-year', today)).toBe('2025-01-01..2025-12-31');
    expect(resolve('last-2-years', today)).toBe('2024-01-01..2025-12-31');
    expect(resolve('year-to-date', today)).toBe('2026-01-01..2026-10-07');
  });

  it('counts rolling day presets including today', () => {
    const [start, end] = DATE_PRESETS['last-7-days'].range(today, monday);
    expect(show([start, end])).toBe('2026-10-01..2026-10-07');
    expect(dayCount(start, end)).toBe(7);
  });

  it('crosses the year boundary in January', () => {
    const jan = new Date(2026, 0, 15);
    expect(resolve('last-month', jan)).toBe('2025-12-01..2025-12-31');
    expect(resolve('last-quarter', jan)).toBe('2025-10-01..2025-12-31');
  });

  it('ends periods at the last millisecond of the day', () => {
    const [, end] = DATE_PRESETS['last-month'].range(today, monday);
    expect(end.getHours()).toBe(23);
    expect(end.getMilliseconds()).toBe(999);
  });

  it('finds built-in and generated presets by id', () => {
    const list = resolvePresets(['last-month']);
    expect(findPreset('last-month', list)?.label).toBe('Last month');
    expect(findPreset('last-2-years', list)?.label).toBe('Last 2 years');
    expect(findPreset('q3-2025', list)?.label).toBe('Q3 2025');
    expect(findPreset('month-2026-09', list)?.id).toBe('month-2026-09');
    expect(findPreset('week-2026-10-05', list)?.group).toBe('week');
    expect(findPreset('year-2024', list)?.label).toBe('2024');
    expect(findPreset('nope', list)).toBeNull();
  });
});

describe('verben-date-picker: date utils', () => {
  it('clamps the day when adding months', () => {
    expect(toLocalIso(addMonths(new Date(2026, 0, 31), 1)).slice(0, 10)).toBe('2026-02-28');
  });

  it('parses date-only strings as local dates (not UTC)', () => {
    const d = parseDate('2026-10-07');
    expect(d?.getDate()).toBe(7);
    expect(d?.getHours()).toBe(0);
    expect(parseDate('2026-10-07T09:30:00Z')?.getHours()).toBe(9);
    expect(parseDate('not a date')).toBeNull();
  });

  it('clamps spans to min / max and rejects spans fully outside', () => {
    const span: [Date, Date] = [new Date(2026, 8, 1), new Date(2026, 8, 30)];
    expect(show(clampSpan(span, new Date(2026, 8, 10), null)!)).toBe('2026-09-10..2026-09-30');
    expect(clampSpan(span, new Date(2026, 9, 1), null)).toBeNull();
  });
});
