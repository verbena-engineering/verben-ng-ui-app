import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-card-page',
  templateUrl: './card-page.component.html',
})
export class CardPageComponent {
  code = {
    basic: `<verben-card
  width="340px"
  pd="20px"
  bgColor="var(--vbn-color-surface)"
  border="1px solid var(--vbn-color-border)"
  borderRadius="10px"
>
  <div card-header>
    <h3>Invoice INV-0042</h3>
    <p>Issued 2 Oct 2026</p>
  </div>
  <div card-body>
    <p>₦ 250,000</p>
  </div>
  <div card-footer>
    <verbena-button text="View" styleType="outline"></verbena-button>
    <verbena-button text="Pay now" styleType="secondary"></verbena-button>
  </div>
</verben-card>`,

    simple: `<verben-card width="260px" pd="16px" bgColor="var(--vbn-color-surface-alt)" borderRadius="8px">
  <div card-body>Only a body slot.</div>
</verben-card>`,

    disabled: `<verben-card width="260px" pd="16px" border="1px solid var(--vbn-color-border)"
  borderRadius="8px" [disabled]="true">
  <div card-body>This card is disabled.</div>
</verben-card>`,
  };

  inputs: DocsProp[] = [
    { name: 'pd / mg', type: 'string', default: "'10px' / '0px'", description: 'Padding and margin.' },
    { name: 'width / height', type: 'string', default: '—', description: 'Size.' },
    { name: 'aspectRatio', type: 'number', default: '—', description: 'Keep a fixed ratio, e.g. 1.5.' },
    { name: 'bgColor / textColor / border / borderRadius', type: 'string', default: '—', description: 'Styling.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the card and blocks interaction.' },
  ];

  slots: DocsProp[] = [
    { name: '[card-header]', type: 'attribute', description: 'Top section.' },
    { name: '[card-body]', type: 'attribute', description: 'Main content.' },
    { name: '[card-footer]', type: 'attribute', description: 'Bottom section, e.g. actions.' },
  ];
}
