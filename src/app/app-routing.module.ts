import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDataViewComponent } from './Components/card-data-view/cdv.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DropdownSampleComponent } from './views/dropdown-sample/dropdown-sample.component';

const routes: Routes = [
  {
    path: 'card-data-view',
    component: CardDataViewComponent,
  },
<<<<<<< HEAD
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'dropdown-chip',
    component: DropdownSampleComponent,
=======
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'documentation', pathMatch: 'full' },
  {
    path: 'documentation',
    loadChildren: () =>
      import('./documentation/documentation.module').then(
        (m) => m.DocumentationModule
      ),
>>>>>>> 4ec2251756f3febaa4d06417fc20bdcb5d766886
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
