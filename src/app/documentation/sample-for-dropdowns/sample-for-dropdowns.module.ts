
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleForDropdownsComponent } from './sample-for-dropdowns.component';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule } from '../../../../projects/verben-ng-ui/src/public-api';


export const appRoutes: Routes = [
    {
      path: '',
      component: SampleForDropdownsComponent,
    },
  ];

  
@NgModule({
  declarations: [SampleForDropdownsComponent],
  imports: [CommonModule, RouterModule.forChild(appRoutes),DropdownModule],
})
export class SampleForDropdownsModule {}
