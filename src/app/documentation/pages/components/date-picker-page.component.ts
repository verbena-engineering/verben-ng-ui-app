import { Component } from '@angular/core';
import {
  DATE_PERIOD_LABELS,
  DATE_PRESETS,
  DatePeriod,
  DatePickerSelectionMode,
  DatePreset,
  DatePresetId,
  DateRange,
  DateSelection,
  VerbenDateUtils,
} from 'verben-ng-ui';
import { DocsProp } from '../../docs-kit/props-table.component';

interface PresetRow {
  tab: string;
  id: string;
  label: string;
  resolves: string;
}

// Custom presets, written the way a feature team would add them:
// a financial year that starts on 1 April, in its own "Fiscal" tab
const fiscalYear =
  (offset: number): DatePreset['range'] =>
  (today) => {
    const startYear = (today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1) + offset;
    return [new Date(startYear, 3, 1), VerbenDateUtils.endOfDay(new Date(startYear + 1, 2, 31))];
  };

const financePresets: (DatePresetId | DatePreset)[] = [
  'this-month',
  'last-month',
  'this-quarter',
  'last-quarter',
  'last-year',
  { id: 'this-fiscal-year', label: 'This fiscal year', group: 'Fiscal', range: fiscalYear(0) },
  { id: 'last-fiscal-year', label: 'Last fiscal year', group: 'Fiscal', range: fiscalYear(-1) },
];

@Component({
  selector: 'docs-date-picker-page',
  templateUrl: './date-picker-page.component.html',
})
export class DatePickerPageComponent {
  // Example values
  day: string | null = null;
  plain: unknown = null;
  simple: unknown = null;
  advanced: unknown = null;
  period: [string, string] | null = null;
  meeting: string | null = '2026-10-07T09:30:00';
  dueDate: Date | null = null;
  range: DateRange | null = null;
  birthday: string | null = null;
  typed: unknown = 'last-5-months'; // a typed preset, saved by its id
  mode: DatePickerSelectionMode = 'default';
  value: unknown = null;
  lastSelection: DateSelection | null = null;
  report: unknown = 'last-month'; // a preset id stays relative to today
  span: unknown = 'month-2026-08..month-2027-03';
  finance: unknown = null;
  bounded: unknown = null;

  financePeriods: DatePeriod[] = ['month', 'quarter', 'year'];
  financePresets = financePresets;

  today = new Date();
  minDate = new Date(this.today.getFullYear() - 1, 0, 1);
  maxDate = this.today;
  oldest = new Date(1900, 0, 1);

  presetRows: PresetRow[] = Object.values(DATE_PRESETS).map((p) => {
    const [start, end] = p.range(this.today, { weekStartsOn: 1 });
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    return {
      tab: DATE_PERIOD_LABELS[p.group as DatePeriod],
      id: p.id,
      label: p.label,
      resolves: `${fmt(start)} – ${fmt(end)}`,
    };
  });

  // Local dates on purpose: toISOString() is UTC and can show the previous day
  local(d: Date | null | undefined): string {
    return d ? VerbenDateUtils.toLocalIso(d) : 'null';
  }

  describeSelection(selection: DateSelection | null): string {
    if (!selection) return 'null';
    const d = (x: Date) => VerbenDateUtils.toLocalIso(x).slice(0, 10);
    return JSON.stringify({
      mode: selection.mode,
      start: d(selection.start),
      end: d(selection.end),
      ...(selection.presetId ? { presetId: selection.presetId, label: selection.label } : {}),
    });
  }

