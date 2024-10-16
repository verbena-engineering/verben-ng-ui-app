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
