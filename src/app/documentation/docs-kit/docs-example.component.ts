import { Component, Input, OnChanges, booleanAttribute } from '@angular/core';
import { DocsCodeFile } from './code-explorer.component';
import { DocsLang } from './highlight';
import { EXAMPLE_VIEWPORTS } from './viewports';

/**
 * The "Preview | Code" block, the same look as the playground pages:
 * a toolbar (Preview | Code, and widths when [responsive]), a dotted stage
 * for the live example, and the code (a file row when there are several).
 *
 * The live example is passed as content: <docs-example [code]="...">LIVE</docs-example>
 * It is hidden with CSS (not *ngIf) while Code is open, so its state survives.
 */
@Component({
  selector: 'docs-example',
  template: `
    <section class="docs-example">
      <h3 *ngIf="title" class="docs-h3" [id]="anchor">{{ title }}</h3>
      <p *ngIf="description" class="docs-example-desc">{{ description }}</p>

      <div class="docs-pg-block docs-example-block">
        <div class="docs-pg-toolbar">
          <div class="docs-segmented" role="tablist" aria-label="View">
            <button type="button" role="tab" [attr.aria-selected]="tab === 'preview'" [class.is-active]="tab === 'preview'" (click)="tab = 'preview'">
              Preview
            </button>
            <button type="button" role="tab" [attr.aria-selected]="tab === 'code'" [class.is-active]="tab === 'code'" (click)="tab = 'code'">
              Code
            </button>
          </div>
          <div class="docs-segmented docs-pg-viewports" *ngIf="responsive && tab === 'preview'" role="group" aria-label="Preview width">
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

        <div class="docs-example-stage" role="tabpanel" [class.docs-hidden]="tab !== 'preview'">
          <div
            class="docs-preview"
            [class.is-start]="align === 'start'"
            [class.is-column]="direction === 'column'"
            [class.is-framed]="width !== '100%'"
            [style.max-width]="width"
            [style.min-height]="minHeight"
          >
            <ng-content></ng-content>
          </div>
        </div>

        <div role="tabpanel" *ngIf="tab === 'code'">
          <docs-code-explorer *ngIf="files.length > 1; else single" [files]="files" compact></docs-code-explorer>
          <ng-template #single>
            <div class="docs-example-code">
              <docs-code-block [code]="code" [lang]="lang"></docs-code-block>
            </div>
          </ng-template>
        </div>
      </div>
    </section>
  `,
})
export class DocsExampleComponent implements OnChanges {
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
  /** Adds Full / Mobile width buttons, for examples whose layout depends on width */
  @Input({ transform: booleanAttribute }) responsive = false;

  readonly viewports = EXAMPLE_VIEWPORTS;
  tab: 'preview' | 'code' = 'preview';
  width = '100%';
  files: DocsCodeFile[] = [];

  ngOnChanges(): void {
    this.files = [{ name: this.htmlFilename, lang: this.lang, code: this.code }];
    if (this.tsCode) this.files.push({ name: this.tsFilename, lang: 'ts', code: this.tsCode });
    if (this.cssCode) this.files.push({ name: this.cssFilename, lang: 'css', code: this.cssCode });
  }

  // Lets the page's "On this page" list link to each example
  get anchor(): string {
    return (this.title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
