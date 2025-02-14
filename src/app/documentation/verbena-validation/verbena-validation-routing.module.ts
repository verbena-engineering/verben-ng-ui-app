import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerbenaValidationComponent } from './verbena-validation.component';

const routes: Routes = [{ path: '', component: VerbenaValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class verbenaValidationRoutingModule {}
