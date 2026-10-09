import { Component, Input, OnChanges } from '@angular/core';
import { DocsNavItem, PLAYGROUND_PAGES } from '../docs-registry';
import { PLAYGROUND_USAGE, PlaygroundUsage } from '../playground-usage';

/**
 * Shown by the docs layout under every playground page that has an entry in
 * playground-usage.ts: what changed, how the element is built, a minimal
 * example, speed notes, and the page's real files (fetched per tab).
 */
@Component({
  selector: 'docs-playground-usage',
  template: `
    <section class="docs-playground-usage" *ngIf="usage || page?.changes">
      <docs-changes *ngIf="page?.changes as changes" [changes]="changes"></docs-changes>

      <ng-container *ngIf="usage">
        <h2 class="docs-h2" id="usage">Usage</h2>
        <p class="docs-p" *ngIf="usage.intro">{{ usage.intro }}</p>
        <docs-props-table
          *ngIf="usage.anatomy"
          [props]="usage.anatomy"
          kind="output"
          [headings]="['Part', 'Kind', 'What it does']"
        ></docs-props-table>

        <ng-container *ngIf="usage.minimal as minimal">
          <h3 class="docs-h3" id="usage-minimal">Minimal example</h3>
          <docs-code-block [code]="minimal.html" lang="html" [filename]="minimal.ts ? 'example.component.html' : undefined"></docs-code-block>
          <docs-code-block *ngIf="minimal.ts" [code]="minimal.ts" lang="ts" filename="example.component.ts"></docs-code-block>
        </ng-container>

        <ng-container *ngIf="usage.performance">
          <h3 class="docs-h3" id="usage-performance">Performance</h3>
          <ul class="docs-list">
            <li *ngFor="let note of usage.performance">{{ note }}</li>
          </ul>
        </ng-container>

        <h3 class="docs-h3" id="usage-code">This page's code</h3>
        <p class="docs-p">The real files of the page above. Each one is downloaded when you open its tab.</p>
        <docs-code-tabs [files]="usage.files"></docs-code-tabs>
      </ng-container>
    </section>
  `,
})
export class DocsPlaygroundUsageComponent implements OnChanges {
  /** Current URL path, e.g. "/documentation/data-view" */
  @Input() route = '';

  usage?: PlaygroundUsage;
  page?: DocsNavItem;

  ngOnChanges(): void {
    this.usage = PLAYGROUND_USAGE[this.route];
    this.page = PLAYGROUND_PAGES.find((p) => p.route === this.route);
  }
}
