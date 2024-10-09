import { DataFilterType } from "./table-filter";

export interface IDataFilter {
    type:DataFilterType ;
    value: string | number; 
    checked: boolean;
  }