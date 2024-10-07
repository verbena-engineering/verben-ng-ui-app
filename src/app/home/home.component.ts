import { Component } from '@angular/core';
import { DataFilterType} from '../../../projects/verben-ng-ui/src/public-api';
import { Column } from '../../../projects/verben-ng-ui/src/lib/models/column-filter';
import { IDataFilter } from '../../../projects/verben-ng-ui/src/lib/models/data-filter';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
 SortFilter=DataFilterType
 isGridView: boolean = true;

 onViewChange(view: boolean): void {
   this.isGridView = view;
   console.log('Current view:', this.isGridView ? 'Grid' : 'List');
 }
 onColumnsUpdated(updatedColumns: Column[]) {
  console.log('Updated columns:', updatedColumns);
}
onSelectOptions(updatedOptions: IDataFilter[]) {
  console.log('Updated Options:', updatedOptions);
}

}
