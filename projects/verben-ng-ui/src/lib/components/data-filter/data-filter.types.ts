export type FilterOperatorType = 'string' | 'number' | 'date' | 'bool' | 'enum';

export interface FilterOperator {
  label: string;
  value: string;
  type: FilterOperatorType;
}

export const STRING_OPERATORS: FilterOperator[] = [
  { label: 'Starts With', value: 'startsWith', type: 'string' },
  { label: 'Ends With', value: 'endsWith', type: 'string' },
  { label: 'Contains', value: 'contains', type: 'string' },
  { label: 'Equals', value: 'equals', type: 'string' },
  { label: 'Is Not', value: 'isNot', type: 'string' },
];

export const NUMBER_OPERATORS: FilterOperator[] = [
  { label: 'Equal', value: 'equal', type: 'number' },
  { label: 'Greater Than', value: 'greaterThan', type: 'number' },
  { label: 'Less Than', value: 'lessThan', type: 'number' },
  { label: 'Is Not', value: 'isNot', type: 'number' },
];

export const DATE_OPERATORS: FilterOperator[] = [
  { label: 'On', value: 'on', type: 'date' },
  { label: 'Before', value: 'before', type: 'date' },
  { label: 'After', value: 'after', type: 'date' },
];

export const BOOL_OPERATORS: FilterOperator[] = [
  { label: 'Is', value: 'is', type: 'bool' },
  { label: 'Is Not', value: 'isNot', type: 'bool' },
];

export const ENUM_OPERATORS: FilterOperator[] = [
  { label: 'Is', value: 'is', type: 'enum' },
  { label: 'Is Not', value: 'isNot', type: 'enum' },
];

export interface FilterCondition {
  columnId: string;
  operator: string;
  value: string | number | boolean | Date;
}

export interface FilterGroup {
  id: string;
  name: string;
  conditions: FilterCondition[];
}

export interface FilterState {
  groups: FilterGroup[];
  activeFilters: FilterCondition[];
}
