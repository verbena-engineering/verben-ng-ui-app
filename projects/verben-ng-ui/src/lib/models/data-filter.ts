import { DataFilterType } from './table-filter';

export interface IDataFilter {
  name?: string;
  type: DataFilterType;
  value: string | number;
  checked: boolean;
}
