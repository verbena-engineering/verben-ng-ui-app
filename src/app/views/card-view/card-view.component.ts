import { Component } from '@angular/core';
import { CardData } from '../../../../projects/verben-ng-ui/src/public-api';
export class Model {
   name!:string;
   mailAddress!:string;
}
@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrl: './card-view.component.scss'
})

export class CardViewComponent {
   currentData!:CardData
   cardData:CardData[]=[
     { 
      selected:true, title:"Title1",
      data:{name:'Ade', mailAddress:'ademail@yahoo.com'} as Model,
       body:[
      { title:'Code',value:'code1'},
      { title:'Name',value:'name1'},
      { title:'Description',value:'description1'}
    ]},
      {  selected:false,title:"Title2", 
         data:{name:'wale', mailAddress:'walemail@yahoo.com'} as Model,
      body:[
      { title:'Code',value:'code2'},
      { title:'Name',value:'name2'},
      { title:'Description',value:'description2'}
    ]},
      { 
         data:{name:'kunle', mailAddress:'kunlemail@yahoo.com'} as Model,
        selected:false, title:"Title3", body:[
      { title:'Code',value:'code3'},
      { title:'Name',value:'name3'},
      { title:'Description',value:'description3'}
    ]}
   ]
   clearData()
   {
    this.currentData={} as CardData
   }
   loadMore()
   {
    this.cardData= this.cardData.concat(this.cardData)
   }
}
