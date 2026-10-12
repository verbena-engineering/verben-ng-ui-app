import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DataFilterType, IDataFilter } from 'verben-ng-ui/src/lib/models';
import { Config } from 'verben-ng-ui/src/lib/models';
import {
  ColumnDefinition,
  ColumnValueOption,
  ColumnValueType,
} from 'verben-ng-ui/src/lib/components/data-table';
import {
  FilterCondition,
  FilterOperator,
  FilterOperatorType,
  STRING_OPERATORS,
  NUMBER_OPERATORS,
  DATE_OPERATORS,
  BOOL_OPERATORS,
  ENUM_OPERATORS,
} from 'verben-ng-ui/src/lib/components/data-filter';

@Component({
  selector: 'verben-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['../shared/panel.css', './table-filter.component.css'],
})
export class TableFilterComponent implements OnInit, OnChanges {
  @Input() filterOptions: IDataFilter[] = [];
  @Input() columns?: ColumnDefinition<any>[];
  @Input() data?: any[];
  @Input() initialFilters?: FilterCondition[];

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
  @Input() border?: string;
  @Input() borderRadius?: string;
  @Input() selectWidth?: string;
  @Input() maxFilterLength: number = 3;
  @Input() savedFilters: IDataFilter[] = [];
  @Input() tooltip: boolean = false;
  @Input() saveCallback?: (items: IDataFilter[]) => Promise<void>;

  @Output() filtersApplied = new EventEmitter<any>();
  @Output() resetSortData = new EventEmitter<any>();
  @Output() filterApplied = new EventEmitter<FilterCondition[]>();
  @Output() resetFilter = new EventEmitter<void>();

  filterArray: string[] = [];
  selectedFilterValue: string = '';
  selectedFilterType: DataFilterType | null = null;
  conditionOptions: string[] = [];
  selectedCondition: string | undefined = '';
  inputValue?: any;
  selectedFilters: IDataFilter[] = [];
  showAllFilters: boolean = false;
  editIndex: number | null = null;
  checkAll: boolean = false;
  isDuplicateFilter: boolean = false;
  disableAddFilterBtn: boolean = false;
  //disableApplyFilterBtn: boolean = true;
  duplicateMessage?: string = '';
  configInstance: Config;
  storageKey: string = 'savedFilters';
  filterCount: number = 0;

