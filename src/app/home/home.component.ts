import { Component } from '@angular/core';
import { DataFilterType, MailPayload} from '../../../projects/verben-ng-ui/src/public-api';
import { Column } from '../../../projects/verben-ng-ui/src/lib/models/column-filter';
import { IDataFilter } from '../../../projects/verben-ng-ui/src/lib/models/data-filter';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

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


handleButtonClick(button: any) {
  console.log('Button clicked', button);
}
}
