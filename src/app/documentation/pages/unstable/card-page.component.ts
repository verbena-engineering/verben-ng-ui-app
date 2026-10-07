import { Component } from '@angular/core';
import { VbnTone } from 'verben-ng-ui';
import { DocsProp } from '../../docs-kit/props-table.component';

type InvoiceStatus = 'Posted' | 'Pending';

interface InvoiceLine {
  id: string;
  product: string;
  amount: number;
  status: InvoiceStatus;
}

interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  open?: boolean;
  showAll?: boolean;
}

/** A soft gradient "photo" as a PNG data URL, so the examples need no image files */
function photo(colors: string[], width = 400, height = 400): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  colors.forEach((c, i) => gradient.addColorStop(i / (colors.length - 1), c));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  // A couple of soft circles so it reads as a picture, not a flat block
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.arc(width * 0.72, height * 0.3, Math.min(width, height) * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.25, height * 0.78, Math.min(width, height) * 0.14, 0, Math.PI * 2);
  ctx.fill();
  return canvas.toDataURL('image/png');
}

interface Comment {
  author: string;
  text: string;
  time: string;
  replies?: Comment[];
}

@Component({
  selector: 'docs-unstable-card-page',
  templateUrl: './card-page.component.html',
})
export class UnstableCardPageComponent {
  // ---------- Vendor invoices (a real screen) ----------
  tone: Record<InvoiceStatus, VbnTone> = { Posted: 'success', Pending: 'warning' };

  invoices: Invoice[] = [
    {
      id: 'VIN-MXTUOE', vendor: 'Dangote', amount: 210_000_000, status: 'Posted',
      lines: [
        { id: 'VIL-85N0JB', product: 'Premium Motor Spirit', amount: 53_488_372.09, status: 'Posted' },
        { id: 'VIL-XUJZ6V', product: 'Premium Motor Spirit', amount: 111_627_906.98, status: 'Posted' },
        { id: 'VIL-Q4M2PA', product: 'Automotive Gas Oil', amount: 44_883_720.93, status: 'Posted' },
      ],
    },
    {
      id: 'VIN-2ZDH89', vendor: 'Dangote', amount: 210_000_000, status: 'Posted',
      lines: [
        { id: 'VIL-7TRW1C', product: 'Premium Motor Spirit', amount: 150_000_000, status: 'Posted' },
        { id: 'VIL-M0P2KD', product: 'Dual Purpose Kerosene', amount: 60_000_000, status: 'Posted' },
      ],
    },
    {
      id: 'VIN-2BOO9K', vendor: 'Dangote', amount: 206_250_000, status: 'Pending',
      lines: [{ id: 'VIL-HH3K8E', product: 'Automotive Gas Oil', amount: 206_250_000, status: 'Pending' }],
    },
    {
      id: 'VIN-R25V8Q', vendor: 'Dangote', amount: 177_500_000, status: 'Posted',
      lines: [{ id: 'VIL-ZP0Q4M', product: 'Premium Motor Spirit', amount: 177_500_000, status: 'Posted' }],
    },
    { id: 'VIN-V9HEKP', vendor: 'Dangote', amount: 550_000_000, status: 'Posted', lines: [] },
    { id: 'VIN-AD8Q8Q', vendor: 'Exxon Mobil', amount: 0, status: 'Pending', lines: [] },
  ];

  /** Demo only: makes three more invoices (an app would call its API) */
  loadMore(): void {
    const vendors = ['Dangote', 'Exxon Mobil', 'TotalEnergies'];
    for (let i = 0; i < 3; i++) {
      const n = this.invoices.length + 1;
      this.invoices.push({
        id: `VIN-${((n * 2_654_435_761) % 36 ** 6).toString(36).toUpperCase().padStart(6, '0')}`,
        vendor: vendors[n % vendors.length],
        amount: n * 12_500_000,
        status: n % 2 ? 'Posted' : 'Pending',
        lines: [],
      });
    }
  }

  post = {
    author: 'ada.lovelace',
    place: 'Lagos, Nigeria',
    photo: photo(['#f97316', '#db2777', '#7c3aed'], 400, 500),
    likes: '1,204',
    caption: 'Sunday market colours 🌶️',
    comments: 48,
    time: '2 hours ago',
  };

  comments: Comment[] = [
    {
      author: 'Chidi Okafor',
      text: 'This is beautiful. Which market is this?',
      time: '1h',
      replies: [{ author: 'Ada Lovelace', text: 'Balogun, early in the morning!', time: '45m' }],
    },
    { author: 'Ngozi Bello', text: 'The colours 😍', time: '30m' },
  ];

  profile = {
    name: 'Ada Lovelace',
    role: 'Product designer · Lagos',
    cover: photo(['#0ea5e9', '#6366f1', '#a855f7'], 600, 200),
    stats: [
      { value: '248', label: 'Posts' },
      { value: '12.4k', label: 'Followers' },
      { value: '312', label: 'Following' },
    ],
  };

  transactions = [
    { title: 'Salary — Verbena Logic', date: 'Oct 1 · Transfer in', amount: 850000 },
    { title: 'Shoprite Lekki', date: 'Oct 3 · Card', amount: -24350.5 },
    { title: 'MTN airtime', date: 'Oct 5 · Bills', amount: -5000 },
    { title: 'From Chidi Okafor', date: 'Oct 6 · Transfer in', amount: 15000 },
  ];
  balance = 1235649.5;

  order = {
    total: 187500,
    items: [
      { name: 'Ankara tote bag', qty: 1, price: 45000, photo: photo(['#facc15', '#f97316'], 160, 160) },
      { name: 'Leather sandals', qty: 2, price: 142500, photo: photo(['#a16207', '#78350f'], 160, 160) },
    ],
  };

