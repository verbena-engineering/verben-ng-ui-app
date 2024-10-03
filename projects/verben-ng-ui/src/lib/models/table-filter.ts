export enum DataFilterType {
  String = 'String',
  Number = 'Number',
  Decimal = 'Decimal',
  Credit= 'Credit',
  Date = 'Date',
  Bool = "Bool"
}

export interface IDataFilter {
  type: DataFilterType;
  condition: string;
  value: string | number; 
  checked: boolean;
}

