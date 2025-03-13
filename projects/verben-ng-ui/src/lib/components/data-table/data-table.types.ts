import { TemplateRef } from '@angular/core';

export interface ColumnDefinition<T> {
  id: string;
  header: string | ((context: any) => any);
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cellTemplate?: TemplateRef<any>;
  cellEditTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  footerTemplate?: TemplateRef<any>;
  sortAction?: 'ASC' | 'DESC';
}

export type GroupedDataRow<T> = T & {
  isGroupRow?: boolean;
  groupValue?: any;
  groupTitle?: any;
};

export type EditedData<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};