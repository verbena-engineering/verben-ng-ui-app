import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDataViewComponent } from './cdv.component';
import { AppComponent } from '../../app.component';
import { CardDataViewModule, SvgModule } from '../../../../projects/verben-ng-ui/src/public-api';
import { CommonModule } from '@angular/common';
const routes: Routes = [
       {
    path: '',
    component: CardDataViewComponent
  },
    {
    path: 'card-data-view',
    component: CardDataViewComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes),CardDataViewModule,SvgModule,CommonModule],
  declarations:[],
  // exports: [RouterModule,CardDataViewComponent]
})
export class CDVModule { }
