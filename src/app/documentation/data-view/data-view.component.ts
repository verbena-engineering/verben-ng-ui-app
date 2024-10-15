import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Model } from '../../views/card-data-view/cdv.component';
import {
  CardData,
  DataFilterType,
  IDataFilter,
} from 'verben-ng-ui/src/public-api';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewComponent {
  isGridView: boolean = true;
  currentData!: CardData;
  selectedColumnCount: number = 0;
  selectedFilterTableCount: number = 0;
  isOPen: boolean = true;
  selectedSortCount: number = 0;
  showColumn: boolean = false;
  showSort: boolean = false;
  selectedAll:boolean=false
  columns: IDataFilter[] = [
    { checked: false, name: 'Column 1', type: DataFilterType.Bool },
    { checked: false, name: 'Column 2', type: DataFilterType.Bool },
    { checked: false, name: 'Column 3', type: DataFilterType.Bool },
    { checked: false, name: 'Column 4', type: DataFilterType.Bool },
    { checked: false, name: 'Column 5', type: DataFilterType.Bool },

  ];
  filterArray: IDataFilter[] = [
    {
      name: 'Name',
      type: DataFilterType.String,
      checked: false,
    },
    {
      name: 'Age',
      type: DataFilterType.Integer,
      checked: false,
    },
    {
      name: 'Salary',
      type: DataFilterType.Decimal,
      checked: false,
    },
    {
      name: 'Date',
      type: DataFilterType.Date,
      checked: false,
    },
    {
      name: 'Qualify for payment',
      type: DataFilterType.Bool,
      checked: false,
    },
  ];
  cardData: CardData[] = [
    {
      selected: true,
      title: 'Title1',
      data: { name: 'Ade', mailAddress: 'ademail@yahoo.com' } as Model,
      body: [
        { title: 'Code', value: 'code1' },
        { title: 'Name', value: 'name1' },
        { title: 'Description', value: 'description1' },
      ],
    },
    {
      selected: false,
      title: 'Title2',
      data: { name: 'wale', mailAddress: 'walemail@yahoo.com' } as Model,
      body: [
        { title: 'Code', value: 'code2' },
        { title: 'Name', value: 'name2' },
        { title: 'Description', value: 'description2' },
      ],
    },
    {
      data: { name: 'kunle', mailAddress: 'kunlemail@yahoo.com' } as Model,
      selected: false,
      title: 'Title3',
      body: [
        { title: 'Code', value: 'code3' },
        { title: 'Name', value: 'name3' },
        { title: 'Description', value: 'description3' },
      ],
    },
  ];
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
  clearData() {
    this.currentData = {} as CardData;
  }
  loadMore() {
    this.cardData = this.cardData.concat(this.cardData);
  }
  onColumnChange(event: boolean) {
    this.showColumn=event
  }
  onSortChange(event: boolean) {
    this.showSort = event;
    console.log(event);
    
  }
  onColumnsUpdated(updatedColumns: IDataFilter[]) {
    this.onColumnChange(false);
    this.selectedColumnCount = updatedColumns.length;
  }
  onSortUpdated(updatedSorts: IDataFilter[]) {
    this.onSortChange(false);
    this.selectedSortCount = updatedSorts.length;
    console.log(updatedSorts);
  }

  onViewChange(isGridView: boolean): void {
    console.log('View changed to:', isGridView ? 'Grid View' : 'List View');
  }

  onStateChange(event: { key: string; value: boolean }): void {
    console.log(`State changed for ${event.key}:`, event.value);
  }
}
