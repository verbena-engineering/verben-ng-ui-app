import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  DATE_PERIOD_LABELS,
  DatePeriod,
  DatePreset,
  monthPreset,
  periodOf,
  quarterPreset,
  spanPreset,
  weekPreset,
  yearPreset,
} from '../date-presets';
import {
  DateSpan,
  addDays,
  addMonths,
  clampSpan,
  compareDays,
  endOfMonth,
  isoWeek,
  startOfMonth,
  startOfWeek,
} from '../date-utils';

interface PeriodTab {
  key: string;
  label: string;
}

interface PeriodItem {
  preset: DatePreset;
  /** Short text on the button ("Sep", "Q3", "Oct 5 – 11") */
  text: string;
  /** Small secondary text ("Jul – Sep", "W41") */
  sub?: string;
  disabled: boolean;
  /** The period that contains today, marked with a dot */
  isCurrent: boolean;
  /** Filled: the selected period, or the first period of a span being picked */
  isActive: boolean;
  /** Tinted: covered by the selection, or by the span being previewed */
  inSelection: boolean;
}

type GridKind = 'weeks' | 'months' | 'quarters' | 'years' | null;

/**
 * Preset ("Periods") mode layout:
 *
 *   tabs         Daily · Weekly · Monthly · Quarterly · Yearly
 *   suggestions  a few relative presets for the tab ("Last month")
 *   side grid    specific periods with a ‹ › stepper   |  projected content
 *                (weeks / months / quarters / years)    |  (the calendar)
 *
 * With [multi] on, the first grid click starts a span and the second ends
 * it (either order, stepping across years in between). Presentational: it
 * reports (preview), (choose), (tabChange) and (spanStartChange).
 */
@Component({
  selector: 'verben-period-panel',
  templateUrl: './period-panel.component.html',
  styleUrls: ['./period-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerbenPeriodPanelComponent implements OnChanges {
  /** Suggestions; their `group` decides the tab */
  @Input() presets: DatePreset[] = [];
  /** Period tabs to offer, in order */
  @Input() periods: DatePeriod[] = ['day', 'week', 'month', 'quarter', 'year'];
  /** Selected preset id */
  @Input() activeId: string | null = null;
  @Input() today: Date = new Date();
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() weekStartsOn: 0 | 1 = 1;
  /** Where the stepper starts (the current selection or today) */
  @Input() focus: Date = new Date();
  /** Current selection, to tint the grid cells it covers */
  @Input() selectedStart: Date | null = null;
  @Input() selectedEnd: Date | null = null;
  /** Pick several consecutive periods (two clicks) instead of one */
  @Input() multi = false;

  @Output() choose = new EventEmitter<DatePreset>();
  @Output() preview = new EventEmitter<DatePreset | null>();
  @Output() tabChange = new EventEmitter<string>();
  /** First period of a span in progress (null when none) */
  @Output() spanStartChange = new EventEmitter<DatePreset | null>();

  tabs: PeriodTab[] = [];
  activeTab = '';
  quick: PeriodItem[] = [];
  grid: PeriodItem[] = [];
  gridKind: GridKind = null;
  stepperLabel = '';

  /** Month (weeks), year (months, quarters) or any year of the page (years) */
  private cursor = new Date();
  private spanStart: DatePreset | null = null;
  private hovered: DatePreset | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    this.tabs = this.buildTabs();
    if (changes['focus']) this.cursor = this.focus;
    // The parent turned "several" off and resets its own copy, so no event here
    if (changes['multi'] && !this.multi) this.spanStart = null;
    if (!this.tabs.some((t) => t.key === this.activeTab)) {
      this.activeTab = this.initialTab();
      // Tell the parent after this check: emitting during it would change
      // values Angular already checked (NG0100 in dev mode)
      const tab = this.activeTab;
      queueMicrotask(() => this.tabChange.emit(tab));
    }
    this.build();
  }

  selectTab(key: string): void {
    if (key === this.activeTab) return;
    this.activeTab = key;
    this.cursor = this.focus;
    this.hovered = null;
    this.setSpanStart(null);
    this.preview.emit(null);
    this.tabChange.emit(key);
    this.build();
  }

  // trackBy: keep the same buttons when only their highlight changes on hover
  trackByPreset(_: number, item: PeriodItem): string {
    return item.preset.id;
  }

  step(delta: number): void {
    const c = this.cursor;
    this.cursor =
      this.gridKind === 'weeks'
        ? addMonths(startOfMonth(c), delta)
        : new Date(c.getFullYear() + delta * (this.gridKind === 'years' ? 12 : 1), 0, 1);
    this.build(); // a span in progress is kept, so it can cross years
  }

  onCellHover(item: PeriodItem | null): void {
    this.hovered = item?.preset ?? null;
    this.preview.emit(this.hovered && this.spanWith(this.hovered));
    this.build();
  }

  onCellClick(item: PeriodItem): void {
    if (!this.multi) {
      this.choose.emit(item.preset);
      return;
    }
    if (!this.spanStart) {
      this.setSpanStart(item.preset);
      this.build();
      return;
    }
    const span = spanPreset(this.spanStart, item.preset);
    this.setSpanStart(null);
    this.choose.emit(span);
  }

  /** The hovered period, extended back to the span start while one is open */
  private spanWith(preset: DatePreset): DatePreset {
    return this.spanStart ? spanPreset(this.spanStart, preset) : preset;
  }

  private setSpanStart(preset: DatePreset | null): void {
    if (this.spanStart === preset) return;
    this.spanStart = preset;
    this.spanStartChange.emit(preset);
  }

  // Periods with something to show, then any custom groups from [presets]
  private buildTabs(): PeriodTab[] {
    const tabs: PeriodTab[] = this.periods.map((p) => ({ key: p, label: DATE_PERIOD_LABELS[p] }));
    for (const preset of this.presets) {
      const key = periodOf(preset);
      if (!(key in DATE_PERIOD_LABELS) && !tabs.some((t) => t.key === key)) {
        tabs.push({ key, label: key });
      }
    }
    return tabs;
  }

  // Open on the tab of the selected preset, else Monthly, else the first
  private initialTab(): string {
    const fromId = this.tabOfId(this.activeId);
    const keys = this.tabs.map((t) => t.key);
    if (fromId && keys.includes(fromId)) return fromId;
    return keys.includes('month') ? 'month' : (keys[0] ?? '');
  }

  private tabOfId(id: string | null): string | null {
    if (!id) return null;
    const listed = this.presets.find((p) => p.id === id);
    if (listed) return periodOf(listed);
    const prefix = /^(day|week|month|year)-|^q[1-4]-/.exec(id);
    if (!prefix) return null;
    return prefix[1] ?? 'quarter';
  }

  private build(): void {
    // What the grid tints: the span being previewed, else the selection
    const previewing = this.hovered && this.spanStart ? this.spanWith(this.hovered) : null;
    const tint: DateSpan | null = previewing
      ? previewing.range(this.today, { weekStartsOn: this.weekStartsOn })
      : this.selectedStart && this.selectedEnd
        ? [this.selectedStart, this.selectedEnd]
        : null;

    const tab = this.activeTab;
    this.quick = this.presets
      .filter((p) => periodOf(p) === tab)
      .map((p) => this.toItem(p, p.label, undefined, tint));

    const c = this.cursor;
    const year = c.getFullYear();
    switch (tab) {
      case 'week': {
        this.gridKind = 'weeks';
        this.stepperLabel = c.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        const items: PeriodItem[] = [];
        // Every week that overlaps the cursor month
        for (
          let start = startOfWeek(startOfMonth(c), this.weekStartsOn);
          compareDays(start, endOfMonth(c)) <= 0;
          start = addDays(start, 7)
        ) {
          const end = addDays(start, 6);
          const endText =
            end.getMonth() === start.getMonth()
              ? String(end.getDate())
              : end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          items.push(
            this.toItem(
              weekPreset(start),
              `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${endText}`,
              this.weekStartsOn === 1 ? `W${isoWeek(start)}` : undefined,
              tint,
            ),
          );
        }
        this.grid = items;
        break;
      }
      case 'month':
        this.gridKind = 'months';
        this.stepperLabel = String(year);
        this.grid = Array.from({ length: 12 }, (_, m) =>
          this.toItem(
            monthPreset(year, m),
            new Date(year, m, 1).toLocaleDateString(undefined, { month: 'short' }),
            undefined,
            tint,
          ),
        );
        break;
      case 'quarter':
        this.gridKind = 'quarters';
        this.stepperLabel = String(year);
        this.grid = [1, 2, 3, 4].map((q) => {
          const month = (i: number) =>
            new Date(year, (q - 1) * 3 + i, 1).toLocaleDateString(undefined, { month: 'short' });
          return this.toItem(quarterPreset(year, q), `Q${q}`, `${month(0)} – ${month(2)}`, tint);
        });
        break;
      case 'year': {
        this.gridKind = 'years';
        const first = year - (year % 12);
        this.stepperLabel = `${first} – ${first + 11}`;
        this.grid = Array.from({ length: 12 }, (_, i) =>
          this.toItem(yearPreset(first + i), String(first + i), undefined, tint),
        );
        break;
      }
      default:
        this.gridKind = null; // Daily and custom tabs: suggestions + calendar only
        this.stepperLabel = '';
        this.grid = [];
    }
  }

  private toItem(preset: DatePreset, text: string, sub: string | undefined, tint: DateSpan | null): PeriodItem {
    const span = preset.range(this.today, { weekStartsOn: this.weekStartsOn });
    const within = (outer: DateSpan | null) =>
      !!outer && compareDays(span[0], outer[0]) >= 0 && compareDays(span[1], outer[1]) <= 0;
    return {
      preset,
      text,
      sub,
      // Disabled when the whole period is outside minDate / maxDate
      disabled: !clampSpan(span, this.min, this.max),
      isCurrent:
        !!preset.fixed && compareDays(span[0], this.today) <= 0 && compareDays(span[1], this.today) >= 0,
      isActive: preset.id === this.activeId || preset.id === this.spanStart?.id,
      inSelection: !!preset.fixed && within(tint),
    };
  }
}
