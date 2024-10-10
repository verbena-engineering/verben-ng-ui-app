import { TableFilterModule } from './../../../../projects/verben-ng-ui/src/lib/components/table-filter/table-filter.module';
import { Component } from '@angular/core';
import { DataFilterType, IDataFilter } from '../../../../projects/verben-ng-ui/src/lib/models/table-filter';

@Component({
  selector: 'app-table-filter-sample',
  templateUrl: './table-filter-sample.component.html',
  styleUrl: './table-filter-sample.component.scss',
})
export class TableFilterSampleComponent {
  filterArray:IDataFilter[] = [
    {
    name:'Name',
    type: DataFilterType.String,
    checked:false
   },
    {
    name:'Age',
    type: DataFilterType.Integer,
    checked:false
   },
    {
    name:'Salary',
    type: DataFilterType.Decimal,
    checked:false
   },
   {
    name:'Date',
    type: DataFilterType.Date,
    checked:false
   },
   {
    name:'Qualify for payment',
    type: DataFilterType.Bool,
    checked:false
   }
  ]
}
