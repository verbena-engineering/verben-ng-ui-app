import { Injectable } from '@angular/core';
import { ExportProfile, Operation } from './data-export.types';

@Injectable()
export class DataExportService {
  private profiles: ExportProfile[] = [];
  private operations: Operation[] = [];

  constructor() {
    this.initializeDefaultProfile();
  }

  private initializeDefaultProfile() {
    this.profiles = [
      {
        id: 'default',
        name: 'All',
        properties: [],
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
    this.operations.push(operation);
  }

  getOperations(): Operation[] {
    return this.operations;
  }

  updateOperation(id: string, updatedOperation: Operation): void {
    const index = this.operations.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.operations[index] = updatedOperation;
    }
  }

  removeOperation(id: string): void {
    this.operations = this.operations.filter((o) => o.id !== id);
  }

  resetAll(): void {
    this.operations = [];
    this.initializeDefaultProfile();
  }

  exportData<T extends object>(
    data: T[],
    selectedProfiles: ExportProfile[]
  ): Record<string, any>[] {
    const uniqueProperties = new Set<string>();
    selectedProfiles.forEach((profile) => {
      profile.properties.forEach((prop) => uniqueProperties.add(prop));
    });

    return data.map((item) => {
      const exportedItem: Record<string, any> = {};
      uniqueProperties.forEach((prop) => {
        if (prop in item) {
          exportedItem[prop] = (item as any)[prop];
        } else {
          const operation = this.operations.find((o) => o.name === prop);
          if (operation) {
            exportedItem[prop] = this.calculateOperation(item, operation);
          }
        }
      });
      return exportedItem;
    });
  }

  private calculateOperation<T>(item: T, operation: Operation): number {
    const value1 = Number((item as any)[operation.field1]);
    const value2 = Number((item as any)[operation.field2]);
    switch (operation.operator) {
      case 'add':
        return value1 + value2;
      case 'subtract':
        return value1 - value2;
      case 'multiply':
        return value1 * value2;
      case 'divide':
        return value2 !== 0 ? value1 / value2 : NaN;
      default:
        return NaN;
    }
  }

  updateDefaultProfile(properties: string[]): void {
    this.profiles[0].properties = properties;
  }
}
