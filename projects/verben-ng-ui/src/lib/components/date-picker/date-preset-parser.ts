/**
 * Turns what a user types into a preset, so the simple picker's combobox
 * accepts presets that aren't in its list:
 *
 *   "today", "yesterday", "ytd" / "year to date"
 *   "this week|month|quarter|year"
 *   "last|past|previous [N] days|weeks|months|quarters|years"   (N = 2, two, …)
 *   "q2", "q2 2025", "2025 q2"
 *   "march", "mar 2026", "2026-03"
 *   "2024"
 *
 * Returns null when the text isn't understood. Pure function, no Angular.
 */
import {
  DATE_PRESETS,
  DatePeriod,
  DatePreset,
  DatePresetId,
  lastPeriodsPreset,
  monthPreset,
  quarterPreset,
  yearPreset,
} from './date-presets';

const UNITS: Record<string, DatePeriod> = {
  d: 'day', day: 'day', days: 'day',
  w: 'week', wk: 'week', wks: 'week', week: 'week', weeks: 'week',
  m: 'month', mo: 'month', mos: 'month', month: 'month', months: 'month',
  q: 'quarter', qtr: 'quarter', qtrs: 'quarter', quarter: 'quarter', quarters: 'quarter',
  y: 'year', yr: 'year', yrs: 'year', year: 'year', years: 'year',
};

const NUMBER_WORDS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

/** "mar", "march", "sept" → index (0-11); anything else → -1. Needs 3+ letters */
function monthIndex(word: string): number {
  return word.length < 3 ? -1 : MONTHS.findIndex((month) => month.startsWith(word));
}

export function parsePresetText(text: string, today: Date): DatePreset | null {
  const t = text.toLowerCase().replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!t) return null;
  const year = today.getFullYear();

  if (t === 'today') return DATE_PRESETS.today;
  if (t === 'yesterday') return DATE_PRESETS.yesterday;
  if (t === 'ytd' || t === 'year to date') return DATE_PRESETS['year-to-date'];

  // this week / current month …
  let m = /^(?:this|current) (week|month|quarter|year)$/.exec(t);
  if (m) return DATE_PRESETS[`this-${m[1]}` as DatePresetId];

  // last month / past 3 months / previous two quarters / last 10 days
  m = /^(?:last|past|previous|prev) (?:(\d{1,3}|[a-z]+) )?([a-z]+)$/.exec(t);
  if (m && UNITS[m[2]]) {
    const n = m[1] === undefined ? 1 : /^\d+$/.test(m[1]) ? +m[1] : NUMBER_WORDS[m[1]];
    if (n && n <= 100) return lastPeriodsPreset(n, UNITS[m[2]]);
  }

  // q2 / q2 2025 / 2025 q2
  m = /^q([1-4])(?: (\d{4}))?$/.exec(t);
  if (m) return quarterPreset(m[2] ? +m[2] : year, +m[1]);
  m = /^(\d{4}) q([1-4])$/.exec(t);
  if (m) return quarterPreset(+m[1], +m[2]);

  // 2024
  m = /^(\d{4})$/.exec(t);
  if (m) return yearPreset(+m[1]);

  // 2026-03
  m = /^(\d{4})-(\d{1,2})$/.exec(t);
  if (m && +m[2] >= 1 && +m[2] <= 12) return monthPreset(+m[1], +m[2] - 1);

  // march / mar 2026 / 2026 march
  m = /^([a-z]+)(?: (\d{4}))?$/.exec(t) ?? /^(\d{4}) ([a-z]+)$/.exec(t);
  if (m) {
    const [word, y] = /^\d/.test(m[1]) ? [m[2], m[1]] : [m[1], m[2]];
    const index = monthIndex(word);
    if (index >= 0) return monthPreset(y ? +y : year, index);
  }
  return null;
}
