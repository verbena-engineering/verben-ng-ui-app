import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  booleanAttribute,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardSlotDirective } from './card-slot.directive';

/** Built-in corner buttons */
export type CardActionName = 'minimize' | 'close' | 'delete' | 'edit' | 'more' | 'expand';

/** A corner button of your own (or a built-in one with another id / label) */
export interface CardAction {
  /** What (action) emits */
  id: string;
  /** Accessible name and tooltip */
  label?: string;
  /** One of the built-in icons… */
  icon?: CardActionName;
  /** …or a short text instead, e.g. 'Pin' */
  text?: string;
  /** 'danger' turns it red on hover (delete is danger by default) */
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

export type CardTagTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export type CardCornerPosition = 'top-right' | 'top-left';

/** Icons are inline paths (24×24, stroked), so the card needs no icon loading */
const ICONS: Record<CardActionName | 'restore', string> = {
  minimize: 'M5 12h14',
  restore: 'M5 5h14v14H5z',
  close: 'M18 6 6 18M6 6l12 12',
  delete: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
  edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  more: 'M12 5h.01M12 12h.01M12 19h.01',
  expand: 'M15 3h6v6M21 3l-7 7M9 21H3v-6M3 21l7-7',
};

const PRESETS: Record<CardActionName, { label: string; danger?: boolean }> = {
  minimize: { label: 'Minimize' },
  close: { label: 'Close' },
  delete: { label: 'Delete', danger: true },
  edit: { label: 'Edit' },
  more: { label: 'More' },
  expand: { label: 'Expand' },
};

/** An action as the template uses it */
interface CornerButton {
  id: string;
  label: string;
  icon?: CardActionName;
  text?: string;
  danger: boolean;
  disabled: boolean;
}

/*
 * <verben-card>: a box with optional sections, filled by marking your own elements.
 *
 *   <verben-card>
 *     <div card-header>…</div>
 *     <img card-media src="…" alt="…" />   (added 2026-10-09: edge to edge)
 *     <div card-body>…</div>
 *     <div card-footer>…</div>
 *   </verben-card>
 *
 * Everything that worked before works and looks the same: same inputs and
 * defaults, same slots, same markup (.card / .card-header / .card-body /
 * .card-footer). Added on 2026-10-09, all opt-in:
 *   heading / subheading   a header without writing markup
 *   variant="plain"        no grey header / footer bars
 *   interactive            hover and keyboard focus, for clickable cards
 *   selected               accent strip on the left (e.g. the open item of a list)
 *   card-media slot        image or video edge to edge
 * Sections you don't fill are not shown (the docs always said so; before,
 * empty header / footer bars were drawn).
 *
 * The corner (added later on 2026-10-09, opt-in): things in the top-right.
 *   tag="Draft" tagTone="warning"            a small chip
 *   [actions]="['minimize', 'close']"        built-in buttons, or your own
 *   (action)="…"  [(collapsed)]="…"          minimize collapses the card
 *   <button card-actions>…</button>          anything else
 *   cornerPosition="top-left"                the other side (default top-right)
 *   actionsOnHover                           buttons only while hovered / focused
 * With a header it sits on the right of the header; on a card that starts
 * with card-media (no header) it floats over the image.
 */
@Component({
  selector: 'verben-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  // Its template only reads its own inputs; projected content belongs to the
  // page, so this changes nothing for the page and skips needless checks
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.tabindex]': 'interactive && !disabled ? 0 : null',
  },
})
export class CardComponent implements OnChanges, AfterContentInit {
  /** Kept for compatibility; empty sections are hidden with CSS (:empty) */
  hasHeader = true;
  hasBody = true;
  hasFooter = true;

  @Input() pd = '10px';
  @Input() mg = '0px';
  @Input() height?: string;
  @Input() width?: string;
  @Input() textColor?: string;
  @Input() bgColor?: string;
  @Input() border?: string;
  @Input() borderRadius?: string;
  @Input() disabled: boolean = false;
  @Input() aspectRatio?: number;

  // ---- Added 2026-10-09 (opt-in) ----
  /** Title shown in the header, without writing header markup */
  @Input() heading?: string;
  /** Muted line under the heading */
  @Input() subheading?: string;
  /** 'plain' = no grey header / footer bars */
  @Input() variant: 'default' | 'plain' = 'default';
  /** Hover and keyboard focus styles for clickable cards; bind (click) / (keydown.enter) as usual */
  @Input({ transform: booleanAttribute }) interactive = false;
  /** Accent strip on the left, e.g. the item whose details are open */
  @Input({ transform: booleanAttribute }) selected = false;

