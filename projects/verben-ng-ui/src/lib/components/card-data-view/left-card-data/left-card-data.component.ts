import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CardData } from '../card-data';
import { CardDataViewComponent } from '../card-data-view.component';

@Component({
  selector: 'verben-left-card-data',
  templateUrl: './left-card-data.component.html',
  styleUrl: './left-card-data.component.css'
})
export class LeftCardDataComponent {
  @Input() pd = '10px';
  @Input() mg = '0px';
  @Input() height?:string="100%";
  @Input() weight?:string="100%";
  @Input() activeCss?:string ;
  @Input() inActiveCss?:string ;
  @Input() cardDataList:CardData[]=[];
  @Input() iconCollapse:string="plus";
  @Input() iconExpanded:string="minus";
  @Input() parent!:CardDataViewComponent;
  @ContentChild('card') card!: TemplateRef<any>;
  @ContentChild('cardChild') cardChild!: TemplateRef<any>;
  @Input() dataId!:string; //what to use to identify each data
  // currentItem:any={};
  showToggle(item:CardData)
  {
    // showToggle() && item.children.length>0
   return this.cardDataList.filter(_=>_.selected).length>0 && item.children.length>0
  }
  showChildren(item:CardData)
  {
    var currToggleState= item.isChildrenExpanded;
    this.cardDataList.forEach(_=>{
      _.isChildrenExpanded=false
      _.selected=false;
    });
    this.parent.onItemClick(item);
    item.isChildrenExpanded=!currToggleState
  }

}
