# `<verben-date-picker>`

One date picker that can change what it picks ("mutate"). Live docs: `/documentation/components/date-picker`
in the docs app. The older `<app-date-picker>` (`DatePickerModule`) is unchanged and documented as
"Date Picker (classic)".

| `mode`     | A click…                                  | ngModel value                                            |
|------------|-------------------------------------------|----------------------------------------------------------|
| `single`   | picks the day and closes (default)        | `"2026-10-07T00:00:00"`                                  |
| `range`    | 1st = start, 2nd = end (hover preview)    | `["2026-10-01T00:00:00", "2026-10-07T23:59:59"]`         |
| `preset`   | picks a whole period                      | same as range; `presetId` is in `(selectionChange)`      |

`[modes]="['single', 'range', 'preset']"` shows a Date / Range / Periods switcher so the **user** can
change mode; `[(mode)]` reports it.

```html
<verben-date-picker
  [modes]="['single', 'range', 'preset']"
  [(mode)]="mode"
  [(ngModel)]="value"
  (selectionChange)="onSelection($event)"
></verben-date-picker>
```

## Periods (preset mode)

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

- **One click = one period.** Tick **"Several months"** (weeks / quarters / years / days) in the footer to
  pick a span: first click starts, second ends, in either order. The ‹ › stepper can move between the
  clicks, so Aug 2026 → Mar 2027 or Q2 → Q1 work. `[allowSeveral]="false"` hides the checkbox.
- Selected = filled; covered / previewed periods = tinted (grid and calendar); today's period = dot.
  The footer says what is hovered or what to click next.
- The calendar follows what you point at. On phones it is hidden except on the Daily tab.
- `[periods]` picks which tabs show; `[presets]` replaces the suggestions (a preset's `group` decides its
  tab; any other group, e.g. `'Fiscal'`, becomes its own tab).
- Week / month / quarter / year suggestions are **calendar based** ("Last 2 months" on 7 Oct = 1 Aug – 30 Sep);
  "Last N days" is rolling and includes today.
- Ids as values: `'last-month'`, `'day-2026-10-07'`, `'week-2026-10-05'`, `'month-2026-09'`, `'q3-2026'`,
  `'year-2025'`, and spans `'month-2026-08..month-2027-03'`. A relative id stays relative.

## Alternative design: `<verben-simple-date-picker>` (for comparison)

Built next to `<verben-date-picker>` (nothing above was replaced) and shown at the bottom of the same
docs page, so the team can compare the two:

```
 ☐ Range   [🔍 Preset, e.g. last 3 months   ]   ← checkbox + preset combobox
           │ Q2 2026      Quarterly  Apr 1 – Jun 30 │   (list floats over the calendar)
   ‹ October 2026 ›
   calendar                                       ← one day, or a range when ticked
 Pick a day or a preset             Today  Clear  Close
```

- **Range checkbox** (`[(rangeMode)]`): unticked = one day per click; ticked = start + end, either order.
- **Preset combobox**: every preset tagged Daily / Weekly / Monthly / Quarterly / Yearly (or a custom group);
  type to filter by label or tag; arrow keys + Enter; first Esc closes the list, second the popup.
- **Typed presets** (`allowTypedPresets`, default on): text that isn't in the list is parsed by
  `date-preset-parser.ts`: "last 5 months", "past two quarters", "previous 3 wks", "q2 2025", "2025 q4",
  "march 2026", "2026-03", "2024", "ytd". They get ids (`last-5-months`, `q2-2025`, …) so they can be saved.
- Same value format and `DateSelection` as `<verben-date-picker>`; separate `VerbenSimpleDatePickerModule`
  (reuses the calendar grid), so either design can be removed without touching the other.

## How it is built

| File | Role |
|---|---|
| `date-utils.ts` | Pure date maths, local time, whole days, weeks. No dependency. |
| `date-presets.ts` | Periods, built-in suggestions (`DATE_PRESETS`), `dayPreset` / `weekPreset` / `monthPreset` / `quarterPreset` / `yearPreset`, `spanPreset()` (several periods), `findPreset()`. A preset = `{ id, label, group, fixed?, range(today, { weekStartsOn }) }`. |
| `calendar-grid/` | One month of days. Presentational (OnPush): highlight in, `(pick)` / `(hover)` out. |
| `period-panel/` | Tabs, suggestion chips, side grid with stepper and span picking; the calendar is projected into it. Presentational (OnPush). |
| `verben-date-picker.component.*` | Field, popup (CDK overlay), mode switch, value + forms (ControlValueAccessor). |
| `verben-date-picker.spec.ts` | Unit tests for presets and date maths. |
| `simple/` | The alternative `<verben-simple-date-picker>` + `VerbenSimpleDatePickerModule`. |
| `date-preset-parser.ts` (+ spec) | Typed text → preset, used by the simple picker's combobox. |

Colors come from `--vbn-*` tokens (works in dark mode), styles are component CSS only (no Tailwind),
icons are inline SVG. The template only reads fields set in `refresh()`, never getters that create new
objects (that would trigger Angular's NG0100 error in dev).

## Not included yet

- Time selection (the classic picker's `showTime`).
- Arrow-key navigation between days (days and periods are focusable buttons; Tab / Enter / Esc work).
- Labels like "Last month" are English only; month and weekday names follow the browser locale.

## Running its tests

Several older specs in the library don't compile, so run only these (19 tests):

```bash
npx ng test verben-ng-ui --watch=false --browsers=ChromeHeadless --include='**/verben-date-picker/**/*.spec.ts' --ts-config=projects/verben-ng-ui/tsconfig.spec.date-picker.json
```
