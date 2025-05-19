import { Injectable, signal, WritableSignal } from '@angular/core';
import { read, utils, writeFile } from 'xlsx';

@Injectable()
export class DataImportService<T> {
  importedData: WritableSignal<T[]> = signal([]);

  constructor() {}

  handleImport(
    file: File,
    // previewer?: (data: any[]) => void,
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
      let imported: any[] = [];
      const wb = read(event.target.result, { cellDates: true });
      const sheets = wb.SheetNames;
      if (sheets.length) {
        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
          // raw: true,
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
      console.log('Imported data:', JSON.stringify(imported, null, 2));
      this.importedData.set(imported);
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
    console.log(event);
    this.importedData.update((dat) => {
      // dat[event.index] = { ...dat[event.index], ...event.data };
      return dat.map((d, i) => {
        if (i === event.index) {
          return { ...d, ...event.data };
        }
        return d;
      });
    });
    console.log(this.importedData());
  }
}
