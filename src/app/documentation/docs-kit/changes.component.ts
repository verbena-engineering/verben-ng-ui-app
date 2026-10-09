import { Component, Input } from '@angular/core';
import { DocsChange } from '../docs-registry';

/** "What changed" note for an updated component (from docs-registry.ts) */
@Component({
  selector: 'docs-changes',
  template: `
    <div class="docs-callout is-updated">
      <span aria-hidden="true">↻</span>
      <div>
        <strong>What changed</strong> <span class="docs-changes-date">({{ changes.date }})</span>
        <ul class="docs-changes-list">
          <li *ngFor="let note of changes.notes">{{ note }}</li>
        </ul>
      </div>
    </div>
  `,
})
export class DocsChangesComponent {
  @Input({ required: true }) changes!: DocsChange;
}
