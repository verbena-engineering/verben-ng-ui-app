import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

type Status = 'Posted' | 'Pending';

@Component({
  selector: 'docs-card-page',
  templateUrl: './card-page.component.html',
})
export class CardPageComponent {
  invoices: { id: string; vendor: string; amount: number; status: Status }[] = [
    { id: 'VIN-MXTUOE', vendor: 'Dangote', amount: 210_000_000, status: 'Posted' },
    { id: 'VIN-2BOO9K', vendor: 'Dangote', amount: 206_250_000, status: 'Pending' },
    { id: 'VIN-AD8Q8Q', vendor: 'Exxon Mobil', amount: 0, status: 'Pending' },
  ];
  selectedId = 'VIN-MXTUOE';
  badge: Record<Status, { bg: string; fg: string }> = {
    Posted: { bg: 'color-mix(in srgb, var(--vbn-color-success) 14%, transparent)', fg: 'var(--vbn-color-success)' },
    Pending: { bg: 'color-mix(in srgb, var(--vbn-color-warning) 16%, transparent)', fg: 'var(--vbn-color-warning)' },
  };

  code = {
    basic: `<verben-card
  width="340px"
  pd="20px"
  bgColor="var(--vbn-color-surface)"
  border="1px solid var(--vbn-color-border)"
  borderRadius="10px"
>
  <div card-header>
    <h3>Invoice INV-0042</h3>
    <p>Issued 2 Oct 2026</p>
  </div>
  <div card-body>
    <p>₦ 250,000</p>
  </div>
  <div card-footer>
    <verbena-button text="View" styleType="outline"></verbena-button>
    <verbena-button text="Pay now" styleType="secondary"></verbena-button>
  </div>
</verben-card>`,

    simple: `<verben-card width="260px" pd="16px" bgColor="var(--vbn-color-surface-alt)" borderRadius="8px">
  <div card-body>Only a body slot.</div>
</verben-card>`,

    disabled: `<verben-card width="260px" pd="16px" border="1px solid var(--vbn-color-border)"
  borderRadius="8px" [disabled]="true">
  <div card-body>This card is disabled.</div>
</verben-card>`,

    heading: `<verben-card width="280px" heading="Shipping to" subheading="12 Admiralty Way, Lekki">
  <div card-body>Delivery on Thursday, 9 Oct.</div>
</verben-card>`,

    plain: `<verben-card width="280px" variant="plain" heading="Team plan" subheading="For growing teams">
  <div card-body>Shared workspaces, unlimited projects and priority support.</div>
  <div card-footer class="row">
    <b>₦25,000 / month</b>
    <verbena-button text="Upgrade" styleType="secondary" size="sm"></verbena-button>
  </div>
</verben-card>

<!-- .row { display: flex; align-items: center; justify-content: space-between; } -->`,

    media: `<verben-card width="280px" variant="plain">
  <div card-header class="row">
    <b>Sunday market</b>
    <span>Lagos</span>
  </div>
  <img card-media src="market.jpg" alt="Market stall" />
  <div card-body>Peppers, tomatoes and ata rodo, fresh this morning.</div>
</verben-card>`,

    list: `<verben-card
  *ngFor="let inv of invoices"
  variant="plain"
  interactive
  [selected]="inv.id === selectedId"
  (click)="selectedId = inv.id"
  (keydown.enter)="selectedId = inv.id"
>
  <div card-header class="row">
    <b>{{ inv.id }}</b>
    <span>{{ inv.vendor }}</span>
  </div>
  <div card-footer class="row">
    <span>{{ inv.amount | currency: 'NGN' : 'symbol-narrow' }}</span>
    <verbena-badge [text]="inv.status" [bgColor]="badge[inv.status].bg"
      [textColor]="badge[inv.status].fg" pd="2px 10px" fontSize="12px"></verbena-badge>
  </div>
</verben-card>`,

    listTs: `type Status = 'Posted' | 'Pending';

invoices = [
  { id: 'VIN-MXTUOE', vendor: 'Dangote', amount: 210_000_000, status: 'Posted' as Status },
  { id: 'VIN-2BOO9K', vendor: 'Dangote', amount: 206_250_000, status: 'Pending' as Status },
];
selectedId = 'VIN-MXTUOE';

// Soft status pill colors for verbena-badge
badge: Record<Status, { bg: string; fg: string }> = {
  Posted: { bg: 'color-mix(in srgb, var(--vbn-color-success) 14%, transparent)', fg: 'var(--vbn-color-success)' },
  Pending: { bg: 'color-mix(in srgb, var(--vbn-color-warning) 16%, transparent)', fg: 'var(--vbn-color-warning)' },
};`,

    nested: `<verben-card width="320px" heading="Order #1042" subheading="Placed 7 Oct 2026 · Paid">
  <div card-body class="stack">
    <verben-card variant="plain" pd="4px" heading="Shipping to" subheading="12 Admiralty Way, Lekki"></verben-card>
    <verben-card variant="plain" pd="4px" heading="Payment" subheading="Visa ending 4242"></verben-card>
  </div>
  <div card-footer class="row">
    <b>Total</b>
    <b>{{ 98500 | currency: 'NGN' : 'symbol-narrow' }}</b>
  </div>
</verben-card>

<!-- .stack { display: grid; gap: 10px; } -->`,
  };

  inputs: DocsProp[] = [
    { name: 'pd / mg', type: 'string', default: "'10px' / '0px'", description: 'Padding and margin.' },
    { name: 'width / height', type: 'string', default: '—', description: 'Size.' },
    { name: 'aspectRatio', type: 'number', default: '—', description: 'Keep a fixed ratio, e.g. 1.5.' },
    { name: 'bgColor / textColor / border / borderRadius', type: 'string', default: '—', description: 'Styling.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: "Adds the 'disable' class (no built-in style)." },
    { name: 'heading / subheading', type: 'string', default: '—', description: 'New: a header without markup (shown after any card-header content).' },
    { name: 'variant', type: "'default' | 'plain'", default: "'default'", description: 'New: plain drops the grey header and footer bars.' },
    { name: 'interactive', type: 'boolean', default: 'false', description: 'New: pointer, hover and keyboard focus (the card becomes focusable). Bind (click) / (keydown.enter) as usual.' },
    { name: 'selected', type: 'boolean', default: 'false', description: 'New: accent strip on the left, e.g. the item whose details are open.' },
  ];

  slots: DocsProp[] = [
    { name: '[card-header]', type: 'attribute', description: 'Top section.' },
    { name: '[card-media]', type: 'attribute', description: 'New: image, video or any element, edge to edge over the padding.' },
    { name: '[card-body]', type: 'attribute', description: 'Main content.' },
    { name: '[card-footer]', type: 'attribute', description: 'Bottom section, e.g. actions.' },
  ];
}
