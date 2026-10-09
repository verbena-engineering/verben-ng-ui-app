import { Component, EventEmitter, Input, Output } from '@angular/core';
import { parsePresetText } from '../date-preset-parser';
import { DATE_PERIOD_LABELS, DatePeriod, DatePreset, presetSpan } from '../date-presets';
import { formatShortSpan, startOfDay } from '../date-utils';

interface PresetOption {
  preset: DatePreset;
  /** Period tag: Daily, Weekly, Monthly, Quarterly, Yearly (or a custom group) */
  tag: string;
  /** Short dates, e.g. "Sep 1 – Sep 30" */
  dates: string;
  disabled: boolean;
}

let nextId = 0;

/**
 * The preset combobox of <app-date-picker variant="simple">: type to filter
 * presets tagged by period, or type one that isn't listed ("last 5 months",
 * "q2 2025", "march 2026", "2024", see date-preset-parser.ts).
 * (preview) reports the highlighted preset so the calendar can show it.
 */
@Component({
  selector: 'verben-preset-search',
  templateUrl: './preset-search.component.html',
  styleUrls: ['./preset-search.component.css'],
})
export class VerbenPresetSearchComponent {
  @Input() presets: DatePreset[] = [];
  @Input() today: Date = startOfDay(new Date());
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() weekStartsOn: 0 | 1 = 1;
  /** Understand typed presets that aren't in the list */
  @Input() allowTyped = true;
  @Input() placeholder = 'Preset, e.g. last 3 months';

  /** The highlighted preset (arrow keys / mouse); null when the list closes */
  @Output() preview = new EventEmitter<DatePreset | null>();
  @Output() choose = new EventEmitter<DatePreset>();

  readonly listId = `vps-list-${nextId++}`;
  query = '';
  listOpen = false;
  options: PresetOption[] = [];
  activeIndex = -1;

  onFocus(): void {
    this.listOpen = true;
    this.buildOptions();
  }

  onInput(value: string): void {
    this.query = value;
    this.listOpen = true;
    this.buildOptions();
    // Pre-select the best match so Enter picks it and the calendar shows it
    const first = this.options.findIndex((o) => !o.disabled);
    if (first >= 0) this.setActive(first);
    else this.setActive(-1);
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.listOpen) this.onFocus();
        const count = this.options.length;
        if (!count) return;
        const step = event.key === 'ArrowDown' ? 1 : -1;
        let i = this.activeIndex;
        // Next enabled option, wrapping around
        for (let tries = 0; tries < count; tries++) {
          i = (i + step + count) % count;
          if (!this.options[i].disabled) break;
        }
        this.setActive(i);
        break;
      }
      case 'Enter': {
        const option = this.options[this.activeIndex];
        if (this.listOpen && option) {
          event.preventDefault();
          this.chooseOption(option);
        }
        break;
      }
      case 'Escape':
        if (this.listOpen) {
          event.preventDefault();
          event.stopPropagation(); // only the list closes, not the popup
          this.closeList();
        }
        break;
      case 'Tab':
        this.closeList();
        break;
    }
  }

  trackByOption(_: number, option: PresetOption): string {
    return option.preset.id;
  }

  setActive(index: number): void {
    this.activeIndex = index;
    this.preview.emit(this.options[index]?.preset ?? null);
  }

  chooseOption(option: PresetOption): void {
    if (option.disabled) return;
    this.closeList();
    this.query = '';
    this.choose.emit(option.preset);
  }

  closeList(): void {
    if (!this.listOpen) return;
    this.listOpen = false;
    this.setActive(-1);
  }

  /** Presets matching every typed word (in label or tag), a typed preset first */
  private buildOptions(): void {
    const words = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const listed = this.presets
      .map((preset) => this.toOption(preset))
      .filter((o) => words.every((w) => `${o.preset.label} ${o.tag}`.toLowerCase().includes(w)));

    const typed = this.allowTyped ? parsePresetText(this.query, this.today) : null;
    if (typed) {
      const existing = listed.findIndex((o) => o.preset.id === typed.id);
      if (existing >= 0) listed.unshift(...listed.splice(existing, 1));
      else listed.unshift(this.toOption(typed));
    }
    this.options = listed;
  }

  private toOption(preset: DatePreset): PresetOption {
    const span = presetSpan(preset, this.today, this.weekStartsOn, this.min, this.max);
    const group = preset.group ?? '';
    return {
      preset,
      tag: DATE_PERIOD_LABELS[group as DatePeriod] ?? group,
      dates: span ? formatShortSpan(span, this.today) : 'outside the allowed dates',
      disabled: !span,
    };
  }
}
