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

}
