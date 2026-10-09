import { DocsCodeFile } from './docs-kit/code-explorer.component';
import { DocsLang } from './docs-kit/highlight';
import { DocsProp } from './docs-kit/props-table.component';

/*
 * What the playground pages show around the live page (see
 * docs-kit/playground-shell.component.ts): a description, Preview | Code
 * (the page's real files), then Installation steps, Anatomy and Performance.
 *
 * Each file is a dynamic import with esbuild's text loader, so it becomes its
 * own small chunk and is downloaded only when it is opened in the Code view:
 * the docs don't ship ~160 KB of example code to everyone. The import paths
 * must be written out (not built from strings) so the bundler can find them.
 */

export interface PlaygroundStep {
  title: string;
  text?: string;
  code?: string;
  lang?: DocsLang;
  filename?: string;
}

export interface PlaygroundNote {
  title: string;
  text: string;
}

/** A number before / after, shown as a stat card */
export interface PlaygroundMetric {
  label: string;
  before: string;
  after: string;
  note: string;
}

export interface PlaygroundUsage {
  /** Lead paragraph under the title */
  description?: string;
  /** Route of the component's docs page, if it has one */
  docs?: string;
  /** "Installation": numbered steps from nothing to a working screen */
  steps?: PlaygroundStep[];
  /** "Anatomy": the structure as a tree, then the parts that matter */
  anatomy?: { tree: string; parts?: DocsProp[] };
  performance?: {
    intro?: string;
    /** Labels for the two columns of the metrics */
    compare?: [string, string];
    metrics?: PlaygroundMetric[];
    notes?: PlaygroundNote[];
    /** Optional detailed table: [name, before, after, why] */
    table?: { headings: string[]; rows: DocsProp[] };
  };
  /** The page's real files, shown in the Code view */
  files: DocsCodeFile[];
}

const DATA_VIEW: PlaygroundUsage = {
  description:
    'A toolbar (view toggle, search, column / filter / sort / export / import / create) over two views you provide. ' +
    "It doesn't filter or sort anything itself: it tells you what the user asked for, and you update your data.",
  steps: [
    {
      title: 'Import the modules',
      text: 'The data view, plus the popovers you want to use.',
      lang: 'ts',
      filename: 'feature.module.ts',
      code: `import { DataViewModule, SortTableModule, TableFilterModule } from 'verben-ng-ui';

@NgModule({
  imports: [DataViewModule, TableFilterModule, SortTableModule],
})
export class FeatureModule {}`,
    },
    {
      title: 'Add the toolbar and your views',
      text: 'viewState picks the buttons; each *-content element becomes a popover or a view.',
      lang: 'html',
      filename: 'example.component.html',
      code: `<verben-data-view
  [viewState]="{ isSearch: true, isToggle: true, isFilter: true, isSort: true, isCreate: true }"
  [selectedFilterTableCount]="activeFilters"
  [selectedSortCount]="activeSorts"
  (onSearchChange)="search($event.value)"
>
  <!-- Popovers -->
  <verben-table-filter filter-content [filterOptions]="filters"></verben-table-filter>
  <verben-sort-table sort-content [sortOptions]="sorts" (selectedOptions)="sortBy($event)"></verben-sort-table>
  <div create-content><!-- your create form --></div>

  <!-- The two views -->
  <div table-content><!-- e.g. <lib-data-table> --></div>
  <div card-content><!-- e.g. <verben-card-data-view> or a grid of <verben-card> --></div>
</verben-data-view>`,
    },
    {
      title: 'Give it options and react to it',
      lang: 'ts',
      filename: 'example.component.ts',
      code: `import { DataFilterType, IDataFilter } from 'verben-ng-ui';

filters: IDataFilter[] = [
  { name: 'Vendor', type: DataFilterType.String, checked: false },
  { name: 'Amount', type: DataFilterType.Decimal, checked: false },
];
sorts: IDataFilter[] = [{ name: 'Date', type: DataFilterType.Date, checked: false }];
activeFilters = 0;
activeSorts = 0;

search(text: string) { /* query your API, or filter your list */ }
sortBy(options: IDataFilter[]) { this.activeSorts = options.length; }`,
    },
  ],
  anatomy: {
    tree: `<verben-data-view [viewState] (onSearchChange) (viewChange) (stateChange)>
├── [column-content] [filter-content] [sort-content]   popovers
├── [export-content] [import-content] [create-content] popovers
├── [table-content]                                    table view
├── [card-content]                                     card view
└── [children]                                         under the toolbar`,
    parts: [
      { name: '[viewState]', type: '{ isSearch?, isToggle?, isColumn?, isFilter?, isSort?, isExport?, isImport?, isSelect?, isCreate?, isExtend? }', description: 'Which toolbar buttons are shown. Unset keys are hidden.' },
      { name: '(onSearchChange)', type: '{ key, value }', description: 'Search text, debounced (milliseconds, default 400) so you query once per pause, not per key.' },
      { name: '[isTableView] / (viewChange)', type: 'boolean', description: 'Table or card view (the toggle).' },
      { name: '(stateChange)', type: '{ key, value }', description: 'A popover opened or closed (key: filter, sort, create…).' },
      { name: '[selectedFilterTableCount] / [selectedSortCount] / [selectedColumnCount]', type: 'number', description: 'The (n) badges next to Filter, Sort and Column.' },
    ],
  },
  performance: {
    notes: [
      { title: 'Search is debounced', text: 'Typing "dangote" causes one search, not seven.' },
      {
        title: 'Popovers exist from the start',
        text: 'Column and filter stay attached while closed (they keep their state); sort, import, export and create are attached only while open. Either way Angular creates projected content with the page, so keep popovers light or put heavy ones behind your own *ngIf.',
      },
      { title: 'Your views decide the speed', text: 'The table and card views are your components; see Card Data View and the Vendor Invoices playground.' },
    ],
  },
  files: [
    { name: 'data-view.component.html', lang: 'html', load: () => import('./data-view/data-view.component.html', { with: { loader: 'text' } }) },
    { name: 'data-view.component.ts', lang: 'ts', load: () => import('./data-view/data-view.component', { with: { loader: 'text' } }) },
  ],
};

