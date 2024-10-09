import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ColumnDefinition } from './data-table.types';
import { ColumnDirective } from './column.directive';

@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends { id: string | number }>
  implements AfterContentInit
{
  @Input({ required: true }) data!: T[];
  @Input({ required: true }) columns!: ColumnDefinition<T>[];

  @ContentChildren(ColumnDirective)
  columnTemplates!: QueryList<ColumnDirective>;

  @Output() rowEdit = new EventEmitter<T>();
  @Output() rowSave = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();

  private editingRowsSignal = signal<Set<string | number>>(new Set());
  private selectedRowsSignal = signal<Set<string | number>>(new Set());
  private editedDataSignal = signal<Map<string | number, EditedData<T>>>(
    new Map()
  );

  columnsSignal: WritableSignal<ColumnDefinition<T>[]> = signal([]);

  ngAfterContentInit() {
    this.columnTemplates.changes.subscribe(() => this.mergeColumnTemplates());
    this.mergeColumnTemplates();
  }

  private mergeColumnTemplates() {
    const updatedColumns = this.columns.map((column) => {
      const matchingTemplate = this.columnTemplates.find(
        (t) => t.columnId === column.id
      );
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
    });
    this.columnsSignal.set(updatedColumns);
  }

  getCellValue = (row: T, column: ColumnDefinition<T>): any => {
    if (column.accessorKey) {
      return (row as any)[column.accessorKey];
    }
    return column.accessorFn ? column.accessorFn(row) : undefined;
  };

  isRowEditing = (rowId: string | number): boolean => {
    return this.editingRowsSignal().has(rowId);
  };

  toggleRowEdit = (rowId: string | number) => {
    this.editingRowsSignal.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
        this.saveRow(rowId);
      } else {
        newSet.add(rowId);
        this.initializeEditedData(rowId);
      }
      return newSet;
    });
  };

  private initializeEditedData(rowId: string | number) {
    const row = this.data.find((r) => r.id === rowId);
    if (row) {
      this.editedDataSignal.update((map) => {
        const newMap = new Map(map);
        newMap.set(rowId, { ...row });
        return newMap;
      });
    }
  }

  private saveRow(rowId: string | number) {
    const editedData = this.editedDataSignal().get(rowId);
    if (editedData) {
      const originalRowIndex = this.data.findIndex((r) => r.id === rowId);
      if (originalRowIndex !== -1) {
        const updatedRow = { ...this.data[originalRowIndex], ...editedData };
        this.data[originalRowIndex] = updatedRow;
        this.rowSave.emit(updatedRow);
        this.editedDataSignal.update((map) => {
          const newMap = new Map(map);
          newMap.delete(rowId);
          return newMap;
        });
      }
    }
  }

  isRowSelected = (rowId: string | number): boolean => {
    return this.selectedRowsSignal().has(rowId);
  };

  toggleRowSelection = (rowId: string | number) => {
    this.selectedRowsSignal.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      this.emitSelectionChange();
      return newSet;
    });
  };

  allRowsSelected = (): boolean => {
    return this.selectedRowsSignal().size === this.data.length;
  };

  someRowsSelected = (): boolean => {
    return (
      this.selectedRowsSignal().size > 0 &&
      this.selectedRowsSignal().size < this.data.length
    );
  };

  toggleAllRows = () => {
    if (this.allRowsSelected()) {
      this.selectedRowsSignal.set(new Set());
    } else {
      this.selectedRowsSignal.set(new Set(this.data.map((row) => row.id)));
    }
    this.emitSelectionChange();
  };

  private emitSelectionChange() {
    const selectedRows = this.data.filter((row) =>
      this.selectedRowsSignal().has(row.id)
    );
    this.selectionChange.emit(selectedRows);
  }

  getHeaderContext(column: ColumnDefinition<T>) {
    return {
      $implicit: column,
      column,
      allRowsSelected: this.allRowsSelected,
      someRowsSelected: this.someRowsSelected,
      toggleAllRows: this.toggleAllRows,
    };
  }

  // updateEditedField<K extends keyof T>(
  //   rowId: string | number,
  //   columnId: K,
  //   field: T[K] extends object ? keyof T[K] : never,
  //   value: any
  // ) {
  //   this.editedDataSignal.update((map) => {
  //     const newMap = new Map(map);
  //     const rowData = newMap.get(rowId) || ({} as EditedData<T>);
  //     const columnData = (rowData[columnId] as any) || {};
  //     newMap.set(rowId, {
  //       ...rowData,
  //       [columnId]: {
  //         ...columnData,
  //         [field]: value,
  //       },
  //     });
  //     return newMap;
  //   });
  // }

  updateEditedValue(rowId: string | number, columnId: keyof T, value: any) {
    this.editedDataSignal.update((map) => {
      const newMap = new Map(map);
      const rowData = newMap.get(rowId) || ({} as EditedData<T>);
      newMap.set(rowId, { ...rowData, [columnId]: value });
      return newMap;
    });
  }

  updateNestedEditedValue(
    rowId: string | number,
    columnId: keyof T,
    nestedField: string,
    value: any
  ) {
    this.editedDataSignal.update((map) => {
      const newMap = new Map(map);
      const rowData = newMap.get(rowId) || ({} as EditedData<T>);
      const columnData = (rowData[columnId] as any) || {};
      newMap.set(rowId, {
        ...rowData,
        [columnId]: {
          ...columnData,
          [nestedField]: value,
        },
      });
      return newMap;
    });
  }

  getCellContext(row: T, column: ColumnDefinition<T>, rowIndex: number) {
    const rowId = row.id;
    const isEditing = this.isRowEditing(rowId);
    const editedData = this.editedDataSignal().get(rowId);

    let value: any;
    if (isEditing && editedData && column.id in editedData) {
      value = editedData[column.id as keyof T];
    } else {
      value = this.getCellValue(row, column);
    }

    return {
      $implicit: value,
      value,
      row,
      column,
      rowIndex,
      isEditing,
      isSelected: this.isRowSelected(rowId),
      toggleRowSelection: () => this.toggleRowSelection(rowId),
      toggleRowEdit: () => this.toggleRowEdit(rowId),
      updateValue: (newValue: any) =>
        this.updateEditedValue(rowId, column.id as keyof T, newValue),
      updateNestedValue: (nestedField: string, newValue: any) =>
        this.updateNestedEditedValue(
          rowId,
          column.id as keyof T,
          nestedField,
          newValue
        ),
    };
  }

  getFooterContext(column: ColumnDefinition<T>) {
    return {
      $implicit: column,
      column,
      data: this.data,
    };
  }
}

type EditedData<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};
