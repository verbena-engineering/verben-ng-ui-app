/**
 * Single source of truth for the docs navigation.
 * The sidebar, the home page cards and the prev/next links all read from here,
 * so adding a component page = add one entry + one route.
 */

export interface DocsNavItem {
  /** Used by the home page to pick the card preview */
  slug: string;
  title: string;
  route: string;
  description?: string;
  /** Older test-harness page for the same component, if any */
  playground?: string;
  /** Library folder, shown on the page for people looking for the source */
  source?: string;
  /**
   * 'unstable' = in team review: badge in the sidebar, warning on the page.
   * 'new' = recently added: small badge in the sidebar and on the page.
   * 'updated' = existing component that changed: badge + a "What changed" note (see changes).
   */
  status?: 'unstable' | 'new' | 'updated';
  /** What changed and when, shown on the page for 'updated' (and 'new') items */
  changes?: DocsChange;
}

export interface DocsChange {
  /** "2026-10-09" */
  date: string;
  notes: string[];
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

const lib = 'projects/verben-ng-ui/src/lib/';

export const GETTING_STARTED: DocsNavItem[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    route: '/documentation',
    description: 'What verben-ng-ui is and how the docs are organised.',
  },
  {
    slug: 'installation',
    title: 'Installation',
    route: '/documentation/installation',
    description: 'Add the library, its styles and the theme to an app.',
  },
  {
    slug: 'theming',
    title: 'Theming',
    route: '/documentation/theming',
    description: 'Brand colors, dark mode and the --vbn-* tokens.',
  },
];

export const COMPONENT_DOCS: DocsNavItem[] = [
  {
    slug: 'badge',
    title: 'Badge',
    route: '/documentation/components/badge',
    description: 'A small label or count for statuses and notifications.',
    playground: '/documentation/button-badge',
    source: lib + 'verbena-badge',
  },
  {
    slug: 'button',
    title: 'Button',
    route: '/documentation/components/button',
    description: 'Preset looks and sizes with hover, focus and loading states, icons, dark mode.',
    playground: '/documentation/button-badge',
    source: lib + 'verbena-button',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'New look: one height per size, 8px corners, softer default colors, and dark-mode colors (outline and grey were unreadable in dark mode).',
        'Hover, pressed and keyboard-focus states; loading shows a spinner, sets aria-busy and blocks clicks.',
        "New inputs: size ('sm' | 'md' | 'lg'), block, disabled (same as disable); styleType 'ghost' and 'link'.",
        'The label can be content between the tags; a button without text becomes a square icon button; icons follow the text color.',
        'Every existing input still works, and bgColor / textColor / border / pd overrides still win.',
      ],
    },
  },
  {
    slug: 'card',
    title: 'Card',
    route: '/documentation/components/card',
    description: 'A container with optional header, media, body and footer sections.',
    playground: '/documentation/card-view',
    source: lib + 'components/card',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'Existing cards are unchanged: same tag, module, inputs, defaults, slots and look. No code changes needed.',
        "Sections you don't fill are no longer drawn (empty grey header / footer bars were shown before).",
        'New, opt-in: heading / subheading, variant="plain", interactive, selected and a card-media slot.',
        'The card is OnPush inside; projected content is unaffected.',
        'Responsive: a set width (width="340px") is never wider than the space the card gets; long words wrap.',
      ],
    },
  },
  {
    slug: 'chip',
    title: 'Chip',
    route: '/documentation/components/chip',
    description: 'Type values and press Enter to collect them as chips.',
    playground: '/documentation/chip',
    source: lib + 'components/chip',
  },
  {
    slug: 'date-picker',
    title: 'Date Picker',
    route: '/documentation/components/date-picker',
    description: 'A day, a date and time, a range or a period, in a default, simple or advanced variant.',
    playground: '/documentation/date-picker',
    source: lib + 'components/date-picker',
    status: 'new',
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    route: '/documentation/components/dialog',
    description: 'A modal window or side drawer built from templates.',
    playground: '/documentation/dialogue',
    source: lib + 'components/verben-dialogue',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'Responsive: small / medium / large shrink to the screen on phones (16px+ margin); a drawer is never wider than the screen.',
        'Same inputs and look on larger screens.',
      ],
    },
  },
  {
    slug: 'dropdown',
    title: 'Dropdown',
    route: '/documentation/components/dropdown',
    description: 'Select one or many options, with search and lazy loading.',
    playground: '/documentation/dropdown',
    source: lib + 'components/drop-down',
    status: 'updated',
    changes: {
      date: '2026-10-02',
      notes: ['New input autoScrollToCurrentItem: the list opens scrolled to the selected item (matched by selectKey).'],
    },
  },
  {
    slug: 'icons',
    title: 'Icons',
    route: '/documentation/components/icons',
    description: 'Hundreds of SVG icons rendered with <verben-svg>.',
    playground: '/documentation/svg',
    source: lib + 'components/svg',
  },
  {
    slug: 'input',
    title: 'Input',
    route: '/documentation/components/input',
    description: 'Text field with label, validation and a password toggle.',
    playground: '/documentation/input-textarea',
    source: lib + 'verbena-input',
  },
  {
    slug: 'notification',
    title: 'Notification',
    route: '/documentation/components/notification',
    description: 'Toast messages triggered from NotificationService.',
    playground: '/documentation/notifications',
    source: lib + 'components/notification',
  },
  {
    slug: 'number-input',
    title: 'Number Input',
    route: '/documentation/components/number-input',
    description: 'Formatted numbers (separators, decimals, prefix, suffix).',
    playground: '/documentation/input-textarea',
    source: lib + 'components/number-input',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        '2026-10-02: thousand separators (on by default), decimalPlaces, prefix and suffix; the bound value is still a number.',
        '2026-10-09: typing after padded decimals works ("0.00", "2,500.00" were blocking); while editing the decimals are not padded.',
      ],
    },
  },
  {
    slug: 'switch',
    title: 'Switch',
    route: '/documentation/components/switch',
    description: 'An on/off toggle with optional labels.',
    playground: '/documentation/switch',
    source: lib + 'verbena-switch',
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    route: '/documentation/components/tabs',
    description: 'Switch between panels of related content.',
    source: lib + 'components/verbena-tab',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'New look: rounded frame, muted tabs, the active tab in the text colour with a line under it (it was yellow on white), a styled count badge.',
        'Responsive: tabs that do not fit scroll sideways instead of widening the page.',
        'Keyboard: tabs are focusable and open with Enter or Space (tablist / tab / tabpanel roles).',
        'Same inputs; the colour inputs (activeTabBgColor, tabColor, textColor, badgeColor) still win.',
      ],
    },
  },
  {
    slug: 'textarea',
    title: 'Textarea',
    route: '/documentation/components/textarea',
    description: 'Multi-line text field with label and validation.',
    playground: '/documentation/input-textarea',
    source: lib + 'verbena-textarea',
  },
  {
    slug: 'time-picker',
    title: 'Time Picker',
    route: '/documentation/components/time-picker',
    description: 'Hours and minutes in 12 or 24 hour format.',
    playground: '/documentation/time-picker',
    source: lib + 'components/verben-time-picker',
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    route: '/documentation/components/tooltip',
    description: 'Extra information shown when hovering an element.',
    playground: '/documentation/tooltip',
    source: lib + 'components/tooltip',
  },
];

