import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnDefinition } from '../data-table/data-table.types';
import {
  SortCondition,
  SortOperator,
  STRING_SORT_OPERATORS,
  NUMBER_SORT_OPERATORS,
  DATE_SORT_OPERATORS,
} from './data-sort.types';

@Component({
  selector: 'lib-data-sort',
  templateUrl: './data-sort.component.html',
  styleUrls: ['./data-sort.component.css'],
})
export class DataSortComponent<T> implements OnInit {
  @Input() columns!: ColumnDefinition<T>[];
  @Input() data!: T[];
  @Input() enableDragAndDrop: boolean = true;
  @Output() sortApplied = new EventEmitter<SortCondition[]>();
  @Output() resetFilter = new EventEmitter();
  sortableColumns: ColumnDefinition<T>[] = [];
  selectedSorts: Map<string, 'asc' | 'desc'> = new Map();
  showAllProperties = false;
  maxVisibleItems = 3;
  draggedIndex: number | null = null;
  checkAll: boolean = false;
  selectedColumns: Set<string> = new Set();

  ngOnInit() {
    this.initializeSortableColumns();
  }

  private initializeSortableColumns() {
    this.sortableColumns = this.columns.filter((col) => col.accessorKey);
  }

  get visibleColumns() {
    return this.showAllProperties
      ? this.sortableColumns
      : this.sortableColumns.slice(0, this.maxVisibleItems);
  }

  // Drag and Drop functionality
  onDragStart(index: number, event: DragEvent) {
    if (!this.enableDragAndDrop) return;
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  onDragOver(event: DragEvent) {
    if (!this.enableDragAndDrop) return;
    event.preventDefault();
  }

  onDrop(index: number, event: DragEvent) {
    if (!this.enableDragAndDrop) return;
    event.preventDefault();
    if (this.draggedIndex !== null && this.draggedIndex !== index) {
      this.swapColumns(this.draggedIndex, index);
    }
    this.draggedIndex = null;
  }

  private swapColumns(fromIndex: number, toIndex: number) {
    const temp = this.sortableColumns[fromIndex];
    this.sortableColumns[fromIndex] = this.sortableColumns[toIndex];
    this.sortableColumns[toIndex] = temp;
  }

  // Column Selection functionality
  toggleSelectAll() {
    this.checkAll = !this.checkAll;
    if (this.checkAll) {
      this.sortableColumns.forEach((column) =>
        this.selectedColumns.add(column.id)
      );
    } else {
      this.selectedColumns.clear();
    }
  }

  toggleColumnSelection(columnId: string) {
    if (this.selectedColumns.has(columnId)) {
      this.selectedColumns.delete(columnId);
      this.checkAll = false;
    } else {
      this.selectedColumns.add(columnId);
      if (this.selectedColumns.size === this.sortableColumns.length) {
        this.checkAll = true;
      }
    }
  }

  isColumnSelected(columnId: string): boolean {
    return this.selectedColumns.has(columnId);
  }

  // Existing sort functionality...
  getSortOperators(column: ColumnDefinition<T>): SortOperator[] {
    const columnType = this.determineColumnType(column);

    switch (columnType) {
      case 'string':
        return STRING_SORT_OPERATORS;
      case 'number':
        return NUMBER_SORT_OPERATORS;
      case 'date':
        return DATE_SORT_OPERATORS;
      default:
        return STRING_SORT_OPERATORS;
    }
  }

  private determineColumnType(
    column: ColumnDefinition<T>
  ): 'string' | 'number' | 'date' {
    if (!this.data.length) return 'string';

    const sampleValue = column.accessorKey
      ? this.data[0][column.accessorKey]
      : column.accessorFn
      ? column.accessorFn(this.data[0])
      : null;

    if (sampleValue instanceof Date) return 'date';
    if (typeof sampleValue === 'number') return 'number';
    return 'string';
  }

  updateSort(columnId: string, direction: 'asc' | 'desc') {
    if (direction) {
      this.selectedSorts.set(columnId, direction);
    } else {
      this.selectedSorts.delete(columnId);
    }
  }

  isColumnSorted(columnId: string, direction: 'asc' | 'desc'): boolean {
    return this.selectedSorts.get(columnId) === direction;
  }

  getColumnHeader(column: ColumnDefinition<T>): string {
    return typeof column.header === 'function'
      ? column.header({})
      : column.header;
  }

  resetAll() {
    this.resetFilter.emit()
    this.selectedSorts.clear();
    this.selectedColumns.clear();
    this.checkAll = false;
  }

  applySorts() {
    // Only emit sorts for selected columns
    const sorts: SortCondition[] = Array.from(this.selectedSorts.entries())
      .filter(([columnId]) => this.selectedColumns.has(columnId))
      .map(([columnId, direction]) => ({
        columnId,
        direction,
      }));
    this.sortApplied.emit(sorts);
  }

  get activeSortCount(): number {
    return Array.from(this.selectedSorts.entries()).filter(([columnId]) =>
      this.selectedColumns.has(columnId)
    ).length;
  }
}
