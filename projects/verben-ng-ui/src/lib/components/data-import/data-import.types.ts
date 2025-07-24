import { ColumnDefinition } from '../data-table/data-table.types';

export interface FieldDefinition<T, K extends keyof T = keyof T>
  extends Omit<
    Pick<
      ColumnDefinition<T>,
      | 'header'
      | 'cellEditTemplate'
      | 'cellTemplate'
      | 'headerTemplate'
      | 'formControlName'
    >,
    'accessorKey'
  > {
  accessorKey: K;
  validatorFn?: (value: T[K]) => boolean;
}
