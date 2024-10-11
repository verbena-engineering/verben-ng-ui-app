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
  operator: 'add' | 'subtract' | 'multiply' | 'divide';
  field2: string;
}
