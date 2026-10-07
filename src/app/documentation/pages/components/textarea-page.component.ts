import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-textarea-page',
  templateUrl: './textarea-page.component.html',
})
export class TextareaPageComponent {
  note = '';
  feedback = '';

  code = {
    basic: `<verbena-textarea
  label="Notes"
  [rows]="4"
  [(ngModel)]="note"
></verbena-textarea>`,

    required: `<verbena-textarea
  label="Feedback"
  [required]="true"
  [rows]="3"
  [(ngModel)]="feedback"
></verbena-textarea>`,

    styled: `<verbena-textarea
  label="Styled"
  [rows]="3"
  bgColor="var(--vbn-color-surface)"
  border="1px dashed var(--vbn-color-border)"
  borderRadius="10px"
  pd="14px"
></verbena-textarea>`,

    disabled: `<verbena-textarea label="Disabled" value="Read only text" [disabled]="true" [rows]="2"></verbena-textarea>`,
  };

  inputs: DocsProp[] = [
    { name: 'label', type: 'string', default: "''", description: 'Label above the field.' },
    { name: 'rows / cols', type: 'number', default: '5 / 40', description: 'Visible size.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Shows an error when left empty.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
    { name: 'value', type: 'string', default: "''", description: 'Initial value when not using ngModel.' },
    { name: 'width / height', type: 'string', default: "'100%' / 'auto'", description: 'Size overrides.' },
    { name: 'bgColor / textColor / border / borderRadius / pd', type: 'string', default: 'theme', description: 'Style overrides.' },
    { name: 'errorMessageColor', type: 'string', default: 'var(--vbn-color-error)', description: 'Error text color.' },
  ];

  outputs: DocsProp[] = [
    { name: 'valueChange', type: 'EventEmitter<string>', description: 'Fires as the user types.' },
  ];
}
