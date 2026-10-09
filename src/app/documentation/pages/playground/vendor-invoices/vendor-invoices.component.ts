import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VbnTone } from 'verben-ng-ui';

/*
 * Vendor Invoices: the same screen as the app's, built from the unstable
 * composable card (UnstableCardModule) inside the existing <verben-data-view>
 * toolbar. Data is generated here; a real screen would call its API in
 * loadMore() / search() and save().
 */

export type InvoiceStatus = 'Posted' | 'Pending';
export type InvoiceSort = 'newest' | 'amount-desc' | 'amount-asc' | 'vendor';

export interface InvoiceLine {
  id: string;
  product: string;
  litres: number;
  amount: number;
  status: InvoiceStatus;
}

export interface Invoice {
  id: string;
  vendor: string;
  date: string; // "2026-10-07"
  status: InvoiceStatus;
  lines: InvoiceLine[];
  /** Sum of the lines, set by refresh() so the template never adds them up */
  total: number;
  /** Lines shown under the card */
  open?: boolean;
}

const VENDORS = ['Dangote', 'Exxon Mobil', 'TotalEnergies', 'Conoil', 'Oando', 'NNPC Retail'];
const PRODUCTS = ['Premium Motor Spirit', 'Automotive Gas Oil', 'Dual Purpose Kerosene', 'Aviation Turbine Kerosene'];
const PAGE_SIZE = 9;

