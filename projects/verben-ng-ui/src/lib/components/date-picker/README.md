# `<app-date-picker>`

The library's one date picker (`DatePickerModule`). Live docs: `/documentation/components/date-picker`
in the docs app. The earlier `<verben-date-picker>` and `<verben-simple-date-picker>` were folded into
it; existing `<app-date-picker>` templates keep working unchanged.

## Two inputs

**`variant`**: how much UI the popup has.

| `variant` | Adds | |
|---|---|---|
| `default` | nothing: just the calendar | what every existing screen gets |
| `simple` | a **Range** checkbox + a **preset search** (also understands typed presets) | |
| `advanced` | **Date / Range / Periods** tabs; Periods has Daily … Yearly grids | |

**`selectionMode`**: what a click picks (the classic picker's input, plus `'preset'`).

| `selectionMode` | A click… | ngModel value |
|---|---|---|
| `default` | picks the day and closes (with `showTime`: stays open for the time) | `"2026-10-07T00:00:00"` |
| `range` | 1st = start, 2nd = end (hover preview; an earlier day restarts) | `["2026-10-01T00:00:00", "2026-10-07T23:59:59"]` |
| `preset` | picks a whole period (the Periods panel) | same as range; `presetId` is in `(selectionChange)` |

In `simple` and `advanced` the user changes `selectionMode` (checkbox / tabs); `[(selectionMode)]` reports it.

```html
<app-date-picker [(ngModel)]="due"></app-date-picker>                              <!-- as before -->
<app-date-picker selectionMode="range" [(ngModel)]="period"></app-date-picker>     <!-- as before -->
<app-date-picker variant="simple" [(ngModel)]="report"></app-date-picker>
<app-date-picker variant="advanced" [(selectionMode)]="mode" [(ngModel)]="value"></app-date-picker>
<app-date-picker selectionMode="preset" [(ngModel)]="report"></app-date-picker>    <!-- periods only -->
```

## Classic inputs, all still accepted

| Input / output | Now |
|---|---|
| `[(date)]`, `[(range)]` | Same: a `Date`, or `[Date, Date]` (00:00 → 23:59:59.999) |
| `selectionMode` `'default' \| 'range'` | Same, plus `'preset'` |
| `showTime` | Hour and minute selects + Start of day / End of day; the value keeps the time; the field shows it |
| `useDefaultDate` | Same: today when there's no value (an empty form value doesn't clear it, as before) |
| `minDate`, `maxDate`, `format`, `placeholder`, `disabled` | Same (dates may also be strings; a trailing "Z" is read as local time, as before) |
| `bgColor`, `border` | Field background and border |
| `overlayWidth`, `datePickerWidth` | Popup width. Default is now "fits its content" (was 400) |
| `useDropdowns`, `yearPlaceholder`, `monthPlaceholder` | Deprecated, ignored: click the month caption for a month grid, then the year for a year grid |
| `clearDate()`, `toggleCalendar()`, `close()` | Same methods |

## Migrating from the folded pickers

| Before | After |
|---|---|
| `<verben-date-picker [modes]="…" [(mode)]="m">` | `<app-date-picker variant="advanced" [modes]="…" [(selectionMode)]="m">` |
| `<verben-date-picker mode="preset">` | `<app-date-picker selectionMode="preset">` |
| `<verben-simple-date-picker [(rangeMode)]="r">` | `<app-date-picker variant="simple" [(selectionMode)]="m">` (`'range'` = ticked) |
| mode `'single'`, `VerbenDatePickerMode` | `'default'`, `DatePickerSelectionMode` |
| `VerbenDatePickerModule`, `VerbenSimpleDatePickerModule` | `DatePickerModule` |

## Periods (`selectionMode="preset"`, or the advanced Periods tab)

