import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SortTableComponent } from './sort-table.component';

const routes: Routes = [{ path: '', component:SortTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SortTableRoutingModule {}
