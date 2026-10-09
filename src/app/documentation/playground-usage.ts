import { DocsCodeFile } from './docs-kit/code-tabs.component';
import { DocsProp } from './docs-kit/props-table.component';

/*
 * "Usage" under each playground page: how the element is built, and the
 * page's real source files.
 *
 * Each file is a dynamic import with esbuild's text loader, so it becomes its
 * own small chunk and is downloaded only when its tab is opened: the docs
 * don't ship ~150 KB of example code to everyone. The import paths must be
 * written out (not built from strings) so the bundler can find them.
 */

export interface PlaygroundUsage {
  /** One paragraph: what the element is and how it is put together */
  intro?: string;
  /** The parts, slots and inputs that matter, as a table */
  anatomy?: DocsProp[];
  /** A clean, minimal version (the playground pages also hold experiments) */
  minimal?: { html: string; ts?: string };
  /** Notes on speed: what the element does well, and what to watch for */
  performance?: string[];
  /** The page's real files */
  files: DocsCodeFile[];
}

const DATA_VIEW: PlaygroundUsage = {
  intro:
    '<verben-data-view> is a toolbar (view toggle, search, column / filter / sort / export / import / create) over ' +
    'two views you provide: table-content and card-content. Each toolbar button opens the matching *-content slot ' +
    'as a popover; viewState decides which buttons exist. The data view does not filter or sort anything itself: ' +
    'it tells you (onSearchChange, stateChange, the popovers\' own outputs) and you update your data.',
  anatomy: [
    { name: '[viewState]', type: '{ isSearch?, isToggle?, isColumn?, isFilter?, isSort?, isExport?, isImport?, isSelect?, isCreate?, isExtend? }', description: 'Which toolbar buttons are shown. Unset keys are hidden.' },
    { name: '(onSearchChange)', type: '{ key, value }', description: 'Search text, debounced (milliseconds, default 400) so you query once per pause, not per key.' },
    { name: '[isTableView] / (viewChange)', type: 'boolean', description: 'Table or card view (the toggle).' },
    { name: '(stateChange)', type: '{ key, value }', description: 'A popover opened or closed (key: filter, sort, create…).' },
    { name: '[selectedFilterTableCount] / [selectedSortCount] / [selectedColumnCount]', type: 'number', description: 'The (n) badges next to Filter, Sort and Column.' },
    { name: 'table-content / card-content', type: 'slot', description: 'The two views, e.g. <lib-data-table> and <verben-card-data-view>.' },
    { name: 'filter-content / sort-content / column-content / export-content / import-content / create-content', type: 'slot', description: 'Popover bodies, e.g. <verben-table-filter>, <verben-sort-table>, <verben-visible-column>, your create form.' },
    { name: 'children', type: 'slot', description: 'Anything shown under the toolbar.' },
  ],
  minimal: {
    html: `<verben-data-view
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
  <div card-content><!-- e.g. <verben-card-data-view> or vbn-cards --></div>
</verben-data-view>`,
    ts: `import { DataFilterType, IDataFilter } from 'verben-ng-ui';

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
  performance: [
    'Search is debounced inside the data view, so typing "dangote" causes one search, not seven.',
    'Column and filter popovers stay attached while closed (hidden with CSS) so they keep their state; sort, import, export and create are attached only while open. Either way Angular creates projected content with the page, so popover components exist (and are checked) from the start: keep them light, or put heavy ones behind your own *ngIf.',
    'The views are your own components: how fast the list is depends on them (see Card Data View below, and the Vendor Invoices playground).',
  ],
  files: [
    { name: 'data-view.component.html', lang: 'html', load: () => import('./data-view/data-view.component.html', { with: { loader: 'text' } }) },
    { name: 'data-view.component.ts', lang: 'ts', load: () => import('./data-view/data-view.component', { with: { loader: 'text' } }) },
  ],
};

const CARD_DATA_VIEW: PlaygroundUsage = {
  intro:
    '<verben-card-data-view> is a master–detail list: cards on the left; clicking a card (or one of its children) ' +
    'opens a details panel on the right. You give it the data (CardData[]) and small templates: how a card looks ' +
    '(#card), how a child looks (#cardChild), and the details for each (#parent / #child). Selection is stored on ' +
    'the data itself (item.selected, item.isChildrenExpanded).',
  anatomy: [
    { name: '<verben-card-data-view #view [cardDataList] dataId (loadMoreClick)>', type: 'container', description: 'The frame. #view gives you onItemClick(item), onCardChildClick(index) and clearData(). dataId names the field in item.data that identifies an item.' },
    { name: '<verben-card-data-view-header>', type: 'optional', description: 'Anything above the list.' },
    { name: '<verben-left-card-data-view> → <verben-left-card-data #list [parent]="view" [cardDataList] dataId>', type: 'list', description: 'The list column. #list gives you showChildren(item) for the +/− toggle.' },
    { name: '<ng-template #card let-item>', type: 'template', description: 'One item. Call view.onItemClick(item) on click; it returns the item to show in the details.' },
    { name: '<ng-template #cardChild let-item let-index="index">', type: 'template', description: 'One child, shown under an expanded item. Call view.onCardChildClick(index).' },
    { name: '<ng-template #cardFooter let-item>', type: 'optional template', description: 'Shown under an expanded item\'s children (e.g. a Save All button).' },
    { name: '<verben-right-card-data-view> → <ng-template #parent> / <ng-template #child>', type: 'details', description: 'The details for a selected item / child. They get no context: read your own field (current in the example).' },
    { name: '<verben-card-data-view-footer>', type: 'optional', description: 'E.g. "N records loaded · Load more".' },
    { name: 'CardData', type: '{ title, body: {title, value}[], data, children: CardData[], selected, isChildrenExpanded? }', description: 'One item. data holds your own object; body is what a card typically lists.' },
  ],
  minimal: {
    html: `<verben-card-data-view #view [cardDataList]="cards" dataId="id" (loadMoreClick)="loadMore()">
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
    ts: `import { CardData } from 'verben-ng-ui';

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
  performance: [
    'The list is rendered with "@for … track $index": after a sort, a filter or an item added at the top, every card is matched by position, so Angular rewrites each card\'s content instead of moving it. Tracking by id (item.data[dataId]) would keep each card with its item.',
    'useVirtualScroll puts the list in a cdk-virtual-scroll-viewport, but the items are rendered with @for, not *cdkVirtualFor, so every item is still created: you get a fixed-height scroll box, not virtualisation. Page with Load more (or server paging) instead.',
    'Templates that call a method per item run it on every change-detection pass. The playground calls list.showToggle(item), which filters the whole list each time: n items × n checks per pass. Measured here with 48 items: 48 calls and 2,304 list scans per check (500 items would be 250,000), on every click or key press anywhere in the app. Prefer a field you set when the data changes.',
    'Selection is stored on the data: clicking an item loops over all items to clear the others, and the details read a mutable field. Fine for tens of items; for hundreds, one "selected" reference is O(1).',
    'The components use the default change detection, so they are checked on every event anywhere in the app: measured here, an unrelated app-wide check costs 1.16 ms on this page with 48 items, against 0.20 ms on the OnPush Vendor Invoices page (see its Performance section).',
  ],
  files: [
    { name: 'cdv.component.html', lang: 'html', load: () => import('../views/card-data-view/cdv.component.html', { with: { loader: 'text' } }) },
    { name: 'cdv.component.ts', lang: 'ts', load: () => import('../views/card-data-view/cdv.component', { with: { loader: 'text' } }) },
  ],
};

/** Usage for each playground route (the Vendor Invoices page has its own) */
export const PLAYGROUND_USAGE: Record<string, PlaygroundUsage> = {
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
