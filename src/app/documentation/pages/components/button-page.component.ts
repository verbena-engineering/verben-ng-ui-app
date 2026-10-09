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
<verbena-button text="Ghost" styleType="ghost"></verbena-button>
<verbena-button text="Danger" styleType="danger"></verbena-button>
<verbena-button text="Link" styleType="link"></verbena-button>`,

    sizes: `<verbena-button text="Small" styleType="secondary" size="sm"></verbena-button>
<verbena-button text="Medium" styleType="secondary"></verbena-button>
<verbena-button text="Large" styleType="secondary" size="lg"></verbena-button>`,

    icons: `<verbena-button text="Add item" styleType="secondary" svg="plus"
  [svgWidth]="16" [svgHeight]="16"></verbena-button>
<verbena-button text="Export" styleType="outline" svg="document-arrow-down"
  svgPosition="right" [svgWidth]="16" [svgHeight]="16"></verbena-button>`,

    iconOnly: `<verbena-button styleType="outline" svg="pencil" [svgWidth]="16" [svgHeight]="16" aria-label="Edit"></verbena-button>
<verbena-button styleType="ghost" svg="trash" [svgWidth]="16" [svgHeight]="16" aria-label="Delete"></verbena-button>`,

    content: `<verbena-button styleType="outline">Load <b>more</b></verbena-button>
<verbena-button styleType="secondary" svg="check" [svgWidth]="16" [svgHeight]="16">
  Approve 3 invoices
</verbena-button>`,

    loading: `<verbena-button
  text="Save changes"
  styleType="secondary"
  [isLoading]="saving"
  (click)="save()"
></verbena-button>`,

    loadingTs: `saving = false;

save() {
  this.saving = true;
  setTimeout(() => (this.saving = false), 1500);
}`,

    disabled: `<verbena-button text="Disabled" styleType="secondary" [disable]="true"></verbena-button>
<verbena-button text="Disabled" styleType="outline" disabled></verbena-button>`,

    block: `<verbena-button text="Continue" styleType="secondary" size="lg" block></verbena-button>`,

    custom: `<verbena-button
  text="Custom"
  bgColor="#18181b"
  textColor="#fafafa"
  borderRadius="999px"
  pd="0 22px"
></verbena-button>
<verbena-button text="Brand blue" bgColor="#2563eb" textColor="#ffffff"></verbena-button>`,
  };

  inputs: DocsProp[] = [
    { name: 'text', type: 'string', default: "''", description: 'Button label. Or put the label between the tags.' },
    {
      name: 'styleType',
      type: "'primary' | 'secondary' | 'outline' | 'ylw-outline' | 'ghost' | 'link' | 'danger' | 'small' | 'grey'",
      default: "'primary'",
      description: 'Preset look. Colors come from the --vbn-btn-* theme tokens.',
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 32 / 36 / 44px.' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Fill the width of the parent.' },
    { name: 'type', type: 'string', default: "'button'", description: 'Native button type, e.g. "submit".' },
    { name: 'disable / disabled', type: 'boolean', default: 'false', description: 'Disables the button (either name works).' },
    { name: 'isLoading', type: 'boolean', default: '—', description: 'Shows a spinner, blocks clicks and sets aria-busy.' },
    { name: 'spinnerSize / spinnerColor', type: 'string', default: '1em / text color', description: 'Spinner size and color while loading.' },
    { name: 'svg', type: 'string', default: "''", description: 'Icon name from the library icon set (see Icons). Without text the button is a square.' },
    { name: 'svgPosition', type: "'left' | 'right'", default: "'left'", description: 'Side of the label the icon sits on.' },
    { name: 'svgWidth / svgHeight', type: 'number', default: '20', description: 'Icon size in px.' },
    { name: 'svgColor', type: 'string', default: 'text color', description: 'Icon color. Unset, the icon follows the text (hover, dark mode).' },
    { name: 'useIcon / icon / iconPosition', type: 'boolean / string / side', default: '—', description: 'A Material Symbol instead of a library icon.' },
    { name: 'bgColor / textColor / border', type: 'string', default: 'preset', description: 'Per-instance colors; hover and pressed shades are mixed from them.' },
    { name: 'borderRadius / pd', type: 'string', default: 'preset', description: 'Corner radius and padding overrides.' },
    { name: 'width / height / fontSize / fontWeight', type: 'string', default: 'preset', description: 'Size and text overrides.' },
    { name: 'buttonClass / buttonTextClass', type: 'string', default: "''", description: 'Extra CSS class on the inner <button> / the label.' },
  ];

  tokens: DocsProp[] = [
    { name: '--vbn-btn-radius', type: 'length', default: '8px', description: 'Corner radius of every preset.' },
    { name: '--vbn-btn-ring', type: 'color', default: '--vbn-color-border-focus', description: 'Keyboard focus ring.' },
    { name: '--vbn-btn-{preset}-bg / -fg', type: 'color', default: 'see theme.css', description: 'Per preset: primary, secondary, danger, small. Hover / pressed are derived.' },
    { name: '--vbn-btn-outline-fg / -border', type: 'color', default: 'text / border', description: 'Outline preset.' },
    { name: '--vbn-btn-ylw-outline-bg / -fg / -border', type: 'color', default: 'primary tint', description: 'Yellow outline preset.' },
    { name: '--vbn-btn-grey-fg / --vbn-btn-link-fg', type: 'color', default: 'muted / info', description: 'Grey and link presets.' },
  ];
}
