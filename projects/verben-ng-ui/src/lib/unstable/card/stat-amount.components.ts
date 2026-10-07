import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
import { formatAmount } from './card-utils';

/** A number with a label under it: <vbn-stat value="1.2k" label="Followers"></vbn-stat> */
@Component({
  selector: 'vbn-stat',
  standalone: true,
  template: `<strong class="vbn-stat-value">{{ value }}</strong><span class="vbn-stat-label">{{ label }}</span>`,
  styles: [
    `.vbn-stat { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.25; }
     .vbn-stat-value { font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums; }
     .vbn-stat-label { font-size: 12px; color: var(--vbn-color-text-muted); }`,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'vbn-stat' },
})
export class VbnStatComponent {
  @Input() value: string | number = '';
  @Input() label = '';
}

/**
 * Money, formatted and colored: money in is green with "+", money out red with "−".
 *   <vbn-amount [value]="-4500" currency="NGN"></vbn-amount>   → −₦4,500.00
 */
@Component({
  selector: 'vbn-amount',
  standalone: true,
  template: `{{ text }}`,
  styles: [
    `.vbn-amount { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
     .vbn-amount--in { color: var(--vbn-color-success); }
     .vbn-amount--out { color: var(--vbn-color-error); }`,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vbn-amount',
    '[class.vbn-amount--in]': 'colored && value > 0',
    '[class.vbn-amount--out]': 'colored && value < 0',
  },
})
export class VbnAmountComponent implements OnChanges {
  @Input() value = 0;
  /** ISO currency code, e.g. NGN, USD, EUR */
  @Input() currency = 'NGN';
  @Input() locale?: string;
  /** Show "+" / "−" */
  @Input({ transform: booleanAttribute }) signed = true;
  /** Green for money in, red for money out */
  @Input({ transform: booleanAttribute }) colored = true;

  text = '';

  ngOnChanges(): void {
    this.text = formatAmount(this.value, {
      currency: this.currency,
      locale: this.locale,
      signed: this.signed,
    });
  }
}
