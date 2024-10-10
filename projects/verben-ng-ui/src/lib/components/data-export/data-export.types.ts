export interface ExportProfile {
  id: string;
  name: string;
  properties: string[];
}

export interface Operation {
  id: string;
  name: string;
  field1: string;
  operator: 'add' | 'subtract' | 'multiply' | 'divide';
  field2: string;
}
