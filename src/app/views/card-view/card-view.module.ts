import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../../app.component';
import {
  CardDataViewModule,
  CardModule,
  SvgModule,
} from '../../../../projects/verben-ng-ui/src/public-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardViewComponent } from './card-view.component';
const routes: Routes = [
  {
    path: '',
    component: CardViewComponent,
  },
  {
    path: 'card-view',
    component: CardViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CardModule, CommonModule,SvgModule,FormsModule],
  declarations: [CardViewComponent],
  // exports: [RouterModule,CardDataViewComponent]
})
export class CardViewModule {}