  code = {
    basic: `<app-date-picker [(ngModel)]="day"></app-date-picker>`,

    variants: `<!-- default: just the calendar (what existing screens get) -->
<app-date-picker [(ngModel)]="plain"></app-date-picker>

<!-- simple: + a Range checkbox and a preset search -->
<app-date-picker variant="simple" [(ngModel)]="simple"></app-date-picker>

<!-- advanced: + Date | Range | Periods tabs -->
<app-date-picker variant="advanced" [(ngModel)]="advanced"></app-date-picker>`,

    setup: `import { DatePickerModule } from 'verben-ng-ui';

@NgModule({ imports: [DatePickerModule] })
export class FeatureModule {}`,

    migrate: `<!-- Before → after (only these two tags change; <app-date-picker> code stays as is) -->
<verben-date-picker [modes]="…" [(mode)]="m">   →  <app-date-picker variant="advanced" [modes]="…" [(selectionMode)]="m">
<verben-simple-date-picker [(rangeMode)]="r">   →  <app-date-picker variant="simple" [(selectionMode)]="m">
mode="single"                                  →  selectionMode="default"
VerbenDatePickerModule / VerbenSimpleDatePickerModule  →  DatePickerModule`,

    range: `<app-date-picker
  selectionMode="range"
  [monthsShown]="2"
  placeholder="Pick a period"
  [(ngModel)]="period"
></app-date-picker>`,

    time: `<app-date-picker [showTime]="true" placeholder="Meeting time" [(ngModel)]="meeting"></app-date-picker>`,

    timeTs: `// The time is kept in the value: "2026-10-07T09:30:00"
meeting: string | null = '2026-10-07T09:30:00';`,

    binding: `<!-- Without forms: [(date)] gives a Date, [(range)] gives [Date, Date] -->
<app-date-picker [(date)]="dueDate"></app-date-picker>
<app-date-picker selectionMode="range" [(range)]="range"></app-date-picker>`,

    bindingTs: `import { DateRange } from 'verben-ng-ui';

dueDate: Date | null = null;
range: DateRange | null = null;   // [start, end]`,

    birthday: `<app-date-picker placeholder="Date of birth" [minDate]="oldest" [maxDate]="today" [(ngModel)]="birthday"></app-date-picker>`,

    typed: `<app-date-picker variant="simple" [(ngModel)]="report"></app-date-picker>`,

    typedTs: `// Typed presets get ids too, so they can be saved and restored:
report: unknown = 'last-5-months';`,

    mutate: `<app-date-picker
  variant="advanced"
  [(selectionMode)]="mode"
  [(ngModel)]="value"
  (selectionChange)="lastSelection = $event"
></app-date-picker>`,

    mutateTs: `import { DatePickerSelectionMode, DateSelection } from 'verben-ng-ui';

mode: DatePickerSelectionMode = 'default';
value: unknown = null;          // a string for one day, [start, end] otherwise
lastSelection: DateSelection | null = null;`,

    periods: `<!-- Periods only: no tabs, no calendar-only mode -->
<app-date-picker selectionMode="preset" [(ngModel)]="report"></app-date-picker>`,

    periodsTs: `// A preset id as the value stays relative:
// next month it means the new "last month"
report: unknown = 'last-month';`,

    span: `<app-date-picker selectionMode="preset" [(ngModel)]="span"></app-date-picker>`,

    spanTs: `// Tick "Several months", click the first month, step to the next year,
// click the last month. The id of the span works as a value too:
span: unknown = 'month-2026-08..month-2027-03';`,

    custom: `<app-date-picker
  selectionMode="preset"
  [periods]="['month', 'quarter', 'year']"
  [presets]="financePresets"
  [(ngModel)]="finance"
></app-date-picker>`,

    customTs: `import { DatePreset, DatePresetId, VerbenDateUtils } from 'verben-ng-ui';

// Financial year starting 1 April, in its own "Fiscal" tab
const fiscalYear = (offset: number): DatePreset['range'] => (today) => {
  const startYear =
    (today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1) + offset;
  return [new Date(startYear, 3, 1), VerbenDateUtils.endOfDay(new Date(startYear + 1, 2, 31))];
};

financePresets: (DatePresetId | DatePreset)[] = [
  'this-month', 'last-month', 'this-quarter', 'last-quarter', 'last-year',
  { id: 'this-fiscal-year', label: 'This fiscal year', group: 'Fiscal', range: fiscalYear(0) },
  { id: 'last-fiscal-year', label: 'Last fiscal year', group: 'Fiscal', range: fiscalYear(-1) },
];`,

    bounds: `<app-date-picker
  variant="advanced"
  format="DD/MM/YYYY"
  [minDate]="minDate"
  [maxDate]="today"
  [(ngModel)]="bounded"
></app-date-picker>`,

    boundsTs: `today = new Date();
minDate = new Date(this.today.getFullYear() - 1, 0, 1); // 1 Jan last year`,
  };

  variants: DocsProp[] = [
    { name: "'default'", type: 'calendar', default: 'yes', description: 'Just the calendar. selectionMode decides what a click picks. What every existing <app-date-picker> gets.' },
    { name: "'simple'", type: 'checkbox + search', default: '—', description: 'A "Range" checkbox and a preset search that also understands typed presets ("last 5 months", "Q2 2025").' },
    { name: "'advanced'", type: 'tabs', default: '—', description: 'Date | Range | Periods tabs; Periods has Daily … Yearly grids and "Several months".' },
  ];

