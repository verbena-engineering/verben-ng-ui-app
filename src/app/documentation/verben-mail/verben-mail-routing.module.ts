import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerbenMailComponent } from './verben-mail.component';

const routes: Routes = [{ path: '', component:VerbenMailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerbenMailRoutingModule {}
