import {
  Component,
  effect,
  input,
  output,
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

@Component({
  selector: 'lib-data-import',
  templateUrl: './data-import.component.html',
  styleUrl: './data-import.component.css',
})
export class DataImportComponent<T> {
  previewColumns = input<ColumnDefinition<T>[]>();
  formGroupConfig = input<
    FormGroupConfig<{
      [K in keyof T]: AbstractControl;
    }>
  >();
  fields = input<string[]>([]);
  title = input<string>();
  previewData = input<T[]>();
  exportTemplateEvent = output<string[]>();
  importEvent = output<File>();

  previewColumnsList: ColumnDefinition<T>[] = [];
  forms = new FormArray<FormGroup>([]);
  uniqueIdentifiers: WritableSignal<string[]> = signal([]);

  private _ext: 'xlsx' | 'xls' | 'csv' = 'xlsx';

  files: File[] = [];
  isDragging = false;
  showPreview = false;

  constructor() {
    effect(() => {
      this.previewData()?.forEach((datum) => {
        console.log(datum);
      });

      console.log(this.previewColumns());
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

  reset() {}

  save() {
    this.showPreview = true;
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
    }
  }

  // getFormControl(index: number, field: string) {
  //   const control = this..get(index)?.get(field) as FormControl<any>;
  //   console.log(control);
  //   return control;
  // }
}
