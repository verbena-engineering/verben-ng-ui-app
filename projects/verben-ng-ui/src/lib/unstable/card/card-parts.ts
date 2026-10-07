import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  numberAttribute,
} from '@angular/core';
import { toAspectRatio } from './card-utils';

/*
 * The small building blocks of <vbn-card>. Each one only adds a CSS class
 * (styles live in card.css), so they are cheap and can be used as an element
 * (<vbn-card-title>) or as an attribute on any tag (<h3 vbnCardTitle>).
 */

/** Bold heading. Exposed as a level-3 heading to screen readers by default */
@Component({
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'vbn-card-title, [vbnCardTitle]',
  host: { class: 'vbn-card-title', role: 'heading', '[attr.aria-level]': 'level' },
})
export class VbnCardTitleComponent {
  @Input({ transform: numberAttribute }) level = 3;
}

/** Muted secondary text (subtitle, date, location…) */
@Component({
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'vbn-card-description, [vbnCardDescription]',
  host: { class: 'vbn-card-description' },
})
export class VbnCardDescriptionComponent {}

/** Top-right slot of a header: a menu button, an amount, a badge… */
@Component({
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'vbn-card-action, [vbnCardAction]',
  host: { class: 'vbn-card-action' },
})
export class VbnCardActionComponent {}

/** columns="3" → 3, columns="auto" → 'auto', anything else → 1 */
function toColumns(value: unknown): number | 'auto' {
  return value === 'auto' ? 'auto' : numberAttribute(value, 1);
}

/**
 * Main body. Sub-cards placed here are spaced automatically.
 * [columns] lays its children out in a grid: a number of columns, or 'auto'
 * for as many as fit (min width --vbn-card-min-column, 240px). Phones get one.
 */
@Component({
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'vbn-card-content, [vbnCardContent]',
  host: {
    class: 'vbn-card-content',
    '[class.vbn-card-content--grid]': "columns === 'auto' || columns > 1",
    '[style.--vbn-card-columns]': "columns === 'auto' ? null : columns > 1 ? columns : null",
    '[attr.data-columns]': "columns === 'auto' ? 'auto' : null",
  },
})
export class VbnCardContentComponent {
  @Input({ transform: toColumns }) columns: number | 'auto' = 1;
}

export type VbnCardJustify = 'start' | 'between' | 'around' | 'end' | 'center';

/** Bottom row for buttons, stats, totals */
@Component({
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'vbn-card-footer, [vbnCardFooter]',
  host: { class: 'vbn-card-footer', '[attr.data-justify]': 'justify' },
})
export class VbnCardFooterComponent {
  @Input() justify: VbnCardJustify = 'start';
}

/** A full-width line between parts */
@Component({
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'vbn-card-divider',
  host: { class: 'vbn-card-divider', role: 'separator' },
})
export class VbnCardDividerComponent {}

/**
 * Edge-to-edge picture or video: <img vbnCardMedia ratio="4/5" src="…" alt="…">.
 * A directive (not a component) so it works on <img> and <video>.
 */
@Directive({
  selector: '[vbnCardMedia]',
  standalone: true,
  host: { class: 'vbn-card-media', '[style.aspect-ratio]': 'aspect' },
})
export class VbnCardMediaDirective {
  aspect: string | null = null;

  /** "16/9", "4:5", "1"… */
  @Input() set ratio(value: string | number | null | undefined) {
    this.aspect = toAspectRatio(value);
  }
}
