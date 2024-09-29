import { Component } from '@angular/core';
import { CardData } from '../../../../projects/verben-ng-ui/src/public-api';

@Component({
  selector: 'app-card-data-view',
  templateUrl: './cdv.component.html',
  styleUrl: './cdv.component.scss'
})
export class CardDataViewComponent {
   cardData:CardData[]=[
     { title:"Title1", body:[
      { title:'Code',value:'code1'},
      { title:'Name',value:'name1'},
      { title:'Description',value:'description1'}
    ]},
      { title:"Title2", body:[
      { title:'Code',value:'code2'},
      { title:'Name',value:'name2'},
      { title:'Description',value:'description2'}
    ]},
      { title:"Title3", body:[
      { title:'Code',value:'code3'},
      { title:'Name',value:'name3'},
      { title:'Description',value:'description3'}
    ]}
   ]
}
