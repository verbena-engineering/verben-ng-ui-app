import { Component, Input, OnChanges, booleanAttribute } from '@angular/core';
import { DocsLang } from './highlight';

export interface DocsCodeFile {
  /** File name, e.g. "vendor-invoices.component.html" */
  name: string;
  lang: DocsLang;
  /** The code, or… */
  code?: string;
  /**
   * …a loader, so the file is fetched only when it is opened. Use an import
   * with the text loader; each file becomes its own small chunk:
   *   load: () => import('./x.component.html', { with: { loader: 'text' } })
   */
  load?: () => Promise<unknown>;
  /** Optional line shown above the code */
  note?: string;
}

const LANG_LABEL: Record<DocsLang, string> = { html: 'HTML', ts: 'TS', css: 'CSS', bash: 'SH', text: 'TXT' };

/**
 * Files on the left, the open file on the right (like shadcn's block viewer).
 * Stacks on narrow screens. Files load on demand and are cached.
 * [compact]: the files become a row of tabs above the code (for 2–3 files).
 */
@Component({
  selector: 'docs-code-explorer',
  template: `
    <div class="docs-explorer" [class.is-compact]="compact">
      <nav class="docs-explorer-files" aria-label="Files">
        <p class="docs-explorer-title">Files</p>
        <button
          *ngFor="let file of files; let i = index"
          type="button"
          class="docs-explorer-file"
          [class.is-active]="i === active"
          [attr.aria-current]="i === active ? 'true' : null"
          (click)="show(i)"
        >
          <span class="docs-explorer-lang" [attr.data-lang]="file.lang">{{ label(file) }}</span>
          <span class="docs-explorer-name">{{ file.name }}</span>
        </button>
      </nav>
      <div class="docs-explorer-code">
        <p class="docs-explorer-note" *ngIf="files[active]?.note">{{ files[active].note }}</p>
        <docs-code-block
          *ngIf="code !== null; else loading"
          [code]="code"
          [lang]="files[active].lang"
          [filename]="files[active].name"
        ></docs-code-block>
        <ng-template #loading><p class="docs-explorer-loading">Loading {{ files[active].name }}…</p></ng-template>
      </div>
    </div>
  `,
})
export class DocsCodeExplorerComponent implements OnChanges {
  @Input() files: DocsCodeFile[] = [];
  @Input({ transform: booleanAttribute }) compact = false;
  active = 0;
  code: string | null = null;

  /** Loaded files, so opening one again doesn't fetch it again */
  private cache = new Map<DocsCodeFile, string>();

  ngOnChanges(): void {
    this.show(0);
  }

  label(file: DocsCodeFile): string {
    return LANG_LABEL[file.lang];
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
    // Only show it if that file is still the open one
    if (this.files[this.active] === file) this.code = text;
  }
}
