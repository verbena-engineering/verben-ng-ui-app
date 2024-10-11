import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDataViewComponent } from './cdv.component';
import { AppComponent } from '../../app.component';
import {
  CardDataViewModule,
  SvgModule,
} from '../../../../projects/verben-ng-ui/src/public-api';
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
  imports: [RouterModule.forChild(routes), CardDataViewModule, CommonModule,SvgModule,FormsModule],
  declarations: [CardDataViewComponent],
  // exports: [RouterModule,CardDataViewComponent]
})
export class CDVModule {}
