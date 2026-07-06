import { Injectable } from '@angular/core';
import {
  ExportProfile,
  Operation,
  ExportItem,
  ExportItemType,
  ArithmeticOperation,
  StringOperation,
} from './data-xport.types';
import {
  ColumnDefinition,
  computeColumnFooter,
} from 'verben-ng-ui/src/lib/components/data-table';
import { isPrintableValue } from './data-xport.utils';

@Injectable()
export class DataXportService<T> {
  private profiles: ExportProfile[] = [];
  private operations: Operation[] = [];
  private columns: ColumnDefinition<T>[] = [];

  constructor() {
    this.initializeDefaultProfile();
  }

  private initializeDefaultProfile() {
    this.profiles = [
      {
        id: 'default',
        name: 'All',
        items: [],
      },
    ];
  }

  setColumns(columns: ColumnDefinition<T>[]) {
    this.columns = columns;
    this.updateDefaultProfile();
  }

  getColumns(): ColumnDefinition<T>[] {
    return this.columns;
  }

  addProfile(profile: ExportProfile): void {
    this.profiles.push(profile);
  }

  getProfiles(): ExportProfile[] {
    return this.profiles;
  }

  updateProfile(id: string, updatedProfile: ExportProfile): void {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.profiles[index] = updatedProfile;
    }
  }

  removeProfile(id: string): void {
    this.profiles = this.profiles.filter((p) => p.id !== id);
  }

  addOperation(operation: Operation): void {
    this.operations.unshift(operation);
    this.updateDefaultProfile();
  }

  getOperations(): Operation[] {
    return this.operations;
  }

  updateOperation(id: string, updatedOperation: Operation): void {
    const index = this.operations.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.operations[index] = updatedOperation;
      this.updateDefaultProfile();
    }
  }

  removeOperation(id: string): void {
    this.operations = this.operations.filter((o) => o.id !== id);
    this.updateDefaultProfile();
    // Remove operation from all profiles
    this.profiles.forEach((profile) => {
      profile.items = profile.items.filter((item) => item.id !== id);
    });
  }

  resetAll(): void {
    this.operations = [];
    this.columns = [];
    this.initializeDefaultProfile();
  }

  getAllItems(): ExportItem[] {
    return [
      ...this.operations.map((op) => ({
        id: op.id,
        name: op.name,
        exportKey: op.name,
        type: 'operation' as ExportItemType,
      })),
      ...this.columns.map((col) => ({
        id: col.id,
        name: col.header instanceof Function ? col.header({}) : col.header,
        exportKey: col.header instanceof Function ? col.header({}) : col.header,
        type: 'property' as ExportItemType,
      })),
    ];
  }

  exportData(
    data: T[],
    selectedProfiles: ExportProfile[],
    useImportKey: boolean = false,
    includeFooter: boolean = true
  ): Record<string, any>[] {
    const uniqueItems = new Set<ExportItem>();
    selectedProfiles.forEach((profile) => {
      profile.items.forEach((item) => uniqueItems.add(item));
    });

    // console.log('ITEMSSS', Array.from(uniqueItems));
    // console.log('DATAAA', Array.from(data));

    const records = data.map((item) => {
      const exportedItem: Record<string, any> = {};
      uniqueItems.forEach((exportItem) => {
        if (exportItem.type === 'property') {
          const column = this.columns.find((col) => col.id === exportItem.id);
          if (column) {
            // exportedItem[exportItem.name] = column.accessorFn
            //   ? column.accessorFn(item)
            //   : column.accessorKey
            //   ? item[column.accessorKey]
            //   : null;

            if (
              column.accessorKey &&
              isPrintableValue(item[column.accessorKey])
            ) {
              exportedItem[exportItem.name] = item[column.accessorKey];
            } else if (
              column.accessorFn &&
              isPrintableValue(column.accessorFn(item))
            ) {
              exportedItem[exportItem.name] = column.accessorFn(item);
            } else if (
              useImportKey &&
              column.importKey &&
              isPrintableValue(item[column.importKey])
            ) {
              exportedItem[exportItem.name] = item[column.importKey];
            } else {
              // Export null/undefined cells as empty rather than literal null.
              exportedItem[exportItem.name] = '';
            }
          }
        } else {
          const operation = this.operations.find((o) => o.id === exportItem.id);
          if (operation) {
            exportedItem[exportItem.name] = this.calculateOperation(
              item,
              operation
            );
          }
        }
      });
      return exportedItem;
    });

    if (includeFooter) {
      const footerRow = this.getFooterRow(data, uniqueItems);
      if (footerRow) {
        records.push(footerRow);
      }
    }

    this.downloadCSV(records);
    return records;
  }

  /**
   * Builds a single footer/summary row aligned with the exported columns. Each
   * exported item gets a key (blank by default) so the CSV stays column-aligned;
   * property columns that define a simple `footerFn` or a richer `footer` config
   * receive the computed value. A `footer` config can opt out via
   * `includeInExport: false`; `footerFn`-only columns are always included.
   * Returns `null` when no column contributes a footer.
   */
  getFooterRow(
    data: T[],
    items: Set<ExportItem> | ExportItem[]
  ): Record<string, any> | null {
    const uniqueItems = new Set<ExportItem>(items);

    const footerRow: Record<string, any> = {};
    let hasFooter = false;

    uniqueItems.forEach((item) => {
      footerRow[item.name] = '';

      if (item.type !== 'property') return;

      const column = this.columns.find((col) => col.id === item.id);
      if (!column || (!column.footer && !column.footerFn)) return;
      if (column.footer?.includeInExport === false) return;

      const value = computeColumnFooter(column, data);
      // Fall back to the label (or empty) so footer cells never carry null.
      footerRow[item.name] = value ?? column.footer?.label ?? '';
      hasFooter = true;
    });

    return hasFooter ? footerRow : null;
  }

  downloadCSV(data: Partial<any>[]) {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => row[header])
          .map((datum) => `"${datum}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private calculateOperation(item: T, operation: Operation): number | string {
    const column1 = this.columns.find((col) => col.id === operation.field1);
    const column2 = this.columns.find((col) => col.id === operation.field2);

    if (!column1 || !column2) return '';

    const value1 = column1.accessorFn
      ? column1.accessorFn(item)
      : column1.accessorKey
      ? item[column1.accessorKey]
      : '';

    const value2 = column2.accessorFn
      ? column2.accessorFn(item)
      : column2.accessorKey
      ? item[column2.accessorKey]
      : '';

    if (operation.type === 'arithmetic') {
      const num1 = Number(value1);
      const num2 = Number(value2);

      switch (operation.operator) {
        case 'add':
          return num1 + num2;
        case 'subtract':
          return num1 - num2;
        case 'multiply':
          return num1 * num2;
        case 'divide':
          return num2 !== 0 ? num1 / num2 : NaN;
      }
    } else {
      return `${value1}${operation.joinBy}${value2}`;
    }
  }

  private updateDefaultProfile(): void {
    this.profiles[0].items = this.getAllItems();
  }
}
