import { Component } from '@angular/core';
import { DataFilterType, IDataFilter } from '../../../projects/verben-ng-ui/src/lib/models/table-filter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
<<<<<<< HEAD
  username: string = '';

  onUsernameChange(value: string) {
    this.username = value;
    console.log('Username changed:', this.username);  
  }
=======
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
>>>>>>> 1935064e4fe0428690a5ce9566fa3f9e86e124eb

handleButtonClick(button: any) {
  console.log('Button clicked', button);
}
}
