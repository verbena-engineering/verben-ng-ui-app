import { Component } from '@angular/core';
import { CardData, CardHoverAction, CardHoverActionsPosition } from 'verben-ng-ui';

interface Truck {
  Code: string;
  DriverName?: string;
  TotalCapacity?: number;
  DataState: 'New' | 'Saved';
}

interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  state: 'Draft' | 'Posted';
}

const toCard = (inv: Invoice): CardData => ({
  selected: false,
  title: inv.id,
  body: [],
  children: [],
  data: inv,
});

const truckCard = (t: Truck): CardData => ({ selected: false, title: t.Code, body: [], children: [], data: t });

@Component({
  selector: 'app-card-hover-actions-demo',
  templateUrl: './card-hover-actions-demo.component.html',
  styleUrl: './card-hover-actions-demo.component.css',
})
export class CardHoverActionsDemoComponent {
  // ---- 0. Like the White360FE trucks list ----
  trucks: CardData[] = [
    { Code: 'FJE3F4O', DriverName: 'Jecil', TotalCapacity: 33000, DataState: 'Saved' as const },
    { Code: '', DataState: 'New' as const }, // an unsaved truck: N/A, Unassigned, can be deleted
    { Code: 'BUSTRK001', DriverName: 'Tayo', TotalCapacity: 500000, DataState: 'Saved' as const },
    { Code: 'KJA-482XY', DriverName: 'Amaka', TotalCapacity: 45000, DataState: 'Saved' as const },
  ].map((t, i) => ({ ...truckCard(t), selected: i === 0 })); // the first one open, as on the screen

  constructor() {
    // Sub cards: the first truck's compartments, shown expanded
    const first = this.trucks[0];
    first.isChildrenExpanded = true;
    first.children = [
      { selected: false, title: 'Compartment 1', body: [], children: [], data: { Position: 1, Capacity: 11000 } },
      { selected: false, title: 'Compartment 2', body: [], children: [], data: { Position: 2, Capacity: 22000 } },
    ];
  }

  // Child cards get their own buttons (without [cardChildActions] they'd use truckActions)
  readonly compartmentActions: CardHoverAction[] = [
    {
      id: 'remove',
      label: 'Remove compartment',
      icon: 'delete',
      iconSize: 13,
      onSelect: (child) => {
        const parent = this.trucks.find((t) => t.children.includes(child));
        if (parent) parent.children = parent.children.filter((c) => c !== child);
        this.truckLog = `removed ${child.title}`;
      },
    },
  ];
  truckLog = '';
  private truckCopies = 0;

  // As in truck.component.ts: copy on every truck, delete on unsaved ones
  readonly truckActions: CardHoverAction[] = [
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'copy', // this app's public/assets/icons/copy.svg (White360FE ships the same file)
      iconSize: 15,
      onSelect: (card) => this.duplicateTruck(card),
    },
    {
      id: 'delete',
      label: 'Delete draft',
      icon: 'delete', // the library's red delete icon, kept red
      iconSize: 15,
      canView: (card) => card.data.DataState === 'New',
      onSelect: (card) => {
        this.trucks = this.trucks.filter((c) => c !== card);
        this.truckLog = `deleted ${card.data.Code || 'the unsaved truck'}`;
      },
    },
  ];

  selectTruck(card: CardData): void {
    this.trucks.forEach((c) => (c.selected = c === card));
    this.truckLog = `selected ${card.data.Code || 'the unsaved truck'}`;
  }

  capacity(t: Truck): string {
    return t.TotalCapacity ? `${t.TotalCapacity} L` : 'N/A';
  }

  private duplicateTruck(card: CardData): void {
    // An unsaved copy right below, opened (selected) like the trucks screen does
    const copy = truckCard({ ...card.data, Code: `${card.data.Code || 'TRUCK'}-${++this.truckCopies}`, DataState: 'New' });
    const at = this.trucks.indexOf(card) + 1;
    this.trucks = [...this.trucks.slice(0, at), copy, ...this.trucks.slice(at)];
    this.selectTruck(copy);
    this.truckLog = `duplicated ${card.data.Code || 'the unsaved truck'}`;
  }

  // ---- 1. In a card list: [cardActions] on <verben-left-card-data> ----
  cards: CardData[] = [
    { id: 'VIN-MXTUOE', vendor: 'Dangote', amount: 210_000, state: 'Posted' as const },
    { id: 'VIN-2BOO9K', vendor: 'Exxon Mobil', amount: 86_250, state: 'Draft' as const },
    { id: 'VIN-AD8Q8Q', vendor: 'Total Energies', amount: 12_400, state: 'Posted' as const },
    { id: 'VIN-7PQ2LM', vendor: 'Oando', amount: 48_900, state: 'Draft' as const },
  ].map(toCard);
  log: string[] = [];
  private copies = 0;

  // A field, not an inline literal: the same array on every check
  readonly invoiceActions: CardHoverAction[] = [
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'document-duplicate', // the app's own public/assets/icons/document-duplicate.svg
      onSelect: (card) => this.duplicate(card),
    },
    {
      id: 'delete',
      label: 'Delete draft',
      icon: 'trash', // the library's icon set
      class: 'danger',
      canView: (card) => card.data.state === 'Draft', // drafts only
      onSelect: (card) => this.remove(card),
    },
  ];

  select(card: CardData): void {
    this.cards.forEach((c) => (c.selected = c === card));
    this.note(`selected ${card.data.id}`);
  }

  private duplicate(card: CardData): void {
    const copy = toCard({ ...card.data, id: `${card.data.id}-COPY${++this.copies}`, state: 'Draft' });
    const at = this.cards.indexOf(card) + 1;
    this.cards = [...this.cards.slice(0, at), copy, ...this.cards.slice(at)];
    this.note(`duplicated ${card.data.id}`);
  }

  private remove(card: CardData): void {
    this.cards = this.cards.filter((c) => c !== card);
    this.note(`deleted ${card.data.id}`);
  }

  private note(text: string): void {
    this.log = [text, ...this.log].slice(0, 4);
  }

  // ---- 2. Text-only actions and the position ----
  readonly positions: CardHoverActionsPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
  position: CardHoverActionsPosition = 'top-left';
  alwaysVisible = false;
  minimized = false;
  cancelled = false;
  readonly windowCard = toCard({ id: 'UPLOAD-1', vendor: 'Upload queue', amount: 0, state: 'Draft' });
  readonly windowActions: CardHoverAction[] = [
    { id: 'minimize', label: 'Minimize', onSelect: () => (this.minimized = !this.minimized) },
    { id: 'cancel', label: 'Cancel', class: 'danger', onSelect: () => (this.cancelled = true) },
  ];
  lastEvent = '';

  // ---- 3. Theming ----
  starred = false;
  readonly themedCard = toCard({ id: 'THEME-1', vendor: 'Themed', amount: 0, state: 'Posted' });
  readonly themedActions: CardHoverAction[] = [
    // iconColor 'currentColor': the icons follow --card-action-color (white here)
    { id: 'duplicate', label: 'Duplicate', icon: 'document-duplicate', iconColor: 'currentColor' },
    { id: 'edit', label: 'Edit', icon: 'pencil', iconColor: 'currentColor' },
  ];
}