/** New components waiting for team approval. Their API may still change. */
export const UNSTABLE_DOCS: DocsNavItem[] = [
];

/** The original demo / test pages, still reachable for manual testing */
export const PLAYGROUND_PAGES: DocsNavItem[] = [
  {
    slug: 'pg-data-table',
    title: 'Data Table',
    description: 'The data table with its filter, sort, column, export and import popovers.',
    route: '/documentation/data-table',
    status: 'updated',
    changes: { date: '2026-10-09', notes: ['Responsive: a table wider than the screen scrolls sideways inside the component instead of widening the page.'] },
  },
  {
    slug: 'pg-data-view',
    title: 'Data View',
    route: '/documentation/data-view',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'The "Create New" button text uses --vbn-color-on-primary, so it stays readable in dark mode.',
        'Its buttons have the new button look (hover, focus, sizes).',
        'Toolbar refresh: segmented table / cards switch, outlined search with a focus ring, bordered action buttons with count pills and an open state.',
        'Responsive: the toolbar wraps; the popovers open right-aligned under the actions and are never wider than the toolbar.',
      ],
    },
  },
  {
    slug: 'pg-card-data-view',
    title: 'Card Data View',
    description: 'A master–detail list: cards with children on the left, details on the right.',
    route: '/documentation/card-data-view',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'Responsive only, same look: list | details (30 / 70) no longer overflow by the gap, and stack (details on top) when both cannot fit.',
        'The card grid keeps 3 columns while there is room, then 2, then 1.',
        'Child rows and the header no longer overflow by their padding.',
      ],
    },
  },
  { slug: 'pg-vendor-invoices', title: 'Vendor Invoices', route: '/documentation/vendor-invoices', status: 'new' },
  { slug: 'pg-card-view', title: 'Card View', description: 'A plain verben-card with header, body and footer.', route: '/documentation/card-view' },
  {
    slug: 'pg-sort-table',
    title: 'Sort Table',
    description: 'Pick and order the columns to sort by, with drag and drop.',
    route: '/documentation/sort-table',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'New look shared by Sort, Filter and Columns: surface, border and shadow by default, count pill, text buttons, row hover, blue checkboxes, rounded main button.',
        'Responsive: never wider than the space they get; inputs wrap.',
        'Same inputs and outputs; bgColor, border, primaryColor and the other style inputs still win.',
      ],
    },
  },
  {
    slug: 'pg-table-filter',
    title: 'Table Filter',
    description: 'Build filters per column type: text, numbers, dates and yes / no.',
    route: '/documentation/table-filter',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'New look shared by Sort, Filter and Columns: surface, border and shadow by default, count pill, text buttons, row hover, blue checkboxes, rounded main button.',
        'Responsive: never wider than the space they get; inputs wrap.',
        'Same inputs and outputs; bgColor, border, primaryColor and the other style inputs still win.',
      ],
    },
  },
  {
    slug: 'pg-visible-column',
    title: 'Visible Column',
    description: 'Choose which table columns are shown.',
    route: '/documentation/visible-column',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'New look shared by Sort, Filter and Columns: surface, border and shadow by default, count pill, text buttons, row hover, blue checkboxes, rounded main button.',
        'Responsive: never wider than the space they get; inputs wrap.',
        'Same inputs and outputs; bgColor, border, primaryColor and the other style inputs still win.',
      ],
    },
  },
  {
    slug: 'pg-mail',
    title: 'Mail Template',
    description: 'A ready-made email form: subject, To / CC / BCC chips, attachment and message.',
    route: '/documentation/verben-mail',
    status: 'updated',
    changes: {
      date: '2026-10-09',
      notes: [
        'New look: rounded fields with a focus ring, a fixed label column, outline and primary buttons; default border uses the theme border colour.',
        'Responsive: never wider than the space it gets; on narrow widths the labels go above their fields.',
      ],
    },
  },
  { slug: 'pg-button-badge', title: 'Button & Badge', description: 'Buttons and badges in every preset, with icons and loading.', route: '/documentation/button-badge' },
  { slug: 'pg-input-textarea', title: 'Inputs & Validation', description: 'Inputs, number inputs, textareas and validation directives.', route: '/documentation/input-textarea' },
  { slug: 'pg-switch', title: 'Switch', description: 'The switch, on and off, with labels.', route: '/documentation/switch' },
  { slug: 'pg-dropdown', title: 'Dropdown', description: 'Single and multi select, search, lazy loading and auto-scroll to the current item.', route: '/documentation/dropdown' },
  { slug: 'pg-dropdown-sample', title: 'Dropdown (sample)', description: 'Pop-ups inside a scrolling area: they stay attached to their buttons while you scroll.', route: '/documentation/dropdown-sample' },
  { slug: 'pg-chip', title: 'Chip', description: 'Type values and press Enter to collect them as chips.', route: '/documentation/chip' },
  { slug: 'pg-date-picker', title: 'Date Picker', description: 'The classic date picker inputs: one day, date and time, ranges, bounds.', route: '/documentation/date-picker' },
  { slug: 'pg-time-picker', title: 'Time Picker', description: 'The time picker.', route: '/documentation/time-picker' },
  { slug: 'pg-dialogue', title: 'Dialogue', description: 'Dialogs and side drawers built from templates.', route: '/documentation/dialogue' },
  { slug: 'pg-notifications', title: 'Notifications', description: 'Success, error, warning and info notifications.', route: '/documentation/notifications' },
  { slug: 'pg-tooltip', title: 'Tooltip', description: 'Tooltips with custom content and positions.', route: '/documentation/tooltip' },
  { slug: 'pg-icons', title: 'Icons', description: 'The icon component.', route: '/documentation/icons' },
  { slug: 'pg-svg', title: 'Verben Icons', description: 'Every icon in the library set, by name.', route: '/documentation/svg' },
  { slug: 'pg-images', title: 'Images', description: 'The image component.', route: '/documentation/images' },
];

export const DOCS_NAV: DocsNavGroup[] = [
  { title: 'Getting Started', items: GETTING_STARTED },
  { title: 'Components', items: COMPONENT_DOCS },
  { title: 'Unstable', items: UNSTABLE_DOCS },
  { title: 'Playground', items: PLAYGROUND_PAGES },
];

/** Reading order for prev/next links (playground pages are excluded) */
export const DOCS_SEQUENCE: DocsNavItem[] = [
  ...GETTING_STARTED,
  ...COMPONENT_DOCS,
  ...UNSTABLE_DOCS,
];
