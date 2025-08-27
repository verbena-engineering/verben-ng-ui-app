import { SortDirection } from '../data-sort/data-sort.types';

export type ExportItemType = 'property' | 'operation';

export interface ExportItem {
  id: string;
  name: string;
  type: ExportItemType;
}

export interface ExportProfile {
  id: string;
  name: string;
  items: ExportItem[];
}

export interface Operation {
  id: string;
  name: string;
  field1: string;
  operator: Operators;
  field2: string;
}

export enum Operators {
  add = 'add',
  subtract = 'subtract',
  multiply = 'multiply',
  divide = 'divide',
  concatenateSpace = 'concatenateSpace',
  concatenateCommaSpace = 'concatenateCommaSpace',
  concatenateComma = 'concatenateComma',
}

export enum SearchPropertyValueType {
  Int = 'Int',
  Float = 'Float',
  Decimal = 'Decimal',
  Double = 'Double',
  String = 'String',
  Bool = 'Bool',
  Date = 'Date',
}

export enum SearchOperator {
  And = 'And',
  Or = 'Or',
}

export enum SearchPropertySign {
  EQ = 'EQ',
  NEQ = 'NEQ',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  LIKE = 'LIKE',
}

export interface SearchPropertyValue {
  PropertyName: string;
  EntityValue: string;
  Type?: SearchPropertyValueType;
  Operator: SearchOperator;
  Sign: SearchPropertySign;
  Sort?: SortDirection;
}
