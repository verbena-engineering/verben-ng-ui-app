import { Component, Input, OnChanges } from '@angular/core';
import { DocsNavItem } from '../docs-registry';
import { PLAYGROUND_USAGE, PlaygroundUsage } from '../playground-usage';
import { PLAYGROUND_VIEWPORTS } from './viewports';

/**
 * Frame for every playground page, used by the docs layout around its
 * <router-outlet>. Like a shadcn block: title and description, then one block
 * with Preview | Code (the page's real files beside a file list), then
 * Installation steps, Anatomy and Performance.
 *
 * The page itself is projected once and only hidden while Code is open, so
 * it keeps its state. On other docs pages (page unset) only the page shows.
 */
@Component({
  selector: 'docs-playground',
  template: `
    <header class="docs-pg-header" *ngIf="page">
      <nav class="docs-breadcrumb" aria-label="Breadcrumb">
        <span>Docs</span><span aria-hidden="true">›</span><span>Playground</span><span aria-hidden="true">›</span>
        <span>{{ page.title }}</span>
      </nav>
      <h1 class="docs-h1">{{ page.title }}</h1>
      <p class="docs-lead">{{ description }}</p>
      <div class="docs-page-meta">
        <span *ngIf="page.status === 'updated'" class="docs-pill docs-pill--updated">Updated {{ page.changes?.date }}</span>
        <span *ngIf="page.status === 'new'" class="docs-pill docs-pill--new">New</span>
        <span *ngIf="page.status === 'unstable'" class="docs-pill docs-pill--unstable">Unstable · in review</span>
        <a *ngIf="usage?.docs" class="docs-pill" [routerLink]="usage!.docs">Component docs ↗</a>
        <span class="docs-pill" *ngIf="usage">{{ usage.files.length }} files</span>
      </div>
      <docs-changes *ngIf="page.changes as changes" [changes]="changes"></docs-changes>
    </header>

    <div [class.docs-pg-block]="!!page">
      <div class="docs-pg-toolbar" *ngIf="page">
        <div class="docs-segmented" role="tablist" aria-label="View">
          <button type="button" role="tab" [attr.aria-selected]="view === 'preview'" [class.is-active]="view === 'preview'" (click)="view = 'preview'">
            Preview
          </button>
          <button type="button" role="tab" [attr.aria-selected]="view === 'code'" [class.is-active]="view === 'code'" [disabled]="!usage" (click)="view = 'code'">
            Code
          </button>
        </div>
        <div class="docs-segmented docs-pg-viewports" *ngIf="view === 'preview'" role="group" aria-label="Preview width">
          <button
            *ngFor="let v of viewports"
            type="button"
            [class.is-active]="width === v.width"
            [attr.aria-pressed]="width === v.width"
            [attr.aria-label]="v.label"
            [title]="v.label"
            (click)="width = v.width"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path [attr.d]="v.icon" />
            </svg>
          </button>
        </div>
      </div>

      <!-- The live page: always here, hidden (not destroyed) while Code is open -->
      <div [class.docs-pg-stage]="!!page" [class.docs-hidden]="page && view === 'code'">
        <div [class.docs-pg-frame]="!!page" [style.max-width]="page ? width : null">
          <ng-content></ng-content>
        </div>
      </div>

      <docs-code-explorer *ngIf="page && usage && view === 'code'" [files]="usage.files"></docs-code-explorer>
    </div>

    <ng-container *ngIf="page && usage">
      <section *ngIf="usage.steps as steps">
        <h2 class="docs-h2" id="installation">Installation</h2>
        <ol class="docs-steps">
          <li *ngFor="let step of steps" class="docs-step">
            <h3 class="docs-step-title">{{ step.title }}</h3>
            <p class="docs-p" *ngIf="step.text">{{ step.text }}</p>
            <docs-code-block *ngIf="step.code" [code]="step.code" [lang]="step.lang ?? 'ts'" [filename]="step.filename"></docs-code-block>
          </li>
        </ol>
      </section>

      <section *ngIf="usage.anatomy as anatomy">
        <h2 class="docs-h2" id="anatomy">Anatomy</h2>
        <docs-code-block [code]="anatomy.tree" lang="text"></docs-code-block>
        <docs-props-table
          *ngIf="anatomy.parts"
          [props]="anatomy.parts"
          kind="output"
          [headings]="['Part', 'Type', 'What it does']"
        ></docs-props-table>
      </section>

      <section *ngIf="usage.performance as perf">
        <h2 class="docs-h2" id="performance">Performance</h2>
        <p class="docs-p" *ngIf="perf.intro">{{ perf.intro }}</p>
        <div class="docs-metrics" *ngIf="perf.metrics">
          <div class="docs-metric" *ngFor="let m of perf.metrics">
            <p class="docs-metric-label">{{ m.label }}</p>
            <div class="docs-metric-values">
              <span><small>{{ perf.compare?.[0] }}</small><b>{{ m.before }}</b></span>
              <span aria-hidden="true" class="docs-metric-arrow">→</span>
              <span class="is-after"><small>{{ perf.compare?.[1] }}</small><b>{{ m.after }}</b></span>
            </div>
            <p class="docs-metric-note">{{ m.note }}</p>
          </div>
        </div>
        <div class="docs-notes" *ngIf="perf.notes">
          <div class="docs-note" *ngFor="let n of perf.notes">
            <h3>{{ n.title }}</h3>
            <p>{{ n.text }}</p>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export class DocsPlaygroundShellComponent implements OnChanges {
  /** The playground page being shown; unset on other docs pages */
  @Input() page?: DocsNavItem;

  readonly viewports = PLAYGROUND_VIEWPORTS;
  usage?: PlaygroundUsage;
  description = '';
  view: 'preview' | 'code' = 'preview';
  width = '100%';

  ngOnChanges(): void {
    this.usage = this.page ? PLAYGROUND_USAGE[this.page.route] : undefined;
    this.description =
      this.usage?.description ?? this.page?.description ?? `The ${this.page?.title} test page.`;
    // Each page starts on Preview at full width
    this.view = 'preview';
    this.width = '100%';
  }
}
