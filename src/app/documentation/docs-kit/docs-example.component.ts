import { Component, Input } from '@angular/core';
import { DocsLang } from './highlight';

/**
 * The shadcn-style "Preview | Code" box.
 * The live example is passed as content: <docs-example [code]="...">LIVE</docs-example>
 * The preview is hidden with CSS (not *ngIf) so its state survives tab switches.
 */
@Component({
  selector: 'docs-example',
  template: `
    <section class="docs-example">
      <h3 *ngIf="title" class="docs-h3" [id]="anchor">{{ title }}</h3>
      <p *ngIf="description" class="docs-example-desc">{{ description }}</p>

      <div class="docs-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="tab === 'preview'"
          [class.is-active]="tab === 'preview'"
          (click)="tab = 'preview'"
        >
          Preview
        </button>
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="tab === 'code'"
          [class.is-active]="tab === 'code'"
          (click)="tab = 'code'"
        >
          Code
        </button>
      </div>

      <div
        class="docs-preview"
        role="tabpanel"
        [class.docs-hidden]="tab !== 'preview'"
        [class.is-start]="align === 'start'"
        [class.is-column]="direction === 'column'"
        [style.min-height]="minHeight"
      >
        <ng-content></ng-content>
      </div>

      <div role="tabpanel" [class.docs-hidden]="tab !== 'code'">
        <docs-code-block
          [code]="code"
          [lang]="lang"
          [filename]="tsCode || cssCode ? htmlFilename : undefined"
        ></docs-code-block>
        <docs-code-block
          *ngIf="tsCode"
          [code]="tsCode"
          lang="ts"
          [filename]="tsFilename"
        ></docs-code-block>
        <docs-code-block
          *ngIf="cssCode"
          [code]="cssCode"
          lang="css"
          [filename]="cssFilename"
        ></docs-code-block>
      </div>
    </section>
  `,
})
export class DocsExampleComponent {
  @Input() title?: string;
  @Input() description?: string;
  /** Template code shown in the Code tab */
  @Input() code = '';
  @Input() lang: DocsLang = 'html';
  /** Optional component class code, shown as a second file */
  @Input() tsCode?: string;
  @Input() htmlFilename = 'example.component.html';
  @Input() tsFilename = 'example.component.ts';
  /** Optional styles, shown as a third file */
  @Input() cssCode?: string;
  @Input() cssFilename = 'example.component.css';
  @Input() align: 'center' | 'start' = 'center';
  @Input() direction: 'row' | 'column' = 'row';
  @Input() minHeight?: string;

  tab: 'preview' | 'code' = 'preview';

  // Lets the page's "On this page" list link to each example
  get anchor(): string {
    return (this.title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
