import { Component, Input, OnChanges } from '@angular/core';
import { DocsLang } from './highlight';

export interface DocsCodeFile {
  /** Tab label, e.g. "vendor-invoices.component.html" */
  name: string;
  lang: DocsLang;
  /** The code, or… */
  code?: string;
  /**
   * …a loader, so the file is fetched only when its tab is opened. Use an
   * import with the text loader; each file becomes its own small chunk:
   *   load: () => import('./x.component.html', { with: { loader: 'text' } })
   */
  load?: () => Promise<unknown>;
  /** Optional line above the code */
  note?: string;
}

/** Several source files, one tab each, in a single code block (long files scroll inside) */
@Component({
  selector: 'docs-code-tabs',
  template: `
    <div class="docs-code-tabs">
      <div class="docs-tabs" role="tablist">
        <button
          *ngFor="let file of files; let i = index"
          type="button"
          role="tab"
          [attr.aria-selected]="i === active"
          [class.is-active]="i === active"
          (click)="show(i)"
        >
          {{ file.name }}
        </button>
      </div>
      <docs-code-block
        *ngIf="code !== null; else loading"
        role="tabpanel"
        [code]="code"
        [lang]="files[active].lang"
        [filename]="files[active].note"
      ></docs-code-block>
      <ng-template #loading><p class="docs-p">Loading {{ files[active].name }}…</p></ng-template>
    </div>
  `,
})
export class DocsCodeTabsComponent implements OnChanges {
  @Input() files: DocsCodeFile[] = [];
  active = 0;
  code: string | null = null;

  /** Loaded files, so switching back to a tab doesn't fetch it again */
  private cache = new Map<DocsCodeFile, string>();

  ngOnChanges(): void {
    this.show(0);
  }

  async show(index: number): Promise<void> {
    this.active = index;
    const file = this.files[index];
    if (!file) return;
    const cached = file.code ?? this.cache.get(file);
    if (cached !== undefined) {
      this.code = cached;
      return;
    }
    this.code = null;
    const module = await file.load?.();
    const text = (module as { default?: string } | undefined)?.default ?? '';
    this.cache.set(file, text);
    // Only show it if the user is still on that tab
    if (this.files[this.active] === file) this.code = text;
  }
}
