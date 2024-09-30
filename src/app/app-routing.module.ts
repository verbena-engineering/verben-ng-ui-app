import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
    path: '',
    loadChildren: () =>
      import('./Components/card-data-view/cdv.module').then(
        (m) => m.CDVModule
      ),
  },
    { path: '**', redirectTo: '', pathMatch: 'full' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
