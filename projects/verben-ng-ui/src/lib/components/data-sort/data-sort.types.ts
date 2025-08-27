export enum SortDirection {
  Asc = 'Asc',
  Desc = 'Desc',
  // None = 'None',
}

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
  { label: 'A to Z', value: SortDirection.Asc, type: 'string' },
  { label: 'Z to A', value: SortDirection.Desc, type: 'string' },
];

export const NUMBER_SORT_OPERATORS: SortOperator[] = [
  { label: '1 to 100', value: SortDirection.Asc, type: 'number' },
  { label: '100 to 1', value: SortDirection.Desc, type: 'number' },
];

export const DATE_SORT_OPERATORS: SortOperator[] = [
  { label: 'Oldest First', value: SortDirection.Asc, type: 'date' },
  { label: 'Newest First', value: SortDirection.Desc, type: 'date' },
];
