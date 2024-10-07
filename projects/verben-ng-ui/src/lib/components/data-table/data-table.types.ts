import { TemplateRef } from '@angular/core';

export interface ColumnDefinition<T> {
  id: string;
  header: string;
  accessorFn?: (row: T) => any;
  cellTemplate?: TemplateRef<any>;
  enableSorting?: boolean;
  enableHiding?: boolean;
}
