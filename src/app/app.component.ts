import { Component } from '@angular/core';
import { SortType } from '../../projects/verben-ng-ui/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'verben-ui';
  sortType=SortType
}
