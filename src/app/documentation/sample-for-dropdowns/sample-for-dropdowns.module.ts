
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleForDropdownsComponent } from './sample-for-dropdowns.component';
import { RouterModule, Routes } from '@angular/router';
import { VerbenPopUpModule } from '../../../../projects/verben-ng-ui/src/lib/components/pop-up/pop-up.module';


export const appRoutes: Routes = [
    {
      path: '',
      component: SampleForDropdownsComponent,
    },
  ];

  
@NgModule({
  declarations: [SampleForDropdownsComponent],
  imports: [CommonModule, RouterModule.forChild(appRoutes),VerbenPopUpModule],
})
export class SampleForDropdownsModule {}
