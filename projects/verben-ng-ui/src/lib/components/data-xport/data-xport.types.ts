export type ExportItemType = 'property' | 'operation';

export interface ExportItem {
  id: string;
  name: string;
  exportKey: string;
  type: ExportItemType;
}

export interface ExportProfile {
  id: string;
  name: string;
  items: ExportItem[];
}

export type OperatorType = 'arithmetic' | 'string';

export interface BaseOperation {
  id: string;
  name: string;
  field1: string;
  field2: string;
  type: OperatorType;
}

export interface ArithmeticOperation extends BaseOperation {
  type: 'arithmetic';
  operator: 'add' | 'subtract' | 'multiply' | 'divide';
}

export interface StringOperation extends BaseOperation {
  type: 'string';
  joinBy: string;
}

export type Operation = ArithmeticOperation | StringOperation;
