import { ConditionalOptions, DataFilterType, ITypeOption } from "./models/table-filter";

export class Config {
  typeOptions: ITypeOption[] = [
    {
      type: DataFilterType.String,
      options: [ConditionalOptions.On,ConditionalOptions.NotEqual]
    },
    {
      type: DataFilterType.Integer,
      options: [ConditionalOptions.On, ConditionalOptions.Before,ConditionalOptions.LessThanAndEqual, ConditionalOptions.After,ConditionalOptions.GreaterThanAndEqual]
    },
    {
      type: DataFilterType.Decimal,
      options: [ConditionalOptions.On, ConditionalOptions.Before,ConditionalOptions.LessThanAndEqual, ConditionalOptions.After,ConditionalOptions.GreaterThanAndEqual]
    },
    {
      type: DataFilterType.Credit,
      options:[ConditionalOptions.On, ConditionalOptions.Before,ConditionalOptions.LessThanAndEqual, ConditionalOptions.After,ConditionalOptions.GreaterThanAndEqual]
    },
    {
      type: DataFilterType.Date,
      options: [ConditionalOptions.On,ConditionalOptions.Before,ConditionalOptions.After]
    },
    {
      type: DataFilterType.Bool,
      options: [ConditionalOptions.Yes,ConditionalOptions.No]
    }
  ];

      getConditionOptions(filterType: DataFilterType): string[] | null {
        const typeOption = this.typeOptions.find(option => option.type === filterType);
        return typeOption ? typeOption.options : null;
    } 
}


