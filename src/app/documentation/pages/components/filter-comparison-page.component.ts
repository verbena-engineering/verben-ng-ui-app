import { Component, OnInit } from '@angular/core';
import {
  ColumnDefinition,
  ColumnValueType,
  DataFilterType,
  IDataFilter,
  FilterCondition,
  SortCondition,
  SortDirection,
} from 'verben-ng-ui';
import { DocsProp } from '../../docs-kit/props-table.component';

interface DemoUser {
  id: string;
  name: string;
  role: string;
  age: number;
  active: boolean;
  joinDate: string;
}

@Component({
  selector: 'docs-filter-comparison-page',
  templateUrl: './filter-comparison-page.component.html',
  styleUrls: ['./filter-comparison-page.component.scss'],
})
export class FilterComparisonPageComponent implements OnInit {
  // ================= FILTER SECTION =================
  classicFilterOptions: IDataFilter[] = [
    { name: 'Full Name', type: DataFilterType.String, checked: false },
    { name: 'Account Role', type: DataFilterType.Enum, checked: false },
    { name: 'User Age', type: DataFilterType.Integer, checked: false },
    { name: 'Active Account', type: DataFilterType.Bool, checked: false },
    { name: 'Join Date', type: DataFilterType.Date, checked: false },
  ];

  classicSavedFilters: IDataFilter[] = [
    {
      name: 'Account Role',
      type: DataFilterType.Enum,
      condition: 'is',
      value: 'Administrator',
      checked: true,
      isRequired: true,
    },
    {
      name: 'User Age',
      type: DataFilterType.Integer,
      condition: 'greaterThan',
      value: 25,
      checked: true,
    },
  ];

  classicAppliedOutput: IDataFilter[] | null = null;
  columnsClassicAppliedOutput: IDataFilter[] | null = null;

  columnsDefinition: ColumnDefinition<DemoUser>[] = [
    {
      id: 'name',
      header: 'Full Name',
      accessorKey: 'name',
      valueType: ColumnValueType.String,
    },
    {
      id: 'role',
      header: 'Account Role',
      accessorKey: 'role',
      valueType: ColumnValueType.Enum,
      valueOptions: ['Administrator', 'Editor', 'Viewer'],
      isRequiredFilter: true,
    },
    {
      id: 'age',
      header: 'User Age',
      accessorKey: 'age',
      valueType: ColumnValueType.Integer,
    },
    {
      id: 'active',
      header: 'Active Account',
      accessorKey: 'active',
      valueType: ColumnValueType.Bool,
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      accessorKey: 'joinDate',
      valueType: ColumnValueType.Date,
    },
  ];

  tableData: DemoUser[] = [
    { id: '1', name: 'Alice Smith', role: 'Administrator', age: 32, active: true, joinDate: '2025-01-15' },
    { id: '2', name: 'Bob Jones', role: 'Editor', age: 28, active: false, joinDate: '2025-06-20' },
  ];

  initialFilters: FilterCondition[] = [
    { columnId: 'role', operator: 'is', value: 'Administrator' },
    { columnId: 'age', operator: 'greaterThan', value: 25 },
  ];

  columnsAppliedOutput: FilterCondition[] | null = null;
  dataFilterAppliedOutput: FilterCondition[] | null = null;

  // ================= SORT SECTION =================
  classicSortOptions: IDataFilter[] = [
    { name: 'Full Name', type: DataFilterType.String, checked: false },
    { name: 'User Age', type: DataFilterType.Number, checked: false },
    { name: 'Join Date', type: DataFilterType.Date, checked: false },
  ];

  classicSortOutput: IDataFilter[] | null = null;
  unifiedSortOutput: SortCondition[] | null = null;
  dataSortOutput: SortCondition[] | null = null;

  code = {
    classicFilter: `<!-- Classic TableFilter mode -->
<verben-table-filter
  width="100%"
  [filterOptions]="classicFilterOptions"
  [maxFilterLength]="3"
  (filtersApplied)="onClassicApplied($event)"
></verben-table-filter>`,

    unifiedFilter: `<!-- Unified TableFilter (drop-in for lib-data-filter) -->
<verben-table-filter
  width="100%"
  [columns]="columnsDefinition"
  [data]="tableData"
  [initialFilters]="initialFilters"
  (filterApplied)="onColumnsApplied($event)"
  (resetFilter)="onColumnsReset()"
></verben-table-filter>`,

    dataFilter: `<!-- Original DataFilter component -->
<lib-data-filter
  [columns]="columnsDefinition"
  [data]="tableData"
  [initialFilters]="initialFilters"
  (filterApplied)="onDataFilterApplied($event)"
></lib-data-filter>`,

    classicSort: `<!-- Classic SortTable mode -->
<verben-sort-table
  width="100%"
  [enableDragAndDrop]="true"
  [sortOptions]="classicSortOptions"
  (selectedOptions)="onClassicSortApplied($event)"
></verben-sort-table>`,

    unifiedSort: `<!-- Unified SortTable (drop-in for lib-data-sort) -->
<verben-sort-table
  width="100%"
  [enableDragAndDrop]="true"
  [columns]="columnsDefinition"
  [data]="tableData"
  (sortApplied)="onUnifiedSortApplied($event)"
  (resetFilter)="onSortReset()"
></verben-sort-table>`,

    dataSort: `<!-- Original DataSort component -->
<lib-data-sort
  [enableDragAndDrop]="true"
  [columns]="columnsDefinition"
  [data]="tableData"
  (sortApplied)="onDataSortApplied($event)"
></lib-data-sort>`,
    unified: `<!-- Unified mode: drop-in compatible with lib-data-filter bindings -->
<verben-table-filter
  width="100%"
  [columns]="columnsDefinition"
  [data]="tableData"
  [initialFilters]="initialFilters"
  (filterApplied)="onColumnsApplied($event)"
  (resetFilter)="onColumnsReset()"
></verben-table-filter>`,
  };