  code = {
    migrate: `<!-- Before -->
<verben-card width="18rem" borderRadius="1rem" [border]="'1px solid var(--vbn-color-primary)'" bgColor="var(--vbn-color-surface)">
  …
</verben-card>

<!-- After: only the tag changed -->
<vbn-card width="18rem" borderRadius="1rem" [border]="'1px solid var(--vbn-color-primary)'" bgColor="var(--vbn-color-surface)">
  <div card-header class="filter-head">
    <b>Filter</b>
    <button type="button" class="link">Reset</button>
  </div>
  <div card-body>Status is Posted · Vendor is Dangote</div>
  <div card-footer class="filter-actions">
    <verbena-button text="Cancel" styleType="outline"></verbena-button>
    <verbena-button text="Apply" styleType="secondary"></verbena-button>
  </div>
</vbn-card>`,

    migrateCss: `/* The screen's own CSS, unchanged */
.filter-head { display: flex; align-items: center; justify-content: space-between; }
.filter-actions { display: flex; justify-content: flex-end; gap: 8px; }`,

    mixed: `<vbn-card width="22rem" pd="16px" borderRadius="1rem">
  <div card-header class="filter-head">
    <b>{{ invoice.id }}</b>
    <vbn-badge [tone]="tone[invoice.status]">{{ invoice.status }}</vbn-badge>
  </div>
  <div card-body>
    <!-- new: sub-cards, spaced automatically -->
    <vbn-card *ngFor="let line of invoice.lines" size="sm"
      [title]="line.id" [description]="'Product: ' + line.product"></vbn-card>
  </div>
  <!-- new: a footer part instead of <div card-footer> -->
  <vbn-card-footer justify="between">
    <vbn-card-description>Total</vbn-card-description>
    <vbn-amount [value]="invoice.amount" signed="false" colored="false"></vbn-amount>
  </vbn-card-footer>
</vbn-card>`,

    migrateTs: `import { CardModule, UnstableCardModule } from 'verben-ng-ui';

@NgModule({
  // Both can live side by side: move screens over one at a time
  imports: [CardModule, UnstableCardModule],
})
export class FeatureModule {}`,

    invoices: `<vbn-card class="invoices" title="Vendor invoices">
  <vbn-card-content columns="auto">
    <div class="invoice" *ngFor="let inv of invoices">
      <button type="button" class="invoice-toggle" (click)="inv.open = !inv.open"
        [attr.aria-expanded]="!!inv.open" [attr.aria-label]="(inv.open ? 'Hide' : 'Show') + ' lines of ' + inv.id">
        {{ inv.open ? '−' : '+' }}
      </button>
      <vbn-card variant="filled" size="sm">
        <vbn-card-header [title]="inv.id">
          <vbn-card-action>{{ inv.vendor }}</vbn-card-action>
        </vbn-card-header>
        <vbn-card-footer justify="between">
          <vbn-amount [value]="inv.amount" signed="false" colored="false"></vbn-amount>
          <vbn-badge [tone]="tone[inv.status]">{{ inv.status }}</vbn-badge>
        </vbn-card-footer>
        <!-- Invoice lines: cards inside the card -->
        <vbn-card-content *ngIf="inv.open">
          <vbn-card *ngFor="let line of inv.lines | slice: 0 : (inv.showAll ? undefined : 2)" size="sm">
            <vbn-card-header [title]="line.id" [description]="'Product: ' + line.product"></vbn-card-header>
            <vbn-card-footer justify="between">
              <vbn-amount [value]="line.amount" signed="false" colored="false"></vbn-amount>
              <vbn-badge [tone]="tone[line.status]">{{ line.status }}</vbn-badge>
            </vbn-card-footer>
          </vbn-card>
          <vbn-card-description *ngIf="!inv.lines.length">No lines yet</vbn-card-description>
          <button *ngIf="!inv.showAll && inv.lines.length > 2" type="button" class="link" (click)="inv.showAll = true">
            See more
          </button>
        </vbn-card-content>
      </vbn-card>
    </div>
  </vbn-card-content>
  <vbn-card-footer justify="end">
    <vbn-card-description>{{ invoices.length }} records loaded</vbn-card-description>
    <button type="button" class="link" (click)="loadMore()">Load more</button>
  </vbn-card-footer>
</vbn-card>`,

    invoicesTs: `import { VbnTone } from 'verben-ng-ui';

type Status = 'Posted' | 'Pending';

interface InvoiceLine { id: string; product: string; amount: number; status: Status; }

interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  status: Status;
  lines: InvoiceLine[];
  open?: boolean;     // lines shown
  showAll?: boolean;  // "See more" clicked
}

tone: Record<Status, VbnTone> = { Posted: 'success', Pending: 'warning' };

invoices: Invoice[] = [
  {
    id: 'VIN-MXTUOE', vendor: 'Dangote', amount: 210_000_000, status: 'Posted',
    lines: [
      { id: 'VIL-85N0JB', product: 'Premium Motor Spirit', amount: 53_488_372.09, status: 'Posted' },
      { id: 'VIL-XUJZ6V', product: 'Premium Motor Spirit', amount: 111_627_906.98, status: 'Posted' },
      { id: 'VIL-Q4M2PA', product: 'Automotive Gas Oil', amount: 44_883_720.93, status: 'Posted' },
    ],
  },
  // …
];

loadMore() {
  // Replace with your API call; this demo makes three more
}`,

    invoicesCss: `.invoices { width: 100%; --vbn-card-min-column: 260px; }

.invoice { display: flex; align-items: flex-start; gap: 6px; }
.invoice > vbn-card { flex: 1; min-width: 0; }

.invoice-toggle {
  flex: none; width: 28px; height: 28px; margin-top: 14px;
  border: 0; border-radius: 6px; background: none;
  color: inherit; font-size: 20px; line-height: 1; cursor: pointer;
}
.invoice-toggle:hover { background: var(--vbn-color-surface-alt); }

.link {
  padding: 0; border: 0; background: none; cursor: pointer;
  color: var(--vbn-color-info); font: inherit; text-decoration: underline;
}
.invoice .link { margin-top: 10px; }`,

    basic: `<vbn-card>
  <vbn-card-header title="Team plan" description="For growing teams">
    <vbn-card-action>
      <vbn-amount [value]="25000" signed="false" colored="false"></vbn-amount>
    </vbn-card-action>
  </vbn-card-header>
  <vbn-card-content>Shared workspaces, unlimited projects and priority support.</vbn-card-content>
  <vbn-card-footer justify="end">
    <verbena-button text="Cancel" styleType="outline"></verbena-button>
    <verbena-button text="Upgrade" styleType="secondary"></verbena-button>
  </vbn-card-footer>
</vbn-card>`,

    post: `<vbn-card size="sm">
  <vbn-card-header avatar [title]="post.author" [description]="post.place">
    <vbn-card-action><verben-svg icon="ellipsis-horizontal"></verben-svg></vbn-card-action>
  </vbn-card-header>
  <img vbnCardMedia ratio="4/5" [src]="post.photo" [alt]="post.caption" />
  <vbn-card-footer justify="between">
    <vbn-card-action>
      <verben-svg icon="heart"></verben-svg>
      <verben-svg icon="chat-bubble-oval-left"></verben-svg>
      <verben-svg icon="paper-airplane"></verben-svg>
    </vbn-card-action>
    <verben-svg icon="bookmark"></verben-svg>
  </vbn-card-footer>
  <vbn-card-content>
    <vbn-card-title>{{ post.likes }} likes</vbn-card-title>
    <p><b>{{ post.author }}</b> {{ post.caption }}</p>
    <vbn-card-description>View all {{ post.comments }} comments · {{ post.time }}</vbn-card-description>
  </vbn-card-content>
</vbn-card>`,

    comments: `<vbn-card title="Comments" [description]="'3 comments'">
  <vbn-card-content>
    <!-- One template, used again for the replies -->
    <ng-template #thread let-c>
      <vbn-card orientation="horizontal" variant="ghost" size="sm">
        <vbn-avatar [name]="c.author" size="sm"></vbn-avatar>
        <vbn-card-content>
          <vbn-card-title>{{ c.author }}</vbn-card-title>
          <p>{{ c.text }}</p>
          <vbn-card-description>{{ c.time }} · Like · Reply</vbn-card-description>
          <ng-container *ngFor="let r of c.replies"
            [ngTemplateOutlet]="thread" [ngTemplateOutletContext]="{ $implicit: r }"></ng-container>
        </vbn-card-content>
      </vbn-card>
    </ng-template>
    <ng-container *ngFor="let c of comments"
      [ngTemplateOutlet]="thread" [ngTemplateOutletContext]="{ $implicit: c }"></ng-container>
  </vbn-card-content>
</vbn-card>`,

    profile: `<vbn-card align="center" variant="elevated">
  <img vbnCardMedia ratio="3/1" [src]="profile.cover" alt="" />
  <vbn-avatar [name]="profile.name" size="xl" overlap></vbn-avatar>
  <vbn-card-header [title]="profile.name" [description]="profile.role"></vbn-card-header>
  <vbn-card-footer justify="around">
    <vbn-stat *ngFor="let s of profile.stats" [value]="s.value" [label]="s.label"></vbn-stat>
  </vbn-card-footer>
  <vbn-card-footer>
    <verbena-button text="Follow" styleType="secondary"></verbena-button>
    <verbena-button text="Message" styleType="outline"></verbena-button>
  </vbn-card-footer>
</vbn-card>`,

    transactions: `<vbn-card title="Recent transactions" description="October 2026">
  <vbn-card-content>
    <vbn-card *ngFor="let t of transactions" variant="ghost" size="sm">
      <vbn-card-header [title]="t.title" [description]="t.date">
        <vbn-avatar [tone]="t.amount > 0 ? 'success' : 'neutral'">
          <verben-svg [icon]="t.amount > 0 ? 'arrow-down-left' : 'arrow-up-right'"></verben-svg>
        </vbn-avatar>
        <vbn-card-action><vbn-amount [value]="t.amount"></vbn-amount></vbn-card-action>
      </vbn-card-header>
    </vbn-card>
  </vbn-card-content>
  <vbn-card-footer justify="between">
    <vbn-card-description>Available balance</vbn-card-description>
    <vbn-amount [value]="balance" signed="false" colored="false"></vbn-amount>
  </vbn-card-footer>
</vbn-card>`,

    nested: `<vbn-card title="Order #1042" description="Placed Oct 7, 2026 · Paid" variant="elevated">
  <vbn-card-content columns="2">
    <vbn-card title="Shipping to" description="12 Admiralty Way, Lekki"></vbn-card>
    <vbn-card title="Payment" description="Visa ending 4242"></vbn-card>
  </vbn-card-content>
  <vbn-card-content>
    <vbn-card title="Items" variant="filled">
      <vbn-card-content>
        <vbn-card *ngFor="let item of order.items" orientation="horizontal" size="sm">
          <img vbnCardMedia [src]="item.photo" alt="" />
          <vbn-card-content>
            <vbn-card-title>{{ item.name }}</vbn-card-title>
            <vbn-card-description>Qty {{ item.qty }}</vbn-card-description>
          </vbn-card-content>
          <vbn-amount [value]="item.price" signed="false" colored="false"></vbn-amount>
        </vbn-card>
      </vbn-card-content>
    </vbn-card>
  </vbn-card-content>
  <vbn-card-footer justify="between">
    <vbn-card-title>Total</vbn-card-title>
    <vbn-amount [value]="order.total" signed="false" colored="false"></vbn-amount>
  </vbn-card-footer>
</vbn-card>`,

    setup: `import { UnstableCardModule } from 'verben-ng-ui';

@NgModule({ imports: [UnstableCardModule] })
export class FeatureModule {}

// Standalone component instead:
// imports: [...VBN_CARD]`,
  };

