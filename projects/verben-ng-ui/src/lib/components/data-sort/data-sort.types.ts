export type SortDirection = 'asc' | 'desc';

export interface SortCondition {
  columnId: string;
  direction: SortDirection;
}

export interface SortOperator {
  label: string;
  value: SortDirection;
  type: 'string' | 'number' | 'date';
}

export const STRING_SORT_OPERATORS: SortOperator[] = [
  { label: 'A to Z', value: 'asc', type: 'string' },
  { label: 'Z to A', value: 'desc', type: 'string' },
];

export const NUMBER_SORT_OPERATORS: SortOperator[] = [
  { label: '1 to 100', value: 'asc', type: 'number' },
  { label: '100 to 1', value: 'desc', type: 'number' },
];

export const DATE_SORT_OPERATORS: SortOperator[] = [
  { label: 'Oldest First', value: 'asc', type: 'date' },
  { label: 'Newest First', value: 'desc', type: 'date' },
];