  // ---- The corner (opt-in): tag, actions, [card-actions] ----
  /** A small chip in the top-right, e.g. 'New', 'Draft', 'Paid' */
  @Input() tag?: string;
  /** Tag colours from the theme */
  @Input() tagTone: CardTagTone = 'neutral';
  /** Your own tag colours (win over tagTone) */
  @Input() tagBgColor?: string;
  @Input() tagTextColor?: string;
  /**
   * Corner buttons, in order: built-in names ('minimize', 'close', 'delete',
   * 'edit', 'more', 'expand') and / or your own { id, label, icon | text }.
   * Each click emits (action) with its id; 'minimize' also collapses the card.
   */
  @Input() actions: (CardActionName | CardAction)[] = [];
  /** Which top corner: 'top-right' (default) or 'top-left' */
  @Input() cornerPosition: CardCornerPosition = 'top-right';
  /**
   * The corner's buttons ([actions] and [card-actions] content) only show while
   * the card is hovered or something in it has keyboard focus. The tag stays.
   * On touch screens (no hover) they always show.
   */
  @Input({ transform: booleanAttribute }) actionsOnHover = false;
  /** Only the header is shown (what 'minimize' toggles); two-way: [(collapsed)] */
  @Input({ transform: booleanAttribute }) collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  /** The id of the corner button that was clicked */
  @Output() action = new EventEmitter<string>();

  /** Which slots you filled (direct children of <verben-card> only, so nested cards don't count) */
  @ContentChildren(CardSlotDirective, { descendants: false })
  private slotted?: QueryList<CardSlotDirective>;
  private filled = new Set<CardSlotDirective['slot']>();
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  buttons: CornerButton[] = [];
  readonly icons = ICONS;

  /** pd as sides, so card-media can stretch over the padding */
  padTop = '10px';
  padRight = '10px';
  padLeft = '10px';

  ngOnChanges(): void {
    // CSS padding shorthand: top [right [bottom [left]]]
    const parts = (this.pd ?? '').trim().split(/\s+/).filter(Boolean);
    this.padTop = parts[0] ?? '0px';
    this.padRight = parts[1] ?? this.padTop;
    this.padLeft = parts[3] ?? this.padRight;

    this.buttons = (this.actions ?? []).map((a) => {
      const custom: CardAction = typeof a === 'string' ? { id: a, icon: a } : a;
      const preset = custom.icon ? PRESETS[custom.icon] : undefined;
      return {
        id: custom.id,
        label: custom.label ?? preset?.label ?? custom.text ?? custom.id,
        icon: custom.icon,
        text: custom.text,
        danger: custom.tone ? custom.tone === 'danger' : !!preset?.danger,
        disabled: !!custom.disabled,
      };
    });
  }

  ngAfterContentInit(): void {
    const read = () => (this.filled = new Set(this.slotted?.map((s) => s.slot)));
    read();
    this.slotted?.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      read();
      this.cdr.markForCheck();
    });
  }

  /** The corner is only rendered when something is in it */
  get hasCorner(): boolean {
    return !!this.tag || this.buttons.length > 0 || this.filled.has('actions');
  }

  /** No header content and the card starts with media: the corner floats over the image */
  get cornerOverlay(): boolean {
    return (
      this.hasCorner &&
      !this.heading &&
      !this.subheading &&
      !this.filled.has('header') &&
      this.filled.has('media')
    );
  }

  /** minimize shows "restore" while collapsed */
  iconOf(b: CornerButton): string | null {
    if (!b.icon) return null;
    return b.icon === 'minimize' && this.collapsed ? ICONS.restore : ICONS[b.icon];
  }

  labelOf(b: CornerButton): string {
    return b.icon === 'minimize' && this.collapsed && b.label === PRESETS.minimize.label ? 'Restore' : b.label;
  }

  press(b: CornerButton): void {
    if (b.icon === 'minimize') {
      this.collapsed = !this.collapsed;
      this.collapsedChange.emit(this.collapsed);
    }
    this.action.emit(b.id);
  }

  trackButton(_: number, b: CornerButton): string {
    return b.id;
  }
}
