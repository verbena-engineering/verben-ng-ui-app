import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DataFilterType } from 'verben-ng-ui/src/lib/models';
import { IDataFilter } from 'verben-ng-ui/src/lib/models';
import {
  ColumnDefinition,
  ColumnValueType,
} from 'verben-ng-ui/src/lib/components/data-table';
import {
  SortCondition,
  SortDirection,
} from 'verben-ng-ui/src/lib/components/data-sort';

@Component({
  selector: 'verben-sort-table',
  templateUrl: './sort-table.component.html',
  styleUrls: ['../shared/panel.css', './sort-table.component.css'],
})
export class SortTableComponent<T = any> implements OnInit, OnChanges {
  @Input() enableDragAndDrop: boolean = false;
  @Input() sortOptions: IDataFilter[] = [];
  /** Drop-in support for ColumnDefinition[] (data-sort) */
  @Input() columns?: ColumnDefinition<T>[];
  /** Drop-in support for data rows (used for type inference if needed) */
  @Input() data?: T[];

  @Input() resetText: string = 'Reset';
  @Input() displayedOptions: number = 4;
  @Input() propertyText: string = 'Property';
  @Input() showMoreText: string = 'Show more';
  @Input() sortButtonText: string = 'Confirm';
  @Input() pd?: string;
  @Input() mg?: string;
  @Input() height?: string;
  @Input() width?: string;
  @Input() bgColor?: string;
  @Input() boxShadow?: string;
  @Input() textColor?: string;
  @Input() primaryColor?: string;
  @Input() secondaryColor?: string;
  @Input() tertiaryColor?: string;
  @Input() border?: string = '';
  @Input() borderRadius?: string;
  @Input() selectWidth?: string;
  @Input() containerHeight?: string = '400px';

  /** Classic outputs */
  @Output() selectedOptions = new EventEmitter<IDataFilter[]>();
  @Output() resetSortData = new EventEmitter();

  /** Drop-in outputs matching lib-data-sort */
  @Output() sortApplied = new EventEmitter<SortCondition[]>();
  @Output() resetFilter = new EventEmitter();

  draggedIndex: number | null = null;
  visibleSortOptions: IDataFilter[] = [];
  hiddenSortOptions: IDataFilter[] = [];
  showMore: boolean = false;
  disableSortButton: boolean = false;
  selectedOrders: Map<number, 'asc' | 'desc'> = new Map();
  defaultSortOptions: IDataFilter[] = [];
  checkAll: boolean = false;

  /** True when columns input was provided */
  isColumnsMode: boolean = false;
  filterableColumns: ColumnDefinition<T>[] = [];

