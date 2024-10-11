export enum DataFilterType {
  String = 'String',
  Integer = 'Integer',
  Decimal = 'Decimal',
  Credit= 'Credit',
  Date = 'Date',
  Bool = "Bool",
  Number="Number"
}

export interface IDataFilter {
  name:string,
  type: DataFilterType;
  value?:any; 
  checked: boolean;
  condition?:string;
}

export enum ConditionalOptions {
  LessThan = 'LessThan',
  GreaterThan = 'GreaterThan',
  Equal = 'Equal',
  On = 'On',
  Before = 'Before',
  After = 'After',
  Yes = 'Yes',
  No = 'No'
 }

export interface ITypeOption {
  type: DataFilterType;
  options: string[];
}