const CARD_DATA_VIEW: PlaygroundUsage = {
  description:
    'A master–detail list: cards on the left; clicking a card (or one of its children) opens a details panel on the right. ' +
    'You give it the data (CardData[]) and small templates for a card, a child and the details.',
  steps: [
    {
      title: 'Import the module',
      lang: 'ts',
      filename: 'feature.module.ts',
      code: `import { CardDataViewModule, VerbenaInputModule } from 'verben-ng-ui';

@NgModule({
  imports: [CardDataViewModule, VerbenaInputModule, FormsModule],
})
export class FeatureModule {}`,
    },
    {
      title: 'Describe a card, a child and the details',
      text: 'The templates get the item; clicking calls the view so it can open the details.',
      lang: 'html',
      filename: 'example.component.html',
      code: `<verben-card-data-view #view [cardDataList]="cards" dataId="id" (loadMoreClick)="loadMore()">
  <verben-left-card-data-view>
    <verben-left-card-data #list [parent]="view" [cardDataList]="cards" dataId="id">
      <!-- One item -->
      <ng-template #card let-item>
        <div class="item" [class.is-selected]="item.selected" (click)="current = view.onItemClick(item)">
          <verben-svg
            *ngIf="item.children.length"
            [icon]="item.isChildrenExpanded ? 'minus' : 'plus'"
            (click)="$event.stopPropagation(); list.showChildren(item)"
          ></verben-svg>
          <b>{{ item.title }}</b>
          <div *ngFor="let row of item.body">{{ row.title }}: {{ row.value }}</div>
        </div>
      </ng-template>

      <!-- One child -->
      <ng-template #cardChild let-item let-index="index">
        <div class="child" [class.is-selected]="item.selected" (click)="current = view.onCardChildClick(index)">
          {{ item.title }}
        </div>
      </ng-template>
    </verben-left-card-data>
  </verben-left-card-data-view>

  <!-- Details -->
  <verben-right-card-data-view>
    <ng-template #parent>
      <verbena-input label="Vendor" [(ngModel)]="current.data.vendor"></verbena-input>
    </ng-template>
    <ng-template #child>
      <verbena-input label="Product" [(ngModel)]="current.data.product"></verbena-input>
    </ng-template>
  </verben-right-card-data-view>

  <verben-card-data-view-footer>
    {{ cards.length }} records loaded · <button type="button" (click)="loadMore()">Load more</button>
  </verben-card-data-view-footer>
</verben-card-data-view>`,
    },
    {
      title: 'Give it data',
      lang: 'ts',
      filename: 'example.component.ts',
      code: `import { CardData } from 'verben-ng-ui';

current!: CardData;

cards: CardData[] = [
  {
    title: 'VIN-MXTUOE',
    selected: false,
    data: { id: 'VIN-MXTUOE', vendor: 'Dangote' },
    body: [
      { title: 'Amount', value: '₦210,000,000.00' },
      { title: 'Status', value: 'Posted' },
    ],
    children: [
      { title: 'VIL-85N0JB', selected: false, data: { id: 'VIL-85N0JB', product: 'Premium Motor Spirit' }, body: [], children: [] },
    ],
  },
];

loadMore() { /* fetch the next page and append it to cards */ }`,
    },
  ],
  anatomy: {
    tree: `<verben-card-data-view #view [cardDataList] dataId (loadMoreClick)>
├── <verben-card-data-view-header>              optional
├── <verben-left-card-data-view>
│   └── <verben-left-card-data #list [parent]="view">
│       ├── <ng-template #card let-item>        one item
│       ├── <ng-template #cardChild let-item>   one child
│       └── <ng-template #cardFooter let-item>  optional
├── <verben-right-card-data-view>
│   ├── <ng-template #parent>                   details of an item
│   └── <ng-template #child>                    details of a child
└── <verben-card-data-view-footer>              optional`,
    parts: [
      { name: '#view', type: 'CardDataViewComponent', description: 'onItemClick(item) and onCardChildClick(index) return what to show in the details; clearData() closes them.' },
      { name: '#list', type: 'LeftCardDataComponent', description: 'showChildren(item) for the +/− toggle.' },
      { name: 'dataId', type: 'string', description: 'The field in item.data that identifies an item.' },
      { name: '#parent / #child', type: 'template', description: 'Get no context: read your own field (current in the example).' },
      { name: 'CardData', type: '{ title, body, data, children, selected, isChildrenExpanded? }', description: 'One item. data holds your own object; body is what a card typically lists.' },
    ],
  },
  performance: {
    notes: [
      { title: 'Cards are matched by position', text: '@for … track $index: after a sort, a filter or an item added at the top, every card is rewritten instead of moved. Tracking by id would keep each card with its item.' },
      { title: '"Virtual scroll" renders everything', text: 'useVirtualScroll wraps an @for list, not *cdkVirtualFor, so every item is still created: a fixed-height scroll box, not virtualisation. Page with Load more instead.' },
      { title: 'n × n template calls', text: 'The playground calls list.showToggle(item) per card, which scans the whole list. 48 items: 2,304 scans per check (500 items: 250,000), on every click or key press anywhere. Prefer a field set when data changes.' },
      { title: 'Selection loops over the list', text: 'Clicking an item clears every other item\'s flag. Fine for tens of items; one "selected" reference is O(1).' },
      { title: 'Default change detection', text: 'Checked on every event in the app: an unrelated check costs 1.01 ms on this page (48 items) against 0.07 ms on the OnPush Vendor Invoices page.' },
    ],
  },
  files: [
    { name: 'cdv.component.html', lang: 'html', load: () => import('../views/card-data-view/cdv.component.html', { with: { loader: 'text' } }) },
    { name: 'cdv.component.ts', lang: 'ts', load: () => import('../views/card-data-view/cdv.component', { with: { loader: 'text' } }) },
  ],
};

