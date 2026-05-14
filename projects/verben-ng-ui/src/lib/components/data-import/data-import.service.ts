import { Injectable, signal, WritableSignal } from '@angular/core';
import { ColumnDefinition } from 'verben-ng-ui/src/lib/components/data-table';
import { read, utils, writeFile } from 'xlsx';

@Injectable()
export class DataImportService<T> {
  importedData: WritableSignal<T[]> = signal([]);

  constructor() {}

  // Function to transform imported data to match your model structure
  transformImportData<T>(
    importedData: Record<string, any>[],
    columnDefinitions: ColumnDefinition<T>[],
  ): Partial<T>[] {
    // Create mappings from header to importKey and importBy
    const headerToImportKeyMap = new Map<string, keyof T>();
    const headerToImportByMap = new Map<
      string,
      keyof T | ((importedRow: any) => T[keyof T])
    >();

    // Filter column definitions to only those with importKey or importBy and populate the maps
    columnDefinitions
      .filter((col) => col.importKey || col.importBy)
      .forEach((col) => {
        const header =
          typeof col.header === 'string'
            ? col.header
            : col.header({}).toString();

        if (col.importKey) {
          headerToImportKeyMap.set(header, col.importKey as keyof T);
        }

        if (col.importBy) {
          headerToImportByMap.set(header, col.importBy);
        }
      });

    // Transform each row in the imported data
    return importedData.map((row) => {
      const transformedRow: Partial<T> = {};

      // Process each key in the row
      Object.entries(row).forEach(([key, value]) => {
        // Check if there's an importBy transformation first (takes priority)
        const importBy = headerToImportByMap.get(key);

        if (importBy) {
          if (typeof importBy === 'function') {
            // Use the importBy function to transform the entire imported row
            const importKey = headerToImportKeyMap.get(key);
            if (importKey) {
              transformedRow[importKey] = importBy(row);
            }
          } else {
            // importBy is a direct key reference
            transformedRow[importBy] = value;
          }
        } else {
          // Fall back to importKey if no importBy is defined
          const importKey = headerToImportKeyMap.get(key);
          if (importKey) {
            transformedRow[importKey] = value;
          }
        }
      });

      return transformedRow;
    });
  }

  handleImport(
    file: File,
    // previewer?: (data: any[]) => void,
    columnDefinitions: ColumnDefinition<T>[],
    parseImport?: (data: any) => Partial<T>[],
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
      // console.time('Begin');
      let imported: any[] = [];
      const wb = read(event.target.result, { cellDates: true });
      const sheets = wb.SheetNames;
      if (sheets.length) {
        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
          defval: null,
        }) as Record<string, any>[];

        imported = this.transformImportData(rows, columnDefinitions) as T[];
        // console.log('TRANSFORMED', imported);

        if (parseImport) {
          imported = parseImport(imported);
          // console.log('PARSED', imported);
        }
        // previewer(imported);
      }
      // console.log('Imported data:', JSON.stringify(imported, null, 2));
      // console.time('Start Process');
      this.importedData.set(imported);
      // console.timeEnd('Begin');
      return imported;
    };
    return reader.readAsArrayBuffer(file);
  }

  handleTemplateExport(fields: string[], title: string) {
    // console.log(fields);
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
              datum[identifier as keyof T] === dat[identifier as keyof T],
          ),
      ).length > 1
    );
  }

  clearData() {
    this.importedData.set([]);
  }
}
