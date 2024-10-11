import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CardData } from '../card-data';

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
  @ContentChild('card') card!: TemplateRef<any>;

}
