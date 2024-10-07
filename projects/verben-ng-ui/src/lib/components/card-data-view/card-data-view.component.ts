import { AfterContentInit, Component, ContentChild, ElementRef, Input, TemplateRef } from '@angular/core';
import { CardData } from './card-data';

@Component({
  selector: 'verben-card-data-view',
  templateUrl: './card-data-view.component.html',
  styleUrl: './card-data-view.component.css'
})

export class CardDataViewComponent implements AfterContentInit  {
  hasCustomLeft:boolean=true;
  hasCustomRight:boolean=true;
  @Input() pd = '10px';
  @Input() mg = '0px';
  @Input() lHeight?:string="100%";
  @Input() rHeight?:string="100%";
  @Input() rWidth?:string="70%";
  @Input() lWidth?:string="30%";
  @Input() textColor?:string ;
  @Input() bgColor?:string ;
  @Input() border?:string ;
  @Input() display?:string ;
  @Input() borderRadius?:string ;
  @Input() activeCss?:string ;
  @Input() inActiveCss?:string ;
  @Input() displayAsRow?:boolean =true;
  @Input() cardDataList:CardData[]=[];
  // @Input() disabled:boolean=false ;
  // @Input() aspectRatio?:number ;
  @ContentChild('card') card!: TemplateRef<any>;
  @ContentChild('leftContent', { static: false }) leftContent: ElementRef | undefined;
  @ContentChild('rightContent', { static: false }) rightContent: ElementRef | undefined;
    ngAfterContentInit() {
    this.hasCustomLeft = this.leftContent?true:false;
    this.hasCustomRight = this.rightContent?true:false;
  }
}
