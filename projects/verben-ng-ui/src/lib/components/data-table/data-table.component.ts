import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  effect,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Signal,
  signal,
  SimpleChanges,
  untracked,
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
  @Output() selectionChange = new EventEmitter<T[]>();

  private editingRowsSignal = signal<Set<string | number>>(new Set());
  private selectedRowsSignal = signal<Set<string | number>>(new Set());

  columnsSignal: WritableSignal<ColumnDefinition<T>[]> = signal([]);

  constructor() {
    effect(() => {
      console.log('Columns updated:', this.columnsSignal());
    });
  }

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

  isRowEditing = computed(() => {
    const editingRows = this.editingRowsSignal();
    return (rowId: string | number) => editingRows.has(rowId);
  });

  toggleRowEdit = (rowId: string | number) => {
    this.editingRowsSignal.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
        const editedRow = this.data.find((row) => row.id === rowId);
        if (editedRow) {
          this.rowEdit.emit(editedRow);
        }
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  isRowSelected = computed(() => {
    const selectedRows = this.selectedRowsSignal();
    return (rowId: string | number) => selectedRows.has(rowId);
  });

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

  allRowsSelected = computed(() => {
    return this.selectedRowsSignal().size === this.data.length;
  });

  someRowsSelected = computed(() => {
    return (
      this.selectedRowsSignal().size > 0 &&
      this.selectedRowsSignal().size < this.data.length
    );
  });

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

  getCellContext(row: T, column: ColumnDefinition<T>, rowIndex: number) {
    return {
      $implicit: this.getCellValue(row, column),
      value: this.getCellValue(row, column),
      row,
      column,
      rowIndex,
      isEditing: this.isRowEditing()(row.id),
      isSelected: this.isRowSelected()(row.id),
      toggleRowSelection: () => this.toggleRowSelection(row.id),
      toggleRowEdit: () => this.toggleRowEdit(row.id),
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