const VENDOR_INVOICES: PlaygroundUsage = {
  description:
    "The app's invoices screen built with the existing <verben-card> and data view toolbar: search, filter, sort, create, " +
    '+ for invoice lines, click for details, load more. Written the way the rest of the app writes cards.',
  docs: '/documentation/components/card',
  steps: [
    {
      title: 'Import the modules',
      text: 'Only existing modules; CommonModule also brings the currency pipe.',
      lang: 'ts',
      filename: 'invoices.module.ts',
      code: `import { CardModule, DataViewModule, NumberInputModule, VerbenaBadgeModule,
  VerbenaButtonModule, VerbenaInputModule } from 'verben-ng-ui';

@NgModule({
  declarations: [VendorInvoicesComponent],
  imports: [
    CommonModule, FormsModule,
    DataViewModule,              // the toolbar
    CardModule,                  // <verben-card>, the same card as everywhere else
    VerbenaBadgeModule, VerbenaButtonModule, VerbenaInputModule, NumberInputModule,
  ],
})
export class InvoicesModule {}`,
    },
    {
      title: 'One card per invoice',
      text: 'The whole template is in Code above; the heart of it is a list of interactive cards with their lines inside.',
      lang: 'html',
      filename: 'vendor-invoices.component.html',
      code: `<verben-card
  *ngFor="let inv of visible; trackBy: byId"
  variant="plain"
  interactive
  [selected]="inv === selected"
  (click)="select(inv)"
>
  <div card-header>
    <div class="row"><b>{{ inv.id }}</b><span>{{ inv.vendor }}</span></div>
    <div class="row">
      <span>{{ inv.total | currency: 'NGN' : 'symbol-narrow' }}</span>
      <verbena-badge [text]="inv.status" [bgColor]="badge[inv.status].bg" [textColor]="badge[inv.status].fg"></verbena-badge>
    </div>
  </div>
  <div card-body *ngIf="inv.open">
    <verben-card *ngFor="let line of inv.lines; trackBy: byId" variant="plain"
      [heading]="line.id" [subheading]="'Product: ' + line.product"></verben-card>
  </div>
</verben-card>`,
    },
    {
      title: 'Keep the template cheap',
      text: 'OnPush, and everything the template shows is computed once per change, never in the template.',
      lang: 'ts',
      filename: 'vendor-invoices.component.ts',
      code: `@Component({ …, changeDetection: ChangeDetectionStrategy.OnPush })
export class VendorInvoicesComponent {
  visible: Invoice[] = [];      // what the board shows
  selected: Invoice | null = null;

  refresh(): void {             // after every search, filter, sort, save…
    for (const invoice of this.all) invoice.total = this.sumLines(invoice);
    const matches = this.all.filter(…);   // search + filters
    this.visible = matches.sort(…).slice(0, this.loaded);
  }

  byId(_: number, item: { id: string }) { return item.id; }   // trackBy
}`,
    },
  ],
  anatomy: {
    tree: `<verben-data-view>                               toolbar
├── <verben-card filter-content|sort-content|create-content variant="plain" heading>
└── <verben-card card-content variant="plain">   the board
    ├── [card-body]
    │   ├── <verben-card interactive [selected]> × n   an invoice
    │   │   ├── [card-header]   id · vendor, amount · status
    │   │   └── [card-body]     its lines: <verben-card [heading] [subheading]>
    │   └── <verben-card>                         details (default look)
    └── [card-footer]                             "9 of 37 records loaded · Load more"`,
    parts: [
      { name: 'variant="plain"', type: 'verben-card', description: 'No grey bars: the board, popovers and invoice cards.' },
      { name: 'interactive / [selected]', type: 'verben-card', description: 'Clickable invoice and line cards; the open one gets the accent strip.' },
      { name: '[heading] / [subheading]', type: 'verben-card', description: 'Line cards without header markup.' },
      { name: 'Details card', type: 'verben-card', description: 'The default look: header with close, form in the body, Delete / Save in the footer.' },
      { name: 'Status pill / amount', type: 'verbena-badge / currency pipe', description: 'Existing library badge with soft colors; Angular\'s currency pipe for ₦.' },
    ],
  },
  performance: {
    intro: 'Measured in this docs app in one session (dev build, Chrome); compare the columns, not the absolute numbers. Both include the docs layout around the page.',
    compare: ['Card Data View', 'Vendor Invoices'],
    metrics: [
      { label: 'Check from elsewhere in the app', before: '1.01 ms', after: '0.07 ms', note: 'OnPush: the screen is skipped, its template isn\'t read.' },
      { label: 'Check of the screen itself', before: '0.90 ms', after: '0.36 ms', note: '48 items vs 37 cards: about half the work per card.' },
      { label: 'Elements per card', before: '21', after: '14', note: 'Less memory and less style / layout work.' },
    ],
    notes: [
      { title: 'Cards stay with their data', text: 'trackBy id: after a sort, a filter or a new invoice, Angular moves cards and creates only new ones.' },
      { title: 'No work per card per check', text: 'The template reads fields (inv.total, visible, selected) computed once per change in refresh().' },
      { title: 'One selected reference', text: '"Is this card open" is inv === selected; no loop over the list.' },
      { title: 'Paging, not "virtual scroll"', text: '9 cards render; Load more adds 9 (a real screen asks the server for the next page).' },
      { title: 'verben-card is OnPush', text: 'Its template only reads its own inputs; unfilled sections are hidden by CSS (:empty), states are CSS.' },
      { title: 'Buttons without per-check objects', text: 'verbena-button used to build a new style object 5× per check; now plain bindings and CSS states.' },
    ],
  },
  files: [
    { name: 'vendor-invoices.component.html', lang: 'html', load: () => import('./pages/playground/vendor-invoices/vendor-invoices.component.html', { with: { loader: 'text' } }) },
    { name: 'vendor-invoices.component.ts', lang: 'ts', load: () => import('./pages/playground/vendor-invoices/vendor-invoices.component', { with: { loader: 'text' } }) },
    { name: 'vendor-invoices.component.css', lang: 'css', load: () => import('./pages/playground/vendor-invoices/vendor-invoices.component.css', { with: { loader: 'text' } }) },
  ],
};

