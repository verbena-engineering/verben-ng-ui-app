import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamplesComponent } from './examples.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
  {
    path: 'common',
    loadChildren: () =>
      import('./common-page/common-page.module').then(
        (m) => m.CommonPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamplesRoutingModule {}
