import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';
import { ICON_NAMES } from '../icons/icon-names';

@Component({
  selector: 'docs-icons-page',
  templateUrl: './icons-page.component.html',
})
export class IconsPageComponent {
  query = '';
  copied = '';
  limit = 120;

  get matches(): string[] {
    const q = this.query.trim().toLowerCase();
    return q ? ICON_NAMES.filter((n) => n.toLowerCase().includes(q)) : ICON_NAMES;
  }

  get visible(): string[] {
    return this.matches.slice(0, this.limit);
  }

  copy(name: string): void {
    navigator.clipboard?.writeText(`<verben-svg icon="${name}"></verben-svg>`).then(() => {
      this.copied = name;
      setTimeout(() => (this.copied = ''), 1500);
    });
  }

  total = ICON_NAMES.length;

  code = {
    basic: `<verben-svg icon="calendar"></verben-svg>`,

    sizes: `<verben-svg icon="bell" size="sm"></verben-svg>
<verben-svg icon="bell" size="md"></verben-svg>
<verben-svg icon="bell" size="lg"></verben-svg>
<verben-svg icon="bell" size="xl"></verben-svg>
<verben-svg icon="bell" [width]="20" [height]="20"></verben-svg>`,

    colors: `<verben-svg icon="check-circle" [width]="32" [height]="32" stroke="var(--vbn-color-success)"></verben-svg>
<verben-svg icon="warning" [width]="32" [height]="32" fill="var(--vbn-color-warning)"></verben-svg>
<verben-svg icon="trash" [width]="32" [height]="32" stroke="var(--vbn-color-error)"></verben-svg>`,
  };

  inputs: DocsProp[] = [
    { name: 'icon', type: 'string', default: "''", description: 'Icon file name (see the gallery).' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'", default: '—', description: '16 / 24 / 32 / 48 / 52 / 64 / 80 px. Overrides width/height.' },
    { name: 'width / height', type: 'number', default: '24', description: 'Size in px.' },
    { name: 'fill / stroke', type: 'string', default: "''", description: 'Recolor the icon (which one works depends on how the SVG is drawn).' },
    { name: 'type', type: "'default' | 'outline' | 'solid'", default: "'default'", description: 'Which icon set folder to load from.' },
  ];
}
