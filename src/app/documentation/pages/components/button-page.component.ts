import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-button-page',
  templateUrl: './button-page.component.html',
})
export class ButtonPageComponent {
  saving = false;

  save(): void {
    this.saving = true;
    setTimeout(() => (this.saving = false), 1500);
  }

  code = {
    variants: `<verbena-button text="Primary" styleType="primary"></verbena-button>
<verbena-button text="Secondary" styleType="secondary"></verbena-button>
<verbena-button text="Outline" styleType="outline"></verbena-button>
<verbena-button text="Yellow outline" styleType="ylw-outline"></verbena-button>
<verbena-button text="Danger" styleType="danger"></verbena-button>`,

    icons: `<verbena-button text="Add item" styleType="secondary" svg="plus"
  [svgWidth]="16" [svgHeight]="16"></verbena-button>
<verbena-button text="Export" styleType="outline" svg="document-arrow-down"
  svgPosition="right" [svgWidth]="16" [svgHeight]="16"></verbena-button>`,

    loading: `<verbena-button
  text="Save changes"
  styleType="secondary"
  [isLoading]="saving"
  spinnerSize="14px"
  spinnerColor="var(--vbn-color-on-primary)"
  (click)="save()"
></verbena-button>`,

    loadingTs: `saving = false;

save() {
  this.saving = true;
  setTimeout(() => (this.saving = false), 1500);
}`,

    disabled: `<verbena-button text="Disabled" styleType="secondary" [disable]="true"></verbena-button>`,

    custom: `<verbena-button
  text="Custom"
  bgColor="#18181b"
  textColor="#fafafa"
  borderRadius="999px"
  pd="10px 22px"
></verbena-button>`,
  };

  inputs: DocsProp[] = [
    { name: 'text', type: 'string', default: "''", description: 'Button label.' },
    {
      name: 'styleType',
      type: "'primary' | 'secondary' | 'outline' | 'ylw-outline' | 'danger' | 'small' | 'grey'",
      default: "'primary'",
      description: 'Preset look. Colors come from the --vbn-btn-* theme tokens.',
    },
    { name: 'type', type: 'string', default: "'button'", description: 'Native button type, e.g. "submit".' },
    { name: 'disable', type: 'boolean', default: 'false', description: 'Disables the button.' },
    { name: 'isLoading', type: 'boolean', default: '—', description: 'Shows a spinner and blocks clicks.' },
    { name: 'spinnerSize / spinnerColor', type: 'string', default: '—', description: 'Spinner size and color while loading.' },
    { name: 'svg', type: 'string', default: "''", description: 'Icon name from the library icon set (see Icons).' },
    { name: 'svgPosition', type: "'left' | 'right'", default: "'left'", description: 'Side of the label the icon sits on.' },
    { name: 'svgWidth / svgHeight', type: 'number', default: '20', description: 'Icon size in px.' },
    { name: 'bgColor / textColor / border', type: 'string', default: 'theme', description: 'Per-instance color overrides.' },
    { name: 'borderRadius / pd', type: 'string', default: 'theme', description: 'Corner radius and padding overrides.' },
    { name: 'width / height / fontSize', type: 'string', default: "'' / '' / '14px'", description: 'Size overrides.' },
    { name: 'buttonClass', type: 'string', default: "''", description: 'Extra CSS class on the inner <button>.' },
  ];
}