/** Usage for each playground route */
export const PLAYGROUND_USAGE: Record<string, PlaygroundUsage> = {
  '/documentation/vendor-invoices': VENDOR_INVOICES,
  '/documentation/data-view': DATA_VIEW,
  '/documentation/card-data-view': CARD_DATA_VIEW,
  '/documentation/data-table': {
    files: [
      { name: 'data-table.component.html', lang: 'html', load: () => import('./data-table/data-table.component.html', { with: { loader: 'text' } }) },
      { name: 'data-table.component.ts', lang: 'ts', load: () => import('./data-table/data-table.component', { with: { loader: 'text' } }) },
      { name: 'data-table.component.scss', lang: 'css', load: () => import('./data-table/data-table.component.scss', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/card-view': {
    files: [
      { name: 'card-view.component.html', lang: 'html', load: () => import('../views/card-view/card-view.component.html', { with: { loader: 'text' } }) },
      { name: 'card-view.component.ts', lang: 'ts', load: () => import('../views/card-view/card-view.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/sort-table': {
    files: [
      { name: 'sort-table.component.html', lang: 'html', load: () => import('./sort-table/sort-table.component.html', { with: { loader: 'text' } }) },
      { name: 'sort-table.component.ts', lang: 'ts', load: () => import('./sort-table/sort-table.component', { with: { loader: 'text' } }) },
      { name: 'sort-table.component.css', lang: 'css', load: () => import('./sort-table/sort-table.component.css', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/table-filter': {
    files: [
      { name: 'table-filter-sample.component.html', lang: 'html', load: () => import('../views/table-filter-sample/table-filter-sample.component.html', { with: { loader: 'text' } }) },
      { name: 'table-filter-sample.component.ts', lang: 'ts', load: () => import('../views/table-filter-sample/table-filter-sample.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/visible-column': {
    files: [
      { name: 'visible-column.component.html', lang: 'html', load: () => import('./visible-column/visible-column.component.html', { with: { loader: 'text' } }) },
      { name: 'visible-column.component.ts', lang: 'ts', load: () => import('./visible-column/visible-column.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/verben-mail': {
    files: [
      { name: 'verben-mail.component.html', lang: 'html', load: () => import('./verben-mail/verben-mail.component.html', { with: { loader: 'text' } }) },
      { name: 'verben-mail.component.ts', lang: 'ts', load: () => import('./verben-mail/verben-mail.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/button-badge': {
    files: [
      { name: 'button-badge.component.html', lang: 'html', load: () => import('./button-badge/button-badge.component.html', { with: { loader: 'text' } }) },
      { name: 'button-badge.component.ts', lang: 'ts', load: () => import('./button-badge/button-badge.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/input-textarea': {
    files: [
      { name: 'verbena-input-textarea.component.html', lang: 'html', load: () => import('./verbena-input-textarea/verbena-input-textarea.component.html', { with: { loader: 'text' } }) },
      { name: 'verbena-input-textarea.component.ts', lang: 'ts', load: () => import('./verbena-input-textarea/verbena-input-textarea.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/switch': {
    files: [
      { name: 'switch.component.html', lang: 'html', load: () => import('./switch/switch.component.html', { with: { loader: 'text' } }) },
      { name: 'switch.component.ts', lang: 'ts', load: () => import('./switch/switch.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/dropdown': {
    files: [
      { name: 'dropdown-sample.component.html', lang: 'html', load: () => import('./dropdown-sample/dropdown-sample.component.html', { with: { loader: 'text' } }) },
      { name: 'dropdown-sample.component.ts', lang: 'ts', load: () => import('./dropdown-sample/dropdown-sample.component', { with: { loader: 'text' } }) },
      { name: 'dropdown-sample.component.scss', lang: 'css', load: () => import('./dropdown-sample/dropdown-sample.component.scss', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/dropdown-sample': {
    files: [
      { name: 'sample-for-dropdowns.component.html', lang: 'html', load: () => import('./sample-for-dropdowns/sample-for-dropdowns.component.html', { with: { loader: 'text' } }) },
      { name: 'sample-for-dropdowns.component.ts', lang: 'ts', load: () => import('./sample-for-dropdowns/sample-for-dropdowns.component', { with: { loader: 'text' } }) },
      { name: 'sample-for-dropdowns.component.scss', lang: 'css', load: () => import('./sample-for-dropdowns/sample-for-dropdowns.component.scss', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/chip': {
    files: [
      { name: 'chip.component.html', lang: 'html', load: () => import('./chip/chip.component.html', { with: { loader: 'text' } }) },
      { name: 'chip.component.ts', lang: 'ts', load: () => import('./chip/chip.component', { with: { loader: 'text' } }) },
      { name: 'chip.component.scss', lang: 'css', load: () => import('./chip/chip.component.scss', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/date-picker': {
    files: [
      { name: 'date-picker.component.html', lang: 'html', load: () => import('./date-picker/date-picker.component.html', { with: { loader: 'text' } }) },
      { name: 'date-picker.component.ts', lang: 'ts', load: () => import('./date-picker/date-picker.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/time-picker': {
    files: [
      { name: 'time-picker.component.html', lang: 'html', load: () => import('./time-picker/time-picker.component.html', { with: { loader: 'text' } }) },
      { name: 'time-picker.component.ts', lang: 'ts', load: () => import('./time-picker/time-picker.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/dialogue': {
    files: [
      { name: 'dialogue-sample.component.html', lang: 'html', load: () => import('./dialogue-sample/dialogue-sample.component.html', { with: { loader: 'text' } }) },
      { name: 'dialogue-sample.component.ts', lang: 'ts', load: () => import('./dialogue-sample/dialogue-sample.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/notifications': {
    files: [
      { name: 'notifications-sample.component.html', lang: 'html', load: () => import('../views/notifications-sample/notifications-sample.component.html', { with: { loader: 'text' } }) },
      { name: 'notifications-sample.component.ts', lang: 'ts', load: () => import('../views/notifications-sample/notifications-sample.component', { with: { loader: 'text' } }) },
      { name: 'notifications-sample.component.scss', lang: 'css', load: () => import('../views/notifications-sample/notifications-sample.component.scss', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/tooltip': {
    files: [
      { name: 'tooltip-sample.component.html', lang: 'html', load: () => import('../views/tooltip-sample/tooltip-sample.component.html', { with: { loader: 'text' } }) },
      { name: 'tooltip-sample.component.ts', lang: 'ts', load: () => import('../views/tooltip-sample/tooltip-sample.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/icons': {
    files: [
      { name: 'icons-sample.component.html', lang: 'html', load: () => import('../views/icons-sample/icons-sample.component.html', { with: { loader: 'text' } }) },
      { name: 'icons-sample.component.ts', lang: 'ts', load: () => import('../views/icons-sample/icons-sample.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/svg': {
    files: [
      { name: 'verbena-svg.component.html', lang: 'html', load: () => import('./verbena-svg/verbena-svg.component.html', { with: { loader: 'text' } }) },
      { name: 'verbena-svg.component.ts', lang: 'ts', load: () => import('./verbena-svg/verbena-svg.component', { with: { loader: 'text' } }) },
    ],
  },
  '/documentation/images': {
    files: [
      { name: 'image-sample.component.html', lang: 'html', load: () => import('../views/image-sample/image-sample.component.html', { with: { loader: 'text' } }) },
      { name: 'image-sample.component.ts', lang: 'ts', load: () => import('../views/image-sample/image-sample.component', { with: { loader: 'text' } }) },
    ],
  },
};
