import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownSampleComponent } from './dropdown-sample.component';
import { DropDownModule, SharedModule } from 'verben-ng-ui/src/public-api';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: DropdownSampleComponent,
  },
];

@NgModule({
  declarations: [DropdownSampleComponent],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule,
    DropDownModule,
    FormsModule,
    SharedModule,
  ],
})
export class DropdownSampleModule {}
