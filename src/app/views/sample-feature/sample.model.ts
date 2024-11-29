export interface SampleModel {
  CompulsoryField: string;
  OptionalField: string;
  DateField: Date;
  EnumField: SampleEnum;
  ArrayField: string[];
}

export enum SampleEnum {
  EnumValueOne = 'EnumValueOne',
  EnumValueTwo = 'EnumValueTwo',
}
