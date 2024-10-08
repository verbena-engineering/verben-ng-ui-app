import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DropdownSampleComponent } from './views/dropdown-sample/dropdown-sample.component';
import { ImageComponent, NotificationComponent, SvgComponent, TableFilterComponent, TooltipComponent } from '../../projects/verben-ng-ui/src/public-api';

const routes: Routes = [
  {
    path: 'card-data-view',
    component: CardDataViewComponent,
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'notifications',
    component: NotificationComponent,
  },
  {
    path: 'icons',
    component: SvgComponent,
  },
  {
    path: 'table-filter',
    component: TableFilterComponent,
  },
  {
    path: 'image',
    component: ImageComponent,
  },
  {
    path: 'tooltip',
    component:TooltipComponent ,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
