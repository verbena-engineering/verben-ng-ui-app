import { ColumnDefinition } from './data-table.types';

/**
 * Resolves the raw value of a column for a single row, mirroring the
 * accessor logic used to render body cells.
 */
export function getColumnValue<T>(row: T, column: ColumnDefinition<T>): any {
  if (column.accessorKey != null) {
    return (row as any)[column.accessorKey];
  }
  return column.accessorFn ? column.accessorFn(row) : undefined;
}

/**
 * Computes the footer value for a column from the dataset.
 *
 * Value precedence: the richer `footer` config (when set) overrides the simple
 * `footerFn`. Group header rows (added when the table is grouped) are excluded
 * so they never skew aggregations. Returns `undefined` when the column has no
 * footer config/fn, or has a label-only footer with no computed value.
 */
export function computeColumnFooter<T>(
  column: ColumnDefinition<T>,
  rows: readonly T[]
): any {
  const config = column.footer;
  if (!config && !column.footerFn) return undefined;

  const dataRows = rows.filter((row) => !(row as any)?.isGroupRow) as T[];

  // `footer` config overrides the simple `footerFn`.
  if (!config) {
    return column.footerFn!(
      dataRows.map((row) => getColumnValue(row, column)),
      dataRows
    );
  }

  if (config.valueFn) {
    return config.valueFn(dataRows, column);
  }

  const aggregation = config.aggregation;
  if (!aggregation) return undefined;

  if (aggregation === 'count') {
    return dataRows.length;
  }

  const numbers = dataRows
    .map((row) => Number(getColumnValue(row, column)))
    .filter((value) => !Number.isNaN(value));

  if (numbers.length === 0) return undefined;

  switch (aggregation) {
    case 'sum':
      return numbers.reduce((total, value) => total + value, 0);
    case 'avg':
      return numbers.reduce((total, value) => total + value, 0) / numbers.length;
    case 'min':
      return Math.min(...numbers);
    case 'max':
      return Math.max(...numbers);
    default:
      return undefined;
  }
}

/**
 * Renders a column's computed footer value to a display string, combining the
 * optional `label` with the (optionally formatted) value.
 */
export function formatColumnFooter<T>(
  column: ColumnDefinition<T>,
  value: any
): string {
  const config = column.footer;
  const hasValue = value !== undefined && value !== null && value !== '';

  // footerFn-only (or no config): render the raw computed value.
  if (!config) {
    return hasValue ? String(value) : '';
  }

  const formatted = config.formatter
    ? config.formatter(value)
    : hasValue
    ? String(value)
    : '';

  return [config.label, formatted].filter((part) => !!part).join(' ');
}