  inputs: DocsProp[] = [
    { name: 'variant', type: "'default' | 'simple' | 'advanced'", default: "'default'", description: 'How much UI around the calendar (see above).' },
    { name: 'selectionMode', type: "'default' | 'range' | 'preset'", default: "'default'", description: 'What a click picks: one day, a range, or a period. Two-way [(selectionMode)] when the user can switch (simple / advanced).' },
    { name: 'showTime', type: 'boolean', default: 'false', description: 'One day: also pick hours and minutes (Start of day / End of day shortcuts). The popup stays open to adjust the time.' },
    { name: 'date', type: 'Date | string | null', default: 'null', description: 'One day without forms. Two-way: [(date)].' },
    { name: 'range', type: 'DateRange | null', default: 'null', description: 'A range without forms, [start, end]. Two-way: [(range)].' },
    { name: 'useDefaultDate', type: 'boolean', default: 'false', description: 'Pick today when there is no value yet.' },
    { name: 'minDate / maxDate', type: 'Date | string | null', default: 'null', description: 'Days outside are disabled; periods are trimmed to fit, or disabled if fully outside.' },
    { name: 'format', type: "'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'", default: "'MM/DD/YYYY'", description: 'How dates are shown in the field.' },
    { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Text when empty.' },
    { name: 'monthsShown', type: '1 | 2', default: '1', description: 'Range: months side by side (always 1 on phones).' },
    { name: 'weekStartsOn', type: '0 | 1', default: '1', description: 'Sunday (0) or Monday (1). Affects the calendar and weekly periods.' },
    { name: 'clearable / disabled', type: 'boolean', default: 'true / false', description: 'Show the × and Clear; disable the field (also via forms).' },
    { name: 'modes', type: 'DatePickerSelectionMode[] | null', default: 'all three', description: 'advanced: which tabs to offer, in order.' },
    { name: 'modeLabels', type: 'Partial<Record<mode, string>>', default: '{}', description: "advanced: rename tabs, e.g. { preset: 'Reports' }." },
    { name: 'presets', type: '(DatePresetId | DatePreset)[] | null', default: 'see "Built-in"', description: "Quick choices. Unset: a short list in the Periods tab, every built-in in the simple search. A preset's group picks its tab / tag." },
    { name: 'periods', type: "('day' | 'week' | 'month' | 'quarter' | 'year')[]", default: 'all five', description: 'Periods: which period tabs to show, in order.' },
    { name: 'allowSeveral', type: 'boolean', default: 'true', description: 'Periods: the "Several months" checkbox for a span of periods.' },
    { name: 'allowRange / allowTypedPresets', type: 'boolean', default: 'true', description: 'simple: show the Range checkbox; understand typed presets.' },
    { name: 'searchPlaceholder', type: 'string', default: "'Preset, e.g. last 3 months'", description: 'simple: placeholder of the search.' },
    { name: 'bgColor / border', type: 'string', default: '—', description: 'Field background and border (classic inputs).' },
    { name: 'overlayWidth / datePickerWidth', type: 'number / string', default: 'fits content', description: 'Popup width (classic inputs).' },
    { name: 'useDropdowns / yearPlaceholder / monthPlaceholder', type: 'deprecated', default: '—', description: 'Still accepted so old templates compile. Month and year are picked by clicking the calendar caption.' },
    { name: 'today', type: 'Date | null', default: 'new Date()', description: 'What presets are relative to. Mainly for demos and tests.' },
  ];

  outputs: DocsProp[] = [
    { name: 'selectionChange', type: 'EventEmitter<DateSelection | null>', description: 'Full details of the pick: mode, start, end, presetId, label.' },
    { name: 'selectionModeChange', type: 'EventEmitter<DatePickerSelectionMode>', description: 'The user ticked Range or switched tab (enables [(selectionMode)]).' },
    { name: 'dateChange', type: 'EventEmitter<Date | null>', description: 'One day picked or cleared (enables [(date)]).' },
    { name: 'rangeChange', type: 'EventEmitter<DateRange | null>', description: 'Range or period picked or cleared (enables [(range)]).' },
  ];

  selectionFields: DocsProp[] = [
    { name: 'mode', type: "'default' | 'range' | 'preset'", description: 'How it was picked.' },
    { name: 'start', type: 'Date', description: 'First day, at 00:00:00.000 (with showTime: the picked moment).' },
    { name: 'end', type: 'Date', description: 'Last day, at 23:59:59.999 (with showTime: the picked moment).' },
    { name: 'presetId', type: 'string?', description: "Presets only, e.g. 'last-month' or 'q3-2026'. Save this to keep it relative." },
    { name: 'label', type: 'string?', description: "Presets only, e.g. 'Last month' or 'September 2026'." },
  ];
}
