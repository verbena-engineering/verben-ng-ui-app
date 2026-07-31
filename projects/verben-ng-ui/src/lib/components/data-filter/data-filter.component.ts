import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ColumnDefinition,
  ColumnValueOption,
  ColumnValueType,
} from 'verben-ng-ui/src/lib/components/data-table';
import {
  FilterOperator,
  FilterOperatorType,
  FilterCondition,
  FilterGroup,
  STRING_OPERATORS,
  NUMBER_OPERATORS,
  DATE_OPERATORS,
  BOOL_OPERATORS,
  ENUM_OPERATORS,
} from './data-filter.types';

/** A filter chip in the panel's list: a condition plus its active state. */
type SavedFilter = FilterCondition & { selected: boolean };

@Component({
  selector: 'lib-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrl: './data-filter.component.css',
})
export class DataFilterComponent<T> implements OnInit, OnChanges {
  @Input() columns!: ColumnDefinition<T>[];
  @Input() data!: T[];
  /**
   * Optional restored filters: the panel opens pre-populated with these as
   * selected filter chips. Applied once (the first time a non-empty value
   * arrives) so it never clobbers the user's in-progress edits afterwards.
   */
  @Input() initialFilters?: FilterCondition[];
  @Output() filterApplied = new EventEmitter<FilterCondition[]>();
  @Output() resetFilter = new EventEmitter();
  filterableColumns: ColumnDefinition<T>[] = [];
  availableOperators: FilterOperator[] = [];
  savedFilters: SavedFilter[] = [];
  currentFilter: Partial<FilterCondition> = {};
  showAllFilters = false;
  maxVisibleItems = 3;
  currentColumnType: FilterOperatorType | null = null;
  /**
   * Options for the value dropdown when the selected column is bool or enum.
   * Always normalised to `{ label, value }` so the template binds one shape.
   */
  valueOptions: ColumnValueOption[] = [];
  /**
   * Held as strings rather than booleans: `verben-drop-down` gates its selected
   * label on a truthiness check, so an option valued `false` would render as
   * though nothing were picked. Coerced back to a boolean in `addFilter`.
   */
  private readonly boolOptions: ColumnValueOption[] = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];
  // Set once the user edits the panel, so restored/host filters no longer
  // overwrite their in-progress work.
  private userTouched = false;
  /**
   * The saved filter currently loaded into the operation row, if any. Held by
   * reference rather than by index so deleting or reordering another filter
   * cannot retarget the write-back.
   */
  private editingFilter: SavedFilter | null = null;

  ngOnInit() {
    this.initializeFilterableColumns();
    this.hydrateSavedFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Pick up filters restored asynchronously by the host after first render.
    if (changes['initialFilters']) {
      this.hydrateSavedFilters();
    }
  }

  /**
   * Seed the saved-filter chips from the restored filters. Skipped once the user
   * has touched the panel so it never overwrites their in-progress edits.
   */
  private hydrateSavedFilters() {
    if (this.userTouched) return;
    this.savedFilters = (this.initialFilters ?? []).map((filter) => ({
      ...filter,
      selected: true,
    }));
  }

  /** Marks the panel as user-edited (called from template interactions). */
  markTouched() {
    this.userTouched = true;
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

    this.applyColumnContext(column);
  }

  /**
   * Derives the value control, operators and options for a column without
   * touching the operator or value already in the operation row — `editFilter`
   * depends on those surviving, where `onColumnSelect` clears them first.
   */
  private applyColumnContext(column: ColumnDefinition<T>) {
    this.currentColumnType = this.resolveColumnType(column);
    this.valueOptions =
      this.currentColumnType === 'bool'
        ? this.boolOptions
        : this.currentColumnType === 'enum'
        ? this.normalizeValueOptions(column.valueOptions)
        : [];

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
      case 'bool':
        this.availableOperators = BOOL_OPERATORS;
        break;
      case 'enum':
        this.availableOperators = ENUM_OPERATORS;
        break;
      default:
        this.availableOperators = [];
    }
  }

  addFilter() {
    const value = this.currentFilter.value;
    // Checked explicitly rather than for falsiness: `false` is a valid bool
    // filter and `0` a valid number one.
    const hasValue = value !== undefined && value !== null && value !== '';

    if (!this.currentFilter.columnId || !this.currentFilter.operator || !hasValue) {
      return;
    }

    const condition: FilterCondition = {
      columnId: this.currentFilter.columnId!,
      operator: this.currentFilter.operator,
      // Bool values round-trip through the dropdown as strings; hosts receive
      // a real boolean.
      value: this.currentColumnType === 'bool' ? value === 'true' : value!,
    };

    // Written back over the filter being edited, and over the existing chip of a
    // required column, so neither case leaves a stale duplicate behind. Updated
    // in place rather than removed and re-added so the chip keeps its position.
    const target =
      this.editingFilter ??
      (this.isRequiredColumn(condition.columnId)
        ? this.savedFilters.find((f) => f.columnId === condition.columnId)
        : undefined);

    if (target) {
      Object.assign(target, condition);
      target.selected = true;
    } else {
      this.savedFilters.unshift({ ...condition, selected: true });
    }

    this.editingFilter = null;
    this.userTouched = true;
    this.resetCurrentFilter();
  }

  /** Loads a saved filter back into the operation row for correction. */
  editFilter(filter: SavedFilter) {
    const column = this.filterableColumns.find(
      (col) => col.id === filter.columnId
    );
    if (!column) return;

    this.applyColumnContext(column);
    this.currentFilter = {
      columnId: filter.columnId,
      operator: filter.operator,
      value: this.toEditableValue(filter.value),
    };
    this.editingFilter = filter;
    this.userTouched = true;
  }

  /**
   * Converts a stored value back into what the value control expects: bools are
   * held as real booleans but the dropdown's options are the strings
   * 'true'/'false' (see `boolOptions`), and the native date input needs
   * 'YYYY-MM-DD' rather than a `Date` a host may have restored.
   */
  private toEditableValue(value: FilterCondition['value']) {
    if (this.currentColumnType === 'bool') return `${value}`;
    if (value instanceof Date) {
      // Built from the local parts: `toISOString` shifts to UTC and would move
      // the date a day back west of Greenwich.
      const month = `${value.getMonth() + 1}`.padStart(2, '0');
      const day = `${value.getDate()}`.padStart(2, '0');
      return `${value.getFullYear()}-${month}-${day}`;
    }
    return value;
  }

  /** Removes a saved filter. Required filters cannot be removed. */
  deleteFilter(filter: SavedFilter) {
    if (this.isRequired(filter)) return;

    const index = this.savedFilters.indexOf(filter);
    if (index === -1) return;

    this.savedFilters.splice(index, 1);
    if (this.editingFilter === filter) this.clearCurrentFilter();
    this.userTouched = true;
  }

  /** Empties the operation row, abandoning any edit in progress. */
  clearCurrentFilter() {
    this.editingFilter = null;
    this.resetCurrentFilter();
  }

  /** True when the filter's column is declared `isRequiredFilter`. */
  isRequired(filter: FilterCondition): boolean {
    return this.isRequiredColumn(filter.columnId);
  }

  private isRequiredColumn(columnId: string): boolean {
    const column = this.filterableColumns.find((col) => col.id === columnId);
    return !!column?.isRequiredFilter;
  }

  isEditing(filter: SavedFilter): boolean {
    return this.editingFilter === filter;
  }

  /**
   * Locks the property dropdown while a required filter is being edited —
   * switching it to another column would drop the required filter entirely.
   */
  get isEditingRequired(): boolean {
    return !!this.editingFilter && this.isRequired(this.editingFilter);
  }

  getFilterDescription(filter: FilterCondition): string {
    const column = this.filterableColumns.find(
      (col) => col.id === filter.columnId
    );
    if (!column) return '';

    const columnName =
      typeof column.header === 'function' ? column.header({}) : column.header;

    const operator = this.getOperatorLabel(filter.operator);

    return `${columnName} ${operator} ${this.getValueLabel(column, filter.value)}`;
  }

  /** Renders a stored filter value the way it was chosen, not as raw data. */
  private getValueLabel(
    column: ColumnDefinition<T>,
    value: FilterCondition['value']
  ): string {
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    // The native date input yields a 'YYYY-MM-DD' string; restored filters may
    // carry one too. Parsed as local time — `new Date('2026-07-28')` is treated
    // as UTC and would display as the previous day west of Greenwich.
    if (typeof value === 'string' && this.isDateString(value)) {
      const [year, month, day] = value.slice(0, 10).split('-').map(Number);
      return new Date(year, month - 1, day).toLocaleDateString();
    }

    const option = this.normalizeValueOptions(column.valueOptions).find(
      (candidate) => candidate.value === value
    );
    return option ? option.label : `${value}`;
  }

  private getOperatorLabel(operatorValue: string): string {
    const operator = [
      ...STRING_OPERATORS,
      ...NUMBER_OPERATORS,
      ...DATE_OPERATORS,
      ...BOOL_OPERATORS,
      ...ENUM_OPERATORS,
    ].find((op) => op.value === operatorValue);
    return operator ? operator.label.toLowerCase() : operatorValue;
  }

  /**
   * Prefers the type declared on the column, falling back to inspecting the data
   * only when the host has not declared one.
   */
  private resolveColumnType(column: ColumnDefinition<T>): FilterOperatorType {
    if (column.valueType) {
      // An Enum with no declared members has nothing to populate a dropdown
      // with, so it degrades to a free-text filter rather than an empty select.
      if (
        column.valueType === ColumnValueType.Enum &&
        !this.normalizeValueOptions(column.valueOptions).length
      ) {
        return 'string';
      }
      return this.mapValueType(column.valueType);
    }

    return this.inferColumnType(column);
  }

  private mapValueType(valueType: ColumnValueType): FilterOperatorType {
    switch (valueType) {
      case ColumnValueType.Date:
        return 'date';
      case ColumnValueType.Number:
      case ColumnValueType.Integer:
      case ColumnValueType.Decimal:
      case ColumnValueType.Currency:
        return 'number';
      case ColumnValueType.Bool:
        return 'bool';
      case ColumnValueType.Enum:
        return 'enum';
      default:
        return 'string';
    }
  }

  /**
   * Best-effort type detection for columns that declare no `valueType`. Falls
   * back to 'string' rather than null so the value field always renders.
   */
  private inferColumnType(column: ColumnDefinition<T>): FilterOperatorType {
    const sampleValue = this.firstNonEmptyValue(column);

    if (sampleValue instanceof Date) return 'date';
    if (typeof sampleValue === 'number') return 'number';
    if (typeof sampleValue === 'boolean') return 'bool';
    if (typeof sampleValue === 'string' && this.isDateString(sampleValue)) {
      return 'date';
    }
    return 'string';
  }

  /**
   * Scans rows for the first usable sample — sampling only the first row misses
   * the type whenever that row happens to hold a null or undefined value.
   */
  private firstNonEmptyValue(column: ColumnDefinition<T>): unknown {
    for (const row of this.data ?? []) {
      const value = this.readValue(column, row);
      if (value !== null && value !== undefined && value !== '') return value;
    }
    return null;
  }

  private readValue(column: ColumnDefinition<T>, row: T): unknown {
    if (column.accessorKey) return row[column.accessorKey];
    if (column.accessorFn) return column.accessorFn(row);
    return null;
  }

  /**
   * Dates usually arrive from an API as ISO strings, which would otherwise be
   * typed as plain text. Anchored to ISO-ish input so ordinary strings that
   * `Date` happens to parse (e.g. "March") are not misread as dates.
   */
  private isDateString(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}([T\s]|$)/.test(value)) return false;
    return !Number.isNaN(new Date(value).getTime());
  }

  /** Accepts either supported `valueOptions` shape and returns one of them. */
  private normalizeValueOptions(
    options: string[] | ColumnValueOption[] | undefined
  ): ColumnValueOption[] {
    if (!options?.length) return [];
    return (options as unknown[]).map((option) =>
      typeof option === 'string'
        ? { label: option, value: option }
        : (option as ColumnValueOption)
    );
  }

  private resetCurrentFilter() {
    this.currentFilter = {};
    this.availableOperators = [];
    this.currentColumnType = null;
    this.valueOptions = [];
  }

  resetAll() {
    this.userTouched = true;
    this.savedFilters = this.savedFilters.filter((filter) =>
      this.isRequired(filter)
    );
    this.clearCurrentFilter();

    // Required filters survive a reset, so the host is told what is left rather
    // than that everything is gone — a bare `resetFilter` would leave the panel
    // showing chips the host is no longer filtering by.
    if (this.savedFilters.length) {
      this.applyFilters();
      return;
    }
    this.resetFilter.emit();
  }

  applyFilters() {
    this.userTouched = true;
    const activeFilters = this.savedFilters
      // Required filters are emitted whether or not they are ticked: their
      // checkbox is disabled, but the host must never be left without them.
      .filter((filter) => filter.selected || this.isRequired(filter))
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

  /**
   * Required filters pinned to the top so the collapsed list can never hide one
   * behind "Show More".
   */
  get orderedFilters(): SavedFilter[] {
    return [
      ...this.savedFilters.filter((filter) => this.isRequired(filter)),
      ...this.savedFilters.filter((filter) => !this.isRequired(filter)),
    ];
  }

  get visibleFilters(): SavedFilter[] {
    return this.showAllFilters
      ? this.orderedFilters
      : this.orderedFilters.slice(0, this.maxVisibleItems);
  }

  get activeFilterCount(): number {
    return this.savedFilters.filter(
      (filter) => filter.selected || this.isRequired(filter)
    ).length;
  }
}
