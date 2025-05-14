import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleDatePickerComponent } from './date-picker.component';

const routes: Routes = [{ path: '', component:SampleDatePickerComponent  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleDatePickerComponentRoutingModule {}
