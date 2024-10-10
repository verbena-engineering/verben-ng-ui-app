import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardDataViewModule } from 'verben-ng-ui/src/public-api';


@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewComponent {
  isGridView: boolean = true;
  
  onViewChange(view: boolean): void {
    this.isGridView = view;
    console.log('Current view:', this.isGridView ? 'Grid' : 'List');
  }
}
