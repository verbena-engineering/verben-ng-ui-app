import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ContentChildren,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  QueryList,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ColumnDefinition,
  DataWithKey,
  EditedData,
  FormGroupConfig,
  GroupedDataRow,
} from './data-table.types';
import { ColumnDirective } from './column.directive';
import { BaseStyles, TableStyles } from './style.types';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T> {
  // Modify data input to use grouped data
  data = input.required<T[]>();
  columns = input.required<ColumnDefinition<T>[]>();
  dataKey = input<keyof T>(); // New required input for unique identifier
  formGroupConfig = input<
    FormGroupConfig<{
      [K in keyof T]: AbstractControl;
    }>
  >();

  groupBy = input<keyof T | ((row: T) => any)>();

  @Input() styleConfig: TableStyles = defaultTableStyles;

  columnTemplates = contentChildren(ColumnDirective);

  @Output() rowEdit = new EventEmitter<T>();
  @Output() rowSave = new EventEmitter<{
    index: number;
    key: number | string;
    data: Partial<T>;
  }>();
  @Output() rowRevert = new EventEmitter<{
    index: number;
    key: number | string;
    data: T;
  }>();
  @Output() rowDelete = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();

  /** Internally maintained data, with guaranteed uniqueness due to key property */
  tableData: Signal<DataWithKey<T>[]>;

  private editingRowsSignal = signal<Set<string | number>>(new Set());
  private selectedRowsSignal = signal<Set<string | number>>(new Set());
  // private editedDataSignal = signal<Map<string | number, EditedData<T>>>(
  //   new Map()
  // );
  private unEditedDataSignal = signal<Map<string | number, T>>(new Map());
  private formGroupsSignal = signal<Map<string | number, FormGroup>>(new Map());

  columnsSignal = computed(() => this.columns());

  displayColumns: Signal<ColumnDefinition<T>[]>;

  constructor() {
    this.displayColumns = computed(() => {
      return this.columnsSignal().map((column) => {
        const matchingTemplate = this.columnTemplates().find(
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
    });

    this.tableData = computed(() => {
      return this.data().map((item, index) => {
        let key;
        const dataKey = this._getRowIdByDataKey(item);
        if (dataKey) {
          key = dataKey;
        } else {
          key = index as DataWithKey<T>['_key'];
        }
        return {
          originalData: item,
          _key: key,
          _key_prop: this.dataKey() ?? '_index',
        };
      });
    });
  }

  hasFooter = computed(() =>
    this.displayColumns().some((col) => col.footerTemplate !== undefined)
  );

  // Helper method to get unique identifier for a row
  private _getRowIdByDataKey(row: T): string | number | undefined {
    const key = this.dataKey();
    if (key) {
      const value = row[key];

      // Convert to string or number if possible, otherwise stringify
      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }
      return JSON.stringify(value);
    }
    return;
  }

  // Type guard method to check for group rows
  isGroupRow(row: T): row is T & { isGroupRow: true; groupTitle: any } {
    return !!(row as any).isGroupRow;
  }

  // Computed property for grouped data

  groupedData = computed(() => {
    if (!this.groupBy()) return this.tableData() as GroupedDataRow<T>[];

    const getGroupValue =
      typeof this.groupBy() === 'function'
        ? (this.groupBy() as (row: T) => any)
        : (row: T) => row[this.groupBy() as keyof T];

    const groups = new Map<any, DataWithKey<T>[]>();

    this.tableData().forEach((row) => {
      if (getGroupValue !== undefined) {
        const groupValue = getGroupValue(row.originalData);
        const existingGroup = groups.get(groupValue) || [];
        groups.set(groupValue, [...existingGroup, row]);
      }
    });

    const groupedDataArray: GroupedDataRow<T>[] = [];

    groups.forEach((groupRows, groupValue) => {
      // Create group header row
      const groupRow: GroupedDataRow<T> = {
        ...({} as DataWithKey<T>), // Create empty object of type T as base
        _key: `group-${groupValue}`,
        isGroupRow: true,
        groupValue,
        groupTitle: groupValue,
      };

      groupedDataArray.push(groupRow);
      // Add regular rows with the optional isGroupRow property (undefined by default)
      groupedDataArray.push(...(groupRows as GroupedDataRow<T>[]));
    });

    return groupedDataArray;
  });

  getCellValue = (row: T, column: ColumnDefinition<T>): any => {
    // For group rows, return the group title if it exists
    if (this.isGroupRow(row)) {
      return (row as any).groupTitle;
    }

    // Existing logic for normal rows
    if (column.accessorKey) {
      return row[column.accessorKey];
    }
    return column.accessorFn ? column.accessorFn(row) : undefined;
  };

  public isRowEditing = (rowKey: DataWithKey<T>['_key']): boolean => {
    return this.editingRowsSignal().has(rowKey);
  };

  public toggleRowEdit = (rowId: DataWithKey<T>['_key']) => {
    let data: DataWithKey<T> | undefined = undefined;
    let index: number = -1;

    this.tableData().forEach((datum, i) => {
      if (datum._key === rowId) {
        data = datum;
        index = i;
      }
    });

    if (data !== undefined && index >= 0) {
      this.toggleRowEditInternal(data, index);
    }
  };

  private toggleRowEditInternal = (row: DataWithKey<T>, index: number) => {
    this.editingRowsSignal.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(row._key)) {
        newSet.delete(row._key);
        this.saveRow(row._key, index);
      } else {
        newSet.add(row._key);
        this.initializeEditedData(row);
      }
      return newSet;
    });
  };

  private initializeEditedData(row: DataWithKey<T>) {
    const rowId = row._key;
    this.unEditedDataSignal.update((map) => {
      const newMap = new Map(map);
      newMap.set(rowId, { ...row.originalData });
      return newMap;
    });
    const formGroupConfig = this.formGroupConfig();
    if (formGroupConfig) {
      const formGroup = new FormGroup(
        formGroupConfig.controls,
        formGroupConfig.validatorOrOpts,
        formGroupConfig.asyncValidator
      );
      formGroup.patchValue(row as any);
      this.formGroupsSignal.update((map) => {
        const newMap = new Map(map);
        newMap.set(rowId, formGroup);
        return newMap;
      });
    }
  }

  private saveRow(rowId: string | number, rowIndex: number) {
    const editedForm = this.formGroupsSignal().get(rowId);
    const unEditedData = this.unEditedDataSignal().get(rowId);

    // if (editedData) {
    //   const originalRow = this.tableData().find((row) => row._key === rowId);
    //   if (originalRow) {
    //     const updatedRow = { ...originalRow, ...editedData };
    //     this.rowSave.emit(updatedRow);
    //     this.editedDataSignal.update((map) => {
    //       const newMap = new Map(map);
    //       newMap.delete(rowId);
    //       return newMap;
    //     });
    //   }
    // }

    if (editedForm) {
      editedForm.markAsPristine();
      editedForm.markAsUntouched();
      this.formGroupsSignal.update((map) => {
        const newMap = new Map(map);
        newMap.delete(rowId);
        return newMap;
      });
      this.rowSave.emit({
        index: rowIndex,
        key: rowId,
        data: editedForm.value,
      });
    }

    if (unEditedData) {
      this.unEditedDataSignal.update((map) => {
        const newMap = new Map(map);
        newMap.delete(rowId);
        return newMap;
      });
      this.rowRevert.emit({
        index: rowIndex,
        key: rowId,
        data: unEditedData,
      });
    }
  }

  private isRowSelected = (rowId: string | number): boolean => {
    return this.selectedRowsSignal().has(rowId);
  };

  private toggleRowSelection = (rowId: string | number) => {
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

  private allRowsSelected = (): boolean => {
    const nonGroupRows = this.data().filter((row) => !this.isGroupRow(row));
    return (
      nonGroupRows.length > 0 &&
      this.selectedRowsSignal().size === nonGroupRows.length
    );
  };

  private someRowsSelected = (): boolean => {
    const nonGroupRows = this.data().filter((row) => !this.isGroupRow(row));
    return (
      this.selectedRowsSignal().size > 0 &&
      this.selectedRowsSignal().size < nonGroupRows.length
    );
  };

  private toggleAllRows = () => {
    if (this.allRowsSelected()) {
      this.selectedRowsSignal.set(new Set());
    } else {
      const nonGroupRows = this.tableData().filter(
        (row) => !this.isGroupRow(row.originalData)
      );
      this.selectedRowsSignal.set(new Set(nonGroupRows.map((row) => row._key)));
    }
    this.emitSelectionChange();
  };

  private emitSelectionChange() {
    const selectedRows = this.tableData().filter((row) =>
      this.selectedRowsSignal().has(row._key)
    );
    this.selectionChange.emit(
      selectedRows.map(({ originalData }) => originalData)
    );
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

  updateEditedValue(
    rowId: string | number,
    column: ColumnDefinition<T>,
    value: any
  ) {
    // this.editedDataSignal.update((map) => {
    //   const newMap = new Map(map);
    //   const rowData = newMap.get(rowId) || ({} as EditedData<T>);
    //   if (column.accessorKey) {
    //     newMap.set(rowId, { ...rowData, [column.accessorKey]: value });
    //   } else {
    //     console.warn(
    //       'Cannot update value for column without accessorKey:',
    //       column.id
    //     );
    //   }
    //   return newMap;
    // });
  }

  updateEditedValueFn(
    rowId: string | number,
    valueFn: (value: any) => T,
    value: any
  ) {
    // this.editedDataSignal.update((map) => {
    //   const newMap = new Map(map);
    //   const rowData = newMap.get(rowId) || ({} as EditedData<T>);
    //   newMap.set(rowId, { ...rowData, ...valueFn(value) });
    //   return newMap;
    // });
  }

  updateEditedData(rowId: string | number, data: Partial<T>) {
    // this.editedDataSignal.update((map) => {
    //   const newMap = new Map(map);
    //   const rowData = newMap.get(rowId) || ({} as EditedData<T>);
    //   newMap.set(rowId, { ...rowData, ...data });
    //   return newMap;
    // });
  }

  updateNestedEditedValue(
    rowId: string | number,
    column: ColumnDefinition<T>,
    nestedField: string,
    value: any
  ) {
    // this.editedDataSignal.update((map) => {
    //   const newMap = new Map(map);
    //   const rowData = newMap.get(rowId) || ({} as EditedData<T>);
    //   if (column.accessorKey) {
    //     const columnData = (rowData[column.accessorKey] as any) || {};
    //     newMap.set(rowId, {
    //       ...rowData,
    //       [column.accessorKey]: {
    //         ...columnData,
    //         [nestedField]: value,
    //       },
    //     });
    //   } else {
    //     console.warn(
    //       'Cannot update nested value for column without accessorKey:',
    //       column.id
    //     );
    //   }
    //   return newMap;
    // });
  }

  getCellContext(
    row: DataWithKey<T>,
    column: ColumnDefinition<T>,
    rowIndex: number
  ) {
    const rowId = row._key;
    const isEditing = this.isRowEditing(row._key);
    // const editedData = this.editedDataSignal().get(rowId);
    const editedForm = this.formGroupsSignal().get(rowId);
    const formControl = editedForm?.get(column.formControlName || '');

    let value: any;
    if (isEditing) {
      if (formControl) {
        value = formControl.value;
      } else {
        value = this.getCellValue(row.originalData, column);
      }
      // else if (editedData) {
      //   if (column.accessorKey && column.accessorKey in editedData) {
      //     // If column has an accessorKey and it exists in edited data, use that
      //     value = editedData[column.accessorKey];
      //   } else if (column.accessorFn) {
      //     // If column has an accessorFn, apply it to the edited data
      //     value = column.accessorFn({ ...row, ...editedData });
      //   } else {
      //     // Fallback to getting the value from the original row
      //     value = this.getCellValue(row, column);
      //   }
      // }
    } else {
      value = this.getCellValue(row.originalData, column);
    }

    return {
      $implicit: value,
      value,
      row: row.originalData,
      column,
      rowIndex,
      rowId,
      isEditing,
      formControl,
      isSelected: this.isRowSelected(rowId),
      toggleRowSelection: () => this.toggleRowSelection(rowId),
      toggleRowEdit: () => this.toggleRowEditInternal(row, rowIndex),
      deleteRow: () => this.deleteRow(rowId),
      updateValue: (newValue: any) =>
        this.updateEditedValue(rowId, column, newValue),
      updateNestedValue: (nestedField: string, newValue: any) =>
        this.updateNestedEditedValue(rowId, column, nestedField, newValue),
      updateValueFn: (valueFn: (value: any) => T, newValue: any) =>
        this.updateEditedValueFn(rowId, valueFn, newValue),
      updateData: (newData: Partial<T>) =>
        this.updateEditedData(rowId, newData),
    };
  }

  deleteRow = (rowId: string | number) => {
    const rowToDelete = this.tableData().find((row) => row._key === rowId);
    if (rowToDelete) {
      this.rowDelete.emit(rowToDelete.originalData);
    }
  };

  getFooterContext(column: ColumnDefinition<T>) {
    return {
      $implicit: column,
      column,
      data: this.data,
    };
  }

  getTableStyle(): any {
    return {
      ...this.styleConfig,
      fontFamily: this.styleConfig.fontFamily,
      fontSize: this.styleConfig.fontSize,
      whiteSpace: this.styleConfig.whiteSpace,
      margin: this.styleConfig.margin,
      border: this.styleConfig.border,
      borderCollapse: this.styleConfig.borderCollapse,
      borderSpacing: this.styleConfig.borderSpacing,
      tableLayout: this.styleConfig.tableLayout,
      width: this.styleConfig.width,
    };
  }

  getHeaderStyle(): any {
    return {
      ...this.styleConfig.header,
      position: this.styleConfig.header?.stickyTop ? 'sticky' : 'static',
      top: this.styleConfig.header?.stickyTop ? '0' : 'auto',
      zIndex: this.styleConfig.header?.zIndex || 'auto',
    };
  }

  getFooterStyle(): any {
    return {
      ...this.styleConfig.footer,
      position: this.styleConfig.footer?.stickyBottom ? 'sticky' : 'static',
      bottom: this.styleConfig.footer?.stickyBottom ? '0' : 'auto',
      zIndex: this.styleConfig.footer?.zIndex || 'auto',
    };
  }

  getRowStyle(rowIndex: number): any {
    const rowStyles = this.styleConfig.rows;
    if (rowStyles && 'even' in rowStyles && 'odd' in rowStyles) {
      return rowIndex % 2 === 0 ? rowStyles.even : rowStyles.odd;
    } else if (rowStyles && 'nth' in rowStyles && rowStyles.nth) {
      const { interval, style } = rowStyles.nth;
      return (rowIndex + 1) % (interval || 1) === 0 ? style : {};
    } else {
      return rowStyles || {};
    }
  }

  getCellStyle(rowIndex: number, colIndex: number): any {
    const isFirstColumn = colIndex === 0;
    const isLastColumn = colIndex === this.displayColumns().length - 1;

    let cellStyle = { ...this.styleConfig.cells };

    if (isFirstColumn) {
      cellStyle = {
        ...cellStyle,
        ...this.styleConfig.firstColumn,
        position: this.styleConfig.firstColumn?.stickyLeft
          ? 'sticky'
          : 'static',
        left: this.styleConfig.firstColumn?.stickyLeft ? '0' : 'auto',
        zIndex: this.styleConfig.firstColumn?.zIndex || 'auto',
      };
    } else if (isLastColumn) {
      cellStyle = {
        ...cellStyle,
        ...this.styleConfig.lastColumn,
        position: this.styleConfig.lastColumn?.stickyRight
          ? 'sticky'
          : 'static',
        right: this.styleConfig.lastColumn?.stickyRight ? '0' : 'auto',
        zIndex: this.styleConfig.lastColumn?.zIndex || 'auto',
      };
    }

    if (rowIndex >= 0) {
      // Apply body styles to all cells
      cellStyle = { ...cellStyle, ...this.styleConfig.body };
    } else {
      cellStyle = { ...this.styleConfig.header };
    }

    return cellStyle;
  }
}

// Default styles
const defaultTableStyles: TableStyles = {
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: '100%',
  header: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '2px solid #e0e0e0',
  },
  rows: {
    even: {
      backgroundColor: '#ffffff',
    },
    odd: {
      backgroundColor: '#f9f9f9',
    },
    nth: {
      interval: 5,
      style: {
        backgroundColor: '#f0f0f0',
      },
    },
  },
  cells: {
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    padding: '12px 16px',
    borderTop: '2px solid #e0e0e0',
  },
};
