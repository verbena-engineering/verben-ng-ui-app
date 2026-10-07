import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-number-input-page',
  templateUrl: './number-input-page.component.html',
})
export class NumberInputPageComponent {
  population = 1234567;
  price = 2500.5;
  weight = 4200;
  quantity = 3;
  raw = 98765;

  typeOf(value: unknown): string {
    return typeof value;
  }

  code = {
    basic: `<verben-number-input label="Population" [(ngModel)]="population"></verben-number-input>`,

    currency: `<verben-number-input
  label="Price"
  prefix="₦ "
  [decimalPlaces]="2"
  [step]="0.5"
  [(ngModel)]="price"
></verben-number-input>`,

    suffix: `<verben-number-input
  label="Weight"
  suffix=" kg"
  [min]="0"
  [max]="100000"
  [(value)]="weight"
></verben-number-input>`,

    integer: `<verben-number-input
  label="Quantity"
  [decimalPlaces]="0"
  [min]="1"
  [max]="99"
  [(ngModel)]="quantity"
></verben-number-input>`,

    raw: `<verben-number-input label="No separator" [thousandSeparator]="false" [(ngModel)]="raw"></verben-number-input>`,
  };

  inputs: DocsProp[] = [
    { name: 'thousandSeparator', type: 'boolean', default: 'true', description: 'Group digits while typing, e.g. 1,234,567.' },
    { name: 'separator', type: 'string', default: "','", description: 'Grouping character.' },
    { name: 'decimalPlaces', type: 'number', default: '—', description: 'Limits typed decimals and pads the display (0 = whole numbers only).' },
    { name: 'prefix / suffix', type: 'string', default: "''", description: 'Shown when the field is not being edited, e.g. "₦ " or " kg".' },
    { name: 'min / max', type: 'number', default: '—', description: 'Values are clamped to this range.' },
    { name: 'step', type: 'number', default: '1', description: 'Amount added by Arrow Up / Arrow Down.' },
    { name: 'label', type: 'string', default: "''", description: 'Label above the field.' },
    { name: 'value', type: 'number', default: '0', description: 'Value for [(value)] binding (alternative to ngModel).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
  ];

  outputs: DocsProp[] = [
    { name: 'valueChange', type: 'EventEmitter<number>', description: 'Fires while typing and on blur. Always a number.' },
    { name: 'keyUp', type: 'EventEmitter<{ event: KeyboardEvent; value: number }>', description: 'Key-up with the parsed value.' },
  ];
}
