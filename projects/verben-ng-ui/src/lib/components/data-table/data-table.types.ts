import { TemplateRef } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  ValidatorFn,
} from '@angular/forms';

/** Built-in aggregations that can be computed over a column's values. */
export type FooterAggregation = 'sum' | 'avg' | 'min' | 'max' | 'count';

/**
 * Richer declarative footer configuration for a column. Overrides the simple
 * `footerFn` when set. Drives both the table's `<tfoot>` and exports.
 *
 * Value precedence (highest → lowest): `valueFn` → `aggregation` → label-only.
 * For full control over the rendered markup use `ColumnDefinition.footerTemplate`,
 * which takes precedence in the table (but is ignored by exports).
 */
export interface ColumnFooterConfig<T> {
  /** Built-in aggregation computed over the column's values across all rows. */
  aggregation?: FooterAggregation;
  /**
   * Custom reducer receiving every (non-group) row and the column.
   * Takes precedence over `aggregation`.
   */
  valueFn?: (rows: T[], column: ColumnDefinition<T>) => any;
  /** Static label rendered alongside / instead of the computed value (e.g. "Total"). */
  label?: string;
  /** Formats the computed value for display and string-based exports. */
  formatter?: (value: any) => string;
  /** Set to `false` to keep this column's footer out of exports. Defaults to `true`. */
  includeInExport?: boolean;
}

/**
 * Declared type of a column's underlying value. Deliberately general rather than
 * filter-specific: operation components that consume `ColumnDefinition` all need
 * to know a column's type (the filter panel picks the value control from it, and
 * import validation, sorting and exports have the same need).
 */
export enum ColumnValueType {
  String = 'String',
  Number = 'Number',
  Integer = 'Integer',
  Decimal = 'Decimal',
  Currency = 'Currency',
  Date = 'Date',
  Bool = 'Bool',
  Enum = 'Enum',
}

/** An allowed value for a column whose `valueType` is `Enum`. */
export interface ColumnValueOption {
  label: string;
  value: any;
}

export interface ColumnDefinition<T> {
  id: string;
  header: string | ((context: any) => any);
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cellTemplate?: TemplateRef<any>;
  cellEditTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  footerTemplate?: TemplateRef<any>;
  /**
   * Simple footer reducer — analogous to `accessorFn`. Receives the column's
   * extracted values (and the non-group rows) and returns the footer value used
   * by the table footer and exports. Overridden by `footer` when that is set.
   */
  footerFn?: (values: any[], rows: T[]) => any;
  /** Richer declarative footer; overrides `footerFn` when set. */
  footer?: ColumnFooterConfig<T>;
  sortAction?: 'ASC' | 'DESC';
  formControlName?: string;
  groupName?: string;
  validatorFn?: (value: T[keyof T]) => boolean;
  importKey?: keyof T;
  canImport?: boolean;
  canExport?: boolean;
  importBy?: keyof T | ((importedRow: any) => T[keyof T]);
  exportBy?: keyof T | ((row: T) => any);
  isHidden?: boolean;
  /**
   * Type of this column's value. Optional — consumers that need a type fall back
   * to inferring one from the data when it is omitted.
   */
  valueType?: ColumnValueType;
  /**
   * Allowed values when `valueType` is `Enum`. Either a plain list of members or
   * `{ label, value }` pairs when the display text differs from the stored value.
   */
  valueOptions?: string[] | ColumnValueOption[];
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
