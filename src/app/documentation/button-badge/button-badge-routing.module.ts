import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonBadgeComponent } from './button-badge.component';

const routes: Routes = [{ path: '', component: ButtonBadgeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class buttonBadgeRoutingModule {}