  parts: DocsProp[] = [
    { name: '<vbn-card> / [vbnCard]', type: 'container', description: 'The card. Works as an element or on any tag (<article vbnCard>, <a vbnCard href>).' },
    { name: '<vbn-card-header>', type: 'grid', description: 'Avatar · title / description · action, lined up automatically.' },
    { name: '<vbn-card-title> / <vbn-card-description>', type: 'text', description: 'Heading (role="heading") and muted text. Usable anywhere.' },
    { name: '<vbn-card-action>', type: 'slot', description: 'Top-right of a header; also a handy inline group of icons or buttons.' },
    { name: '<vbn-card-content>', type: 'block', description: 'Body. Sub-cards inside are spaced; [columns] makes a grid.' },
    { name: '<vbn-card-footer>', type: 'row', description: 'Buttons, stats, totals. [justify] aligns them.' },
    { name: '[vbnCardMedia]', type: 'directive', description: 'Edge-to-edge <img>/<video>/<div>; flush with the top or bottom edge when first or last.' },
    { name: '<vbn-card-divider>', type: 'line', description: 'A separator.' },
    { name: '<vbn-avatar>', type: 'extra', description: 'Photo, initials or icon; can overlap a cover.' },
    { name: '<vbn-stat>', type: 'extra', description: 'A value with a label under it.' },
    { name: '<vbn-amount>', type: 'extra', description: 'Formatted money; + green for money in, − red for money out.' },
    { name: '<vbn-badge>', type: 'extra', description: 'Soft status pill: tone success / warning / error / info / neutral.' },
  ];

