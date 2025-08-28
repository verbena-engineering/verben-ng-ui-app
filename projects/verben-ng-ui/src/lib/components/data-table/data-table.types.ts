import { TemplateRef } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  ValidatorFn,
} from '@angular/forms';

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
  formControlName?: string;
  groupName?: string;
  validatorFn?: (value: T[keyof T]) => boolean;
  importKey?: keyof T;
  canImport?: boolean;
  canExport?: boolean;
  importBy?: keyof T | ((importedRow: any) => T[keyof T]);
  exportBy?: keyof T | ((row: T) => any);
}

// Define a type that extends T with a _key property
export type DataWithKey<T> = {
  _key: string | number;
  _key_prop: keyof T | '_index';
  originalData: T;
};

export type GroupedDataRow<T> = DataWithKey<T> & {
  isGroupRow?: boolean;
  groupValue?: any;
  groupTitle?: any;
};

export type FormControlOf<T> = {
  [K in keyof T]?: FormControl;
};

export interface FormGroupConfig<
  TControl extends { [key: string]: AbstractControl }
> {
  controls: TControl;
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null;
}

export type EditedData<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

// ====================================

// export type ColumnDefinitionBase<T> = {
//   id: string;
//   header: string | ((context: any) => any);
//   cellTemplate?: TemplateRef<any>;
//   cellEditTemplate?: TemplateRef<any>;
//   headerTemplate?: TemplateRef<any>;
//   footerTemplate?: TemplateRef<any>;
//   sortAction?: 'ASC' | 'DESC';
//   formControlName?: string;
//   groupName?: string;
// };

// // Helper type to create a column definition with a specific accessor key
// export type ColumnDefinitionWithKey<
//   T,
//   K extends keyof T
// > = ColumnDefinitionBase<T> & {
//   accessorKey: K;
//   accessorFn?: never;
//   validatorFn?: (value: T[K]) => boolean;
// };

// export type ColumnDefinitionWithFn<T, R = any> = ColumnDefinitionBase<T> & {
//   accessorKey?: never;
//   accessorFn: (row: T) => R;
//   validatorFn?: (value: R) => boolean;
// };

// export type ColumnDefinitionWithNeither<T> = ColumnDefinitionBase<T> & {
//   accessorKey?: never;
//   accessorFn?: never;
//   validatorFn?: never;
// };

// // Union type that represents all possible column definition variants
// export type ColumnDefinition<T> =
//   | { [K in keyof T]: ColumnDefinitionWithKey<T, K> }[keyof T]
//   | ColumnDefinitionWithFn<T>
//   | ColumnDefinitionWithNeither<T>;
