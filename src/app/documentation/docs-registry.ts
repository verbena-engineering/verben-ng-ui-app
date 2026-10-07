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
    description: 'Preset button styles with icons and a loading state.',
    playground: '/documentation/button-badge',
    source: lib + 'verbena-button',
  },
  {
    slug: 'card',
    title: 'Card',
    route: '/documentation/components/card',
    description: 'A container with optional header, body and footer slots.',
    playground: '/documentation/card-view',
    source: lib + 'components/card',
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
    description: 'Pick a single date, a date and time, or a date range.',
    playground: '/documentation/date-picker',
    source: lib + 'components/date-picker',
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    route: '/documentation/components/dialog',
    description: 'A modal window or side drawer built from templates.',
    playground: '/documentation/dialogue',
    source: lib + 'components/verben-dialogue',
  },
  {
    slug: 'dropdown',
    title: 'Dropdown',
    route: '/documentation/components/dropdown',
    description: 'Select one or many options, with search and lazy loading.',
    playground: '/documentation/dropdown',
    source: lib + 'components/drop-down',
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

/** The original demo / test pages, still reachable for manual testing */
export const PLAYGROUND_PAGES: DocsNavItem[] = [
  { slug: 'pg-data-table', title: 'Data Table', route: '/documentation/data-table' },
  { slug: 'pg-data-view', title: 'Data View', route: '/documentation/data-view' },
  { slug: 'pg-card-data-view', title: 'Card Data View', route: '/documentation/card-data-view' },
  { slug: 'pg-card-view', title: 'Card View', route: '/documentation/card-view' },
  { slug: 'pg-sort-table', title: 'Sort Table', route: '/documentation/sort-table' },
  { slug: 'pg-table-filter', title: 'Table Filter', route: '/documentation/table-filter' },
  { slug: 'pg-visible-column', title: 'Visible Column', route: '/documentation/visible-column' },
  { slug: 'pg-mail', title: 'Mail Template', route: '/documentation/verben-mail' },
  { slug: 'pg-button-badge', title: 'Button & Badge', route: '/documentation/button-badge' },
  { slug: 'pg-input-textarea', title: 'Inputs & Validation', route: '/documentation/input-textarea' },
  { slug: 'pg-switch', title: 'Switch', route: '/documentation/switch' },
  { slug: 'pg-dropdown', title: 'Dropdown', route: '/documentation/dropdown' },
  { slug: 'pg-dropdown-sample', title: 'Dropdown (sample)', route: '/documentation/dropdown-sample' },
  { slug: 'pg-chip', title: 'Chip', route: '/documentation/chip' },
  { slug: 'pg-date-picker', title: 'Date Picker', route: '/documentation/date-picker' },
  { slug: 'pg-time-picker', title: 'Time Picker', route: '/documentation/time-picker' },
  { slug: 'pg-dialogue', title: 'Dialogue', route: '/documentation/dialogue' },
  { slug: 'pg-notifications', title: 'Notifications', route: '/documentation/notifications' },
  { slug: 'pg-tooltip', title: 'Tooltip', route: '/documentation/tooltip' },
  { slug: 'pg-icons', title: 'Icons', route: '/documentation/icons' },
  { slug: 'pg-svg', title: 'Verben Icons', route: '/documentation/svg' },
  { slug: 'pg-images', title: 'Images', route: '/documentation/images' },
];

export const DOCS_NAV: DocsNavGroup[] = [
  { title: 'Getting Started', items: GETTING_STARTED },
  { title: 'Components', items: COMPONENT_DOCS },
  { title: 'Playground', items: PLAYGROUND_PAGES },
];

/** Reading order for prev/next links (playground pages are excluded) */
export const DOCS_SEQUENCE: DocsNavItem[] = [
  ...GETTING_STARTED,
  ...COMPONENT_DOCS,
];