  /** True when columns input was supplied instead of filterOptions */
  isColumnsMode: boolean = false;
  filterableColumns: ColumnDefinition<any>[] = [];
  currentColumnDef?: ColumnDefinition<any>;
  valueOptions: ColumnValueOption[] = [];
  private readonly boolOptions: ColumnValueOption[] = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];
  private columnOperatorMap: Map<string, FilterOperator[]> = new Map();
  private userTouched: boolean = false;

  constructor() {
    this.configInstance = new Config();
  }

  ngOnInit(): void {
    this.setupFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['filterOptions']) {
      this.setupFromInputs();
    }
    if (changes['initialFilters']) {
      this.hydrateSavedFilters();
    }
  }

  private setupFromInputs(): void {
    if (this.columns && this.columns.length > 0) {
      this.isColumnsMode = true;
      this.initializeFromColumns();
      this.hydrateSavedFilters();
    } else {
      this.isColumnsMode = false;
      this.filterArray = (this.filterOptions || []).map((item) => item.name);
      this.filterCount = this.savedFilters.filter(
        (item) => item.checked === true,
      ).length;
    }
  }

  private initializeFromColumns(): void {
    this.filterableColumns = (this.columns || []).filter(
      (col) => col.accessorKey || col.id,
    );
    this.filterArray = this.filterableColumns.map((col) =>
      this.getColumnHeader(col),
    );
    this.buildOperatorMaps();
  }

  private hydrateSavedFilters(): void {
    if (this.userTouched) return;
    if (
      this.isColumnsMode &&
      this.initialFilters &&
      this.initialFilters.length > 0
    ) {
      this.savedFilters = this.initialFilters.map((cond) => {
        const col = this.filterableColumns.find((c) => c.id === cond.columnId);
        const colName = col ? this.getColumnHeader(col) : cond.columnId;
        const colType = col
          ? this.resolveColumnType(col)
          : DataFilterType.String;
        return {
          name: colName,
          type: colType,
          condition: this.mapCodeToConditionLabel(cond.operator),
          value: this.toEditableValue(cond.value, colType),
          checked: true,
          isRequired: !!col?.isRequiredFilter,
        };
      });
      this.filterCount = this.savedFilters.length;
      this.checkAll = true;
    }
  }

  markTouched(): void {
    this.userTouched = true;
  }

  private getColumnHeader(column: ColumnDefinition<any>): string {
    return typeof column.header === 'function'
      ? column.header({})
      : column.header || column.id;
  }

  private buildOperatorMaps(): void {
    this.columnOperatorMap.clear();
    for (const col of this.filterableColumns) {
      const type = this.resolveColumnType(col);
      let ops: FilterOperator[] = [];
      switch (type) {
        case DataFilterType.String:
          ops = STRING_OPERATORS;
          break;
        case DataFilterType.Number:
        case DataFilterType.Integer:
        case DataFilterType.Decimal:
        case DataFilterType.Credit:
          ops = NUMBER_OPERATORS;
          break;
        case DataFilterType.Date:
          ops = DATE_OPERATORS;
          break;
        case DataFilterType.Bool:
          ops = BOOL_OPERATORS;
          break;
        case DataFilterType.Enum:
          ops = ENUM_OPERATORS;
          break;
        default:
          ops = STRING_OPERATORS;
      }
      this.columnOperatorMap.set(col.id, ops);
    }
  }

  private resolveColumnType(column: ColumnDefinition<any>): DataFilterType {
    if (column.valueType) {
      switch (column.valueType) {
        case ColumnValueType.Date:
          return DataFilterType.Date;
        case ColumnValueType.Integer:
          return DataFilterType.Integer;
        case ColumnValueType.Decimal:
          return DataFilterType.Decimal;
        case ColumnValueType.Currency:
        case ColumnValueType.Number:
          return DataFilterType.Number;
        case ColumnValueType.Bool:
          return DataFilterType.Bool;
        case ColumnValueType.Enum:
          return DataFilterType.Enum;
        default:
          return DataFilterType.String;
      }
    }
    // Fallback: infer from data
    return this.inferColumnType(column);
  }

  private inferColumnType(column: ColumnDefinition<any>): DataFilterType {
    if (!this.data || !this.data.length) return DataFilterType.String;
    for (const row of this.data) {
      const val = column.accessorKey
        ? row[column.accessorKey]
        : column.accessorFn
          ? column.accessorFn(row)
          : null;
      if (val !== null && val !== undefined && val !== '') {
        if (val instanceof Date) return DataFilterType.Date;
        if (typeof val === 'number') return DataFilterType.Number;
        if (typeof val === 'boolean') return DataFilterType.Bool;
        if (
          typeof val === 'string' &&
          /^\d{4}-\d{2}-\d{2}/.test(val) &&
          !isNaN(new Date(val).getTime())
        ) {
          return DataFilterType.Date;
        }
        return DataFilterType.String;
      }
    }
    return DataFilterType.String;
  }

  private mapCodeToConditionLabel(operatorCode: string): string {
    const allOps = [
      ...STRING_OPERATORS,
      ...NUMBER_OPERATORS,
      ...DATE_OPERATORS,
      ...BOOL_OPERATORS,
      ...ENUM_OPERATORS,
    ];
    const match = allOps.find((op) => op.value === operatorCode);
    return match ? match.label : operatorCode;
  }

  private mapConditionLabelToCode(
    conditionLabel: string,
    colType?: DataFilterType,
  ): string {
    const allOps = [
      ...STRING_OPERATORS,
      ...NUMBER_OPERATORS,
      ...DATE_OPERATORS,
      ...BOOL_OPERATORS,
      ...ENUM_OPERATORS,
    ];
    const match = allOps.find(
      (op) => op.label.toLowerCase() === (conditionLabel || '').toLowerCase(),
    );
    if (match) return match.value;

    // Fallbacks from Config / ConditionalOptions enum
    const lower = (conditionLabel || '').toLowerCase();
    if (lower === 'contains') return 'contains';
    if (lower === 'on' || lower === 'equals' || lower === 'equal')
      return colType === DataFilterType.Date
        ? 'on'
        : colType === DataFilterType.Number ||
            colType === DataFilterType.Integer
          ? 'equal'
          : 'equals';
    if (lower === 'before' || lower === 'less than' || lower === 'lte')
      return colType === DataFilterType.Date ? 'before' : 'lessThan';
    if (lower === 'after' || lower === 'greater than' || lower === 'gte')
      return colType === DataFilterType.Date ? 'after' : 'greaterThan';
    if (lower === 'neq' || lower === 'is not') return 'isNot';
    if (lower === 'yes' || lower === 'is') return 'is';
    if (lower === 'no') return 'isNot';
    return conditionLabel;
  }

  private normalizeValueOptions(
    options: string[] | ColumnValueOption[] | undefined,
  ): ColumnValueOption[] {
    if (!options || !options.length) return [];
    return (options as unknown[]).map((option) =>
      typeof option === 'string'
        ? { label: option, value: option }
        : (option as ColumnValueOption),
    );
  }

  private toEditableValue(
    val: any,
    type: DataFilterType,
  ): string | number | boolean {
    if (type === DataFilterType.Bool) return `${val}`;
    if (val instanceof Date) {
      const month = `${val.getMonth() + 1}`.padStart(2, '0');
      const day = `${val.getDate()}`.padStart(2, '0');
      return `${val.getFullYear()}-${month}-${day}`;
    }
    return val;
  }

  onFilterNameChange(selectedFilterValue: string) {
    if (this.isColumnsMode) {
      const col = this.filterableColumns.find(
        (c) =>
          this.getColumnHeader(c) === selectedFilterValue ||
          c.id === selectedFilterValue,
      );
      this.currentColumnDef = col;
      if (col) {
        this.selectedFilterType = this.resolveColumnType(col);
        const ops = this.columnOperatorMap.get(col.id) || [];
        this.conditionOptions = ops.map((op) => op.label);
        this.selectedCondition = '';
        this.inputValue = '';
        this.valueOptions =
          this.selectedFilterType === DataFilterType.Bool
            ? this.boolOptions
            : this.selectedFilterType === DataFilterType.Enum
              ? this.normalizeValueOptions(col.valueOptions)
              : [];
      }
      return;
    }

    const selectedFilter = this.filterOptions.find(
      (option) => option.name === selectedFilterValue,
    );

    if (selectedFilter) {
      this.selectedFilterType = selectedFilter.type;
      this.conditionOptions =
        this.configInstance.getConditionOptions(this.selectedFilterType) || [];
      this.selectedCondition = '';
      this.valueOptions =
        this.selectedFilterType === DataFilterType.Bool ? this.boolOptions : [];
    }
  }

  resetFilters() {
    this.userTouched = true;
    this.selectedFilterType = null;
    this.selectedCondition = '';
    this.inputValue = '';

    // In columns mode, check for required filters
    if (this.isColumnsMode) {
      this.savedFilters = this.savedFilters.filter((filter) =>
        this.isRequiredFilter(filter),
      );
      this.savedFilters.forEach((x) => (x.checked = true));
    } else {
      this.savedFilters.forEach((x) => {
        x.checked = false;
      });
    }

    this.editIndex = null;
    this.checkAll =
      this.savedFilters.length > 0 && this.savedFilters.every((f) => f.checked);
    this.isDuplicateFilter = false;
    this.duplicateMessage = '';
    localStorage.removeItem(this.storageKey);
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;

    this.resetSortData.emit();
    this.resetFilter.emit();
    this.applyFilters(true);
  }

  isRequiredFilter(filter: IDataFilter): boolean {
    if (!this.isColumnsMode) return false;
    if (filter.isRequired !== undefined) return filter.isRequired;
    const col = this.filterableColumns.find(
      (c) => this.getColumnHeader(c) === filter.name || c.id === filter.name,
    );
    // If not explicitly set on the filter, only true if no other filter with this column is already required
    return !!col?.isRequiredFilter && this.savedFilters.find((f) => f.name === filter.name) === filter;
  }

  addFilter() {
    this.userTouched = true;
    if (
      !this.selectedFilterValue ||
      !this.selectedCondition ||
      this.inputValue === undefined ||
      this.inputValue === null ||
      this.inputValue === ''
    ) {
      return;
    }

    if (this.editIndex === null && this.isDuplicateFilter) {
      return;
    }

    if (this.selectedFilterType === DataFilterType.Date) {
      const filtersToAdd: IDataFilter[] = [];

      if (Array.isArray(this.inputValue)) {
        // Range / Period: array of two dates [start, end]
        const [rawStart, rawEnd] = this.inputValue;
        const startStr = typeof rawStart === 'string' ? rawStart : rawStart instanceof Date ? rawStart.toISOString() : String(rawStart);
        const endStr = typeof rawEnd === 'string' ? rawEnd : rawEnd instanceof Date ? rawEnd.toISOString() : String(rawEnd);

        // Normalize to day bounds if simple date
        const startVal = startStr.includes('T') ? startStr.replace('T', ' ').slice(0, 16) : startStr.concat(' 00:00');
        const endVal = endStr.includes('T') ? endStr.replace('T', ' ').slice(0, 16) : endStr.concat(' 23:59');

        filtersToAdd.push(
          {
            name: this.selectedFilterValue,
            type: DataFilterType.Date,
            condition: 'After',
            value: startVal,
            checked: true,
          },
          {
            name: this.selectedFilterValue,
            type: DataFilterType.Date,
            condition: 'Before',
            value: endVal,
            checked: true,
          }
        );
      } else if (
        this.selectedCondition === 'On' ||
        this.selectedCondition?.toLowerCase() === 'on' ||
        this.selectedCondition === 'Equal' ||
        this.selectedCondition === 'Equals'
      ) {
        // Single Date with On / Equals: split into After 00:00 and Before 23:59 for backend processing
        let dateBase = '';
        if (typeof this.inputValue === 'string') {
          dateBase = this.inputValue.includes('T') ? this.inputValue.split('T')[0] : this.inputValue.split(' ')[0];
        } else if (this.inputValue instanceof Date) {
          const month = `${this.inputValue.getMonth() + 1}`.padStart(2, '0');
          const day = `${this.inputValue.getDate()}`.padStart(2, '0');
          dateBase = `${this.inputValue.getFullYear()}-${month}-${day}`;
        } else {
          dateBase = String(this.inputValue);
        }

        filtersToAdd.push(
          {
            name: this.selectedFilterValue,
            type: DataFilterType.Date,
            condition: 'After',
            value: dateBase.concat(' 00:00'),
            checked: true,
          },
          {
            name: this.selectedFilterValue,
            type: DataFilterType.Date,
            condition: 'Before',
            value: dateBase.concat(' 23:59'),
            checked: true,
          }
        );
      } else {
        // Single Date with Before / After
        let valStr = '';
        if (typeof this.inputValue === 'string') {
          valStr = this.inputValue.includes('T') ? this.inputValue.replace('T', ' ').slice(0, 16) : this.inputValue;
        } else if (this.inputValue instanceof Date) {
          const month = `${this.inputValue.getMonth() + 1}`.padStart(2, '0');
          const day = `${this.inputValue.getDate()}`.padStart(2, '0');
          valStr = `${this.inputValue.getFullYear()}-${month}-${day}`;
        } else {
          valStr = String(this.inputValue);
        }

        filtersToAdd.push({
          name: this.selectedFilterValue,
          type: DataFilterType.Date,
          condition: this.selectedCondition,
          value: valStr,
          checked: true,
        });
      }

      for (const newFilter of filtersToAdd) {
        if (this.editIndex !== null) {
          const isDuplicate = this.savedFilters.some(
            (filter, index) =>
              filter.name === newFilter.name &&
              filter.condition === newFilter.condition &&
              filter.value === newFilter.value &&
              index !== this.editIndex,
          );
          if (isDuplicate) continue;
          this.savedFilters[this.editIndex] = newFilter;
          this.editIndex = null;
        } else {
          if (
            this.savedFilters.some(
              (filter) =>
                filter.name === newFilter.name &&
                filter.condition === newFilter.condition &&
                filter.value === newFilter.value,
            )
          ) {
            continue;
          }
          this.savedFilters.push(newFilter);
          this.filterCount = this.savedFilters.filter(
            (item) => item.checked === true,
          ).length;
        }
      }
    } else {
      const newFilter: IDataFilter = {
        name: this.selectedFilterValue,
        type: this.selectedFilterType || DataFilterType.String,
        condition: this.selectedCondition,
        value: this.inputValue,
        checked: true,
      };

      if (this.editIndex !== null) {
        const isDuplicate = this.savedFilters.some(
          (filter, index) =>
            filter.name === newFilter.name &&
            filter.condition === newFilter.condition &&
            filter.value === newFilter.value &&
            index !== this.editIndex,
        );

        if (isDuplicate) {
          return;
        }
        this.savedFilters[this.editIndex] = newFilter;
        this.editIndex = null;
      } else {
        if (
          this.savedFilters.some(
            (filter) =>
              filter.name === newFilter.name &&
              filter.condition === newFilter.condition &&
              filter.value === newFilter.value,
          )
        ) {
          return;
        }
        this.savedFilters.push(newFilter);
        this.filterCount = this.savedFilters.filter(
          (item) => item.checked === true,
        ).length;
      }
    }

    this.clearOperationSection();
  }

  toggleCheckbox(index: number) {
    this.userTouched = true;
    this.savedFilters[index].checked = !this.savedFilters[index].checked;
    this.checkAll = this.savedFilters.every((item) => item.checked);
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;
  }

  deleteFilter(index: number) {
    this.userTouched = true;
    if (this.isRequiredFilter(this.savedFilters[index])) return;

    this.savedFilters.splice(index, 1);
    this.checkDuplicateFilter();
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;
    if (this.savedFilters.length === 0) {
      this.checkAll = false;
    }
    if (this.saveCallback) {
      this.saveCallback(this.savedFilters);
    }
  }

  editFilter(index: number) {
    this.userTouched = true;
    const filter = this.savedFilters[index];
    this.selectedFilterType = filter.type;
    this.selectedFilterValue = filter.name;
    this.onFilterNameChange(this.selectedFilterValue);
    this.selectedCondition = filter.condition;
    this.inputValue = filter.value;
    this.editIndex = index;
  }

  applyFilters(skipSave: boolean = false) {
    this.userTouched = true;
    this.selectedFilters = this.savedFilters.filter(
      (filter) => filter.checked || this.isRequiredFilter(filter),
    );
    if (this.saveCallback && !skipSave) {
      this.saveCallback(this.savedFilters);
    }

    // Emit classic outputs
    this.filtersApplied.emit(this.selectedFilters);
    if (!skipSave) {
      this.filtersApplied.emit(this.storageKey);
    }

    // Convert and emit for DataFilter consumers
    const dataFilterConditions: FilterCondition[] = this.selectedFilters.map(
      (f) => {
        let colId = f.name;
        if (this.isColumnsMode) {
          const col = this.filterableColumns.find(
            (c) => this.getColumnHeader(c) === f.name || c.id === f.name,
          );
          if (col) colId = col.id;
        }
        const operator = this.mapConditionLabelToCode(
          f.condition || '',
          f.type,
        );
        let value: any = f.value;
        if (f.type === DataFilterType.Bool && typeof value === 'string') {
          value = value === 'true';
        }
        return {
          columnId: colId,
          operator,
          value,
        };
      },
    );

    this.filterApplied.emit(dataFilterConditions);
  }

  toggleShowMore() {
    this.showAllFilters = !this.showAllFilters;
  }

  get visibleFilters() {
    // If columns mode, sort required filters first
    const sorted = this.isColumnsMode
      ? [
          ...this.savedFilters.filter((f) => this.isRequiredFilter(f)),
          ...this.savedFilters.filter((f) => !this.isRequiredFilter(f)),
        ]
      : this.savedFilters;

    return this.showAllFilters ? sorted : sorted.slice(0, this.maxFilterLength);
  }

  clearOperationSection() {
    this.selectedFilterValue = '';
    this.selectedCondition = '';
    this.inputValue = '';
    this.editIndex = null;
  }

  toggleSelectAll(): void {
    this.userTouched = true;
    this.checkAll = !this.checkAll;
    this.savedFilters.forEach((filter) => {
      if (this.isRequiredFilter(filter)) {
        filter.checked = true;
      } else {
        filter.checked = this.checkAll;
      }
    });
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;
  }

  checkDuplicateFilter(): void {
    if (this.editIndex !== null) {
      const exists = this.savedFilters.some(
        (filter, index) =>
          filter.name === this.selectedFilterValue &&
          filter.condition === this.selectedCondition &&
          filter.value === this.inputValue &&
          index !== this.editIndex,
      );
      this.disableAddFilterBtn = exists;
      this.isDuplicateFilter = exists;
      this.duplicateMessage = exists
        ? 'This entry is a duplicate and cannot be added.'
        : '';
    } else {
      const exists = this.savedFilters.some(
        (filter) =>
          filter.name === this.selectedFilterValue &&
          filter.condition === this.selectedCondition &&
          filter.value === this.inputValue,
      );
      this.disableAddFilterBtn = exists;
      this.isDuplicateFilter = exists;
      this.duplicateMessage = exists
        ? 'This entry is a duplicate and cannot be added.'
        : '';
    }
  }
}
