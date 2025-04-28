import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerbenaSvgComponent } from './verbena-svg.component';

const routes: Routes = [{ path: '', component:VerbenaSvgComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerbenaSvgRoutingModule {}
