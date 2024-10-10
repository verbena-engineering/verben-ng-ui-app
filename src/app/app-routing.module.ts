import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDataViewComponent } from './views/card-data-view/cdv.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { IconsSampleComponent } from './views/icons-sample/icons-sample.component';
import { ImageSampleComponent } from './views/image-sample/image-sample.component';
import { NotificationsSampleComponent } from './views/notifications-sample/notifications-sample.component';
import { TableFilterSampleComponent } from './views/table-filter-sample/table-filter-sample.component';
import { TooltipSampleComponent } from './views/tooltip-sample/tooltip-sample.component';

const routes: Routes = [

  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'documentation', pathMatch: 'full' },
  {
    path: 'documentation',
    loadChildren: () =>
      import('./documentation/documentation.module').then(
        (m) => m.DocumentationModule
      ),
  },
  {
    path: 'icons',
    component: IconsSampleComponent,
  },
  {
    path: 'images',
    component: ImageSampleComponent,
  },
  {
    path: 'notifications',
    component: NotificationsSampleComponent,
  },
  {
    path: 'table-filter',
    component: TableFilterSampleComponent,
  },
  {
    path: 'tooltips',
    component: TooltipSampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
