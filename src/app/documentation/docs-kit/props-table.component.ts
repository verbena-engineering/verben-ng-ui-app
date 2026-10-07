import { Component, Input } from '@angular/core';

export interface DocsProp {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** API reference table: one row per @Input / @Output */
@Component({
  selector: 'docs-props-table',
  template: `
    <div class="docs-table-wrap">
      <table class="docs-table">
        <thead>
          <tr>
            <th>{{ kind === 'output' ? 'Event' : 'Prop' }}</th>
            <th>Type</th>
            <th *ngIf="kind === 'input'">Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of props">
            <td><code class="docs-inline-code">{{ p.name }}</code></td>
            <td><code class="docs-type">{{ p.type }}</code></td>
            <td *ngIf="kind === 'input'">
              <code class="docs-type">{{ p.default ?? '—' }}</code>
            </td>
            <td>{{ p.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class DocsPropsTableComponent {
  @Input() props: DocsProp[] = [];
  @Input() kind: 'input' | 'output' = 'input';
}
