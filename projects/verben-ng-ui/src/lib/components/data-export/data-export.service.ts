import { Injectable } from '@angular/core';
import {
  ExportProfile,
  Operation,
  ExportItem,
  ExportItemType,
  Operators,
} from './data-export.types';

@Injectable()
export class DataExportService {
  private profiles: ExportProfile[] = [];
  private operations: Operation[] = [];
  private baseProperties: string[] = [];

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
    this.baseProperties = [];
    this.initializeDefaultProfile();
  }

  getAllItems(): ExportItem[] {
    return [
      ...this.operations.map((op) => ({
        id: op.id,
        name: op.name,
        type: 'operation' as ExportItemType,
      })),
      ...this.baseProperties.map((prop) => ({
        id: prop,
        name: prop,
        type: 'property' as ExportItemType,
      })),
    ];
  }

  getBaseProperties(): string[] {
    return this.baseProperties;
  }

  setBaseProperties(properties: string[]): void {
    this.baseProperties = properties;
    this.updateDefaultProfile();
  }

  private updateDefaultProfile(): void {
    this.profiles[0].items = this.getAllItems();
  }

  exportData<T>(
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
          exportedItem[exportItem.id] = (item as any)[exportItem.id];
        } else {
          const operation = this.operations.find((o) => o.id === exportItem.id);
          if (operation) {
            exportedItem[exportItem.id] = this.calculateOperation(
              item,
              operation
            );
          }
        }
      });
      return exportedItem;
    });
  }

  private calculateOperation<T>(
    item: T,
    operation: Operation
  ): number | string {
    const value1 = Number((item as any)[operation.field1]);
    const value2 = Number((item as any)[operation.field2]);
    switch (operation.operator) {
      case Operators.add:
        return value1 + value2;
      case Operators.subtract:
        return value1 - value2;
      case Operators.multiply:
        return value1 * value2;
      case Operators.divide:
        return value2 !== 0 ? value1 / value2 : NaN;
      case Operators.concatenateSpace:
        return `${value1} ${value2}`;
      case Operators.concatenateCommaSpace:
        return `${value1}, ${value2}`;
      case Operators.concatenateComma:
        return `${value1},${value2}`;
      default:
        return NaN;
    }
  }
}
