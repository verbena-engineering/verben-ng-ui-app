import { Component } from '@angular/core';
export class Model {
  name!: string;
  mailAddress!: string;
}
@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrl: './card-view.component.scss',
})
export class CardViewComponent {}
