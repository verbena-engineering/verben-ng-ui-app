import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ColumnDefinition } from '../data-table/data-table.types';
import {
  FilterOperator,
  FilterCondition,
  FilterGroup,
  STRING_OPERATORS,
  NUMBER_OPERATORS,
  DATE_OPERATORS,
} from './data-filter.types';

@Component({
  selector: 'lib-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrl: './data-filter.component.css',
})
export class DataFilterComponent<T> implements OnInit {
  @Input() columns!: ColumnDefinition<T>[];
  @Input() data!: T[];
  @Output() filterApplied = new EventEmitter<FilterCondition[]>();
  @Output() resetFilter = new EventEmitter();
  filterableColumns: ColumnDefinition<T>[] = [];
  availableOperators: FilterOperator[] = [];
  savedFilters: (FilterCondition & { selected: boolean })[] = [];
  currentFilter: Partial<FilterCondition> = {};
  showAllFilters = false;
  maxVisibleItems = 3;
  currentColumnType: 'string' | 'number' | 'date' | null = null;

  ngOnInit() {
    this.initializeFilterableColumns();
  }

  private initializeFilterableColumns() {
    this.filterableColumns = this.columns.filter((col) => col.accessorKey);
  }

  onColumnSelect(columnId: string) {
    const column = this.filterableColumns.find((col) => col.id === columnId);
    if (!column) return;

    this.currentFilter.columnId = columnId;

    // Reset other values
    this.currentFilter.operator = undefined;
    this.currentFilter.value = undefined;

    // Determine column type and set available operators
    this.currentColumnType = this.determineColumnType(column);

    switch (this.currentColumnType) {
      case 'string':
        this.availableOperators = STRING_OPERATORS;
        break;
      case 'number':
        this.availableOperators = NUMBER_OPERATORS;
        break;
      case 'date':
        this.availableOperators = DATE_OPERATORS;
        break;
      default:
        this.availableOperators = [];
    }
  }

  addFilter() {
    if (
      !this.currentFilter.columnId ||
      !this.currentFilter.operator ||
      !this.currentFilter.value
    ) {
      return;
    }

    const newFilter: FilterCondition & { selected: boolean } = {
      columnId: this.currentFilter.columnId!,
      operator: this.currentFilter.operator,
      value: this.currentFilter.value,
      selected: true,
    };

    this.savedFilters.unshift(newFilter);
    this.resetCurrentFilter();
  }

  getFilterDescription(filter: FilterCondition): string {
    const column = this.filterableColumns.find(
      (col) => col.id === filter.columnId
    );
    if (!column) return '';

    const columnName =
      typeof column.header === 'function' ? column.header({}) : column.header;

    const operator = this.getOperatorLabel(filter.operator);

    let value = filter.value;
    if (value instanceof Date) {
      value = (value as Date).toLocaleDateString();
    }

    return `${columnName} ${operator} ${value}`;
  }

  private getOperatorLabel(operatorValue: string): string {
    const operator = [
      ...STRING_OPERATORS,
      ...NUMBER_OPERATORS,
      ...DATE_OPERATORS,
    ].find((op) => op.value === operatorValue);
    return operator ? operator.label.toLowerCase() : operatorValue;
  }

  private determineColumnType(
    column: ColumnDefinition<T>
  ): 'string' | 'number' | 'date' | null {
    if (!this.data.length) return null;

    const sampleValue = column.accessorKey
      ? this.data[0][column.accessorKey]
      : column.accessorFn
      ? column.accessorFn(this.data[0])
      : null;

    if (sampleValue === null) return null;

    if (sampleValue instanceof Date) return 'date';
    if (typeof sampleValue === 'number') return 'number';
    return 'string';
  }

  private resetCurrentFilter() {
    this.currentFilter = {};
    this.availableOperators = [];
  }

  resetAll() {
  
    this.savedFilters = [];
    this.resetCurrentFilter();
    this.resetFilter.emit()
  }

  applyFilters() {
    const activeFilters = this.savedFilters
      .filter((filter) => filter.selected)
      .map(({ columnId, operator, value }) => ({
        columnId,
        operator,
        value,
      }));
    this.filterApplied.emit(activeFilters);
  }

  getColumnLabel(columnId: string): string {
    const column = this.filterableColumns.find((col) => col.id === columnId);
    return column
      ? typeof column.header === 'function'
        ? column.header({})
        : column.header
      : columnId;
  }

  get visibleFilters() {
    return this.showAllFilters
      ? this.savedFilters
      : this.savedFilters.slice(0, this.maxVisibleItems);
  }

  get activeFilterCount(): number {
    return this.savedFilters.filter((filter) => filter.selected).length;
  }
}
