import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-tooltip-page',
  templateUrl: './tooltip-page.component.html',
})
export class TooltipPageComponent {
  code = {
    basic: `<verben-tooltip
  [tooltipContent]="tip"
  bottom="calc(100% + 8px)"
  left="0"
  width="max-content"
>
  <verbena-button text="Hover me" styleType="outline"></verbena-button>
</verben-tooltip>

<ng-template #tip>Saved 2 minutes ago</ng-template>`,

    rich: `<verben-tooltip
  [tooltipContent]="details"
  top="calc(100% + 8px)"
  left="0"
  width="220px"
  padding="12px"
  borderRadius="8px"
  backgroundColor="var(--vbn-color-surface)"
  textColor="var(--vbn-color-text)"
  border="1px solid var(--vbn-color-border)"
>
  <span class="link">INV-0042</span>
</verben-tooltip>

<ng-template #details>
  <strong>Invoice INV-0042</strong>
  <p>₦ 250,000 · Due 14 Oct</p>
</ng-template>`,
  };

  inputs: DocsProp[] = [
    { name: 'tooltipContent', type: 'TemplateRef<any>', default: '—', description: 'Template rendered inside the tooltip.' },
    { name: 'top / bottom / left / right', type: 'string', default: '—', description: 'Position relative to the hovered element (CSS values). Set at least one vertical and one horizontal side.' },
    { name: 'width', type: 'string', default: "''", description: "Tooltip width. 'max-content' keeps short text on one line." },
    { name: 'backgroundColor / textColor', type: 'string', default: 'var(--vbn-color-text) / var(--vbn-color-surface)', description: 'Colors (dark by default).' },
    { name: 'padding / borderRadius / border', type: 'string', default: "'5px 10px' / '4px' / ''", description: 'Box styling.' },
    { name: 'zIndex', type: 'string', default: "'9999'", description: 'Stacking order.' },
    { name: 'customClass', type: 'string', default: "''", description: 'Extra CSS class on the tooltip box.' },
  ];
}