```
 Daily   Weekly   Monthly   Quarterly   Yearly          ← tabs
 (This month) (Last month) (Last 2 months) (Last 3…)    ← suggestions
 ┌─ side ─────────┐ ┌─ calendar ──────────────┐
 │ ‹ 2026 ›       │ │ previews what you point  │
 │ Jan Feb Mar …  │ │ at / picked, as a band   │
 └────────────────┘ └──────────────────────────┘
 ☐ Several months   Aug 2026 – Mar 2027 · 243 days   Clear  Close
```

| Tab | Suggestions (default) | Side grid |
|---|---|---|
| Daily | Today, Yesterday, Last 7 days, Last 30 days | none: the calendar itself is the picker |
| Weekly | This week, Last week, Last 2 weeks | weeks of a month (‹ › by month), ISO week no. when weeks start Monday |
| Monthly | This month, Last month, Last 2 months, Last 3 months | 12 months (‹ › by year) |
| Quarterly | This quarter, Last quarter | Q1–Q4 (‹ › by year) |
| Yearly | This year, Year to date, Last year, Last 2 years | 12-year page |

- **One click = one period.** Tick **"Several months"** (weeks / quarters / years / days) to pick a span:
  first click starts, second ends, in either order and across years. `[allowSeveral]="false"` hides it.
- `[periods]` picks which tabs show; `[presets]` replaces the suggestions (a preset's `group` decides its
  tab; any other group, e.g. `'Fiscal'`, becomes its own tab).
- Suggestions are **calendar based** ("Last 2 months" on 7 Oct = 1 Aug – 30 Sep); "Last N days" is rolling.
- Ids as values: `'last-month'`, `'day-2026-10-07'`, `'week-2026-10-05'`, `'month-2026-09'`, `'q3-2026'`,
  `'year-2025'`, spans `'month-2026-08..month-2027-03'`, typed `'last-5-months'`. A relative id stays relative.

## Preset search (`variant="simple"`)

Lists every built-in preset tagged Daily / Weekly / Monthly / Quarterly / Yearly (or `[presets]`); type to
filter by label or tag; arrow keys + Enter; first Esc closes the list, the second the popup. Typed presets
that aren't listed are parsed by `date-preset-parser.ts`: "last 5 months", "past two quarters",
"q2 2025", "march 2026", "2024", "ytd". `[allowRange]` / `[allowTypedPresets]` turn the parts off.

## How it is built

| File | Role |
|---|---|
| `date-picker.component.*` | `<app-date-picker>`: field, popup (CDK overlay), variants, value + forms (ControlValueAccessor), classic inputs. |
| `date-picker.types.ts` | `DatePickerVariant`, `DatePickerSelectionMode`, `DateRange`, `DateSelection`. |
| `calendar/` | `<verben-calendar>`: month navigation + days / months / years views. |
| `calendar-grid/` | `<verben-calendar-grid>`: one month of days. Presentational (OnPush). |
| `period-panel/` | `<verben-period-panel>`: tabs, suggestions, side grid, span picking; the calendar is projected in. |
| `preset-search/` | `<verben-preset-search>`: the simple variant's combobox. |
| `date-utils.ts`, `date-presets.ts`, `date-preset-parser.ts` | Pure logic: date maths, presets, typed-preset parsing. |

The parts are exported from `DatePickerModule` too (e.g. an inline `<verben-calendar>`). Colors come from
`--vbn-*` tokens (dark mode works), component CSS only (no Tailwind), inline SVG icons. The template only
reads fields set in `refresh()`, never getters that create new objects (NG0100 in dev).

## Not included yet

- Arrow-key navigation between days (days and periods are focusable buttons; Tab / Enter / Esc work).
- Time for ranges (ranges are whole days).
- Labels like "Last month" are English only; month and weekday names follow the browser locale.

## Running its tests

Several older specs in the library don't compile, so run only these (27 tests: presets, date maths,
typed presets, and the component incl. every classic input):

```bash
npx ng test verben-ng-ui --watch=false --browsers=ChromeHeadless --include='**/date-picker/**/*.spec.ts' --ts-config=projects/verben-ng-ui/tsconfig.spec.date-picker.json
```
