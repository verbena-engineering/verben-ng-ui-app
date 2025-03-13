import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisibleColumnComponent } from './visible-column.component';

const routes: Routes = [{ path: '', component:VisibleColumnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisibleColumnRoutingModule {}
