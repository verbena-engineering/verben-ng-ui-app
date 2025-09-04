import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDataViewComponent } from './cdv.component';
import { AppComponent } from '../../app.component';
import {
  CardDataViewModule,
  CardModule,
  SvgModule,
  VerbenaButtonModule,
  VerbenaInputModule,
} from 'verben-ng-ui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: CardDataViewComponent,
  },
  {
    path: 'card-data-view',
    component: CardDataViewComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CardDataViewModule,
    CommonModule,
    SvgModule,
    FormsModule,
    CardModule,
    VerbenaButtonModule,
    VerbenaInputModule,
  ],
  declarations: [CardDataViewComponent],
  // exports: [RouterModule,CardDataViewComponent]
})
export class CDVModule {}