@Component({
  selector: 'app-vendor-invoices',
  templateUrl: './vendor-invoices.component.html',
  styleUrls: ['./vendor-invoices.component.css'],
  // Checked only when its inputs, its events or its async results change,
  // not on every click anywhere in the app
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorInvoicesComponent {
  readonly statuses: InvoiceStatus[] = ['Posted', 'Pending'];
  readonly vendors = VENDORS;
  readonly tone: Record<InvoiceStatus, VbnTone> = { Posted: 'success', Pending: 'warning' };
  readonly sorts: { value: InvoiceSort; label: string }[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'amount-desc', label: 'Amount, high to low' },
    { value: 'amount-asc', label: 'Amount, low to high' },
    { value: 'vendor', label: 'Vendor, A to Z' },
  ];

  private all: Invoice[] = makeInvoices(37);

  // Toolbar state
  query = '';
  shownStatuses: Record<InvoiceStatus, boolean> = { Posted: true, Pending: true };
  vendor = '';
  sort: InvoiceSort = 'newest';
  creating = false;
  newInvoice = { vendor: VENDORS[0], amount: null as number | null }; // null = empty field

  // List state
  loaded = PAGE_SIZE;
  visible: Invoice[] = [];
  matching = 0;
  filterCount = 0;

  // Detail panel: an invoice, or one of its lines
  selected: Invoice | null = null;
  selectedLine: InvoiceLine | null = null;
  draft = { vendor: '', product: '', amount: 0, status: 'Pending' as InvoiceStatus };

  constructor() {
    this.refresh();
  }

  private sumLines(invoice: Invoice): number {
    return invoice.lines.reduce((sum, line) => sum + line.amount, 0);
  }

  // ---------- Toolbar ----------

  /** The toolbar opened or closed a popover; we only track "Create New" */
  onToolbar(change: { key: string; value: boolean }): void {
    if (change.key === 'create') this.creating = change.value;
  }

  search(text: string): void {
    this.query = text.trim().toLowerCase();
    this.loaded = PAGE_SIZE;
    this.refresh();
  }

  resetFilters(): void {
    this.shownStatuses = { Posted: true, Pending: true };
    this.vendor = '';
    this.refresh();
  }

  create(): void {
    const invoice: Invoice = {
      id: newId('VIN', this.all.length + 101),
      vendor: this.newInvoice.vendor,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      lines: [],
      total: 0,
    };
    const amount = this.newInvoice.amount ?? 0;
    if (amount > 0) {
      invoice.lines.push({
        id: newId('VIL', this.all.length + 701),
        product: PRODUCTS[0],
        litres: Math.round(amount / 950),
        amount,
        status: 'Pending',
      });
    }
    this.all.unshift(invoice);
    this.newInvoice = { vendor: VENDORS[0], amount: null };
    this.creating = false;
    this.refresh();
    this.select(invoice);
  }

  // ---------- List ----------

  loadMore(): void {
    this.loaded += PAGE_SIZE;
    this.refresh();
  }

  byId(_: number, item: { id: string }): string {
    return item.id;
  }

  // ---------- Detail ----------

  select(invoice: Invoice, line: InvoiceLine | null = null): void {
    this.selected = invoice;
    this.selectedLine = line;
    this.draft = {
      vendor: invoice.vendor,
      product: line?.product ?? '',
      amount: line ? line.amount : invoice.total,
      status: line?.status ?? invoice.status,
    };
  }

  close(): void {
    this.selected = null;
    this.selectedLine = null;
  }

  save(): void {
    if (!this.selected) return;
    if (this.selectedLine) {
      Object.assign(this.selectedLine, {
        product: this.draft.product,
        amount: this.draft.amount,
        status: this.draft.status,
      });
    } else {
      this.selected.vendor = this.draft.vendor;
      this.selected.status = this.draft.status;
    }
    this.refresh();
  }

  remove(): void {
    if (!this.selected) return;
    if (this.selectedLine) {
      this.selected.lines = this.selected.lines.filter((l) => l !== this.selectedLine);
      this.select(this.selected);
    } else {
      this.all = this.all.filter((i) => i !== this.selected);
      this.close();
    }
    this.refresh();
  }

  /** Recomputes what the template shows (never in a getter, so no work on every check) */
  refresh(): void {
    for (const invoice of this.all) invoice.total = this.sumLines(invoice);
    const q = this.query;
    const matches = this.all.filter(
      (i) =>
        this.shownStatuses[i.status] &&
        (!this.vendor || i.vendor === this.vendor) &&
        (!q || `${i.id} ${i.vendor} ${i.lines.map((l) => `${l.id} ${l.product}`).join(' ')}`.toLowerCase().includes(q)),
    );
    const sorted = [...matches].sort((a, b) => {
      switch (this.sort) {
        case 'amount-desc':
          return b.total - a.total;
        case 'amount-asc':
          return a.total - b.total;
        case 'vendor':
          return a.vendor.localeCompare(b.vendor);
        default:
          return b.date.localeCompare(a.date);
      }
    });
    this.matching = sorted.length;
    this.visible = sorted.slice(0, this.loaded);
    this.filterCount = this.statuses.filter((s) => !this.shownStatuses[s]).length + (this.vendor ? 1 : 0);
  }
}

// ---------- Demo data (a real screen gets this from its API) ----------

function newId(prefix: string, seed: number): string {
  return `${prefix}-${((seed * 2_654_435_761) % 36 ** 6).toString(36).toUpperCase().padStart(6, '0')}`;
}

function makeInvoices(count: number): Invoice[] {
  return Array.from({ length: count }, (_, i) => {
    const lines = Array.from({ length: (i * 7) % 4 }, (_, j) => {
      const litres = 20_000 + ((i * 37 + j * 53) % 40) * 2_500;
      return {
        id: newId('VIL', i * 10 + j + 1),
        product: PRODUCTS[(i + j) % PRODUCTS.length],
        litres,
        amount: litres * (880 + ((i + j) % 5) * 35),
        status: (i + j) % 3 ? 'Posted' : 'Pending',
      } as InvoiceLine;
    });
    const day = new Date(2026, 9, 7 - i);
    return {
      id: newId('VIN', i + 1),
      vendor: VENDORS[(i * 5) % VENDORS.length],
      date: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`,
      status: i % 4 === 2 ? 'Pending' : 'Posted',
      lines,
      total: 0,
    };
  });
}
