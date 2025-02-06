import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ArithmeticOperation,
  ExportItem,
  ExportProfile,
  Operation,
  StringOperation,
} from './data-xport.types';
import { ColumnDefinition } from '../data-table/data-table.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataXportService } from './data-xport.service';

@Component({
  selector: 'lib-data-xport',
  templateUrl: './data-xport.component.html',
  styleUrl: './data-xport.component.css',
})
export class DataXportComponent<T> {
  @Input() data!: T[];
  @Input() columns!: ColumnDefinition<T>[];
  @Output() exportDataEvent = new EventEmitter<Record<string, any>[]>();

  profiles: (ExportProfile & { selected: boolean })[] = [];
  groupItems: (ExportItem & { selected: boolean })[] = [];
  newGroupForm: FormGroup;
  newOperation: Partial<Operation> = {
    id: '',
    name: '',
    field1: '',
    field2: '',
    type: 'arithmetic',
  } as ArithmeticOperation;

  numericColumns: ColumnDefinition<T>[] = [];
  stringColumns: ColumnDefinition<T>[] = [];
  isEditingOperation: boolean = false;
  showAllProfiles: boolean = false;
  showAllGroups: boolean = false;

  arithmeticOperators = [
    { value: 'add', label: '+' },
    { value: 'subtract', label: '-' },
    { value: 'multiply', label: '×' },
    { value: 'divide', label: '÷' },
  ];

  constructor(
    private exportService: DataXportService<T>,
    private fb: FormBuilder
  ) {
    this.newGroupForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.initializeColumns();
    this.updateProfiles();
  }

  ngOnChanges() {
    if (this.columns) {
      this.initializeColumns();
    }
  }

  get visibleProfiles() {
    return this.showAllProfiles ? this.profiles : this.profiles.slice(0, 3);
  }

  get visibleGroups() {
    return this.showAllGroups ? this.groupItems : this.groupItems.slice(0, 3);
  }

  initializeColumns() {
    if (this.columns?.length) {
      this.exportService.setColumns(this.columns);
      this.updateColumnTypes();
      this.updateGroupItems();
    }
  }

  private updateColumnTypes() {
    if (this.data?.length && this.columns?.length) {
      const sampleData = this.data[0];

      this.numericColumns = this.columns.filter((col) => {
        const value = col.accessorFn
          ? col.accessorFn(sampleData)
          : col.accessorKey
          ? sampleData[col.accessorKey]
          : null;
        return typeof value === 'number';
      });

      this.stringColumns = this.columns.filter((col) => {
        const value = col.accessorFn
          ? col.accessorFn(sampleData)
          : col.accessorKey
          ? sampleData[col.accessorKey]
          : null;
        return typeof value === 'string';
      });
    }
  }

  updateProfiles() {
    this.profiles = this.exportService.getProfiles().map((profile) => ({
      ...profile,
      selected: false,
    }));
  }

  updateGroupItems() {
    this.groupItems = this.exportService.getAllItems().map((item) => ({
      ...item,
      selected: false,
    }));
  }

  addGroup() {
    if (this.newGroupForm.valid) {
      const selectedItems = this.groupItems.filter((item) => item.selected);
      if (selectedItems.length > 0) {
        const newProfile: ExportProfile = {
          id: Date.now().toString(),
          name: this.newGroupForm.get('name')?.value,
          items: selectedItems,
        };
        this.exportService.addProfile(newProfile);
        this.updateProfiles();
        this.groupItems.forEach((item) => (item.selected = false));
        this.newGroupForm.reset();
      }
    }
  }

  editProfile(profile: ExportProfile & { selected: boolean }) {
    this.groupItems.forEach((item) => {
      item.selected = profile.items.some(
        (profileItem) => profileItem.id === item.id
      );
    });
    this.removeProfile(profile);
  }

  removeProfile(profile: ExportProfile & { selected: boolean }) {
    this.exportService.removeProfile(profile.id);
    this.updateProfiles();
  }

  addOrUpdateOperation() {
    if (
      this.newOperation.name &&
      this.newOperation.field1 &&
      this.newOperation.field2
    ) {
      const operation: Operation =
        this.newOperation.type === 'arithmetic'
          ? {
              id: this.isEditingOperation
                ? this.newOperation.id!
                : Date.now().toString(),
              name: this.newOperation.name,
              field1: this.newOperation.field1,
              field2: this.newOperation.field2,
              type: 'arithmetic',
              operator:
                (this.newOperation as ArithmeticOperation).operator || 'add',
            }
          : {
              id: this.isEditingOperation
                ? this.newOperation.id!
                : Date.now().toString(),
              name: this.newOperation.name,
              field1: this.newOperation.field1,
              field2: this.newOperation.field2,
              type: 'string',
              joinBy: (this.newOperation as StringOperation).joinBy || ' ',
            };

      if (this.isEditingOperation) {
        this.exportService.updateOperation(operation.id, operation);
      } else {
        this.exportService.addOperation(operation);
      }
      this.updateGroupItems();
      this.resetOperationForm();
    }
  }

  editOperation(operation: ExportItem & { selected: boolean }) {
    const foundOperation = this.exportService
      .getOperations()
      .find((op) => op.id === operation.id);
    if (foundOperation) {
      this.newOperation = { ...foundOperation };
      this.isEditingOperation = true;
    }
  }

  removeOperation(operation: ExportItem & { selected: boolean }) {
    this.exportService.removeOperation(operation.id);
    this.updateGroupItems();
  }

  resetOperationForm() {
    this.newOperation = {
      id: '',
      name: '',
      field1: '',
      field2: '',
      type: 'arithmetic',
      operator: 'add',
    } as ArithmeticOperation;
    this.isEditingOperation = false;
  }

  resetAll() {
    this.exportService.resetAll();
    this.initializeColumns();
    this.updateProfiles();
    this.resetOperationForm();
    this.newGroupForm.reset();
  }

  exportData() {
    const selectedProfiles = this.profiles.filter(
      (profile) => profile.selected
    );
    if (selectedProfiles.length > 0) {
      const exportedData = this.exportService.exportData(
        this.data,
        selectedProfiles
      );
      console.log(exportedData);
      this.exportDataEvent.emit(exportedData);
    }
  }

  onField1Change() {
    this.newOperation.field2 = '';
    const isNumeric = this.numericColumns.some(
      (col) => col.id === this.newOperation.field1
    );
    this.newOperation.type = isNumeric ? 'arithmetic' : 'string';
    if (isNumeric) {
      (this.newOperation as ArithmeticOperation).operator = 'add';
    } else {
      (this.newOperation as StringOperation).joinBy = ' ';
    }
  }

  private transformColumnToOption(column: ColumnDefinition<T>) {
    return {
      id: column.id,
      label:
        typeof column.header === 'function' ? column.header({}) : column.header,
      originalColumn: column,
    };
  }

  get columnOptions() {
    return [...this.numericColumns, ...this.stringColumns].map((col) =>
      this.transformColumnToOption(col)
    );
  }

  get availableFields2() {
    const columns =
      this.newOperation.type === 'arithmetic'
        ? this.numericColumns
        : this.stringColumns;
    return columns.map((col) => this.transformColumnToOption(col));
  }

  toggleShowAllProfiles() {
    this.showAllProfiles = !this.showAllProfiles;
  }

  toggleShowAllGroups() {
    this.showAllGroups = !this.showAllGroups;
  }

  getColumnHeader(column: ColumnDefinition<T>): string {
    return typeof column.header === 'function'
      ? column.header({})
      : column.header;
  }
}
