export enum DataFilterType {
  String = 'String',
  Number = 'Number',
  Decimal = 'Decimal',
  Credit= 'Credit',
  Date = 'Date',
  Bool = "Bool"
}

export interface IDataFilter {
  name?: string;
  type: DataFilterType;
  value: string | number;
  checked: boolean;
}

