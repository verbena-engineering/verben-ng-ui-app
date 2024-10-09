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
  enableSorting?: boolean;
  enableHiding?: boolean;
}
