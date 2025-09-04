import { DataFilterType } from './DataFilterType';

export enum ConditionalOptions {
  GreaterThanAndEqual = 'GTE',
  LessThanAndEqual = 'LTE',
  NotEqual = 'NEQ',
  On = 'On',
  Before = 'Before',
  After = 'After',
  Yes = 'Yes',
  No = 'No',
}

export interface ITypeOption {
  type: DataFilterType;
  options: string[];
}
