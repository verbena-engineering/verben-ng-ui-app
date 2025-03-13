import { AfterContentInit, Component, contentChild, ContentChild, effect, ElementRef, EventEmitter, Input, Output, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { CardData } from './card-data';
import { Title } from '@angular/platform-browser';
import { RightCardDataViewComponent } from './right-card-data-view/right-card-data-view.component';
import { LeftCardDataComponent } from './left-card-data/left-card-data.component';

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
  @Input() borderRadius?:string="12px";
  @Input() activeCss?:string ;
  @Input() inActiveCss?:string ;
  @Input() displayAsRow?:boolean =true;
  @Input() cardDataList:CardData[]=[];
  @Input() dataId!:string; //what to use to identify each data
  @Input() totalRecords:number=0;
  @Input() footer:boolean=false;
  @Input() noOfVisibleChildren:number=3;
  @ContentChild(RightCardDataViewComponent) rightContent!:RightCardDataViewComponent; 
  // @ContentChild(LeftCardDataComponent) left!:LeftCardDataComponent; 
  @ContentChild('card') card!: TemplateRef<any>;
  // @ContentChild('content') content!: TemplateRef<any>;
  currentItem:any={};
  currentChildItem:any={};

  hasCurrentItem()
  {
    return !!Object.keys(this.currentItem ?? {}).length || !!Object.keys(this.currentChildItem ?? {}).length
  }
  clearData()
   {
    this.currentItem={} as CardData
    this.currentChildItem={} as CardData
    this.cardDataList.forEach(_=>{
      _.selected=false;
      _.children.forEach(c=>{c.selected=false;c.isChildrenExpanded=false})
      _.isChildrenExpanded=false
    });
   }
   setDetailData()
   {
     this.rightContent.parentData= this.currentItem;
      this.rightContent.chilData= this.currentChildItem;
   }
  @Input() onItemClick(item:CardData){
    this.resetChildren(item);
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
    this.setDetailData()
    return this.currentItem
  }
 resetChildren(newSelect:CardData)
  {
    if(this.currentItem && this.currentItem.children?.length){
   (this.currentItem.children as any[]).forEach(c=>{
    c.selected=false;
  })
  if(newSelect.data[this.dataId]!=this.currentItem.data[this.dataId])
    this.currentItem.isChildrenExpanded=false;
}
  this.currentChildItem= null;
  }
  @Input() onCardChildClick(childIndex:number){
    var item = this.currentItem.children[childIndex];
    (this.currentItem.children as any[]).forEach(element => {
      if(element.data[this.dataId]==item.data[this.dataId])
      {
        this.currentChildItem= item;
      }
      else
      {
        element.selected=false;
      }
    });
    this.currentChildItem.selected=true;
    this.setDetailData()
    return this.currentChildItem
  }
  showChildren(item:CardData)
  {
    var currToggleState= item.isChildrenExpanded;
    this.cardDataList.forEach(_=>{
      _.isChildrenExpanded=false
      _.selected=false;
    });
    item.selected=true;
    item.isChildrenExpanded=!currToggleState
  }

  @Output() loadMoreClick = new EventEmitter();
  onLoadMoreClick()
  {
    this.loadMoreClick.emit();
  }
}
