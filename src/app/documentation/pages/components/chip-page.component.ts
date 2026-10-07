import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-chip-page',
  templateUrl: './chip-page.component.html',
})
export class ChipPageComponent {
  tags: string[] = ['angular', 'ui'];
  emails: string[] = [];
  limited: string[] = ['one', 'two'];
  required: string[] = [];

  code = {
    basic: `<verben-chip placeholder="Add a tag and press Enter" [(ngModel)]="tags"></verben-chip>`,

    separator: `<!-- Paste or type "a@x.com; b@y.com" -->
<verben-chip
  placeholder="Emails separated by ;"
  separator=";"
  [(ngModel)]="emails"
></verben-chip>`,

    max: `<verben-chip placeholder="Up to 3 items" [max]="3" [(ngModel)]="limited"></verben-chip>`,

    required: `<verben-chip
  placeholder="At least one label"
  [required]="true"
  invalidMessage="Add at least one label"
  [(ngModel)]="required"
></verben-chip>`,
  };

  inputs: DocsProp[] = [
    { name: 'placeholder', type: 'string', default: "''", description: 'Text shown in the empty input.' },
    { name: 'separator', type: 'string', default: "','", description: 'Typing or pasting this splits the text into several chips.' },
    { name: 'max', type: 'number', default: '—', description: 'Maximum number of chips.' },
    { name: 'required / invalidMessage', type: 'boolean / string', default: 'false / —', description: 'Validation state and message.' },
    { name: 'errorPosition', type: "'top' | 'left' | 'right' | ''", default: "''", description: 'Where the message shows (bottom by default).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables input and removal.' },
    { name: 'width / styleClass', type: 'string', default: "'100%' / ''", description: 'Width and extra CSS class.' },
  ];

  outputs: DocsProp[] = [
    { name: 'onChange', type: 'EventEmitter<ChipChangeEvent>', description: 'Fires when chips are added or removed.' },
  ];
}
