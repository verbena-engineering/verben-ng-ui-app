import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IDataFilter } from 'verben-ng-ui';
import { DataFilterType } from 'verben-ng-ui';

@Component({
  selector: 'app-sort-table',
  templateUrl: './sort-table.component.html',
  styleUrl: './sort-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortTableComponent {
  sortOptions: IDataFilter[] = [
    {
      name: 'Amount',
      type: DataFilterType.Number,
      checked: false,
    },
    { name: 'Name', type: DataFilterType.String, checked: false },
    { name: 'Date', type: DataFilterType.Date, checked: false },
    {
      name: 'Category',
      type: DataFilterType.String,
      checked: false,
    },
    {
      name: 'Rating',
      value: 'Rating',
      type: DataFilterType.Number,
      checked: false,
    },
  ];
  onSelectOptions(updatedOptions: IDataFilter[]) {
    console.log('Updated Options:', updatedOptions);
  }
}
