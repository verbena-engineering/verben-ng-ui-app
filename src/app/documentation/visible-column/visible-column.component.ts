import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IDataFilter } from 'verben-ng-ui/src/lib/models/data-filter';
import { DataFilterType} from 'verben-ng-ui/src/public-api';

@Component({
  selector: 'app-visible-column',
  templateUrl: './visible-column.component.html',
  styleUrl: './visible-column.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibleColumnComponent {
  SortFilter = DataFilterType;
  columns: IDataFilter[] = [
    { checked: true, name: 'Column 1', type: DataFilterType.Bool },
    { checked: false, name: 'Column 2', type: DataFilterType.Bool },
    { checked: true, name: 'Column 3', type: DataFilterType.Bool },
    { checked: false, name: 'Column 4', type: DataFilterType.Bool },
    { checked: true, name: 'Column 5', type: DataFilterType.Bool },
    { checked: false, name: 'Column 6', type: DataFilterType.Bool },
    { checked: true, name: 'Column 7', type: DataFilterType.Bool },
    { checked: false, name: 'Column 8', type: DataFilterType.Bool}
  ];

  onColumnsUpdated(updatedColumns: IDataFilter[]) {
    console.log('Updated columns:', updatedColumns);
  }
}
