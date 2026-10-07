import { Component, Input, OnChanges } from '@angular/core';
import { DocsLang, highlightCode } from './highlight';

/** Dark, highlighted code block with an optional filename and a copy button */
@Component({
  selector: 'docs-code-block',
  template: `
    <div class="docs-code">
      <div class="docs-code-header" *ngIf="filename">{{ filename }}</div>
      <button
        type="button"
        class="docs-copy"
        (click)="copy()"
        [attr.aria-label]="copied ? 'Copied' : 'Copy code'"
        [title]="copied ? 'Copied' : 'Copy code'"
      >
        <svg *ngIf="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg *ngIf="copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </button>
      <pre><code [innerHTML]="html"></code></pre>
    </div>
  `,
})
export class DocsCodeBlockComponent implements OnChanges {
  @Input() code = '';
  @Input() lang: DocsLang = 'html';
  @Input() filename?: string;

  html = '';
  copied = false;

  ngOnChanges(): void {
    this.html = highlightCode(this.code.trim(), this.lang);
  }

  copy(): void {
    const text = this.code.trim();
    const done = () => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => {});
    }
  }
}
