import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-badge-page',
  templateUrl: './badge-page.component.html',
})
export class BadgePageComponent {
  code = {
    basic: `<verbena-badge text="3"></verbena-badge>`,

    status: `<verbena-badge text="Paid" bgColor="var(--vbn-color-success)"></verbena-badge>
<verbena-badge text="Pending" bgColor="var(--vbn-color-warning)"></verbena-badge>
<verbena-badge text="Overdue" bgColor="var(--vbn-color-error)"></verbena-badge>
<verbena-badge text="Draft" bgColor="var(--vbn-color-secondary)"
  textColor="var(--vbn-color-on-secondary)"></verbena-badge>`,

    sizes: `<verbena-badge text="Small" fontSize="11px" pd="2px 8px"></verbena-badge>
<verbena-badge text="Default"></verbena-badge>
<verbena-badge text="Large" fontSize="16px" pd="6px 14px"></verbena-badge>`,

    count: `<span class="inbox">
  Inbox
  <verbena-badge text="12" fontSize="11px" pd="1px 7px"></verbena-badge>
</span>`,
  };

  inputs: DocsProp[] = [
    { name: 'text', type: 'string', default: "''", description: 'Text or number inside the badge.' },
    { name: 'bgColor', type: 'string', default: 'var(--vbn-color-error)', description: 'Background color.' },
    { name: 'textColor', type: 'string', default: 'var(--vbn-color-surface)', description: 'Text color.' },
    { name: 'borderRadius', type: 'string', default: "'12px'", description: 'Corner radius.' },
    { name: 'pd', type: 'string', default: "'5px 10px'", description: 'Padding.' },
    { name: 'fontSize', type: 'string', default: "'14px'", description: 'Font size.' },
    { name: 'width / height', type: 'string', default: "''", description: 'Fixed size, e.g. for a round dot.' },
  ];
}
