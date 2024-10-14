import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerbenaInputTextareaComponent } from './verbena-input-textarea.component';

const routes: Routes = [{ path: '', component: VerbenaInputTextareaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class buttonBadgeRoutingModule {}
