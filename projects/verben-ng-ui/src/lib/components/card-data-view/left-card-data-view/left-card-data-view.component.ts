import { Component, Input } from '@angular/core';
import { CardData } from '../card-data';

@Component({
  selector: 'verben-left-card-data-view',
  templateUrl: './left-card-data-view.component.html',
  styleUrl: './left-card-data-view.component.css'
})
export class LeftCardDataViewComponent {
   @Input() cardDataList:CardData[]=[];

}