  cardInputs: DocsProp[] = [
    { name: 'variant', type: "'outline' | 'elevated' | 'filled' | 'ghost'", default: "'outline'", description: 'Border, shadow, muted background, or nothing.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and spacing. Cards inside cards are tighter automatically.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Horizontal puts children side by side (avatar + text, thumbnail + details).' },
    { name: 'align', type: "'start' | 'center'", default: "'start'", description: 'Center text, avatar and footer (profile cards).' },
    { name: 'interactive', type: 'boolean', default: 'false', description: 'Hover and focus styles for clickable cards.' },
    { name: 'title / description', type: 'string', default: '—', description: 'Shortcut that renders a header for you.' },
    { name: 'pd', type: 'string', default: '—', description: 'Same as <verben-card>: inner spacing, "16px" or "12px 20px" (vertical horizontal). Unset: from size.' },
    { name: 'mg / width / height', type: 'string', default: '—', description: 'Same as <verben-card>: margin and size.' },
    { name: 'bgColor / textColor / border / borderRadius', type: 'string', default: '—', description: 'Same as <verben-card>. Applies to this card only, not to cards inside it.' },
    { name: 'aspectRatio', type: 'number | string', default: '—', description: 'Same as <verben-card>; also takes "16:9".' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the card and blocks clicks (sets aria-disabled).' },
  ];

  /** <verben-card> → <vbn-card>, for the "Coming from" section */
  migration: DocsProp[] = [
    { name: '<verben-card>', type: 'rename', default: '<vbn-card>', description: 'The only change. When the card is promoted, <verben-card> itself becomes this card, so even that goes away.' },
    { name: 'CardModule', type: 'add', default: 'UnstableCardModule', description: 'Import it next to CardModule; old and new cards work side by side.' },
    { name: 'pd, mg, width, height, aspectRatio', type: 'same', default: '—', description: 'Same names and values. pd "50px 30px" = vertical horizontal.' },
    { name: 'bgColor, textColor, border, borderRadius', type: 'same', default: '—', description: 'Same names; or use variant and the --vbn-card-* tokens.' },
    { name: 'disabled', type: 'same', default: '—', description: 'Now visible: dims the card and blocks clicks (on <verben-card> it had no styling).' },
    { name: '[card-header] / [card-body] / [card-footer]', type: 'same', default: '—', description: 'Keep your own layout inside; header still goes first and footer last. Or use <vbn-card-header> / <vbn-card-content> / <vbn-card-footer> for the built-in layouts.' },
    { name: 'Look', type: 'changes', default: '—', description: 'No grey header/footer bars; spacing from size. Your own classes on the slots still win.' },
  ];

  headerInputs: DocsProp[] = [
    { name: 'title / description', type: 'string', default: '—', description: 'Rendered as <vbn-card-title> and <vbn-card-description>.' },
    { name: 'avatar', type: 'string | empty', default: '—', description: 'Image URL, or just `avatar` for initials from the title.' },
    { name: 'avatarSize', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of that avatar.' },
  ];

  otherInputs: DocsProp[] = [
    { name: 'vbn-card-content [columns]', type: "number | 'auto'", default: '1', description: "Grid columns for sub-cards; 'auto' fits as many as there's room for (min width --vbn-card-min-column, 240px). One column on phones." },
    { name: "vbn-card-footer [justify]", type: "'start' | 'between' | 'around' | 'center' | 'end'", default: "'start'", description: 'How footer items are spread.' },
    { name: 'vbnCardMedia [ratio]', type: 'string', default: '—', description: "Aspect ratio: '4/5', '16:9', '1'…" },
    { name: 'vbn-card-title [level]', type: 'number', default: '3', description: 'Heading level for screen readers.' },
    { name: 'vbn-avatar src / name / size / tone / overlap', type: '…', default: "— / — / 'md' / 'neutral' / false", description: 'Photo, initials source, size, tint (success / error / warning / info) and cover overlap.' },
    { name: 'vbn-badge tone', type: "'neutral' | 'success' | 'warning' | 'error' | 'info'", default: "'neutral'", description: 'Pill color, tinted from the tone.' },
    { name: 'vbn-stat value / label', type: 'string | number', default: "''", description: 'The number and the text under it.' },
    { name: 'vbn-amount value / currency / locale / signed / colored', type: '…', default: "0 / 'NGN' / browser / true / true", description: 'Money formatting and coloring.' },
  ];

  tokens: DocsProp[] = [
    { name: '--vbn-card-bg', type: 'color', default: 'surface', description: 'Card background.' },
    { name: '--vbn-card-border', type: 'color', default: 'border', description: 'Card border.' },
    { name: '--vbn-card-radius', type: 'length', default: '12px', description: 'Corner radius (nested cards use 4px less).' },
    { name: '--vbn-card-padding', type: 'length', default: '20px', description: 'Inner spacing.' },
    { name: '--vbn-card-gap', type: 'length', default: '16px', description: 'Space between parts.' },
    { name: '--vbn-card-nested-padding', type: 'length', default: '14px', description: 'Inner spacing of cards inside cards.' },
    { name: '--vbn-card-min-column', type: 'length', default: '240px', description: "Narrowest column for columns=\"auto\"." },
  ];
}
