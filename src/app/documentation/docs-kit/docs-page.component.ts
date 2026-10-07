import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DOCS_SEQUENCE, DocsNavItem } from '../docs-registry';

/**
 * Page frame used by every docs page: breadcrumb, title, description,
 * links (playground / source), the page body and prev/next navigation.
 */
@Component({
  selector: 'docs-page',
  template: `
    <article class="docs-article">
      <nav class="docs-breadcrumb" aria-label="Breadcrumb">
        <span>Docs</span>
        <span aria-hidden="true">›</span>
        <span *ngIf="section">{{ section }}</span>
        <span *ngIf="section" aria-hidden="true">›</span>
        <span>{{ title }}</span>
      </nav>

      <h1 class="docs-h1">{{ title }}</h1>
      <p *ngIf="description" class="docs-lead">{{ description }}</p>

      <div class="docs-page-meta" *ngIf="current?.playground || current?.source || current?.status">
        <span *ngIf="current?.status === 'unstable'" class="docs-pill docs-pill--unstable">
          Unstable · in review
        </span>
        <span *ngIf="current?.status === 'new'" class="docs-pill docs-pill--new">New</span>
        <a *ngIf="current?.playground" class="docs-pill" [routerLink]="current!.playground">
          Playground ↗
        </a>
        <span *ngIf="current?.source" class="docs-pill">
          <code>{{ current!.source }}</code>
        </span>
      </div>

      <ng-content></ng-content>

      <nav class="docs-pager" aria-label="Pages">
        <a *ngIf="prev" [routerLink]="prev.route">
          <small>Previous</small>← {{ prev.title }}
        </a>
        <a *ngIf="next" class="is-next" [routerLink]="next.route">
          <small>Next</small>{{ next.title }} →
        </a>
      </nav>
    </article>
  `,
})
export class DocsPageComponent {
  @Input() title = '';
  @Input() description?: string;
  @Input() section?: string = 'Components';

  constructor(private router: Router) {}

  private get index(): number {
    const url = this.router.url.split(/[?#]/)[0];
    return DOCS_SEQUENCE.findIndex((item) => item.route === url);
  }

  get current(): DocsNavItem | undefined {
    return DOCS_SEQUENCE[this.index];
  }

  get prev(): DocsNavItem | undefined {
    return this.index > 0 ? DOCS_SEQUENCE[this.index - 1] : undefined;
  }

  get next(): DocsNavItem | undefined {
    const i = this.index;
    return i >= 0 && i < DOCS_SEQUENCE.length - 1
      ? DOCS_SEQUENCE[i + 1]
      : undefined;
  }
}
