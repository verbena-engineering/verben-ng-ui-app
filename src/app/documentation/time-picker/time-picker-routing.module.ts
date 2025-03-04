import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimePickerComponent } from './time-picker.component';

const routes: Routes = [{ path: '', component: TimePickerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimePickerRoutingModule {}
