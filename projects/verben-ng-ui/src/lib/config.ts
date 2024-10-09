import { ConditionalOptions, DataFilterType, ITypeOption } from "./models/table-filter";

export class Config {
    typeOptions: ITypeOption[] = [
        {
          type: DataFilterType.String,
          options: [ConditionalOptions.Equal]
        },
        {
          type: DataFilterType.Integer,
          options: [ConditionalOptions.Equal, ConditionalOptions.LessThan, ConditionalOptions.GreaterThan] 
        },
        {
          type: DataFilterType.Decimal,
          options: [ConditionalOptions.Equal, ConditionalOptions.LessThan, ConditionalOptions.GreaterThan]
        },
        {
          type: DataFilterType.Credit,
          options: [ConditionalOptions.Equal, ConditionalOptions.LessThan, ConditionalOptions.GreaterThan]
        },
        {
          type: DataFilterType.Date,
          options: [ConditionalOptions.On,ConditionalOptions.Before,ConditionalOptions.After] 
        },
        {
          type: DataFilterType.Bool,
          options: [ConditionalOptions.Equal]
        }
      ];

      getConditionOptions(filterType: DataFilterType): string[] | null {
        const typeOption = this.typeOptions.find(option => option.type === filterType);
        return typeOption ? typeOption.options : null;
    } 
}


