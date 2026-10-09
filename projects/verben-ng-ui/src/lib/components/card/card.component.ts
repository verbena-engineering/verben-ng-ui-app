import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  booleanAttribute,
} from '@angular/core';

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
export class CardComponent implements OnChanges {
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
  }
}
