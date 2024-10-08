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
  { path: '', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