  ngOnInit() {
    this.setupFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['sortOptions'] || changes['data']) {
      this.setupFromInputs();
    }
  }

  private setupFromInputs(): void {
    if (this.columns && this.columns.length > 0) {
      this.isColumnsMode = true;
      this.filterableColumns = this.columns.filter(
        (col) => col.accessorKey || col.id,
      );
      this.sortOptions = this.filterableColumns.map((col) => ({
        name: this.getColumnHeader(col),
        type: this.resolveColumnType(col),
        checked: false,
      }));
      this.defaultSortOptions = [...this.sortOptions];
      this.updateVisibleOptions();
      this.updateSortButtonState();
    } else {
      this.isColumnsMode = false;
      this.defaultSortOptions = [...this.sortOptions];
      this.updateVisibleOptions();
      this.updateSortButtonState();
    }
  }

  private getColumnHeader(column: ColumnDefinition<T>): string {
    return typeof column.header === 'function'
      ? column.header({})
      : column.header || column.id;
  }

  private resolveColumnType(column: ColumnDefinition<T>): DataFilterType {
    if (column.valueType) {
      switch (column.valueType) {
        case ColumnValueType.Date:
          return DataFilterType.Date;
        case ColumnValueType.Integer:
        case ColumnValueType.Number:
        case ColumnValueType.Decimal:
        case ColumnValueType.Currency:
          return DataFilterType.Number;
        default:
          return DataFilterType.String;
      }
    }
    // Fallback: infer from data
    if (this.data && this.data.length > 0) {
      const sample = column.accessorKey
        ? (this.data[0] as any)[column.accessorKey]
        : column.accessorFn
        ? column.accessorFn(this.data[0])
        : null;
      if (sample instanceof Date) return DataFilterType.Date;
      if (typeof sample === 'number') return DataFilterType.Number;
    }
    return DataFilterType.String;
  }

  updateVisibleOptions() {
    if (this.sortOptions.length > this.displayedOptions) {
      this.visibleSortOptions = this.sortOptions.slice(
        0,
        this.displayedOptions,
      );
      this.hiddenSortOptions = this.sortOptions.slice(this.displayedOptions);
      this.showMore = true;
    } else {
      this.visibleSortOptions = this.sortOptions;
      this.showMore = false;
    }
  }

  toggleShowMore() {
    if (this.showMoreText === 'Show more') {
      this.visibleSortOptions.push(...this.hiddenSortOptions);
      this.showMoreText = 'Show less';
    } else {
      this.updateVisibleOptions();
      this.showMoreText = 'Show more';
    }
  }
  applySort() {
    const selectedSortDetails = this.sortOptions.reduce<IDataFilter[]>(
      (acc, sort, index) => {
        if (sort.checked) {
          acc.push({
            name: sort.name,
            type: sort.type || 'String',
            value:
              this.getSortOrder(
                sort.type,
                this.selectedOrders.get(index) || 'asc',
              ) || '',
            checked: sort.checked || false,
          });
        }
        return acc;
      },
      [],
    );
    this.selectedOptions.emit(selectedSortDetails);

    // Emit SortCondition[] matching lib-data-sort
    const sortConditions: SortCondition[] = this.sortOptions.reduce<SortCondition[]>(
      (acc, sort, index) => {
        if (sort.checked) {
          let columnId = sort.name;
          if (this.isColumnsMode) {
            const col = this.filterableColumns.find(
              (c) => this.getColumnHeader(c) === sort.name || c.id === sort.name,
            );
            if (col) columnId = col.id;
          }
          const order = this.selectedOrders.get(index) || 'asc';
          acc.push({
            columnId,
            direction: order === 'desc' ? SortDirection.Desc : SortDirection.Asc,
          });
        }
        return acc;
      },
      [],
    );
    this.sortApplied.emit(sortConditions);

    return selectedSortDetails;
  }
  getSortOrder(type: DataFilterType, selectedOrder: 'asc' | 'desc') {
    if (type === 'Number') {
      return selectedOrder === 'asc' ? 'asc' : 'desc';
    } else if (type === 'String') {
      return selectedOrder === 'asc' ? 'asc' : 'desc';
    } else if (type === 'Date') {
      return selectedOrder === 'asc' ? 'asc' : 'desc';
    }
    return null;
  }

  toggleSort(index: number) {
    const option = this.sortOptions[index];
    option.checked = !option.checked;
    if (!option.checked) {
      this.checkAll = false;
    } else if (this.sortOptions.every((option) => option.checked)) {
      this.checkAll = true;
    }

    if (option.checked) {
      this.selectedOrders.set(index, 'asc');
    } else {
      this.selectedOrders.delete(index);
    }
    this.updateSortButtonState();
  }
  toggleSelectAll() {
    this.checkAll = !this.checkAll; // Toggle checkAll state

    // Set all options to checked/unchecked and assign default sort order when checked
    this.sortOptions.forEach((option, index) => {
      option.checked = this.checkAll;

      if (this.checkAll) {
        // If checked, set the default sort order to 'asc' for all
        this.selectedOrders.set(index, 'asc');
      } else {
        // If unchecked, remove the sort order
        this.selectedOrders.delete(index);
      }
    });

    this.updateSortButtonState(); // Update the state of the sort button
  }

  resetSort() {
    this.sortOptions.forEach((option, index) => {
      option.checked = false;
      this.selectedOrders.delete(index);
    });

    this.sortOptions = [...this.defaultSortOptions];
    this.updateVisibleOptions();
    this.updateSortButtonState();
    this.checkAll = false;
    this.resetSortData.emit();
    this.resetFilter.emit();
    this.applySort();
  }

  /** Alias matching lib-data-sort method */
  resetAll() {
    this.resetSort();
  }

  /** Alias matching lib-data-sort method */
  applySorts() {
    return this.applySort();
  }

  /** Alias matching lib-data-sort property */
  get activeSortCount(): number {
    return this.countSelectedSorts();
  }

  updateSortButtonState() {
    this.disableSortButton = this.countSelectedSorts() === 0;
  }

  countSelectedSorts(): number {
    return this.sortOptions.filter((option) => option.checked).length;
  }

  setSortOrder(index: number, order: 'asc' | 'desc') {
    this.selectedOrders.set(index, order);
  }

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
    if (this.draggedIndex !== null) {
      this.swapColumns(this.draggedIndex, index);
    }
  }

  swapColumns(fromIndex: number, toIndex: number) {
    if (
      fromIndex < this.visibleSortOptions.length &&
      toIndex < this.visibleSortOptions.length
    ) {
      const temp = this.visibleSortOptions[fromIndex];
      this.visibleSortOptions[fromIndex] = this.visibleSortOptions[toIndex];
      this.visibleSortOptions[toIndex] = temp;

      const globalFromIndex = this.sortOptions.indexOf(temp);
      const globalToIndex = this.sortOptions.indexOf(
        this.visibleSortOptions[fromIndex],
      );

      if (globalFromIndex !== -1 && globalToIndex !== -1) {
        const tempGlobal = this.sortOptions[globalFromIndex];
        this.sortOptions[globalFromIndex] = this.sortOptions[globalToIndex];
        this.sortOptions[globalToIndex] = tempGlobal;
      }
    }
    this.draggedIndex = null;
  }
}
