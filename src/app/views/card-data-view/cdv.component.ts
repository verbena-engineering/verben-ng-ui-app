import { Component } from '@angular/core';
import { CardData } from '../../../../projects/verben-ng-ui/src/public-api';
export class Model {
   name!:string;
   mailAddress!:string;
}
@Component({
  selector: 'app-card-data-view',
  templateUrl: './cdv.component.html',
  styleUrl: './cdv.component.scss'
})

export class CardDataViewComponent {
   currentData!:CardData
   currentChildData!:CardData
   cardData:CardData[]=[
     { 
      children:[],
      selected:false, title:"Title1",
      data:{name:'Ade', mailAddress:'ademail@yahoo.com'} as Model,
       body:[
      { title:'Code',value:'code1'},
      { title:'Name',value:'name1'},
      { title:'Description',value:'description1'}
    ]},
      {  children:[],
        selected:false,title:"Title2", 
         data:{name:'wale', mailAddress:'walemail@yahoo.com'} as Model,
      body:[
      { title:'Code',value:'code2'},
      { title:'Name',value:'name2'},
      { title:'Description',value:'description2'}
    ]},
      { children:[
           { children:[],
         data:{name:'Child1', mailAddress:'childkunlemail@yahoo.com'} as Model,
        selected:false, title:"TitleChild3", body:[
      { title:'Code',value:'Childcode3'},
      { title:'Name',value:'Childname3'},
      { title:'Description',value:'Childdescription3'}
    ]},
       { children:[],
         data:{name:'Child2', mailAddress:'Child2kunlemail@yahoo.com'} as Model,
        selected:false, title:"Child2Title3", body:[
      { title:'Code',value:'Child2code3'},
      { title:'Name',value:'Child2name3'},
      { title:'Description',value:'Child2description3'}
    ]}
      ],
         data:{name:'kunle', mailAddress:'kunlemail@yahoo.com'} as Model,
        selected:false, title:"Title3", body:[
      { title:'Code',value:'code3'},
      { title:'Name',value:'name3'},
      { title:'Description',value:'description3'}
    ]}
   ]

   loadMore()
   {
    this.cardData= this.cardData.concat(this.cardData)
   }
}
