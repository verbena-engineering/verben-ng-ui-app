import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { ColumnDefinition } from './data-table.types';
import { ColumnDirective } from './column.directive';
import { BaseStyles, TableStyles } from './style.types';

@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends { id: string | number }>
  implements OnInit, AfterContentInit
{
  // Modify data input to use grouped data
  data = input.required<T[]>();
  columns = input.required<ColumnDefinition<T>[]>();
  // @Input({ required: true })
  // set data(value: T[]) {
  //   this._data = value;
  // }
  // get data(): T[] {
  //   return this.groupedData();
  // }
  // private _data: T[] = [];
  // Modify columns input to use a signal
  // @Input({ required: true })
  // set columns(value: ColumnDefinition<T>[]) {
  //   this.columnsSignal.set(value);
  // }
  // New inputs for grouping
  groupBy = input<keyof T | ((row: T) => any)>();

  @Input() styleConfig: TableStyles = defaultTableStyles;

  @ContentChildren(ColumnDirective)
  columnTemplates!: QueryList<ColumnDirective>;

  @Output() rowEdit = new EventEmitter<T>();
  @Output() rowSave = new EventEmitter<T>();
  @Output() rowDelete = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();

  private editingRowsSignal = signal<Set<string | number>>(new Set());
  private selectedRowsSignal = signal<Set<string | number>>(new Set());
  private editedDataSignal = signal<Map<string | number, EditedData<T>>>(
    new Map()
  );

  columnsSignal: WritableSignal<ColumnDefinition<T>[]> = signal([]);

  hasFooter = computed(() =>
    this.columnsSignal().some((col) => col.footerTemplate !== undefined)
  );

  // Type guard method to check for group rows
  isGroupRow(row: T): row is T & { isGroupRow: true; groupTitle: any } {
    return !!(row as any).isGroupRow;
  }

  // Computed property for grouped data
  groupedData = computed(() => {
    // If no grouping is specified, return original data
    if (!this.groupBy()) return this.data();

    // Determine group function based on input type
    const getGroupValue =
      typeof this.groupBy() === 'function'
        ? (this.groupBy() as (row: T) => any)
        : (row: T) => row[this.groupBy() as keyof T];

    // Group the data
    const groups = new Map<any, T[]>();

    this.data().forEach((row) => {
      if (getGroupValue !== undefined) {
        const groupValue = getGroupValue(row);
        const existingGroup = groups.get(groupValue) || [];
        groups.set(groupValue, [...existingGroup, row]);
      }
    });

    // Construct final grouped data array with group rows
    const groupedDataArray: (T & { isGroupRow?: boolean })[] = [];

    groups.forEach((groupRows, groupValue) => {
      // Create a group row
      const groupRow = {
        id: `group-${groupValue}`,
        isGroupRow: true,
        groupValue,
        groupTitle: groupValue,
      } as unknown as T & { isGroupRow: boolean };

      groupedDataArray.push(groupRow);
      groupedDataArray.push(...groupRows);
    });

    return groupedDataArray;
  });

  ngOnInit() {
    // Set initial columns if not already set
    if (this.columnsSignal().length === 0) {
      this.columnsSignal.set(this.columns());
    }
  }

  ngAfterContentInit() {
    this.columnTemplates.changes.subscribe(() => this.mergeColumnTemplates());
    this.mergeColumnTemplates();
  }

  private mergeColumnTemplates() {
    // Only merge if we have both columns and templates
    if (this.columnsSignal().length > 0) {
      const updatedColumns = this.columnsSignal().map((column) => {
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
  }

  getCellValue = (row: T, column: ColumnDefinition<T>): any => {
    // For group rows, return the group title if it exists
    if (this.isGroupRow(row)) {
      return (row as any).groupTitle;
    }

    // Existing logic for normal rows
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
        // this.saveRow(rowId);
      } else {
        newSet.add(rowId);
        this.initializeEditedData(rowId);
      }
      return newSet;
    });
  };

  private initializeEditedData(rowId: string | number) {
    const row = this.data().find((r) => r.id === rowId);
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
      const originalRowIndex = this.data().findIndex((r) => r.id === rowId);
      if (originalRowIndex !== -1) {
        const updatedRow = { ...this.data()[originalRowIndex], ...editedData };
        this.data()[originalRowIndex] = updatedRow;
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
    const nonGroupRows = this.data().filter((row) => !this.isGroupRow(row));
    return (
      nonGroupRows.length > 0 &&
      this.selectedRowsSignal().size === nonGroupRows.length
    );
  };

  someRowsSelected = (): boolean => {
    const nonGroupRows = this.data().filter((row) => !this.isGroupRow(row));
    return (
      this.selectedRowsSignal().size > 0 &&
      this.selectedRowsSignal().size < nonGroupRows.length
    );
  };

  toggleAllRows = () => {
    if (this.allRowsSelected()) {
      this.selectedRowsSignal.set(new Set());
    } else {
      const nonGroupRows = this.data().filter((row) => !this.isGroupRow(row));
      this.selectedRowsSignal.set(new Set(nonGroupRows.map((row) => row.id)));
    }
    this.emitSelectionChange();
  };

  private emitSelectionChange() {
    const selectedRows = this.data().filter((row) =>
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

  updateEditedValue(rowId: string | number, columnId: keyof T, value: any) {
    this.editedDataSignal.update((map) => {
      const newMap = new Map(map);
      const rowData = newMap.get(rowId) || ({} as EditedData<T>);
      newMap.set(rowId, { ...rowData, [columnId]: value });
      return newMap;
    });
  }

  updateEditedValueFn(
    rowId: string | number,
    valueFn: (value: any) => T,
    value: any
  ) {
    this.editedDataSignal.update((map) => {
      const newMap = new Map(map);
      const rowData = newMap.get(rowId) || ({} as EditedData<T>);
      newMap.set(rowId, { ...rowData, ...valueFn(value) });
      return newMap;
    });
  }

  updateEditedData(rowId: string | number, data: Partial<T>) {
    this.editedDataSignal.update((map) => {
      const newMap = new Map(map);
      const rowData = newMap.get(rowId) || ({} as EditedData<T>);
      newMap.set(rowId, { ...rowData, ...data });
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
      deleteRow: () => this.deleteRow(rowId),
      updateValue: (newValue: any) =>
        this.updateEditedValue(rowId, column.id as keyof T, newValue),
      updateNestedValue: (nestedField: string, newValue: any) =>
        this.updateNestedEditedValue(
          rowId,
          column.id as keyof T,
          nestedField,
          newValue
        ),

      updateValueFn: (valueFn: (value: any) => T, newValue: any) =>
        this.updateEditedValueFn(rowId, valueFn, newValue),
      updateData: (newData: Partial<T>) =>
        this.updateEditedData(rowId, newData),
    };
  }

  deleteRow = (rowId: string | number) => {
    const rowToDelete = this.data().find((row) => row.id === rowId);
    if (rowToDelete) {
      this.rowDelete.emit(rowToDelete);
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
    const isLastColumn = colIndex === this.columnsSignal().length - 1;

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

type EditedData<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

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
