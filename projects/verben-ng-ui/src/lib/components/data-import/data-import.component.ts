import {
  Component,
  computed,
  effect,
  input,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ColumnDefinition,
  FormGroupConfig,
} from '../data-table/data-table.types';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ColumnDirective } from '../data-table/column.directive';
import { DataImportService } from './data-import.service';

@Component({
  selector: 'lib-data-import',
  templateUrl: './data-import.component.html',
  styleUrl: './data-import.component.css',
  providers: [DataImportService],
})
export class DataImportComponent<T extends {}> {
  previewColumns = input.required<ColumnDefinition<T>[]>();
  formGroupConfig = input<
    FormGroupConfig<{
      [K in keyof T]: AbstractControl;
    }>
  >();
  /**
   * @deprecated Use importKey of previewColumns instead
   */
  fields = input<string[]>();
  title = input<string>('export-template');
  columnTemplates = input<readonly ColumnDirective[]>([]);
  parser = input<(data: any) => Partial<T>[]>();
  /**
   * @deprecated Please remove, now handled internally
   */
  previewData = input<T[]>();
  /**
   * Pass the method to use the imported data,
   * and eventually returns true if successfully used
   */
  onImportComplete = input<(data: Partial<T>[]) => Promise<boolean>>();
  /**
   * @deprecated Please remove, now handled internally
   */
  exportTemplateEvent = output<string[]>();
  /**
   * @deprecated Please remove, now handled internally
   */
  importEvent = output<File>();
  /**
   * @deprecated Use the onImportComplete input instead
   */
  importEventData = output<Partial<T>[]>();
  /**
   * @deprecated Please remove, now handled internally
   */
  rowSave = output<{
    index: number;
    key: number | string;
    data: Partial<T>;
  }>();

  // data: Signal<(T & { isDuplicate: boolean })[]>;
  previewColumnsList: Signal<ColumnDefinition<T>[]>;
  forms = new FormArray<FormGroup>([]);
  uniqueIdentifiers: WritableSignal<string[]> = signal([]);
  // duplicateDataMap: Map<string, number> = new Map();
  duplicateIndexSet = new Set<number>();
  invalidIndexSet = new Map<number, ColumnDirective['columnId'][]>();

  headers: Signal<string[]>;

  private _ext: 'xlsx' | 'xls' | 'csv' = 'xlsx';

  files: File[] = [];
  isDragging = false;
  showPreview = false;

  constructor(public service: DataImportService<T>) {
    effect(() => {
      this.service.importedData()?.forEach((datum) => {
        console.log(datum);
      });

      const isDuplicate = (datum: Partial<T>, array: Partial<T>[]) => {
        const identifiers = this.uniqueIdentifiers();

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
      };

      // const columns = this.previewColumnsList();

      this.service.importedData()?.forEach((d, i, arr) => {
        if (isDuplicate(d, arr)) {
          this.duplicateIndexSet.add(i);
        }

        // columns
        //   .filter(({ validatorFn }) => validatorFn !== undefined)
        //   .forEach((column) => {
        //     const invalidFields = Object.entries(d).reduce<string[]>(
        //       (f, [k, v], i) => {
        //         if (
        //           column.validatorFn &&
        //           !column.validatorFn(v as T[keyof T])
        //         ) {
        //           f.push(column.id);
        //         }
        //         return f;
        //       },
        //       []
        //     );

        //     if (invalidFields.length > 0) {
        //       this.invalidIndexSet.set(i, invalidFields);
        //     }
        //   });
      });
    });

    // this.importTableColumns = computed(() => {
    //   return this.previewColumns().map((column) => {
    //     const matchingTemplate = this.columnTemplates().find(
    //       (t) => t.columnId === column.id
    //     );
    //     console.log(matchingTemplate);
    //     if (matchingTemplate) {
    //       return {
    //         ...column,
    //         cellTemplate: matchingTemplate.cellTemplate,
    //         cellEditTemplate: matchingTemplate.cellEditTemplate,
    //         headerTemplate: matchingTemplate.headerTemplate,
    //         footerTemplate: matchingTemplate.footerTemplate,
    //       };
    //     }
    //     return column;
    //   });
    // });

    this.previewColumnsList = computed(() => {
      return this.previewColumns()
        .filter((col) => col.importKey || col.formControlName)
        .map((column) => {
          const matchingTemplate = this.columnTemplates().find(
            (t) => t.columnId === column.id
          );
          console.log(matchingTemplate);
          if (matchingTemplate) {
            return {
              ...column,
              // accessorKey: column.importKey,
              cellTemplate: matchingTemplate.cellTemplate,
              cellEditTemplate: matchingTemplate.cellEditTemplate,
              headerTemplate: matchingTemplate.headerTemplate,
              footerTemplate: matchingTemplate.footerTemplate,
            };
          }
          return column;
        })
        .concat([
          {
            id: 'actions',
            header: 'Actions',
          },
        ]);
    });

    this.headers = computed(() => {
      return (
        this.fields() ??
        this.previewColumnsList()
          .filter((col) => col.importKey)
          .map((col) => col.header.toString())
      );
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    this.files = Array.from(event.dataTransfer!.files);

    this.service.handleImport(
      this.files[0],
      this.previewColumnsList(),
      this.parser()
    );
    // this.importEvent.emit(this.files[0]);
    this.showPreview = true;
  }

  onFileSelected(event: any) {
    this.files = Array.from(event.target.files);
    this.service.handleImport(
      this.files[0],
      this.previewColumnsList(),
      this.parser()
    );

    // this.importEvent.emit(this.files[0]);
    this.showPreview = true;
  }

  reset() {
    this.files = [];
  }

  save() {
    // console.log('PREVDATA', this.service.importedData());
    const onComplete = this.onImportComplete();
    if (onComplete) {
      onComplete(this.service.importedData()).then((success) => {
        if (success) {
          this.showPreview = false;
        }
      });
    } else {
      this.importEventData.emit(this.service.importedData() || []);
      this.showPreview = false;
    }
  }

  getControlNames() {
    const controls = this.formGroupConfig()?.controls;
    if (controls) {
      return Object.keys(controls);
    }
    return [];
  }

  handleTemplateExport() {
    this.service.handleTemplateExport(this.headers(), this.title());
    // this.exportTemplateEvent.emit(this.headers());
  }

  // getFormControl(index: number, field: string) {
  //   const control = this..get(index)?.get(field) as FormControl<any>;
  //   console.log(control);
  //   return control;
  // }
}
