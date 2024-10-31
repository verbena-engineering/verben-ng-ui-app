import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CardData } from '../card-data';

@Component({
  selector: 'verben-right-card-data-view',
  templateUrl: './right-card-data-view.component.html',
  styleUrl: './right-card-data-view.component.css'
})
export class RightCardDataViewComponent {
   @ContentChild('parent') parent!: TemplateRef<any>;
   @ContentChild('child') child!: TemplateRef<any>;
   @Input() parentData! :CardData
   @Input() chilData! :CardData
   @Input() meth(d:any)
   {
      console.log(this.parent)
      console.log(this.chilData)
   }
  //  currentData && currentData.title

}
