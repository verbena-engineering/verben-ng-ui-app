import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-switch-page',
  templateUrl: './switch-page.component.html',
})
export class SwitchPageComponent {
  notifications = true;
  publish = false;

  code = {
    basic: `<verbena-switch [(ngModel)]="notifications"></verbena-switch>
<span>{{ notifications ? 'Notifications on' : 'Notifications off' }}</span>`,

    labels: `<verbena-switch
  onText="Yes"
  offText="No"
  width="70px"
  height="28px"
  [(ngModel)]="publish"
></verbena-switch>`,

    colors: `<verbena-switch
  [checked]="true"
  onColor="var(--vbn-color-info)"
  offColor="var(--vbn-color-secondary)"
></verbena-switch>`,

    disabled: `<verbena-switch [checked]="true" [disabled]="true"></verbena-switch>
<verbena-switch [checked]="false" [disabled]="true"></verbena-switch>`,
  };

  inputs: DocsProp[] = [
    { name: 'checked', type: 'boolean', default: 'false', description: 'On/off state when not using ngModel.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch.' },
    { name: 'onText / offText', type: 'string', default: "'On' / 'Off'", description: 'Text shown inside the track.' },
    { name: 'onColor / offColor', type: 'string', default: 'var(--vbn-state-on) / var(--vbn-color-border)', description: 'Track colors.' },
    { name: 'width / height', type: 'string', default: "'80px' / '30px'", description: 'Track size.' },
    { name: 'label', type: 'string', default: "''", description: 'Accessible label.' },
    { name: 'customStyles', type: 'string', default: "''", description: 'Extra CSS class.' },
  ];

  outputs: DocsProp[] = [
    { name: 'change', type: 'EventEmitter<boolean>', description: 'Fires with the new state when toggled.' },
  ];
}
