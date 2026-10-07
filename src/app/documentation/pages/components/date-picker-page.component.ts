import { Component } from '@angular/core';
import {
  DATE_PERIOD_LABELS,
  DATE_PRESETS,
  DatePeriod,
  DatePreset,
  DatePresetId,
  DateSelection,
  VerbenDatePickerMode,
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

const thisFiscalYear: DatePreset = {
  id: 'this-fiscal-year',
  label: 'This fiscal year',
  group: 'Fiscal',
  range: fiscalYear(0),
};
const lastFiscalYear: DatePreset = {
  id: 'last-fiscal-year',
  label: 'Last fiscal year',
  group: 'Fiscal',
  range: fiscalYear(-1),
};

@Component({
  selector: 'docs-verben-date-picker-page',
  templateUrl: './verben-date-picker-page.component.html',
})
export class VerbenDatePickerPageComponent {
  // Example values
  day: string | null = null;
  mode: VerbenDatePickerMode = 'single';
  value: unknown = null;
  lastSelection: DateSelection | null = null;
  report: unknown = 'last-month'; // a preset id stays relative to today
  span: unknown = 'month-2026-08..month-2027-03';
  finance: unknown = null;
  period: [string, string] | null = null;
  bounded: unknown = null;

  allModes: VerbenDatePickerMode[] = ['single', 'range', 'preset'];
  financePeriods: DatePeriod[] = ['month', 'quarter', 'year'];
  financePresets: (DatePresetId | DatePreset)[] = [
    'this-month',
    'last-month',
    'this-quarter',
    'last-quarter',
    'last-year',
    thisFiscalYear,
    lastFiscalYear,
  ];

  today = new Date();
  minDate = new Date(this.today.getFullYear() - 1, 0, 1);
  maxDate = this.today;

  presetRows: PresetRow[] = Object.values(DATE_PRESETS).map((p) => {
    const [start, end] = p.range(this.today, { weekStartsOn: 1 });
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    return {
      tab: DATE_PERIOD_LABELS[p.group as DatePeriod],
      id: p.id,
      label: p.label,
      resolves: `${fmt(start)} – ${fmt(end)}`,
    };
  });

  // Local dates on purpose: toISOString() is UTC and can show the previous day
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
    basic: `<verben-date-picker [(ngModel)]="day"></verben-date-picker>`,

    mutate: `<verben-date-picker
  [modes]="['single', 'range', 'preset']"
  [(mode)]="mode"
  [(ngModel)]="value"
  (selectionChange)="lastSelection = $event"
></verben-date-picker>`,

    mutateTs: `import { DateSelection, VerbenDatePickerMode } from 'verben-ng-ui';

mode: VerbenDatePickerMode = 'single';
value: unknown = null;          // string in single mode, [start, end] otherwise
lastSelection: DateSelection | null = null;`,

    periods: `<verben-date-picker mode="preset" [(ngModel)]="report"></verben-date-picker>`,

    span: `<verben-date-picker mode="preset" [(ngModel)]="span"></verben-date-picker>`,

    spanTs: `// Tick "Several months", click the first month, step to the next year,
// click the last month. The id of the span works as a value too:
span: unknown = 'month-2026-08..month-2027-03';`,

    periodsTs: `// A preset id as the value stays relative:
// next month it means the new "last month"
report: unknown = 'last-month';`,

    custom: `<verben-date-picker
  mode="preset"
  [periods]="['month', 'quarter', 'year']"
  [presets]="financePresets"
  [(ngModel)]="finance"
></verben-date-picker>`,

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

    range: `<verben-date-picker
  mode="range"
  [monthsShown]="2"
  placeholder="Pick a period"
  [(ngModel)]="period"
></verben-date-picker>`,

    bounds: `<verben-date-picker
  [modes]="['single', 'range', 'preset']"
  format="DD/MM/YYYY"
  [minDate]="minDate"
  [maxDate]="today"
  [(ngModel)]="bounded"
></verben-date-picker>`,

    boundsTs: `today = new Date();
minDate = new Date(this.today.getFullYear() - 1, 0, 1); // 1 Jan last year`,
  };

  inputs: DocsProp[] = [
    { name: 'mode', type: "'single' | 'range' | 'preset'", default: "'single'", description: 'What a click picks. Two-way: [(mode)].' },
    { name: 'modes', type: 'VerbenDatePickerMode[] | null', default: 'null', description: 'Modes the user can switch between in the popup. Unset = only `mode`, no switcher.' },
    { name: 'periods', type: "('day' | 'week' | 'month' | 'quarter' | 'year')[]", default: 'all five', description: 'Preset mode: which period tabs to show, in order.' },
    { name: 'allowSeveral', type: 'boolean', default: 'true', description: 'Preset mode: show the "Several months" checkbox for picking a span of periods.' },
    { name: 'presets', type: '(DatePresetId | DatePreset)[]', default: 'DEFAULT_DATE_PRESETS', description: 'Preset mode: quick choices. A preset\'s group picks its tab; other group names get their own tab.' },
    { name: 'monthsShown', type: '1 | 2', default: '1', description: 'Range mode: months side by side (always 1 on phones).' },
    { name: 'minDate / maxDate', type: 'Date | string | null', default: 'null', description: 'Days outside are disabled; periods are trimmed to fit, or disabled if fully outside.' },
    { name: 'format', type: "'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'", default: "'MM/DD/YYYY'", description: 'How dates are shown in the field.' },
    { name: 'weekStartsOn', type: '0 | 1', default: '1', description: 'Sunday (0) or Monday (1). Affects the calendar and weekly periods.' },
    { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Text when empty.' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Show the × button and Clear action.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field (also via form controls).' },
    { name: 'modeLabels', type: 'Partial<Record<mode, string>>', default: '{}', description: "Rename the switcher buttons, e.g. { preset: 'Reports' }." },
    { name: 'today', type: 'Date | null', default: 'new Date()', description: 'What presets are relative to. Mainly for demos and tests.' },
  ];

  outputs: DocsProp[] = [
    { name: 'selectionChange', type: 'EventEmitter<DateSelection | null>', description: 'Full details of the pick: mode, start, end, presetId, label.' },
    { name: 'modeChange', type: 'EventEmitter<VerbenDatePickerMode>', description: 'The user switched mode (enables [(mode)]).' },
  ];

  selectionFields: DocsProp[] = [
    { name: 'mode', type: "'single' | 'range' | 'preset'", description: 'How it was picked.' },
    { name: 'start', type: 'Date', description: 'First day, at 00:00:00.000.' },
    { name: 'end', type: 'Date', description: 'Last day, at 23:59:59.999 (also for a single day).' },
    { name: 'presetId', type: 'string?', description: "Preset mode only, e.g. 'last-month' or 'q3-2026'. Save this to keep it relative." },
    { name: 'label', type: 'string?', description: "Preset mode only, e.g. 'Last month' or 'September 2026'." },
  ];

  // ---------- Alternative design: <verben-simple-date-picker> ----------

  simpleDay: unknown = null;
  simpleRangeMode = true;
  simpleRange: unknown = null;
  simpleReport: unknown = 'last-5-months'; // a typed preset, saved by id
  simpleLimited: unknown = null;
  simpleFinance: (DatePresetId | DatePreset)[] = [
    'this-month',
    'last-month',
    'this-quarter',
    'last-quarter',
    'last-year',
    thisFiscalYear,
    lastFiscalYear,
  ];

  simpleCode = {
    basic: `<verben-simple-date-picker [(ngModel)]="day"></verben-simple-date-picker>`,

    range: `<verben-simple-date-picker
  [(rangeMode)]="rangeMode"
  [monthsShown]="2"
  [(ngModel)]="period"
></verben-simple-date-picker>`,

    rangeTs: `rangeMode = true;   // the "Range" checkbox starts ticked
period: unknown = null;`,

    typed: `<verben-simple-date-picker [(ngModel)]="report"></verben-simple-date-picker>`,

    typedTs: `// Typed presets get ids too, so they can be saved and restored:
report: unknown = 'last-5-months';`,

    custom: `<verben-simple-date-picker
  [presets]="financePresets"
  [allowTypedPresets]="false"
  [allowRange]="false"
  [(ngModel)]="value"
></verben-simple-date-picker>`,
  };

  simpleInputs: DocsProp[] = [
    { name: 'rangeMode', type: 'boolean', default: 'false', description: 'The "Range" checkbox: unticked = one day per click, ticked = start + end. Two-way: [(rangeMode)].' },
    { name: 'allowRange', type: 'boolean', default: 'true', description: 'Show the "Range" checkbox.' },
    { name: 'presets', type: '(DatePresetId | DatePreset)[]', default: 'all built-ins', description: 'Presets listed in the combobox, tagged by their group (Daily … Yearly, or a custom name).' },
    { name: 'allowTypedPresets', type: 'boolean', default: 'true', description: 'Understand typed presets that are not in the list: "last 5 months", "q2 2025", "march 2026", "2024", "ytd".' },
    { name: 'searchPlaceholder', type: 'string', default: "'Preset, e.g. last 3 months'", description: 'Placeholder of the combobox.' },
    { name: 'monthsShown', type: '1 | 2', default: '1', description: 'Months side by side while Range is ticked (1 on phones).' },
    { name: 'placeholder / format / minDate / maxDate / weekStartsOn / clearable / disabled / today', type: '—', default: '—', description: 'Same as <verben-date-picker>.' },
  ];

  simpleOutputs: DocsProp[] = [
    { name: 'selectionChange', type: 'EventEmitter<DateSelection | null>', description: "Same DateSelection as above; mode is 'single', 'range' or 'preset'." },
    { name: 'rangeModeChange', type: 'EventEmitter<boolean>', description: 'The Range checkbox was toggled (enables [(rangeMode)]).' },
  ];
}
