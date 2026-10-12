import { Component } from '@angular/core';
import {
  ColumnDefinition,
  ColumnValueType,
  DataFilterType,
  IDataFilter,
  FilterCondition,
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
export class FilterComparisonPageComponent {
  // Mode 1: Classic TableFilter filterOptions
  classicFilterOptions: IDataFilter[] = [
    { name: 'Customer Name', type: DataFilterType.String, checked: false },
    { name: 'Age', type: DataFilterType.Integer, checked: false },
    { name: 'Role', type: DataFilterType.Enum, checked: false },
    { name: 'Joined Date', type: DataFilterType.Date, checked: false },
  ];

  classicAppliedOutput: any = null;

  // Mode 2: Columns format (Drop-in DataFilter contract)
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

  code = {
    classic: `<!-- Classic TableFilter mode: passes filterOptions and handles filtersApplied -->
<verben-table-filter
  width="100%"
  [filterOptions]="classicFilterOptions"
  [maxFilterLength]="4"
  (filtersApplied)="onClassicApplied($event)"
></verben-table-filter>`,

    unified: `<!-- Unified mode: drop-in compatible with lib-data-filter bindings -->
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
  };

  inputs: DocsProp[] = [
    { name: 'columns', type: 'ColumnDefinition<T>[]', default: 'undefined', description: 'DataTable column definitions. Enables drop-in DataFilter mode.' },
    { name: 'data', type: 'T[]', default: 'undefined', description: 'Table rows used for dynamic type inference if column valueType is omitted.' },
    { name: 'initialFilters', type: 'FilterCondition[]', default: 'undefined', description: 'Pre-populated active filters in DataFilter format.' },
    { name: 'filterOptions', type: 'IDataFilter[]', default: '[]', description: 'Classic TableFilter options list.' },
    { name: 'savedFilters', type: 'IDataFilter[]', default: '[]', description: 'Pre-existing filters in classic format.' },
    { name: 'maxFilterLength', type: 'number', default: '3', description: 'Number of filters visible before Show More.' },
    { name: 'tooltip', type: 'boolean', default: 'false', description: 'Show tooltip on duplicate validation.' },
  ];

  outputs: DocsProp[] = [
    { name: 'filterApplied', type: 'EventEmitter<FilterCondition[]>', default: '-', description: 'Emits FilterCondition[] array matching lib-data-filter contract.' },
    { name: 'resetFilter', type: 'EventEmitter<void>', default: '-', description: 'Emitted when filters are reset.' },
    { name: 'filtersApplied', type: 'EventEmitter<any>', default: '-', description: 'Classic TableFilter event (emits IDataFilter[] then storageKey).' },
    { name: 'resetSortData', type: 'EventEmitter<any>', default: '-', description: 'Classic TableFilter reset event.' },
  ];

  onClassicApplied(event: any): void {
    if (Array.isArray(event)) {
      this.classicAppliedOutput = event;
    }
  }

  onColumnsApplied(filters: FilterCondition[]): void {
    this.columnsAppliedOutput = filters;
  }

  onDataFilterApplied(filters: FilterCondition[]): void {
    this.dataFilterAppliedOutput = filters;
  }
}
