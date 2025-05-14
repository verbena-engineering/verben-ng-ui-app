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

@Component({
  selector: 'lib-data-import',
  templateUrl: './data-import.component.html',
  styleUrl: './data-import.component.css',
})
export class DataImportComponent<T> {
  previewColumns = input.required<ColumnDefinition<T>[]>();
  formGroupConfig = input<
    FormGroupConfig<{
      [K in keyof T]: AbstractControl;
    }>
  >();
  fields = input<string[]>([]);
  title = input<string>('title');
  columnTemplates = input<readonly ColumnDirective[]>([]);
  previewData = input.required<T[]>();
  exportTemplateEvent = output<string[]>();
  importEvent = output<File>();
  importEventData = output<T[]>();
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

  private _ext: 'xlsx' | 'xls' | 'csv' = 'xlsx';

  files: File[] = [];
  isDragging = false;
  showPreview = false;

  constructor() {
    effect(() => {
      this.previewData()?.forEach((datum) => {
        console.log(datum);
      });

      const isDuplicate = (datum: T, array: T[]) => {
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

      this.previewData()?.forEach((d, i, arr) => {
        if (isDuplicate(d, arr)) {
          this.duplicateIndexSet.add(i);
        }
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
        .filter((col) => col.accessorKey || col.formControlName)
        .map((column) => {
          const matchingTemplate = this.columnTemplates().find(
            (t) => t.columnId === column.id
          );
          console.log(matchingTemplate);
          if (matchingTemplate) {
            return {
              ...column,
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
    this.importEvent.emit(this.files[0]);
    this.showPreview = true;
  }

  onFileSelected(event: any) {
    this.files = Array.from(event.target.files);
    this.importEvent.emit(this.files[0]);
    this.showPreview = true;
  }

  reset() {
    this.files = [];
  }

  save() {
    console.log('PREVDATA', this.previewData());
    this.showPreview = false;
    this.importEventData.emit(this.previewData() || []);
  }

  getControlNames() {
    const controls = this.formGroupConfig()?.controls;
    if (controls) {
      return Object.keys(controls);
    }
    return [];
  }

  handleTemplateExport() {
    const fg = this.formGroupConfig()?.controls;
    if (fg) {
      this.exportTemplateEvent.emit(Object.keys(fg));
    } else {
      this.exportTemplateEvent.emit(this.fields());
    }
  }

  // getFormControl(index: number, field: string) {
  //   const control = this..get(index)?.get(field) as FormControl<any>;
  //   console.log(control);
  //   return control;
  // }
}
