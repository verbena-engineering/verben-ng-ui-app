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
import { DataExtendItem, DataType } from './data-extend.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lib-data-extend',
  templateUrl: './data-extend.component.html',
  styleUrl: './data-extend.component.css',
})
export class DataExtendComponent {
  properties = input<DataExtendItem[]>([]);
  extendDataEvent = output<DataExtendItem[]>();

  items: WritableSignal<DataExtendItem[]> = signal<DataExtendItem[]>([]);
  showAll: WritableSignal<boolean> = signal<boolean>(false);
  visibleItems: Signal<DataExtendItem[]>;
  form: FormGroup;
  selectedItem: DataExtendItem | null = null;

  dataTypes = Object.values(DataType);

  constructor(private fb: FormBuilder) {
    this.visibleItems = computed(() =>
      this.showAll() ? this.items() : this.items().slice(0, 3)
    );
    effect(() => {
      this.items.set(this.properties());
    });

    this.form = this.fb.group({
      Name: ['', Validators.required],
      DefaultValue: [''],
      DataType: ['', Validators.required],
      MaxValue: [0],
      MinValue: [0],
      IsRequired: [false],
      Options: [''],
    });

    this.form.get('DataType')?.valueChanges.subscribe((value) => {
      if (
        value === DataType.SingleSelection ||
        value === DataType.MultiSelection
      ) {
        this.form.get('Options')?.enable();
        this.form.get('Options')?.setValue('');
        this.form.get('Options')?.setValidators([Validators.required]);
      } else {
        this.form.get('Options')?.clearValidators();
        this.form.get('Options')?.disable();
      }

      if (
        value === DataType.Number ||
        value === DataType.Decimal ||
        value === DataType.SingleSelection ||
        value === DataType.MultiSelection
      ) {
        this.form.get('MaxValue')?.setValidators([Validators.required]);
        this.form.get('MinValue')?.setValidators([Validators.required]);
      }
      if (value === DataType.Text) {
        this.form.get('MaxValue')?.clearValidators();
        this.form.get('MinValue')?.clearValidators();
        this.form.get('MaxValue')?.disable();
        this.form.get('MinValue')?.disable();
      } else {
        this.form.get('MaxValue')?.enable();
        this.form.get('MinValue')?.enable();
      }

      this.form.get('Options')?.updateValueAndValidity();
    });
  }

  toggleShowAll() {
    this.showAll.update((prev) => !prev);
  }

  addItem() {
    const newItem = this.form.value;
    if (this.selectedItem) {
      const index = this.items().indexOf(this.selectedItem);
      this.items.update((prev) => {
        const updatedItems = [...prev];
        updatedItems[index] = newItem;
        return updatedItems;
      });
      this.selectedItem = null;
    } else {
      this.items.update((prev) => [...prev, newItem]);
    }
    this.form.reset();
  }

  removeItem(index: number) {
    this.items.update((prev) => prev.filter((_, i) => i !== index));
  }

  save() {
    this.extendDataEvent.emit(this.items());
  }

  cancel() {
    this.items.set(this.properties());
  }

  reset() {
    this.items.set([]);
    this.form.reset();
  }

  editItem(index: number) {
    const item = this.items()[index];
    this.form.patchValue(item);
    this.selectedItem = item;
  }
}
