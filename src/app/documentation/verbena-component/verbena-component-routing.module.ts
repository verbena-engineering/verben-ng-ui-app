import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerbenaComponentComponent } from './verbena-component.component';

const routes: Routes = [{ path: '', component: VerbenaComponentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class verbenaComponentRoutingModule {}
