import { AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CardData } from './card-data';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verben-card-data-view',
  templateUrl: './card-data-view.component.html',
  styleUrl: './card-data-view.component.css'
})

export class CardDataViewComponent  {
  @Input() pd = '10px';
  @Input() mg = '0px';
  @Input() lHeight?:string="100%";
  @Input() rHeight?:string="100%";
  @Input() rWidth?:string="70%";
  @Input() lWidth?:string="30%";
  @Input() textColor?:string ;
  @Input() lbgColor?:string ;
  @Input() rbgColor?:string ;
  @Input() border?:string ;
  @Input() display?:string ;
  @Input() borderRadius?:string ;
  @Input() activeCss?:string ;
  @Input() inActiveCss?:string ;
  @Input() displayAsRow?:boolean =true;
  @Input() cardDataList:CardData[]=[];
  @Input() dataId!:string;
  // @Input() disabled:boolean=false ;
  // @Input() aspectRatio?:number ;
  @ContentChild('card') card!: TemplateRef<any>;
  // @ContentChild('content') content!: TemplateRef<any>;
  currentItem:any={};
  hasCurrentItem()
  {
    return !!Object.keys(this.currentItem).length
  }
  @Input() onItemClick(item:CardData){
    item.selected= true;
    this.cardDataList.forEach(element => {
      if(element.data[this.dataId]==item.data[this.dataId])
      {
        this.currentItem= item;
      }
      else
      {
        element.selected=false;
      }
    });
    return this.currentItem
  }

}
