import { Component } from '@angular/core';
import { DocsCodeFile } from '../../../docs-kit/code-tabs.component';
import { DocsProp } from '../../../docs-kit/props-table.component';

@Component({
  selector: 'docs-vendor-invoices-page',
  templateUrl: './vendor-invoices-page.component.html',
})
export class VendorInvoicesPageComponent {
  readonly setup = `import { DataViewModule, NumberInputModule, UnstableCardModule,
  VerbenaButtonModule, VerbenaInputModule } from 'verben-ng-ui';

@NgModule({
  declarations: [VendorInvoicesComponent],
  imports: [
    CommonModule, FormsModule,
    DataViewModule,       // the toolbar (stable)
    UnstableCardModule,   // every card, badge and amount (⚠️ unstable)
    VerbenaButtonModule, VerbenaInputModule, NumberInputModule,
  ],
})
export class InvoicesModule {}`;

  // The real files, fetched when their tab is opened (each is its own small chunk)
  readonly files: DocsCodeFile[] = [
    { name: 'vendor-invoices.component.html', lang: 'html', load: () => import('./vendor-invoices.component.html', { with: { loader: 'text' } }) },
    { name: 'vendor-invoices.component.ts', lang: 'ts', load: () => import('./vendor-invoices.component', { with: { loader: 'text' } }) },
    { name: 'vendor-invoices.component.css', lang: 'css', load: () => import('./vendor-invoices.component.css', { with: { loader: 'text' } }) },
  ];

  readonly anatomy: DocsProp[] = [
    { name: '<verben-data-view>', type: 'stable', description: 'The existing toolbar: view toggle, search, Filter, Sort and Create New. Its popovers are projected in.' },
    { name: 'filter-content / sort-content / create-content', type: 'vbn-card', description: 'Each popover is a small elevated card: title + content + footer.' },
    { name: 'card-content', type: 'vbn-card (filled)', description: 'The board. Inside: a vbn-card-content grid (columns="auto") of invoice cards, and the details card.' },
    { name: 'Invoice card', type: 'vbn-card size="sm" interactive', description: 'Header (id · vendor), footer (vbn-amount · vbn-badge). + opens its lines: cards inside the card.' },
    { name: 'Details', type: 'vbn-card elevated', description: 'Header with close, a form (verbena-input, verben-number-input, status buttons), the lines as ghost rows, Delete / Save.' },
    { name: 'table-content', type: 'vbn-card + <table>', description: 'The list view behind the toolbar toggle; same data and pager.' },
    { name: 'Pager', type: 'vbn-card-footer', description: '"9 of 37 records loaded · Load more", one template used by both views.' },
  ];

  /** Same screen, built two ways */
  readonly comparison: DocsProp[] = [
    {
      name: 'Keeping cards with their data',
      type: 'track $index → trackBy id',
      default: 'by id',
      description: 'Card Data View matches cards by position, so after a sort, a filter or a new invoice at the top every card is rewritten. Here each card stays with its invoice: Angular moves it and only creates cards that are new.',
    },
    {
      name: 'Work per change-detection pass',
      type: 'n × n → 0',
      default: 'none per card',
      description: "The Card Data View playground calls showToggle(item) per card, which filters the whole list: 37 items ≈ 1,400 checks, 500 items ≈ 250,000, on every click or key press anywhere. Here the template only reads fields (inv.total, visible, selected) computed once per change in refresh().",
    },
    {
      name: 'Selection',
      type: 'flag on every item → one reference',
      default: 'O(1)',
      description: 'Card Data View sets item.selected and loops over all items to clear the others. Here selected is one reference; "is this card selected" is inv === selected.',
    },
    {
      name: 'Change detection',
      type: 'Default → OnPush',
      default: 'OnPush',
      description: 'The screen and every card part are OnPush: they are checked when their own inputs or events change, not on every event in the app.',
    },
    {
      name: 'Long lists',
      type: '"virtual scroll" → paging',
      default: '9 per page',
      description: "Card Data View's useVirtualScroll wraps an @for list, so every item is still created (a fixed-height scroll box, not virtualisation). Here 9 cards render, Load more adds 9 (a real screen asks the server for the next page).",
    },
    {
      name: 'Lines and details',
      type: 'created on demand',
      default: '*ngIf',
      description: 'Both create children only when expanded. Here the details card exists only while something is selected (a field check, not a method call).',
    },
    {
      name: 'Layout',
      type: 'CSS, not JS',
      default: 'grid / :has / container query',
      description: 'Columns (auto-fill grid), the list ↔ details split and the narrow header are pure CSS: nothing runs in JavaScript on resize.',
    },
  ];

  /** Measured in this docs app (dev build, Chrome, this machine); compare the two columns, not the absolute numbers */
  readonly measured: DocsProp[] = [
    {
      name: 'Check from elsewhere in the app',
      type: '1.16 ms',
      default: '0.20 ms',
      description: 'Typing elsewhere, a timer, another request… Card Data View (48 items) re-checks every card and scans the list 2,304 times. Vendor Invoices (37 cards) is OnPush, so the screen is skipped: its template is not read at all. Both numbers include the docs layout around the page.',
    },
    {
      name: 'Check of the screen itself',
      type: '0.56 ms',
      default: '1.40 ms',
      description: 'You clicked or typed in it. The trade-off: each invoice card is a few small components (card, header, action, footer, amount, badge), so a full check of the screen touches more bindings than plain <div> cards. It grows linearly with the cards shown (no n × n), and paging keeps that number small.',
    },
    {
      name: 'Elements per card',
      type: '21',
      default: '7',
      description: 'Fewer DOM elements per card: less memory and less style / layout work for the browser.',
    },
  ];

  /** Inside the components this screen uses */
  readonly inside: DocsProp[] = [
    { name: 'vbn-card parts', type: 'OnPush, no template', description: 'Header, title, content, footer, action… are standalone OnPush components whose template is just <ng-content>; they only set a CSS class on their own element. A check has nothing to compare inside them.' },
    { name: 'vbn-amount, vbn-avatar', type: 'computed in ngOnChanges', description: 'Money is formatted (Intl.NumberFormat) and initials are worked out once when the input changes, not on every check.' },
    { name: 'One stylesheet', type: 'ViewEncapsulation.None', description: 'All card parts share one stylesheet (classes start with vbn-card), added to the page once.' },
    { name: 'verbena-button', type: 'getter → CSS', description: 'Before: a getter built a new style object and was read 5 times per button per check, plus a 12-entry [ngStyle] to compare. Now: plain class and style bindings, and hover / pressed / focus are CSS states the browser handles.' },
    { name: 'Docs code', type: 'one chunk per file', description: 'The Usage tabs fetch each source file only when opened, so the docs don\'t send every example\'s code to every visitor.' },
  ];
}
