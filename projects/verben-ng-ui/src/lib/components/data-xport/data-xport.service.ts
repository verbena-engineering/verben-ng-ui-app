import { Injectable } from '@angular/core';
import {
  ExportProfile,
  Operation,
  ExportItem,
  ExportItemType,
  ArithmeticOperation,
  StringOperation,
} from './data-xport.types';
import { ColumnDefinition } from '../data-table/data-table.types';

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
    selectedProfiles: ExportProfile[]
  ): Record<string, any>[] {
    const uniqueItems = new Set<ExportItem>();
    selectedProfiles.forEach((profile) => {
      profile.items.forEach((item) => uniqueItems.add(item));
    });

    return data.map((item) => {
      const exportedItem: Record<string, any> = {};
      uniqueItems.forEach((exportItem) => {
        if (exportItem.type === 'property') {
          const column = this.columns.find((col) => col.id === exportItem.id);
          if (column) {
            exportedItem[exportItem.name] = column.accessorFn
              ? column.accessorFn(item)
              : column.accessorKey
              ? item[column.accessorKey]
              : null;
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
