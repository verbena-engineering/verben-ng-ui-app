import { Injectable, signal, WritableSignal } from '@angular/core';
import { read, utils, writeFile } from 'xlsx';
import { ColumnDefinition } from '../data-table/data-table.types';

@Injectable()
export class DataImportService<T> {
  importedData: WritableSignal<T[]> = signal([]);

  constructor() {}

  // Function to transform imported data to match your model structure
  transformImportData<T>(
    importedData: Record<string, any>[],
    columnDefinitions: ColumnDefinition<T>[]
  ): Partial<T>[] {
    // Create a mapping from header to importKey
    const headerToImportKeyMap = new Map<string, keyof T>();

    // Filter column definitions to only those with importKey and populate the map
    columnDefinitions
      .filter((col) => col.importKey)
      .forEach((col) => {
        const header =
          typeof col.header === 'string'
            ? col.header
            : col.header({}).toString();
        headerToImportKeyMap.set(header, col.importKey as keyof T);
      });

    // Transform each row in the imported data
    return importedData.map((row) => {
      const transformedRow: Partial<T> = {};

      // Process each key in the row
      Object.entries(row).forEach(([key, value]) => {
        // Find the corresponding import key for this header/key
        const importKey = headerToImportKeyMap.get(key);

        // Only add the field if there's a matching import key
        if (importKey) {
          transformedRow[importKey] = value;
        }
      });

      return transformedRow;
    });
  }

  handleImport(
    file: File,
    // previewer?: (data: any[]) => void,
    columnDefinitions: ColumnDefinition<T>[],
    parseImport?: (data: any) => Partial<T>[]
  ) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // const wb = read(event.target.result, {
      //   type: 'string',
      //   raw: true,
      //   cellText: true,
      //   cellFormula: false,
      //   cellNF: false,
      // });
      console.time('Begin');
      let imported: any[] = [];
      const wb = read(event.target.result, { raw: true });
      const sheets = wb.SheetNames;
      if (sheets.length) {
        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
          raw: false,
          // defval: '',
          // rawNumbers: true,
          // dateNF: 'dd/mm/yyyy',
        });
        if (parseImport) {
          imported = parseImport(rows);
        } else {
          imported = rows as any[];
        }
        // previewer(imported);
      }
      // console.log('Imported data:', JSON.stringify(imported, null, 2));
      // console.time('Start Process');
      this.importedData.set(
        this.transformImportData(imported, columnDefinitions) as T[]
      );
      console.timeEnd('Begin');
      return imported;
    };
    return reader.readAsArrayBuffer(file);
  }

  handleTemplateExport(fields: string[], title: string) {
    console.log(fields);
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, [fields]);
    // utils.sheet_add_json(ws, this._data, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, title);
    writeFile(wb, title + '-template.' + 'xlsx');
  }

  addRow(event: { index: number; key: string | number; data: Partial<T> }) {
    // console.log(event);
    this.importedData.update((dat) => {
      // dat[event.index] = { ...dat[event.index], ...event.data };
      return dat.map((d, i) => {
        if (i === event.index) {
          return { ...d, ...event.data };
        }
        return d;
      });
    });
    // console.log(this.importedData());
  }

  isDuplicate(datum: Partial<T>, array: Partial<T>[], identifiers: string[]) {
    return (
      array.filter(
        (dat) =>
          identifiers.length > 0 &&
          identifiers.every(
            (identifier) =>
              datum[identifier as keyof T] &&
              datum[identifier as keyof T] === dat[identifier as keyof T]
          )
      ).length > 1
    );
  }
}
