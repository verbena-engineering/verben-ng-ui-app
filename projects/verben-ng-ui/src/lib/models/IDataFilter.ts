import { DataFilterType } from './DataFilterType';

export interface IDataFilter {
  name: string;
  type: DataFilterType;
  value?: any;
  checked: boolean;
  condition?: string;
}
