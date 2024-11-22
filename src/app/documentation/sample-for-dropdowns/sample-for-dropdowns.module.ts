
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleForDropdownsComponent } from './sample-for-dropdowns.component';
import { RouterModule, Routes } from '@angular/router';
import { VerbenDropdownModule } from '../../../../projects/verben-ng-ui/src/lib/components/dropdown/dropdown.module';


export const appRoutes: Routes = [
    {
      path: '',
      component: SampleForDropdownsComponent,
    },
  ];

  
@NgModule({
  declarations: [SampleForDropdownsComponent],
  imports: [CommonModule, RouterModule.forChild(appRoutes),VerbenDropdownModule],
})
export class SampleForDropdownsModule {}
