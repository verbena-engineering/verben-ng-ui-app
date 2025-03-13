export interface SampleModel {
  CompulsoryField: string;
  OptionalField?: string;
  DateField: Date;
  EnumField: SampleEnum;
  ArrayField: string[];
  IntegerField: number;
  MoneyField: number;
  BooleanField: boolean;
  ObjectField: {NestedPropertyField: string};
  NestedArrayField: {NestedArrayField: string[]}[];
}

export enum SampleEnum {
  EnumValueOne = 'EnumValueOne',
  EnumValueTwo = 'EnumValueTwo',
}
