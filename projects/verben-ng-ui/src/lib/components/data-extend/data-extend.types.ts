export interface DataExtendItem {
  Name: string;
  DataType: DataType;
  MaxValue: number;
  MinValue: number;
  IsRequired: boolean;
  DefaultValue: any;
  Value: any;
  Options: string;
  Id: string;
}

export enum DataType {
  Text = 'Text',
  MultilineText = 'MultilineText',
  MailAddress = 'MailAddress',
  PhoneNumber = 'PhoneNumber',
  Number = 'Number',
  Decimal = 'Decimal',
  YesNo = 'YesNo',
  URL = 'URL',
  Image = 'Image',
  SingleSelection = 'SingleSelection',
  MultiSelection = 'MultiSelection',
  Colour = 'Colour',
  Video = 'Video',
  Audio = 'Audio',
  SingleFileSelection = 'SingleFileSelection',
  MultiFileSelection = 'MultiFileSelection',
}
