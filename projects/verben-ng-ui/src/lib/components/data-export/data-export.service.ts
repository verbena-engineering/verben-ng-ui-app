import { Injectable } from '@angular/core';
import { ExportProfile } from './data-export.types';

@Injectable()
export class DataExportService {
  private profiles: ExportProfile[] = [];

  constructor() {}

  addProfile(profile: ExportProfile): void {
    this.profiles.push(profile);
  }

  getProfiles(): ExportProfile[] {
    return this.profiles;
  }

  exportData<T extends object>(
    data: T[],
    selectedProfiles: ExportProfile[]
  ): Partial<T>[] {
    const uniqueProperties = new Set<string>();
    selectedProfiles.forEach((profile) => {
      profile.properties.forEach((prop) => uniqueProperties.add(prop));
    });

    return data.map((item) => {
      const exportedItem: Partial<T> = {};
      uniqueProperties.forEach((prop) => {
        if (prop in item) {
          exportedItem[prop as keyof T] = item[prop as keyof T];
        }
      });
      return exportedItem;
    });
  }
}
