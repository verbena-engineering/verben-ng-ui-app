import { Component, effect, input, output } from '@angular/core';
import { ColumnDefinition } from '../data-table/data-table.types';
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
export class DataImportComponent<T extends { Id: string | number }> {
  previewColumns = input<ColumnDefinition<T>[]>();
  formControls = input<FormGroup['controls']>();
  title = input<string>();
  previewData = input<T[]>();
  exportTemplateEvent = output<string[]>();
  importEvent = output<File>();

  previewColumnsList: ColumnDefinition<T>[] = [];
  forms = new FormArray<FormGroup>([]);

  private _ext: 'xlsx' | 'xls' | 'csv' = 'xlsx';

  files: File[] = [];
  isDragging = false;
  showPreview = false;

  constructor() {
    effect(() => {
      this.previewData()?.forEach((datum) => {
        console.log(datum);
        const formGroup = new FormGroup(this.formControls());
        formGroup.patchValue(datum);
        this.forms.push(formGroup);
      });
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
  }

  onFileSelected(event: any) {
    this.files = Array.from(event.target.files);
    this.importEvent.emit(this.files[0]);
  }

  reset() {}

  save() {
    this.showPreview = true;
  }

  handleTemplateExport() {
    const fg = this.formControls();
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
