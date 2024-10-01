export enum FilterType {
  String = 'string',
  Number = 'number',
  Integer = 'integer',
  Credit= 'Credit',
  Date = 'Date',
}

export interface IFilter {
  type: FilterType;
  condition: string;
  value: string | number; 
  checked: boolean;
}
