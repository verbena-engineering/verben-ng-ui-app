import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-input-page',
  templateUrl: './input-page.component.html',
})
export class InputPageComponent {
  email = '';
  password = '';
  username = '';
  code = '';

  snippets = {
    basic: `<verbena-input
  label="Email"
  type="email"
  placeHolder="name@company.com"
  [(ngModel)]="email"
></verbena-input>`,

    password: `<verbena-input
  label="Password"
  type="password"
  placeHolder="At least 8 characters"
  [passwordToggle]="true"
  [(ngModel)]="password"
></verbena-input>`,

    validation: `<verbena-input
  label="Username"
  placeHolder="Type, then clear the field"
  [required]="true"
  [minLength]="3"
  [customErrorMessages]="{ required: 'Pick a username.' }"
  [(ngModel)]="username"
></verbena-input>`,

    capitalization: `<verbena-input
  label="Voucher code"
  placeHolder="Typed text becomes uppercase"
  capitalization="uppercase"
  [(ngModel)]="code"
></verbena-input>`,

    disabled: `<verbena-input label="Company" value="Verbena Logic" [disabled]="true"></verbena-input>
<verbena-input label="Reference" value="INV-0042" [readOnly]="true"></verbena-input>`,
  };

  inputs: DocsProp[] = [
    { name: 'label', type: 'string', default: "''", description: 'Label above the field.' },
    { name: 'placeHolder', type: 'string', default: "''", description: 'Placeholder text (note the capital H).' },
    {
      name: 'type',
      type: "'text' | 'email' | 'password' | 'number' | 'decimal' | 'integer' | 'tel' | 'url' | 'date' | 'file' | …",
      default: "'text'",
      description: 'Native input type. number/decimal/integer strip commas from the value.',
    },
    { name: 'required', type: 'boolean', default: 'false', description: 'Shows an error when empty.' },
    { name: 'minLength / maxLength', type: 'number', default: '—', description: 'Length validation with messages.' },
    { name: 'min / max', type: 'number', default: '—', description: 'Value range for numeric types.' },
    { name: 'customErrorMessages', type: '{ required?, minLength?, maxLength?, minValue?, … }', default: '{}', description: 'Replace the default error texts.' },
    { name: 'passwordToggle', type: 'boolean', default: 'false', description: 'Adds a show/hide button for passwords.' },
    {
      name: 'capitalization',
      type: "'none' | 'uppercase' | 'lowercase' | 'sentencecase' | 'pascalcase' | 'camelcase'",
      default: "'none'",
      description: 'Transforms the text as the user types.',
    },
    { name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'Disable or lock the field.' },
    { name: 'showErrorMessage', type: 'boolean', default: 'true', description: 'Hide the message but keep the invalid state.' },
    { name: 'errorPosition', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Where the error text appears.' },
    { name: 'bgColor / border / borderRadius / textColor', type: 'string', default: 'theme', description: 'Style overrides.' },
  ];

  outputs: DocsProp[] = [
    { name: 'valueChange', type: 'EventEmitter<string | FileList>', description: 'Fires on every keystroke (FileList for type="file").' },
  ];
}