  filterInputs: DocsProp[] = [
    { name: 'columns', type: 'ColumnDefinition<T>[]', default: 'undefined', description: 'DataTable column definitions. Enables drop-in DataFilter mode.' },
    { name: 'data', type: 'T[]', default: 'undefined', description: 'Table rows used for dynamic type inference if column valueType is omitted.' },
    { name: 'initialFilters', type: 'FilterCondition[]', default: 'undefined', description: 'Pre-populated active filters in DataFilter format.' },
    { name: 'filterOptions', type: 'IDataFilter[]', default: '[]', description: 'Classic TableFilter options list.' },
    { name: 'savedFilters', type: 'IDataFilter[]', default: '[]', description: 'Pre-existing filters in classic format.' },
    { name: 'maxFilterLength', type: 'number', default: '3', description: 'Number of filters visible before Show More.' },
    { name: 'tooltip', type: 'boolean', default: 'false', description: 'Show tooltip on duplicate validation.' },
  ];

  filterOutputs: DocsProp[] = [
    { name: 'filterApplied', type: 'EventEmitter<FilterCondition[]>', default: '-', description: 'Emits FilterCondition[] array matching lib-data-filter contract.' },
    { name: 'resetFilter', type: 'EventEmitter<void>', default: '-', description: 'Emitted when filters are reset.' },
    { name: 'filtersApplied', type: 'EventEmitter<any>', default: '-', description: 'Classic TableFilter event (emits IDataFilter[] then storageKey).' },
    { name: 'resetSortData', type: 'EventEmitter<any>', default: '-', description: 'Classic TableFilter reset event.' },
  ];

  inputs = this.filterInputs;
  outputs = this.filterOutputs;

  sortInputs: DocsProp[] = [
    { name: 'columns', type: 'ColumnDefinition<T>[]', default: 'undefined', description: 'DataTable column definitions. Enables drop-in DataSort mode.' },
    { name: 'data', type: 'T[]', default: 'undefined', description: 'Table rows used for dynamic type inference if column valueType is omitted.' },
    { name: 'sortOptions', type: 'IDataFilter[]', default: '[]', description: 'Classic SortTable options list.' },
    { name: 'enableDragAndDrop', type: 'boolean', default: 'false', description: 'Enable drag-and-drop reordering of sort properties with clearly visible handle.' },
    { name: 'displayedOptions', type: 'number', default: '4', description: 'Number of sort properties visible before Show More.' },
    { name: 'sortButtonText', type: 'string', default: "'Confirm'", description: 'Button text.' },
  ];

  sortOutputs: DocsProp[] = [
    { name: 'sortApplied', type: 'EventEmitter<SortCondition[]>', default: '-', description: 'Emits SortCondition[] array matching lib-data-sort contract.' },
    { name: 'resetFilter', type: 'EventEmitter<void>', default: '-', description: 'Emitted when sorting is reset (alias matching lib-data-sort).' },
    { name: 'selectedOptions', type: 'EventEmitter<IDataFilter[]>', default: '-', description: 'Classic SortTable output emitting selected IDataFilter[] options.' },
    { name: 'resetSortData', type: 'EventEmitter<any>', default: '-', description: 'Classic SortTable reset output.' },
  ];

  ngOnInit(): void {
    // Seed initial output panels so verification is visible immediately
    this.classicAppliedOutput = [...this.classicSavedFilters];
    this.columnsAppliedOutput = [...this.initialFilters];
    this.dataFilterAppliedOutput = [...this.initialFilters];
    this.classicSortOutput = [
      { name: 'Full Name', type: DataFilterType.String, value: 'asc', checked: true },
    ];
    this.unifiedSortOutput = [
      { columnId: 'name', direction: SortDirection.Asc },
    ];
    this.dataSortOutput = [
      { columnId: 'name', direction: SortDirection.Asc },
    ];
  }

  onClassicApplied(event: any): void {
    if (Array.isArray(event)) {
      this.classicAppliedOutput = event;
    }
  }

  onColumnsApplied(filters: FilterCondition[]): void {
    this.columnsAppliedOutput = filters;
  }

  onColumnsClassicApplied(event: any): void {
    if (Array.isArray(event)) {
      this.columnsClassicAppliedOutput = event;
    }
  }

  onDataFilterApplied(filters: FilterCondition[]): void {
    this.dataFilterAppliedOutput = filters;
  }

  onColumnsReset(): void {
    this.columnsAppliedOutput = [];
    this.columnsClassicAppliedOutput = [];
  }

  onClassicReset(): void {
    this.classicAppliedOutput = [];
  }

  onDataFilterReset(): void {
    this.dataFilterAppliedOutput = [];
  }

  onClassicSortApplied(sorts: IDataFilter[]): void {
    this.classicSortOutput = sorts;
  }

  onClassicSortReset(): void {
    this.classicSortOutput = [];
  }

  onUnifiedSortApplied(sorts: SortCondition[]): void {
    this.unifiedSortOutput = sorts;
  }

  onSortReset(): void {
    this.unifiedSortOutput = [];
  }

  onDataSortApplied(sorts: SortCondition[]): void {
    this.dataSortOutput = sorts;
  }

  onDataSortReset(): void {
    this.dataSortOutput = [];
  }
}
