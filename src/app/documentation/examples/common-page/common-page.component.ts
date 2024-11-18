import { Component } from '@angular/core';
import {
  CardData,
  ColumnDefinition,
  DataFilterType,
  IDataFilter,
} from 'verben-ng-ui';
import { ExampleDataType } from '../example.types';
import { generateRandomName } from '../helper';

@Component({
  selector: 'app-common-page',
  templateUrl: './common-page.component.html',
  styleUrl: './common-page.component.scss',
})
export class CommonPageComponent {
  tableData = Array.from({ length: 10 }, (_, index) => ({
    id: `ACTIVITY-${index + 1}`,
    activityDetails: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      () => generateRandomName()
    ),
    numberOfParticipants: Math.floor(Math.random() * 20) + 1,
    role: 'Tester',
    names: generateRandomName(),
    age: Math.floor(Math.random() * 50) + 1,
    money: Math.floor(Math.random() * 500) + 1,
    message:
      'Dark seas and dark towers. Night sky and wry smile. Loneliness, nonetheless.',
  }));

  cardData: CardData[] = this.tableData.map(({ names, age, role, money }) => ({
    selected: false,
    title: names.firstName + ' ' + names.lastName,
    data: {
      firstName: names.firstName,
      lastName: names.lastName,
      age,
      role,
      money,
    } as Partial<ExampleDataType>,
    body: [
      { title: 'Name', value: names.firstName + ' ' + names.lastName },
      { title: 'Age', value: age.toString() },
      { title: 'Role', value: role },
      { title: 'Money', value: money.toString() },
    ],
    children: [],
  }));

  selectedColumnCount: number = 0;
  selectedFilterTableCount: number = 0;
  isOPen: boolean = true;
  selectedSortCount: number = 0;
  showColumn: boolean = false;
  showSort: boolean = false;
  selectedAll: boolean = false;

  currentData!: CardData;

  tableColumns2: ColumnDefinition<ExampleDataType>[] = [
    {
      id: 'select',
      header: 'Select',
    },
    {
      id: 'names',
      header: 'Full Name',
      accessorFn: (row) => `${row.names?.firstName} ${row.names?.lastName}`,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
    },
    {
      id: 'age',
      header: 'Age',
      accessorKey: 'age',
    },
    {
      id: 'money',
      header: 'Money',
      accessorKey: 'money',
    },
    {
      id: 'message',
      header: 'Message',
      accessorKey: 'message',
    },
    {
      id: 'actions',
      header: 'Actions',
    },
  ];

  columns: IDataFilter[] = this.tableColumns2.map((col) => ({
    checked: false,
    name:
      typeof col.header === 'string' ? col.header : col.accessorKey ?? col.id,
    type: DataFilterType.Bool,
  }));

  filterArray: IDataFilter[] = this.columns;

  sortOptions: IDataFilter[] = this.columns;

  onViewChange(isGridView: boolean): void {
    console.log('View changed to:', isGridView ? 'Grid View' : 'List View');
  }

  onStateChange(event: { key: string; value: boolean }): void {
    console.log(`State changed for ${event.key}:`, event.value);
  }
  loadMore() {
    this.cardData = this.cardData.concat(this.cardData);
  }
  clearData() {
    this.currentData = {} as CardData;
  }
  onColumnChange(event: boolean) {
    this.showColumn = event;
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
}
