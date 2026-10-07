import { parsePresetText } from './date-preset-parser';
import { findPreset, lastPeriodsPreset } from './date-presets';
import { toLocalIso } from './date-utils';

const today = new Date(2026, 9, 7); // Wed 7 Oct 2026
const ctx = { weekStartsOn: 1 as const };

// "id: label: YYYY-MM-DD..YYYY-MM-DD" for compact expectations
const read = (text: string) => {
  const p = parsePresetText(text, today);
  if (!p) return null;
  const [s, e] = p.range(today, ctx);
  return `${p.id}: ${p.label}: ${toLocalIso(s).slice(0, 10)}..${toLocalIso(e).slice(0, 10)}`;
};

describe('date picker: typed presets', () => {
  it('understands relative words', () => {
    expect(read('today')).toBe('today: Today: 2026-10-07..2026-10-07');
    expect(read('YTD')).toBe('year-to-date: Year to date: 2026-01-01..2026-10-07');
    expect(read('this quarter')).toBe('this-quarter: This quarter: 2026-10-01..2026-12-31');
    expect(read('last month')).toBe('last-month: Last month: 2026-09-01..2026-09-30');
  });

  it('understands "last N <unit>" with digits, words and short units', () => {
    expect(read('last 5 months')).toBe('last-5-months: Last 5 months: 2026-05-01..2026-09-30');
    expect(read('past two quarters')).toBe('last-2-quarters: Last 2 quarters: 2026-04-01..2026-09-30');
    expect(read('previous 3 wks')).toBe('last-3-weeks: Last 3 weeks: 2026-09-14..2026-10-04');
    expect(read('last 10 days')).toBe('last-10-days: Last 10 days: 2026-09-28..2026-10-07');
    expect(read('last 3 years')).toBe('last-3-years: Last 3 years: 2023-01-01..2025-12-31');
  });

  it('understands quarters, months and years', () => {
    expect(read('q2')).toBe('q2-2026: Q2 2026: 2026-04-01..2026-06-30');
    expect(read('Q2 2025')).toBe('q2-2025: Q2 2025: 2025-04-01..2025-06-30');
    expect(read('2025 q4')).toBe('q4-2025: Q4 2025: 2025-10-01..2025-12-31');
    expect(read('2024')).toBe('year-2024: 2024: 2024-01-01..2024-12-31');
    expect(read('2026-03')?.startsWith('month-2026-03:')).toBeTrue();
    expect(read('mar 2026')?.endsWith('2026-03-01..2026-03-31')).toBeTrue();
    expect(read('sept')?.startsWith('month-2026-09:')).toBeTrue();
  });

  it('returns null for text it does not understand', () => {
    expect(parsePresetText('', today)).toBeNull();
    expect(parsePresetText('banana', today)).toBeNull();
    expect(parsePresetText('last 5 bananas', today)).toBeNull();
    expect(parsePresetText('ma', today)).toBeNull();
  });

  it('restores "last N" ids, and N = 1 gives the built-in', () => {
    expect(findPreset('last-5-months', [])?.label).toBe('Last 5 months');
    expect(lastPeriodsPreset(1, 'month').id).toBe('last-month');
    expect(lastPeriodsPreset(7, 'day').id).toBe('last-7-days');
  });
});
